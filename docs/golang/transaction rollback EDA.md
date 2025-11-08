Việc xây dựng một ứng dụng Go monolithic nhưng vẫn muốn tách biệt logic các module theo DDD và tăng cường EDA là một cách tiếp cận rất tốt để có được lợi ích của kiến trúc module hóa mà không phải chịu chi phí phức tạp của microservices. Tuy nhiên, việc xử lý transaction trong bối cảnh này, đặc biệt khi có sự tham gia của event, cần được cân nhắc kỹ lưỡng.

Trong một ứng dụng monolithic với một cơ sở dữ liệu duy nhất, bạn **có thể** sử dụng các giao dịch ACID truyền thống để đảm bảo tính nguyên tử giữa các hoạt động DB. Thách thức chính là làm thế nào để tích hợp việc publish event một cách nguyên tử với giao dịch DB đó, và làm thế nào để xử lý "rollback" khi một module khác gặp lỗi **sau khi** giao dịch DB ban đầu đã cố gắng hoàn thành.

### **I. Nguyên tắc Cốt lõi: Một Giao dịch DB Duy nhất cho một "Business Operation"**

Trong một monolith, một "business operation" (ví dụ: đăng ký người dùng, đặt hàng) nên được thực hiện trong **một giao dịch cơ sở dữ liệu ACID duy nhất** nếu tất cả các thay đổi DB liên quan đều nằm trong cùng một cơ sở dữ liệu.

- **Go idiom:** Sử dụng `db.BeginTx(ctx, opts)` và truyền đối tượng `*sql.Tx` xuống các Repository của các module khác nhau.
- **`defer tx.Rollback()`:** Ngay sau `BeginTx`, hãy `defer tx.Rollback()` để đảm bảo giao dịch luôn được hoàn tác nếu có lỗi.
- **`tx.Commit()`:** Chỉ gọi `tx.Commit()` khi tất cả các thao tác DB đã hoàn tất thành công.

### **II. Thách thức: Tính Nguyên tử giữa DB Commit và Event Publishing**

Vấn đề nảy sinh khi bạn muốn publish một event (cho dù là in-memory hay ra một Message Broker bên ngoài) như một phần của cùng một "business operation". Bạn không thể thực hiện giao dịch ACID giữa cơ sở dữ liệu và Message Broker.

Để giải quyết vấn đề này trong một ứng dụng monolithic theo EDA, bạn có hai giải pháp chính:

#### **Giải pháp 1: Transactional Outbox Pattern (Khuyên dùng cho Event ra bên ngoài)**

Đây là giải pháp vàng để đảm bảo tính nguyên tử giữa một giao dịch cục bộ DB và việc gửi một event ra Message Broker bên ngoài.

**Mô tả:**

1.  **Bảng Outbox:** Trong cơ sở dữ liệu của bạn, tạo một bảng riêng biệt, gọi là `outbox` (hoặc `domain_events`). Bảng này sẽ lưu trữ các event cần được publish.
    - Ví dụ: `id (UUID), aggregate_type (string), aggregate_id (string), event_type (string), payload (JSONB), occurred_at (timestamp), status (string: PENDING, SENT, FAILED), sent_at (timestamp)`
2.  **Giao dịch Nguyên tử:** Khi một module thực hiện một thay đổi DB và cần publish một event, nó sẽ:
    - Thực hiện các thay đổi vào các bảng nghiệp vụ của nó.
    - **INSERT event vào bảng `outbox`** trong **cùng một giao dịch cơ sở dữ liệu (`*sql.Tx`)** với các thay đổi nghiệp vụ.
    - Sau đó, `tx.Commit()` sẽ đảm bảo rằng hoặc cả thay đổi nghiệp vụ và event đều được lưu, hoặc không có gì cả.
3.  **Outbox Relayer:** Một tiến trình riêng biệt (có thể là một goroutine chạy định kỳ trong cùng ứng dụng Go của bạn, hoặc một dịch vụ phụ trợ riêng) sẽ:
    - Định kỳ poll bảng `outbox` để tìm các event có `status = PENDING`.
    - Đọc các event này.
    - **Publish event ra Message Broker** (Kafka, NATS, RabbitMQ).
    - Sau khi publish thành công, **UPDATE `status` của event trong bảng `outbox` thành `SENT`**. Nếu thất bại, có thể cập nhật `status` thành `FAILED` và retry sau.

**Go Implementation Strategy:**

