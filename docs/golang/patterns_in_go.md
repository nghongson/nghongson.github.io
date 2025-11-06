### I. Mẫu Đồng thời (Concurrency Patterns) - Thế mạnh cốt lõi của Go

Các mẫu này khai thác triệt để `goroutines` và `channels` để quản lý các tác vụ đồng thời một cách hiệu quả và an toàn.

1.  **Worker Pool (Nhóm Công việc)**
    - **Mô tả:** Giới hạn số lượng `goroutines` chạy đồng thời để xử lý một tập hợp các công việc. Các công việc được gửi vào một kênh (channel), và một số lượng `goroutines` cố định (workers) sẽ lấy công việc từ kênh đó để xử lý.
    - **Khi sử dụng:** Khi bạn có nhiều tác vụ cần xử lý nhưng muốn kiểm soát tài nguyên (CPU, memory, kết nối database) và tránh làm quá tải hệ thống. Ví dụ: xử lý hàng đợi tin nhắn, nén ảnh, thực hiện các yêu cầu API bên ngoài.
    - **Cách tiếp cận:**
      - Tạo một kênh `jobs` để gửi công việc.
      - Tạo một kênh `results` để nhận kết quả.
      - Khởi tạo N `goroutines` (workers), mỗi worker đọc từ kênh `jobs`, xử lý, và ghi kết quả vào kênh `results`.
      - Đóng kênh `jobs` khi tất cả công việc đã được gửi.
      - Sử dụng `sync.WaitGroup` để chờ tất cả workers hoàn thành.

2.  **Fan-Out / Fan-In (Phân Luồng / Gom Luồng)**
    - **Mô tả:**
      - **Fan-Out:** Phân chia một luồng công việc thành nhiều `goroutines` để xử lý song song.
      - **Fan-In:** Gom kết quả từ nhiều `goroutines` hoặc nhiều kênh thành một kênh duy nhất.
    - **Khi sử dụng:**
      - **Fan-Out:** Khi bạn cần xử lý một lượng lớn dữ liệu hoặc tác vụ một cách song song để tăng tốc độ.
      - **Fan-In:** Khi bạn muốn tổng hợp kết quả từ các nguồn xử lý song song vào một điểm duy nhất để tiếp tục xử lý hoặc trả về.
    - **Cách tiếp cận:**
      - **Fan-Out:** Đọc từ kênh đầu vào, tạo nhiều `goroutines` để xử lý từng phần, mỗi `goroutine` ghi kết quả vào kênh riêng hoặc một kênh chung.
      - **Fan-In:** Một `goroutine` chính đọc từ nhiều kênh kết quả và gửi chúng vào một kênh tổng hợp.

3.  **Pipelines (Đường ống)**
    - **Mô tả:** Xử lý dữ liệu theo một chuỗi các giai đoạn, trong đó đầu ra của một giai đoạn trở thành đầu vào của giai đoạn tiếp theo. Mỗi giai đoạn thường chạy trong một `goroutine` riêng biệt và giao tiếp qua `channels`.
    - **Khi sử dụng:** Khi bạn cần xử lý dữ liệu qua nhiều bước tuần tự nhưng muốn tối ưu hóa hiệu suất bằng cách xử lý các phần khác nhau của dữ liệu ở các giai đoạn khác nhau một cách đồng thời. Ví dụ: xử lý ETL (Extract, Transform, Load), chuỗi xử lý hình ảnh, phân tích dữ liệu.
    - **Cách tiếp cận:** Mỗi hàm (hoặc nhóm hàm) đại diện cho một giai đoạn, nhận kênh đầu vào và trả về kênh đầu ra.

4.  **Context (Ngữ cảnh)**
    - **Mô tả:** Là một đối tượng (kiểu `context.Context`) được truyền qua các lời gọi hàm để mang tín hiệu hủy bỏ (cancellation), thời hạn (deadline/timeout) và các giá trị theo yêu cầu (request-scoped values) qua các ranh giới API và giữa các `goroutines`.
    - **Khi sử dụng:** **Luôn luôn** sử dụng trong các ứng dụng web/API, microservices, hoặc bất kỳ hệ thống nào có các tác vụ đồng thời hoặc lâu dài cần được quản lý lifecycle. Điều này đặc biệt quan trọng để ngăn chặn rò rỉ `goroutine` và giới hạn thời gian thực thi.
    - **Cách tiếp cận:**
      - Truyền `context.Context` làm tham số đầu tiên của các hàm.
      - Sử dụng `context.WithTimeout`, `context.WithDeadline`, `context.WithCancel` để tạo các ngữ cảnh con.
      - Sử dụng `select` với `<-ctx.Done()` để lắng nghe tín hiệu hủy bỏ.

