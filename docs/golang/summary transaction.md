Đảm bảo tính toàn vẹn giao dịch (transaction commit/rollback) là một trong những khía cạnh quan trọng nhất khi làm việc với cơ sở dữ liệu trong bất kỳ ngôn ngữ nào, và Go cũng không ngoại lệ. Khi chuyển từ các ngôn ngữ khác, bạn cần hiểu rõ cách Go và package `database/sql` của nó xử lý các giao dịch.

Go không có cơ chế `try-catch` như nhiều ngôn ngữ khác, vì vậy việc quản lý `commit` và `rollback` cần một cách tiếp cận tường minh và cẩn thận, thường sử dụng `defer` và kiểm tra lỗi.

### **I. Các Nguyên tắc Cốt lõi để Đảm bảo Toàn vẹn Giao dịch trong Go**

1.  **Sử dụng `database/sql` Package:** Đây là package tiêu chuẩn của Go để tương tác với cơ sở dữ liệu. Nó cung cấp các interface chung, và bạn sẽ sử dụng các driver cụ thể (ví dụ: `pq` cho PostgreSQL, `go-sql-driver/mysql` cho MySQL).
2.  **Explicit Transaction Management:** Go yêu cầu bạn quản lý giao dịch một cách tường minh:
    - `db.BeginTx(ctx, opts)`: Bắt đầu một giao dịch. Luôn sử dụng `BeginTx` với `context.Context` và `sql.TxOptions` để kiểm soát isolation level và timeout.
    - `tx.Commit()`: Hoàn tất giao dịch, lưu các thay đổi.
    - `tx.Rollback()`: Hủy bỏ giao dịch, hoàn tác tất cả các thay đổi.
3.  **`defer tx.Rollback()` là Bắt buộc:** Đây là idiom quan trọng nhất. Ngay sau khi bắt đầu giao dịch, hãy `defer` một lệnh `tx.Rollback()`. Điều này đảm bảo rằng giao dịch sẽ được rollback nếu có bất kỳ lỗi nào xảy ra hoặc nếu hàm kết thúc mà không gọi `Commit()`.
4.  **Kiểm tra lỗi sau mỗi thao tác:** Sau mỗi thao tác cơ sở dữ liệu (ví dụ: `tx.ExecContext`, `tx.QueryRowContext`), bạn phải kiểm tra lỗi. Nếu có lỗi, bạn sẽ thoát khỏi hàm, và lệnh `defer tx.Rollback()` sẽ được kích hoạt.
5.  **Chỉ `Commit()` khi không có lỗi:** `tx.Commit()` chỉ nên được gọi khi tất cả các thao tác trong giao dịch đã hoàn tất thành công.
6.  **`context.Context` cho Timeout & Cancellation:** Luôn sử dụng `context.Context` với `BeginTx`, `ExecContext`, `QueryContext`, v.v. Điều này cho phép bạn thiết lập timeout cho toàn bộ giao dịch hoặc hủy bỏ nó nếu request gốc bị hủy, ngăn chặn các giao dịch bị treo.

### **II. Mẫu Thiết kế Giao dịch An toàn (Safe Transaction Pattern)**

Đây là một mẫu phổ biến và được khuyến nghị để quản lý giao dịch trong Go:

