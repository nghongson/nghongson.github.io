Chào bạn,

Khi tiếp cận Go từ các ngôn ngữ như Node.js hoặc PHP, bạn sẽ thấy Go có một tập hợp các "pattern" riêng, bao gồm cả các idiom ngôn ngữ và các mẫu thiết kế kiến trúc. Nhiều trong số chúng xuất phát từ triết lý của Go về sự đơn giản, hiệu quả và đồng thời.

Dưới đây là các pattern thường được sử dụng trong Go, được phân loại để dễ hiểu:

### **I. Các Idiom & Pattern Cốt lõi của Go (Core Go Idioms & Patterns)**

1.  **Xử lý lỗi (Error Handling) - `(value, error)`:**
    - **Mô tả:** Thay vì `try-catch`, hàm trả về hai giá trị, với giá trị cuối cùng là `error`.
    - **Go-idiomatic:** Luôn kiểm tra `if err != nil`.
    - **Ví dụ:**
      ```go
      func ReadFile(path string) ([]byte, error) {
          data, err := os.ReadFile(path)
          if err != nil {
              return nil, fmt.Errorf("failed to read file %s: %w", path, err) // Error wrapping
          }
          return data, nil
      }
      ```
    - **Liên quan:** Error Wrapping (`fmt.Errorf("%w", err)`), Sentinel Errors (`errors.New("...")`), Custom Error Types.

2.  **`defer` Statement:**
    - **Mô tả:** Lên lịch một hàm được thực thi sau khi hàm chứa nó kết thúc, bất kể bằng cách nào (return, panic). Thường dùng để dọn dẹp tài nguyên.
    - **Go-idiomatic:** Đặt `defer` ngay sau khi tài nguyên được cấp phát để đảm bảo không bị quên.
    - **Ví dụ:**
      ```go
      func processFile(path string) error {
          f, err := os.Open(path)
          if err != nil {
              return err
          }
          defer f.Close() // Đảm bảo file đóng khi hàm kết thúc
          // ... đọc và xử lý file
          return nil
      }
      ```

3.  **Interfaces Nhỏ & Triển khai ngầm định (Small Interfaces & Implicit Implementation):**
    - **Mô tả:** Go khuyến khích các interface nhỏ, tập trung vào một hành vi cụ thể. Một kiểu triển khai interface nếu nó có tất cả các phương thức của interface đó (không cần từ khóa `implements`).
    - **Go-idiomatic:** "Accept interfaces, return structs." (Nhận interface làm tham số, trả về struct). Giúp decoupling và test dễ dàng.
    - **Ví dụ:**

      ```go
      type Reader interface {
          Read(p []byte) (n int, err error)
      }

      type MyFile struct { /* ... */ }
      func (mf *MyFile) Read(p []byte) (n int, err error) { /* ... */ }
      // MyFile tự động triển khai Reader
      ```

4.  **Composition (Nhúng Struct):**
    - **Mô tả:** Thay vì kế thừa lớp, Go sử dụng nhúng (embedding) để tái sử dụng các trường và phương thức.
    - **Go-idiomatic:** "Composition over Inheritance" (Ưu tiên tổng hợp hơn kế thừa).
    - **Ví dụ:**

      ```go
      type AuditInfo struct {
          CreatedAt time.Time
          CreatedBy string
      }

      type User struct {
          AuditInfo // Nhúng AuditInfo
          ID        string
          Email     string
      }
      // user.CreatedAt có thể truy cập trực tiếp từ User
      ```

5.  **`context.Context`:**
    - **Mô tả:** Cơ chế để truyền các giá trị request-scoped, tín hiệu hủy bỏ (cancellation) và timeout qua các ranh giới API và giữa các goroutine.
    - **Go-idiomatic:** Luôn truyền `context.Context` làm tham số đầu tiên cho các hàm/phương thức trong các chuỗi request.
    - **Ví dụ:**
      ```go
      func FetchData(ctx context.Context, url string) ([]byte, error) {
          req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
          resp, err := http.DefaultClient.Do(req)
          if err != nil {
              return nil, err
          }
          defer resp.Body.Close()
          return io.ReadAll(resp.Body)
      }
      ```