```go
// Trong domain/repository.go (hoặc một EventStore interface)
type EventStore interface {
    Append(ctx context.Context, tx *sql.Tx, event DomainEvent) error
}

// Trong infrastructure/persistence/postgres/event_store.go
type postgresEventStore struct{}
func (s *postgresEventStore) Append(ctx context.Context, tx *sql.Tx, event DomainEvent) error {
    payload, _ := json.Marshal(event.Payload)
    query := `INSERT INTO outbox (id, aggregate_type, aggregate_id, event_type, payload, occurred_at, status)
              VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`
    _, err := tx.ExecContext(ctx, query, event.ID, event.AggregateType, event.AggregateID, event.Type, payload, event.OccurredAt)
    return err
}

// Trong application/service.go (ví dụ: OrderService)
func (s *orderService) PlaceOrder(ctx context.Context, orderData *OrderDTO) (*Order, error) {
    tx, err := s.db.BeginTx(ctx, nil)
    if err != nil { return nil, fmt.Errorf("failed to begin tx: %w", err) }
    defer func() {
        if err != nil { // Rollback nếu có lỗi trước khi commit
            tx.Rollback()
        }
    }()

    // 1. Logic nghiệp vụ và lưu vào DB (module Order)
    order, err := s.orderRepo.CreateOrder(ctx, tx, orderData)
    if err != nil { return nil, fmt.Errorf("failed to create order: %w", err) }

    // 2. Tạo Domain Event
    orderCreatedEvent := domain.NewOrderCreatedEvent(order.ID, order.CustomerID, order.Total)

    // 3. Lưu event vào bảng outbox (trong cùng giao dịch)
    err = s.eventStore.Append(ctx, tx, orderCreatedEvent)
    if err != nil { return nil, fmt.Errorf("failed to append event to outbox: %w", err) }

    // 4. Commit giao dịch
    if commitErr := tx.Commit(); commitErr != nil {
        return nil, fmt.Errorf("failed to commit transaction: %w", commitErr)
    }

    // Sau khi commit, Outbox Relayer sẽ publish event này ra Message Broker
    return order, nil
}
```

**Ưu điểm:**

- Đảm bảo tính nguyên tử giữa thay đổi DB và event _persistence_.
- Tăng khả năng phục hồi: Nếu Message Broker bị down, event vẫn nằm trong bảng outbox và sẽ được gửi khi broker hoạt động trở lại.
- Giảm thiểu rủi ro mất event hoặc trạng thái không nhất quán.

**Nhược điểm:**

- Phức tạp hơn để triển khai.
- Độ trễ nhỏ cho việc gửi event ra Message Broker (eventual consistency).
- Yêu cầu Outbox Relayer.
- Các consumer của event cần phải là **idempotent** (có thể xử lý event nhiều lần mà không gây ra tác dụng phụ) vì event có thể được gửi nhiều lần (at-least-once delivery).

#### **Giải pháp 2: In-Process Event Dispatcher (Khuyên dùng cho Event nội bộ)**

Nếu các "module" của bạn thực sự chỉ là các package trong cùng một ứng dụng Go và bạn không cần gửi event ra Message Broker bên ngoài, bạn có thể sử dụng một In-Process Event Dispatcher.

**Mô tả:**

1.  **Event Dispatcher Interface:** Định nghĩa một interface cho việc dispatch event.
    ```go
    type EventDispatcher interface {
        Dispatch(ctx context.Context, event DomainEvent) error
    }
    ```
2.  **Event Handlers:** Mỗi module/package quan tâm đến một loại event sẽ đăng ký một `EventHandler` với `EventDispatcher`.
3.  **Dispatch sau Commit:** Module tạo event sẽ dispatch event **sau khi giao dịch DB của nó đã commit thành công**.

**Go Implementation Strategy:**

```go
// Trong application/service.go (ví dụ: OrderService)
func (s *orderService) PlaceOrder(ctx context.Context, orderData *OrderDTO) (*Order, error) {
    tx, err := s.db.BeginTx(ctx, nil)
    if err != nil { return nil, fmt.Errorf("failed to begin tx: %w", err) }
    defer func() {
        if err != nil {
            tx.Rollback()
        }
    }()

    // 1. Logic nghiệp vụ và lưu vào DB (module Order)
    order, err := s.orderRepo.CreateOrder(ctx, tx, orderData)
    if err != nil { return nil, fmt.Errorf("failed to create order: %w", err) }

    // 2. Tạo Domain Event
    orderCreatedEvent := domain.NewOrderCreatedEvent(order.ID, order.CustomerID, order.Total)

    // 3. Commit giao dịch
    if commitErr := tx.Commit(); commitErr != nil {
        err = fmt.Errorf("failed to commit transaction: %w", commitErr) // Gán lỗi để defer xử lý
        return nil, err
    }

    // 4. Dispatch event SAU KHI commit thành công
    // Đây là điểm mấu chốt: nếu commit thất bại, event sẽ không được dispatch.
    // Việc dispatch có thể đồng bộ (chạy ngay) hoặc bất đồng bộ (chạy trong goroutine riêng).
    go func() {
        // Sử dụng một context mới hoặc context con nếu event handler có thể chạy lâu hơn request
        eventCtx, eventCancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer eventCancel()
        if dispatchErr := s.eventDispatcher.Dispatch(eventCtx, orderCreatedEvent); dispatchErr != nil {
            log.Printf("Error dispatching OrderCreatedEvent asynchronously: %v", dispatchErr)
            // Xử lý lỗi dispatch: log, retry, dead-letter queue (nếu có)
        }
    }()

    return order, nil
}
```