```go
package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver
)

// Giả lập Repository Layer
type UserRepository interface {
	CreateUser(ctx context.Context, tx *sql.Tx, name, email string) (int, error)
	UpdateUserStatus(ctx context.Context, tx *sql.Tx, userID int, status string) error
}

type postgresUserRepository struct{}

func NewPostgresUserRepository() UserRepository {
	return &postgresUserRepository{}
}

func (r *postgresUserRepository) CreateUser(ctx context.Context, tx *sql.Tx, name, email string) (int, error) {
	var id int
	query := "INSERT INTO users (name, email, status) VALUES ($1, $2, 'active') RETURNING id"
	err := tx.QueryRowContext(ctx, query, name, email).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("repo: failed to create user: %w", err)
	}
	return id, nil
}

func (r *postgresUserRepository) UpdateUserStatus(ctx context.Context, tx *sql.Tx, userID int, status string) error {
	query := "UPDATE users SET status = $1 WHERE id = $2"
	res, err := tx.ExecContext(ctx, query, status, userID)
	if err != nil {
		return fmt.Errorf("repo: failed to update user status: %w", err)
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("repo: user with ID %d not found for status update", userID)
	}
	return nil
}

// Giả lập Service Layer
type UserService struct {
	db   *sql.DB
	userRepo UserRepository
}

func NewUserService(db *sql.DB, userRepo UserRepository) *UserService {
	return &UserService{db: db, userRepo: userRepo}
}

// RegisterUser là một Business Use Case đòi hỏi giao dịch.
// Nó tạo người dùng và thực hiện một thao tác khác trong cùng một giao dịch.
func (s *UserService) RegisterUser(ctx context.Context, name, email string) (int, error) {
	// 1. Bắt đầu giao dịch với context và tùy chọn.
	// Sử dụng sql.TxOptions để đặt Isolation Level nếu cần (ví dụ: sql.LevelSerializable).
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
	if err != nil {
		return 0, fmt.Errorf("service: failed to begin transaction: %w", err)
	}

	// 2. Đảm bảo rollback nếu có lỗi xảy ra trước khi commit thành công.
	// Đây là phần quan trọng nhất: rollback sẽ chạy nếu hàm kết thúc mà chưa commit.
	defer func() {
		if p := recover(); p != nil { // Bắt panic nếu có
			log.Printf("Recovered from panic during transaction: %v. Rolling back...", p)
			if rbErr := tx.Rollback(); rbErr != nil {
				log.Printf("Rollback failed after panic: %v", rbErr)
			}
			panic(p) // Re-panic after rollback
		} else if err != nil { // Nếu có lỗi trong quá trình xử lý (trước Commit)
			log.Printf("Transaction failed: %v. Rolling back...", err)
			if rbErr := tx.Rollback(); rbErr != nil {
				log.Printf("Rollback failed: %v", rbErr)
			}
		}
	}()

	// 3. Thực hiện các thao tác trong giao dịch, truyền 'tx' xuống Repository.
	userID, err := s.userRepo.CreateUser(ctx, tx, name, email)
	if err != nil {
		return 0, fmt.Errorf("service: %w", err) // Bọc lỗi từ repo
	}

	// Giả lập một thao tác khác trong cùng giao dịch
	// Ví dụ: gửi email chào mừng, và nếu gửi email thất bại, rollback toàn bộ.
	// Trong thực tế, việc gửi email có thể là một thao tác bất đồng bộ bên ngoài giao dịch DB chính.
	// Nhưng để minh họa, chúng ta coi nó là một phần của giao dịch (nếu nó là DB-bound).
	err = s.userRepo.UpdateUserStatus(ctx, tx, userID, "pending_verification")
	if err != nil {
		return 0, fmt.Errorf("service: %w", err) // Bọc lỗi
	}

	// 4. Commit giao dịch nếu tất cả các bước thành công.
	// Nếu Commit() thất bại (ví dụ: lỗi kết nối DB), lỗi này sẽ được trả về.
	// Nếu Commit() thành công, biến 'err' vẫn là nil, và defer sẽ không chạy rollback.
	if commitErr := tx.Commit(); commitErr != nil {
		return 0, fmt.Errorf("service: failed to commit transaction: %w", commitErr)
	}

	log.Printf("User %s (%s) registered successfully with ID: %d", name, email, userID)
	return userID, nil
}

func main() {
	// Giả lập kết nối DB
	// Thay thế bằng chuỗi kết nối PostgreSQL thực tế của bạn
	connStr := "user=go_user password=go_password dbname=go_db sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	// Thiết lập pool kết nối
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Ping DB để đảm bảo kết nối
	if err = db.Ping(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	log.Println("Successfully connected to database!")

	// Đảm bảo bảng 'users' tồn tại
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			status VARCHAR(50) NOT NULL DEFAULT 'active',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create users table: %v", err)
	}
	log.Println("Users table ensured.")

	userRepo := NewPostgresUserRepository()
	userService := NewUserService(db, userRepo)

	// --- Ví dụ thành công ---
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = userService.RegisterUser(ctx, "Alice", "alice@example.com")
	if err != nil {
		log.Printf("Error registering Alice: %v", err)
	}

	// --- Ví dụ thất bại (email trùng lặp) ---
	ctx2, cancel2 := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel2()

	_, err = userService.RegisterUser(ctx2, "Bob", "alice@example.com") // Email trùng
	if err != nil {
		log.Printf("Error registering Bob (expected): %v", err)
		// Kiểm tra lỗi cụ thể
		if errors.Is(err, sql.ErrNoRows) { // Ví dụ: lỗi từ Scan() nếu không có hàng
			log.Println("This might be a no-rows error.")
		}
		// Trong thực tế, bạn sẽ kiểm tra lỗi UNIQUE constraint từ driver DB
	}

	// --- Ví dụ thất bại (giả lập lỗi sau CreateUser nhưng trước Commit) ---
	// Để minh họa, hãy sửa đổi UpdateUserStatus để luôn trả về lỗi nếu userID là 99999
	// (hoặc một lỗi nghiệp vụ nào đó)
	// func (r *postgresUserRepository) UpdateUserStatus(...) error {
	//    if userID == 99999 { return errors.New("simulated error for rollback") }
	//    // ...
	// }
	// Sau đó gọi RegisterUser với userID đó.
}
```