6.  **Functional Options (Options Pattern):**
    - **Mô tả:** Dùng để cấu hình các struct hoặc hàm với nhiều tùy chọn mà không cần nhiều tham số trong constructor, giúp API rõ ràng và dễ mở rộng.
    - **Go-idiomatic:** Rất phổ biến cho các hàm khởi tạo.
    - **Ví dụ:**

      ```go
      type Server struct {
          port int
          timeout time.Duration
          // ...
      }

      type Option func(*Server) // Định nghĩa kiểu Option

      func WithPort(port int) Option {
          return func(s *Server) { s.port = port }
      }
      func WithTimeout(t time.Duration) Option {
          return func(s *Server) { s.timeout = t }
      }

      func NewServer(opts ...Option) *Server {
          s := &Server{ // Giá trị mặc định
              port:    8080,
              timeout: 5 * time.Second,
          }
          for _, opt := range opts {
              opt(s) // Áp dụng các tùy chọn
          }
          return s
      }

      // Cách dùng:
      // s := NewServer(WithPort(9000), WithTimeout(10*time.Second))
      ```

### **II. Các Pattern Đồng thời (Concurrency Patterns)**

1.  **Worker Pool:**
    - **Mô tả:** Giới hạn số lượng goroutine chạy đồng thời để xử lý một tập hợp công việc, sử dụng channels để phân phối công việc và thu thập kết quả.
    - **Go-idiomatic:** Hiệu quả để quản lý tài nguyên và tránh quá tải hệ thống.
    - **Ví dụ:**
      ```go
      func worker(id int, jobs <-chan int, results chan<- int) {
          for j := range jobs {
              fmt.Printf("Worker %d processing job %d\n", id, j)
              time.Sleep(time.Second) // Giả lập công việc
              results <- j * 2
          }
      }
      // Trong main: khởi tạo jobs/results channels, chạy N workers, gửi jobs, thu thập results.
      ```

2.  **Fan-out/Fan-in:**
    - **Mô tả:** Phân tán công việc cho nhiều goroutine (fan-out) và sau đó tập hợp kết quả từ chúng vào một channel duy nhất (fan-in).
    - **Go-idiomatic:** Tối ưu hóa việc sử dụng CPU/IO cho các tác vụ độc lập.
    - **Ví dụ:** Nhiều goroutine đọc từ một channel đầu vào, xử lý, và ghi vào một channel đầu ra chung.

3.  **Pipelines:**
    - **Mô tả:** Chuỗi các goroutine, mỗi goroutine thực hiện một giai đoạn xử lý, truyền dữ liệu qua channels từ giai đoạn này sang giai đoạn tiếp theo.
    - **Go-idiomatic:** Xử lý luồng dữ liệu tuần tự, mỗi giai đoạn hoạt động độc lập.
    - **Ví dụ:** `Gen(nums...) -> Square(in) -> Sum(in)`

4.  **`select` Statement:**
    - **Mô tả:** Chờ đợi và xử lý giao tiếp trên nhiều channel cùng một lúc, hoặc timeout.
    - **Go-idiomatic:** Quan trọng cho các hệ thống đồng thời phức tạp, cho phép non-blocking reads và timeout.
    - **Ví dụ:**
      ```go
      select {
      case msg := <-ch1:
          fmt.Println("Received from ch1:", msg)
      case <-time.After(5 * time.Second):
          fmt.Println("Timeout!")
      case <-ctx.Done(): // Từ context.Context
          fmt.Println("Cancellation signal received!")
      }
      ```