5.  **Rate Limiter (Bộ Giới hạn Tốc độ)**
    - **Mô tả:** Kiểm soát tần suất mà một hành động (ví dụ: gọi API, gửi tin nhắn) có thể được thực hiện để ngăn chặn quá tải dịch vụ hoặc tuân thủ các giới hạn của bên thứ ba.
    - **Khi sử dụng:** Bảo vệ tài nguyên của bạn, tuân thủ chính sách của API bên ngoài, hoặc đảm bảo công bằng trong việc sử dụng dịch vụ.
    - **Cách tiếp cận:** Sử dụng gói `golang.org/x/time/rate` hoặc triển khai bằng `channels` và `time.Ticker` để chỉ cho phép một số lượng request nhất định trong một khoảng thời gian cụ thể.

6.  **Error Group (Nhóm Lỗi)**
    - **Mô tả:** Quản lý lỗi từ nhiều `goroutines` con, cho phép bạn đợi tất cả các `goroutines` hoàn thành và thu thập lỗi từ chúng. Nó cũng cung cấp một cơ chế để hủy bỏ tất cả các `goroutines` con nếu một trong số chúng trả về lỗi.
    - **Khi sử dụng:** Khi bạn khởi chạy nhiều `goroutines` không phụ thuộc vào nhau và muốn chờ chúng hoàn thành, thu thập tất cả lỗi (hoặc lỗi đầu tiên), và có thể hủy bỏ những `goroutine` khác nếu có lỗi xảy ra.
    - **Cách tiếp cận:** Sử dụng gói `golang.org/x/sync/errgroup`.

---

### II. Mẫu Thiết kế Chung & Go Idiomatic (General & Go Idiomatic Design Patterns)

Đây là các mẫu phổ biến trong lập trình hướng đối tượng được điều chỉnh hoặc có cách triển khai đặc trưng trong Go, hoặc các nguyên tắc thiết kế được Go khuyến khích.

1.  **Repository Pattern (Mẫu Repository)**
    - **Mô tả:** Trừu tượng hóa lớp truy cập dữ liệu (data access layer) khỏi lớp nghiệp vụ (business logic). Lớp nghiệp vụ giao tiếp với một interface `Repository` mà không cần biết chi tiết về cách dữ liệu được lưu trữ (SQL, NoSQL, in-memory, v.v.).
    - **Khi sử dụng:** **Bắt buộc** trong kiến trúc microservices với Go để tách biệt logic nghiệp vụ khỏi chi tiết lưu trữ dữ liệu, tăng cường khả năng kiểm thử, linh hoạt thay đổi cơ sở dữ liệu và tuân thủ DDD.
    - **Cách tiếp cận:** Định nghĩa một `interface` cho Repository trong domain layer hoặc service layer. Triển khai concrete structs cho từng loại cơ sở dữ liệu.

2.  **Options Pattern / Functional Options Pattern (Mẫu Tùy chọn / Mẫu Tùy chọn Hàm)**
    - **Mô tả:** Cung cấp một cách linh hoạt và có thể mở rộng để cấu hình các `struct` hoặc hàm, đặc biệt khi có nhiều tham số tùy chọn. Thay vì truyền nhiều tham số `nil` hoặc một `Config` struct lớn, bạn truyền một danh sách các "option functions" có thể thay đổi trạng thái của đối tượng/hàm.
    - **Khi sử dụng:** Khi bạn cần tạo các đối tượng hoặc gọi các hàm với nhiều tham số cấu hình tùy chọn mà không muốn có constructor/hàm với quá nhiều tham số. Rất phổ biến trong các thư viện Go.
    - **Cách tiếp cận:** Định nghĩa kiểu `Option func(*MyStruct)` và các hàm tạo `Option` (ví dụ: `WithTimeout(d time.Duration) Option`).