### **III. Phân tích Kỹ thuật và Best Practices:**

1.  **Vị trí của Giao dịch (Transaction Scope): Service Layer:**
    - Như bạn thấy trong ví dụ, logic `BeginTx`, `Commit`, `Rollback` được đặt trong `UserService` (lớp Application/Service). Đây là nơi được khuyến nghị.
    - **Lý do:** Các giao dịch thường bao gồm nhiều thao tác trên nhiều bảng, đôi khi thông qua nhiều Repository khác nhau, để hoàn thành một "use case" hoặc một "business operation" duy nhất. Lớp Service là nơi phối hợp các hoạt động này.
    - **Tránh:** Đặt logic giao dịch trong lớp Repository. Một Repository method riêng lẻ hiếm khi cần một giao dịch đầy đủ, và việc quản lý giao dịch ở đó sẽ làm cứng nhắc Repository và hạn chế khả năng tái sử dụng.

2.  **Truyền `*sql.Tx` xuống Repository:**
    - Lớp Service bắt đầu giao dịch và sau đó truyền đối tượng `*sql.Tx` xuống các phương thức của Repository.
    - Các phương thức của Repository sẽ sử dụng `tx.ExecContext`, `tx.QueryRowContext`, v.v., thay vì `db.ExecContext`, `db.QueryRowContext`. Điều này đảm bảo tất cả các thao tác đều nằm trong cùng một giao dịch.

3.  **Xử lý `defer` cho `Rollback()`:**
    - Hàm `defer` với `tx.Rollback()` là rất quan trọng. Nó đảm bảo rằng nếu có bất kỳ `return` sớm nào do lỗi hoặc `panic`, giao dịch sẽ được rollback.
    - Logic `defer` phức tạp hơn một chút để xử lý trường hợp `Commit()` thành công nhưng vẫn có lỗi khác xảy ra sau đó (ít phổ biến) hoặc để bắt `panic`.
    - Biến `err` trong `defer` closure sẽ là lỗi cuối cùng của hàm (nếu có) khi `defer` được thực thi.

4.  **Isolation Levels (`sql.TxOptions`):**
    - Luôn cân nhắc thiết lập `Isolation` level (ví dụ: `sql.LevelSerializable`, `sql.LevelReadCommitted`) trong `sql.TxOptions` khi bắt đầu giao dịch. Điều này giúp ngăn chặn các vấn đề như dirty reads, non-repeatable reads, phantom reads, tùy thuộc vào yêu cầu của ứng dụng và mức độ đồng thời mong muốn.
    - `ReadWrite` hoặc `ReadOnly` cũng có thể được chỉ định.

5.  **Error Wrapping:**
    - Sử dụng `fmt.Errorf("context: %w", err)` để bọc lỗi ở mỗi lớp (Repository, Service). Điều này tạo ra một chuỗi lỗi có ngữ cảnh, giúp việc debug dễ dàng hơn rất nhiều.
    - Sử dụng `errors.Is()` và `errors.As()` để kiểm tra các loại lỗi cụ thể (ví dụ: `ErrUserNotFound` của bạn, hoặc lỗi `UNIQUE constraint` từ driver DB) ở lớp Application/Handler.