5.  **`sync.WaitGroup`:**
    - **Mô tả:** Chờ đợi một nhóm các goroutine hoàn thành.
    - **Go-idiomatic:** Đơn giản để đồng bộ hóa.
    - **Ví dụ:**
      ```go
      var wg sync.WaitGroup
      for i := 0; i < 5; i++ {
          wg.Add(1) // Tăng bộ đếm
          go func(id int) {
              defer wg.Done() // Giảm bộ đếm khi goroutine kết thúc
              fmt.Println("Worker", id, "done")
          }(i)
      }
      wg.Wait() // Chờ tất cả goroutine hoàn thành
      ```

### **III. Các Pattern Thiết kế (Design Patterns - Go Style)**

1.  **Repository Pattern:**
    - **Mô tả:** Tách biệt logic truy cập dữ liệu (DB, cache) khỏi logic nghiệp vụ. Logic nghiệp vụ tương tác với interface của Repository, không trực tiếp với cơ sở dữ liệu.
    - **Go-idiomatic:** Sử dụng interface cho Repository để dễ dàng mock và thay đổi triển khai. **(Yêu cầu bắt buộc trong context của bạn)**
    - **Ví dụ:** (Đã có trong demo Clean Code)
      ```go
      type UserRepository interface {
          Create(ctx context.Context, user *User) error
          GetByID(ctx context.Context, id string) (*User, error)
      }
      // ... service sử dụng UserRepository interface
      ```

2.  **Decorator Pattern:**
    - **Mô tả:** Bọc một đối tượng hiện có (thường là một interface) để thêm chức năng mới mà không làm thay đổi cấu trúc gốc. Thường dùng cho logging, caching, metrics.
    - **Go-idiomatic:** Dễ dàng triển khai với interfaces.
    - **Ví dụ (Caching Decorator cho Service):**

      ```go
      type UserService interface {
          GetUser(ctx context.Context, id string) (*User, error)
      }

      type cachingUserService struct {
          next UserService // Dịch vụ gốc
          cache *redis.Client
      }

      func NewCachingUserService(next UserService, cache *redis.Client) UserService {
          return &cachingUserService{next: next, cache: cache}
      }

      func (s *cachingUserService) GetUser(ctx context.Context, id string) (*User, error) {
          // Thử lấy từ cache
          // Nếu không có, gọi s.next.GetUser() và lưu vào cache
          // ...
          return nil, nil
      }
      ```

3.  **Builder Pattern:**
    - **Mô tả:** Xây dựng một đối tượng phức tạp từng bước, giúp kiểm soát quá trình khởi tạo và tăng tính dễ đọc khi có nhiều tùy chọn.
    - **Go-idiomatic:** Thường dùng cho các cấu trúc có nhiều trường tùy chọn hoặc yêu cầu logic khởi tạo phức tạp.
    - **Ví dụ:**

      ```go
      type QueryBuilder struct {
          query string
          args  []interface{}
      }

      func NewQueryBuilder() *QueryBuilder {
          return &QueryBuilder{}
      }

      func (qb *QueryBuilder) Select(cols ...string) *QueryBuilder {
          qb.query += "SELECT " + strings.Join(cols, ", ")
          return qb
      }

      func (qb *QueryBuilder) Where(condition string, arg interface{}) *QueryBuilder {
          qb.query += " WHERE " + condition
          qb.args = append(qb.args, arg)
          return qb
      }

      func (qb *QueryBuilder) Build() (string, []interface{}) {
          return qb.query, qb.args
      }
      ```

4.  **Generics (Kiểu tổng quát):**
    - **Mô tả:** Viết code hoạt động với nhiều kiểu dữ liệu khác nhau trong khi vẫn duy trì tính an toàn kiểu.
    - **Go-idiomatic:** Dùng cho các thuật toán chung, cấu trúc dữ liệu (`Stack[T]`, `Queue[T]`), hoặc các hàm tiện ích (`Map[T, U]`, `Filter[T]`).
    - **Ví dụ:** (Đã có trong các ví dụ `MessageCore[T]`)
      ```go
      func Map[T, U any](items []T, fn func(T) U) []U {
          result := make([]U, len(items))
          for i, item := range items {
              result[i] = fn(item)
          }
          return result
      }
      ```