3.  **Builder Pattern (Mẫu Builder)**
    - **Mô tả:** Cung cấp một API theo chuỗi (chainable API) để xây dựng các đối tượng phức tạp từng bước một, tách biệt quá trình xây dựng khỏi biểu diễn cuối cùng của đối tượng.
    - **Khi sử dụng:** Khi một đối tượng có nhiều thuộc tính tùy chọn hoặc yêu cầu một quá trình xây dựng nhiều bước, hoặc khi bạn muốn đảm bảo tính bất biến (immutability) sau khi đối tượng được tạo.
    - **Cách tiếp cận:** Tạo một `Builder` struct với các phương thức setter trả về `*Builder` để cho phép gọi chuỗi (method chaining), và một phương thức `Build()` trả về đối tượng đã hoàn thành.

4.  **Strategy Pattern (Mẫu Chiến lược)**
    - **Mô tả:** Định nghĩa một họ các thuật toán, đóng gói mỗi thuật toán và làm cho chúng có thể hoán đổi cho nhau. Nó cho phép một client chọn thuật toán để sử dụng tại thời điểm chạy.
    - **Khi sử dụng:** Khi bạn có nhiều biến thể của một hành vi hoặc thuật toán và muốn thay đổi giữa chúng một cách linh hoạt mà không sửa đổi code client.
    - **Cách tiếp cận:** Định nghĩa một `interface` cho chiến lược (ví dụ: `PaymentStrategy`). Các struct cụ thể triển khai interface đó. Client chứa một trường `PaymentStrategy` và gọi phương thức trên đó.

5.  **Decorator Pattern (Mẫu Decorator)**
    - **Mô tả:** Gắn thêm các hành vi hoặc trách nhiệm mới vào một đối tượng một cách động.
    - **Khi sử dụng:** Khi bạn muốn mở rộng chức năng của một đối tượng mà không cần kế thừa hoặc thay đổi cấu trúc của nó. Rất hữu ích cho logging, metrics, authentication/authorization, caching...
    - **Cách tiếp cận:** Tạo một `struct` Decorator bao bọc một `interface` cụ thể. Phương thức của Decorator gọi phương thức tương ứng trên đối tượng được bọc, thêm logic bổ sung trước hoặc sau đó.

6.  **"Accept Interfaces, Return Structs" (Chấp nhận Interface, Trả về Struct)**
    - **Mô tả:** Đây là một nguyên tắc idiomatic trong Go: các hàm hoặc phương thức nên chấp nhận các `interface` làm tham số đầu vào (để tăng tính linh hoạt và khả năng kiểm thử), nhưng nên trả về các `struct` cụ thể (để cung cấp đầy đủ chức năng).
    - **Khi sử dụng:** Hầu hết mọi nơi trong thiết kế API và gói Go.
    - **Cách tiếp cận:**

      ```go
      // Bad: less flexible, tightly coupled
      // func NewService(db *sql.DB) *Service {...}

      // Good: accepts any type that implements the DBClient interface
      func NewService(db DBClient) *Service { // DBClient is an interface
          return &Service{db: db} // Service is a concrete struct
      }
      ```

---

### III. Mẫu Kiến trúc Microservices (Microservices Architectural Patterns)

Các mẫu này đặc biệt quan trọng khi xây dựng và quản lý các hệ thống phân tán với Go.

1.  **Domain-Driven Design (DDD) Bounded Contexts**
    - **Mô tả:** Chia hệ thống thành các "ngữ cảnh giới hạn" (Bounded Contexts) riêng biệt, mỗi ngữ cảnh có một mô hình miền (domain model) và ngôn ngữ chung (ubiquitous language) riêng. Mỗi microservice thường tương ứng với một Bounded Context.
    - **Khi sử dụng:** **Cơ sở** để thiết kế và chia nhỏ các microservices. Giúp xác định ranh giới dịch vụ, giảm thiểu sự phụ thuộc và cho phép phát triển độc lập.
    - **Cách tiếp cận:** Phân tích miền nghiệp vụ, xác định các ranh giới tự nhiên nơi các khái niệm (entities, aggregates) có ý nghĩa khác nhau hoặc được quản lý bởi các nhóm khác nhau.