6.  **Idempotency và Retries:**
    - **Lỗi `Commit()`:** Nếu `tx.Commit()` trả về lỗi, bạn không thể chắc chắn liệu giao dịch đã thực sự được commit trên database hay chưa (ví dụ: lỗi mạng xảy ra sau khi DB commit nhưng trước khi Go nhận được xác nhận). Trong những trường hợp này, các hoạt động của bạn cần phải là **idempotent** (có thể thực hiện nhiều lần mà không gây ra tác dụng phụ không mong muốn) nếu bạn định thử lại.
    - **Distributed Transactions (Sagas):** Nếu giao dịch của bạn kéo dài qua nhiều microservice hoặc hệ thống dữ liệu khác nhau, `database/sql` transaction không đủ. Bạn sẽ cần các pattern giao dịch phân tán như **Saga Pattern** hoặc dựa vào **Eventual Consistency** thông qua message queues.

7.  **Quản lý Connection Pool:**
    - `database/sql` tự động quản lý connection pool. Cấu hình `db.SetMaxOpenConns()`, `db.SetMaxIdleConns()`, `db.SetConnMaxLifetime()` một cách hợp lý là rất quan trọng để tránh các vấn đề về hiệu suất và kết nối bị treo.

Việc áp dụng các nguyên tắc này một cách nhất quán sẽ giúp bạn xây dựng các ứng dụng Go có khả năng xử lý giao dịch cơ sở dữ liệu mạnh mẽ, đáng tin cậy và dễ bảo trì.

## Làm thế nào để đảm bảo tính toàn vẹn khi một "giao dịch" nghiệp vụ liên quan đến nhiều dịch vụ hoặc module độc lập, và một trong số chúng thất bại?

Trong ngữ cảnh của Go và microservices, bạn không thể thực hiện một `ROLLBACK` ACID (Atomicity, Consistency, Isolation, Durability) truyền thống trên nhiều service/database khác nhau. Các giao dịch ACID chỉ hoạt động trong phạm vi một cơ sở dữ liệu hoặc một nguồn dữ liệu duy nhất.

Khi một hoạt động nghiệp vụ cần sự phối hợp của nhiều module/service và một module gặp lỗi, bạn phải chuyển sang các mô hình **giao dịch phân tán (Distributed Transactions)** hoặc **nhất quán cuối cùng (Eventual Consistency)**. Các mô hình này không đảm bảo tính nguyên tử tức thì như ACID, nhưng chúng đảm bảo rằng hệ thống sẽ đạt được trạng thái nhất quán theo thời gian.

Dưới đây là các pattern chính để xử lý tình huống này:

### **I. Saga Pattern (Mẫu Saga)**

Saga là một chuỗi các giao dịch cục bộ (local transactions) mà mỗi giao dịch cục bộ cập nhật cơ sở dữ liệu của riêng mình và publish một sự kiện (event) để kích hoạt giao dịch cục bộ tiếp theo trong saga. Nếu một giao dịch cục bộ thất bại, saga sẽ thực thi một chuỗi các giao dịch bù trừ (compensating transactions) để hoàn tác các thay đổi đã được thực hiện bởi các giao dịch cục bộ trước đó.

**Ưu điểm:**

- Đảm bảo tính nhất quán trên nhiều dịch vụ mà không cần giao dịch phân tán 2-phase commit (2PC) phức tạp, chậm chạp và không mở rộng.
- Tăng khả năng mở rộng và khả năng phục hồi của hệ thống.

**Nhược điểm:**

- Phức tạp hơn để triển khai và debug.
- Yêu cầu các giao dịch bù trừ (compensating transactions).
- Tính nhất quán cuối cùng (eventual consistency) thay vì nhất quán tức thì.

**Các cách triển khai Saga:**