### **IV. Các Pattern Kiến trúc (Architectural Patterns - Microservices)**

1.  **Layered Architecture (Kiến trúc phân lớp):**
    - **Mô tả:** Chia ứng dụng thành các lớp logic riêng biệt (ví dụ: Handler -> Service -> Repository). Mỗi lớp chỉ giao tiếp với lớp liền kề.
    - **Go-idiomatic:** Rất phổ biến trong các ứng dụng Go để quản lý độ phức tạp.
    - **Ví dụ:** (Đã có trong demo Clean Code)
      - `Handler` (API Layer): Xử lý HTTP requests/responses.
      - `Service` (Business Logic Layer): Chứa logic nghiệp vụ cốt lõi.
      - `Repository` (Data Access Layer): Tương tác với cơ sở dữ liệu/cache.

2.  **Domain-Driven Design (DDD) & Bounded Contexts:**
    - **Mô tả:** Thiết kế các microservice xung quanh các "bounded contexts" (ngữ cảnh giới hạn) của miền nghiệp vụ. Mỗi microservice sở hữu dữ liệu và logic của riêng nó.
    - **Go-idiomatic:** Phù hợp với microservices, giúp decoupling dịch vụ.
    - **Liên quan đến Data Persistence:**
      - **Strict Limitation on Foreign Keys (FKs):** Tránh FKs giữa các microservice để tăng khả năng mở rộng và decoupling.
      - **Shift Integrity Management to Application Layer:** Quản lý tính toàn vẹn dữ liệu ở lớp ứng dụng (Service/Domain logic).
      - **Prioritize Data Decoupling and Denormalization:** Thiết kế schema độc lập, denormalize dữ liệu có kiểm soát để giảm gọi API và JOIN chéo dịch vụ.

3.  **Eventual Consistency (Nhất quán cuối cùng):**
    - **Mô tả:** Dữ liệu có thể không nhất quán ngay lập tức trên toàn hệ thống sau một thao tác ghi, nhưng cuối cùng sẽ trở nên nhất quán. Thường dùng trong kiến trúc microservices.
    - **Go-idiomatic:** Triển khai bằng Message Queues (Kafka, NATS) hoặc Saga patterns để đồng bộ hóa dữ liệu giữa các dịch vụ một cách bất đồng bộ.
    - **Ví dụ:** Service A cập nhật dữ liệu của nó, publish một event. Service B subscribe event đó và cập nhật dữ liệu của nó dựa trên event.

4.  **Database Migration Tools:**
    - **Mô tả:** Sử dụng các công cụ như Goose hoặc Migrate để quản lý các thay đổi schema và dữ liệu của cơ sở dữ liệu một cách có phiên bản và idempotent.
    - **Go-idiomatic:** **(Yêu cầu bắt buộc trong context của bạn)** Đảm bảo quá trình triển khai cơ sở dữ liệu tự động và đáng tin cậy.

5.  **Circuit Breaker:**
    - **Mô tả:** Ngăn chặn ứng dụng gửi request liên tục đến một dịch vụ bị lỗi, giúp hệ thống phục hồi và tránh quá tải dịch vụ lỗi.
    - **Go-idiomatic:** Có các thư viện Go như `sony/gobreaker` để triển khai.

6.  **Rate Limiter:**
    - **Mô tả:** Giới hạn số lượng request mà một client hoặc một dịch vụ có thể thực hiện trong một khoảng thời gian nhất định.
    - **Go-idiomatic:** Có thể triển khai bằng các thuật toán như Token Bucket hoặc Leaky Bucket, thường dùng cho API Gateway hoặc trong từng microservice.

Việc hiểu và áp dụng các pattern này sẽ giúp bạn viết mã Go hiệu quả, dễ bảo trì và phù hợp với kiến trúc microservices hiện đại.