**Ưu điểm:**

- Đơn giản hơn Outbox Pattern.
- Event được xử lý nhanh hơn (thường là tức thì hoặc gần tức thì).

**Nhược điểm:**

- **Không đảm bảo Atomic Message Delivery với Message Broker bên ngoài:** Nếu bạn có Message Broker bên ngoài, giải pháp này không đảm bảo rằng event sẽ đến được broker nếu ứng dụng crash _sau khi commit DB nhưng trước khi event được gửi đi_.
- **Lỗi trong Event Handler:** Nếu một event handler nội bộ gặp lỗi sau khi giao dịch DB đã commit, bạn không thể "rollback" giao dịch DB gốc. Bạn phải xử lý lỗi trong chính event handler đó (ví dụ: log lỗi, retry, hoặc bù trừ thủ công).

### **III. Xử lý "Rollback" khi một Module khác gặp lỗi**

Đây là phần quan trọng nhất trong câu hỏi của bạn.

**A. Với Transactional Outbox Pattern (hoặc bất kỳ EDA nào với Eventual Consistency):**

- Khi một module (ví dụ: Payment Service) nhận được `OrderCreatedEvent` và cố gắng xử lý giao dịch cục bộ của nó (ví dụ: trừ tiền), **nếu module này gặp lỗi**, nó sẽ:
  1.  **Không commit giao dịch cục bộ của nó.**
  2.  **Publish một "Compensating Event"** (ví dụ: `PaymentFailedEvent`).
  3.  Các module khác (ví dụ: Order Service) lắng nghe `PaymentFailedEvent` này.
  4.  `Order Service` sẽ thực hiện một **giao dịch bù trừ (compensating transaction)** cục bộ của nó (ví dụ: thay đổi trạng thái Order thành `Canceled`, hoàn lại hàng vào kho).

- **Không có "rollback" chung:** Không có lệnh `tx.Rollback()` nào sẽ hoàn tác tất cả các thay đổi trên các module khác. Thay vào đó, bạn xây dựng một chuỗi các hành động bù trừ để đạt được trạng thái nhất quán.

**B. Với In-Process Event Dispatcher (trong cùng ứng dụng monolith):**

- Nếu một event handler nội bộ (ví dụ: `InventoryEventHandler` xử lý `OrderCreatedEvent`) gặp lỗi **sau khi `OrderService` đã commit giao dịch DB của nó**:
  - Giao dịch DB của `OrderService` đã thành công và không thể rollback.
  - Lỗi trong `InventoryEventHandler` là một vấn đề riêng biệt. Bạn cần xử lý nó trong handler đó (ví dụ: log lỗi, gửi thông báo cho admin, hoặc có một cơ chế retry nội bộ).
  - Nếu lỗi đó nghiêm trọng và cần hoàn tác trạng thái của `Order`, bạn sẽ phải viết logic bù trừ cụ thể trong `InventoryEventHandler` hoặc một service khác. Ví dụ, `InventoryEventHandler` có thể publish một `InventoryUpdateFailedEvent`, và `OrderService` sẽ lắng nghe event đó để hủy đơn hàng.

### **Kết luận và Khuyến nghị:**

1.  **Đối với giao dịch DB thuần túy (nội bộ một business operation):** Luôn sử dụng `db.BeginTx`, `defer tx.Rollback()`, và `tx.Commit()`. Truyền `*sql.Tx` xuống các Repository liên quan. Đây là cách đảm bảo tính nguyên tử trong phạm vi DB duy nhất của bạn.
2.  **Đối với Event ra bên ngoài (Message Broker):** **Sử dụng Transactional Outbox Pattern**. Đây là cách an toàn nhất để đảm bảo tính nguyên tử giữa DB commit và event _persistence_.
3.  **Đối với Event nội bộ (In-Process):** Sử dụng In-Process Event Dispatcher, đảm bảo dispatch event sau khi DB commit.
4.  **Xử lý lỗi chéo module:**
    - Trong một monolith với EDA, "rollback" khi một module khác gặp lỗi được thay thế bằng **giao dịch bù trừ (compensating transactions)**.
    - Các module cần lắng nghe các event "thất bại" hoặc "hoàn tác" và thực hiện các hành động cần thiết để đưa hệ thống về trạng thái nhất quán.
    - **Idempotency** là chìa khóa cho tất cả các consumer để xử lý an toàn các event có thể được gửi lại hoặc xử lý nhiều lần.

Việc thiết kế theo các pattern này sẽ giúp ứng dụng Go monolithic của bạn trở nên mạnh mẽ, có khả năng phục hồi và dễ mở rộng hơn, đồng thời vẫn giữ được sự rõ ràng của các module theo DDD.