1.  **Choreography (điều phối):**
    - **Mô tả:** Mỗi dịch vụ tự publish sự kiện sau khi hoàn thành giao dịch cục bộ của mình. Các dịch vụ khác lắng nghe các sự kiện này và tự kích hoạt giao dịch cục bộ tiếp theo. Không có điều phối viên trung tâm.
    - **Khi nào dùng:** Đơn giản hơn cho các saga nhỏ, ít bước, hoặc khi các dịch vụ ít phụ thuộc vào nhau.
    - **Thách thức:** Khó theo dõi luồng tổng thể, khó xử lý lỗi và bù trừ khi saga trở nên phức tạp.
    - **Trong Go:** Sử dụng Message Broker (Kafka, NATS, RabbitMQ) để các services publish và subscribe events.

    _Ví dụ luồng Choreography:_
    1.  `Order Service` tạo `Order`, commit vào DB của nó, publish `OrderCreatedEvent`.
    2.  `Payment Service` lắng nghe `OrderCreatedEvent`, xử lý thanh toán, commit vào DB của nó, publish `PaymentProcessedEvent`.
    3.  `Inventory Service` lắng nghe `PaymentProcessedEvent`, cập nhật kho hàng, commit vào DB của nó, publish `InventoryUpdatedEvent`.
    4.  Nếu `Payment Service` thất bại, nó publish `PaymentFailedEvent`.
    5.  `Order Service` lắng nghe `PaymentFailedEvent`, cập nhật trạng thái `Order` thành `Canceled` (giao dịch bù trừ).

2.  **Orchestration (điều hành):**
    - **Mô tả:** Một điều phối viên trung tâm (Saga Orchestrator) chịu trách nhiệm quản lý toàn bộ luồng saga. Orchestrator gửi lệnh đến các dịch vụ để thực hiện giao dịch cục bộ và lắng nghe các sự kiện phản hồi từ các dịch vụ để quyết định bước tiếp theo.
    - **Khi nào dùng:** Saga phức tạp hơn, có nhiều bước hoặc cần logic bù trừ phức tạp.
    - **Thách thức:** Điều phối viên có thể trở thành điểm nghẽn hoặc điểm lỗi duy nhất (single point of failure), cần được thiết kế để có khả năng phục hồi.
    - **Trong Go:**
      - Orchestrator là một service Go riêng biệt.
      - Nó dùng Message Broker để gửi lệnh (command) đến các services và lắng nghe sự kiện phản hồi (event).
      - Trạng thái của saga được lưu trữ trong DB của Orchestrator.
      - Các thư viện như `Temporal.io` (có SDK Go) hoặc `Cadence` cung cấp framework mạnh mẽ để xây dựng các saga orchestration có khả năng phục hồi cao.

    _Ví dụ luồng Orchestration:_
    1.  `Order Service` nhận yêu cầu, gửi `CreateOrderCommand` đến `Order Orchestrator`.
    2.  `Order Orchestrator` lưu trạng thái saga, gửi `ProcessPaymentCommand` đến `Payment Service`.
    3.  `Payment Service` xử lý thanh toán, gửi `PaymentProcessedEvent` hoặc `PaymentFailedEvent` đến `Order Orchestrator`.
    4.  Nếu `PaymentProcessedEvent`: `Order Orchestrator` gửi `UpdateInventoryCommand` đến `Inventory Service`.
    5.  Nếu `PaymentFailedEvent`: `Order Orchestrator` gửi `CancelOrderCommand` đến `Order Service` (giao dịch bù trừ).

### **II. Transactional Outbox Pattern (Mẫu Outbox Giao dịch)**

Mẫu này giải quyết vấn đề **Atomic Message Delivery** (đảm bảo rằng một giao dịch cục bộ vào cơ sở dữ liệu và việc gửi một sự kiện ra message broker là nguyên tử). Nếu bạn không dùng Outbox, có rủi ro:

- Bạn commit vào DB nhưng không gửi được event (dữ liệu không nhất quán).
- Bạn gửi được event nhưng không commit vào DB (dữ liệu không nhất quán).

**Mô tả:**