2.  **Saga Pattern (Mẫu Saga)**
    - **Mô tả:** Một cách để quản lý các giao dịch phân tán (distributed transactions) trong kiến trúc microservices. Một Saga là một chuỗi các giao dịch cục bộ (local transactions) riêng lẻ trong mỗi dịch vụ. Nếu một giao dịch cục bộ thất bại, Saga sẽ thực hiện các giao dịch bù trừ (compensating transactions) để hoàn tác các thay đổi đã thực hiện trước đó.
    - **Khi sử dụng:** Khi bạn cần duy trì tính nhất quán dữ liệu qua nhiều dịch vụ mà không sử dụng giao dịch 2-phase commit (2PC) truyền thống (thường không khả thi trong microservices).
    - **Cách tiếp cận:**
      - **Choreography (điều phối):** Các dịch vụ tự phát ra/lắng nghe các sự kiện và tự điều phối Saga.
      - **Orchestration (điều hành):** Một `Orchestrator` service trung tâm điều khiển luồng của Saga.

3.  **Circuit Breaker (Mẫu Ngắt Mạch)**
    - **Mô tả:** Một mẫu phòng vệ để ngăn chặn sự cố cascading failures trong hệ thống phân tán. Khi một dịch vụ con bắt đầu trả về lỗi hoặc phản hồi chậm, Circuit Breaker sẽ "mở mạch" (open the circuit), chuyển hướng các yêu cầu đến dịch vụ đó sang một phản hồi lỗi tức thì thay vì tiếp tục gửi yêu cầu và làm quá tải dịch vụ bị lỗi. Sau một thời gian, nó sẽ thử lại.
    - **Khi sử dụng:** Khi gọi các dịch vụ bên ngoài hoặc các microservices khác để tăng tính ổn định và khả năng phục hồi của hệ thống.
    - **Cách tiếp cận:** Sử dụng thư viện như `github.com/sony/gobreaker` hoặc tự triển khai với các trạng thái `Closed`, `Open`, `Half-Open`.

4.  **Retry Pattern (Mẫu Thử Lại)**
    - **Mô tả:** Tự động thử lại một hoạt động bị lỗi (ví dụ: gọi API, truy vấn cơ sở dữ liệu) với hy vọng rằng nó sẽ thành công trong lần thử tiếp theo, đặc biệt cho các lỗi tạm thời (transient failures).
    - **Khi sử dụng:** Khi tương tác với các hệ thống có thể gặp lỗi tạm thời (mạng chập chờn, dịch vụ khác đang khởi động lại, giới hạn số lượng request tạm thời).
    - **Cách tiếp cận:** Sử dụng vòng lặp với `time.Sleep` và các chiến lược backoff (ví dụ: exponential backoff) để tăng thời gian chờ giữa các lần thử lại. Cần kết hợp với `context.Context` để có thể hủy bỏ.

5.  **Idempotent Operations (Thao tác Bất Biến)**
    - **Mô tả:** Thiết kế các thao tác sao cho việc thực hiện chúng nhiều lần sẽ tạo ra cùng một kết quả như khi thực hiện một lần. Điều này rất quan trọng trong hệ thống phân tán nơi tin nhắn có thể được gửi nhiều lần (ví dụ: do thử lại).
    - **Khi sử dụng:** **Bắt buộc** khi thiết kế các API nhận lệnh (commands), xử lý tin nhắn từ hàng đợi, hoặc bất kỳ thao tác nào có thể được gọi lại.
    - **Cách tiếp cận:**
      - Sử dụng ID duy nhất cho mỗi yêu cầu (ví dụ: `Idempotency-Key` trong header HTTP).
      - Kiểm tra sự tồn tại của ID đó trong cơ sở dữ liệu trước khi xử lý.
      - Đối với database migrations: **Bắt buộc** sử dụng các công cụ di chuyển cơ sở dữ liệu bất biến (như Goose, Migrate) để đảm bảo các thay đổi schema/data an toàn khi chạy nhiều lần.

6.  **Event-Driven Architecture (Kiến trúc Hướng Sự kiện)**
    - **Mô tả:** Các dịch vụ giao tiếp bằng cách phát ra và tiêu thụ các sự kiện. Thay vì gọi trực tiếp nhau, các dịch vụ publish sự kiện khi có điều gì đó quan trọng xảy ra, và các dịch vụ khác đăng ký lắng nghe các sự kiện đó để phản ứng.
    - **Khi sử dụng:** Để tăng cường tính decoupling giữa các microservices, cho phép mở rộng hệ thống dễ dàng hơn và xây dựng các hệ thống có tính nhất quán cuối cùng (eventual consistency).
    - **Cách tiếp cận:** Sử dụng Message Brokers (như Kafka, NATS, RabbitMQ) để quản lý việc publish/subscribe sự kiện.

---