1.  Khi một dịch vụ thực hiện một giao dịch cục bộ và cần publish một sự kiện, nó **lưu sự kiện đó vào một bảng "Outbox" trong cùng giao dịch cục bộ với dữ liệu nghiệp vụ chính**.
2.  Sau khi giao dịch cục bộ commit thành công, một process riêng biệt (Outbox Relayer) định kỳ poll bảng Outbox, đọc các sự kiện chưa được gửi, publish chúng ra Message Broker, và sau đó đánh dấu các sự kiện đó là đã gửi (hoặc xóa chúng).

**Go Implementation:**

- Bảng Outbox trong cùng DB của microservice.
- Giao dịch Go của bạn sẽ `INSERT` vào bảng nghiệp vụ chính và bảng `outbox` trong cùng một `*sql.Tx`.
- Một Go routine hoặc một dịch vụ phụ trợ (`Outbox Relayer`) sẽ poll bảng Outbox.

### **III. Idempotent Operations (Thao tác Bất biến)**

Đây là một nguyên tắc thiết kế quan trọng cho tất cả các hoạt động trong hệ thống phân tán. Một thao tác là idempotent nếu việc thực hiện nó nhiều lần với cùng một đầu vào tạo ra cùng một kết quả như khi thực hiện nó một lần.

**Mô tả:**

- Khi bạn nhận một lệnh hoặc sự kiện, hãy đảm bảo rằng việc xử lý nó nhiều lần sẽ không gây ra tác dụng phụ không mong muốn (ví dụ: tạo nhiều bản ghi trùng lặp, trừ tiền nhiều lần).
- Thường được thực hiện bằng cách sử dụng một `correlation ID` hoặc `message ID` duy nhất cho mỗi yêu cầu/sự kiện, và kiểm tra xem ID đó đã được xử lý chưa trước khi thực hiện logic nghiệp vụ.

**Go Implementation:**

- Khi nhận một request/event, kiểm tra trong DB hoặc cache xem `ID_yêu_cầu` đã được xử lý chưa.
- Nếu đã xử lý, trả về kết quả thành công mà không thực hiện lại logic.
- Nếu chưa, thực hiện logic và lưu `ID_yêu_cầu` vào DB/cache cùng với kết quả.

### **IV. Nhất quán cuối cùng (Eventual Consistency)**

Hầu hết các giải pháp giao dịch phân tán đều dẫn đến nhất quán cuối cùng.

**Mô tả:**

- Dữ liệu có thể không nhất quán ngay lập tức trên toàn hệ thống sau một thao tác ghi, nhưng cuối cùng sẽ trở nên nhất quán.
- Điều này thường chấp nhận được đối với nhiều ứng dụng web và di động, nơi người dùng có thể chấp nhận một độ trễ nhỏ để có được dữ liệu cập nhật.

**Go Implementation:**

- Sử dụng message queues để gửi sự kiện.
- Các dịch vụ subscribe sự kiện và cập nhật dữ liệu của chúng một cách bất đồng bộ.
- Thiết kế giao diện người dùng để phản ánh tính nhất quán cuối cùng (ví dụ: hiển thị "đang xử lý" hoặc làm mới dữ liệu sau một thời gian).

### **Kết luận:**

Khi một entity của module (microservice) khác gặp lỗi trong một "giao dịch" nghiệp vụ, bạn không thể đơn giản là "rollback" toàn bộ như trong một hệ thống monolith. Thay vào đó, bạn cần áp dụng các pattern giao dịch phân tán:

- **Saga Pattern (Choreography hoặc Orchestration):** Để điều phối các giao dịch cục bộ và thực hiện các giao dịch bù trừ khi có lỗi.
- **Transactional Outbox Pattern:** Để đảm bảo tính nguyên tử giữa giao dịch DB cục bộ và việc gửi sự kiện.
- **Idempotent Operations:** Để đảm bảo an toàn khi các thao tác được thử lại hoặc xử lý nhiều lần.
- **Chấp nhận Eventual Consistency:** Thiết kế hệ thống và UI để hoạt động tốt với tính nhất quán cuối cùng.

Việc lựa chọn pattern nào phụ thuộc vào độ phức tạp của "giao dịch", mức độ yêu cầu về tính nhất quán tức thì, và khả năng mở rộng của hệ thống. Đối với các ứng dụng Go trong kiến trúc microservices, việc hiểu và triển khai các pattern này là cực kỳ quan trọng.
