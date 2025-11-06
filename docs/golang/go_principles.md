### I. Đơn giản & Rõ ràng (Simplicity & Readability)

1.  **Code Rõ ràng hơn Code Thông minh (Clearer Code Over Clever Code):**
    - **Triết lý:** Go ưu tiên sự rõ ràng và dễ đọc hơn các kỹ thuật lập trình phức tạp hoặc "thông minh". Mã phải dễ hiểu ngay cả đối với người mới làm quen với dự án.
    - **Áp dụng:** Tránh các thủ thuật code khó hiểu, ưu tiên các giải pháp trực tiếp. Sử dụng tên biến và hàm có ý nghĩa, tuân thủ các quy ước định dạng (`gofmt`, `golint`).

2.  **Explicit is Better Than Implicit (Minh bạch hơn Ngầm định):**
    - **Triết lý:** Go khuyến khích làm rõ mọi thứ thay vì ẩn chúng đi. Không có tính năng "phép thuật" tự động.
    - **Áp dụng:** Ví dụ, bạn phải `import` rõ ràng mọi gói bạn sử dụng. Xử lý lỗi được thực hiện tường minh bằng cách trả về `error` chứ không phải exception.

3.  **Few Features, More Productivity (Ít tính năng, Năng suất cao hơn):**
    - **Triết lý:** Go có một tập hợp tính năng nhỏ gọn, không có generics (cho đến Go 1.18), không có kế thừa lớp, không có annotations, v.v. Điều này làm giảm độ phức tạp và "cognitive load" cho lập trình viên.
    - **Áp dụng:** Tập trung vào giải pháp cho vấn đề cụ thể thay vì tìm kiếm các tính năng ngôn ngữ. Sử dụng những gì Go cung cấp (interfaces, embedding, goroutines, channels) một cách hiệu quả.

---

### II. Hiệu suất & Hiệu quả (Performance & Efficiency)

1.  **Concurrency (Đồng thời) qua `goroutines` và `channels`:**
    - **Triết lý:** Go được xây dựng từ đầu để hỗ trợ đồng thời như một tính năng ngôn ngữ hạng nhất, không phải là một thư viện bổ sung. Mô hình CSP (Communicating Sequential Processes) là cốt lõi.
    - **Áp dụng:**
      - Sử dụng `goroutines` cho các tác vụ độc lập hoặc song song mà không cần lo lắng quá nhiều về chi phí.
      - Sử dụng `channels` để giao tiếp và đồng bộ hóa giữa các `goroutines`, tránh sử dụng shared memory và mutexes bất cứ khi nào có thể ("Don't communicate by sharing memory; instead, share memory by communicating").
      - Áp dụng các mẫu đồng thời như Worker Pool, Fan-Out/Fan-In, Pipelines.

2.  **Giảm thiểu Allocations (Phân bổ bộ nhớ) và Áp lực Garbage Collector (GC):**
    - **Triết lý:** Mặc dù Go có GC, việc phân bổ bộ nhớ quá mức (đặc biệt trong các vòng lặp nóng) có thể gây ra áp lực lớn lên GC, dẫn đến việc tạm dừng (pauses) và giảm hiệu suất.
    - **Áp dụng:**
      - Sử dụng `bytes.Buffer` hoặc `strings.Builder` thay vì nối chuỗi `+=` trong vòng lặp.
      - Khởi tạo slice với dung lượng phù hợp (ví dụ: `make([]int, 0, capacity)`).
      - Tái sử dụng các đối tượng (ví dụ: sử dụng `sync.Pool`).
      - Hiểu về cách các đối tượng được phân bổ trên heap so với stack.

3.  **Tập trung vào hiệu năng (Performance Focus):**
    - **Triết lý:** Go được thiết kế để hiệu quả, với thời gian biên dịch nhanh, khởi động nhanh và hiệu suất runtime gần với C/C++.
    - **Áp dụng:** Sử dụng `pprof` để phân tích hiệu suất (CPU, bộ nhớ, block, mutex) và tìm ra các điểm nghẽn. Viết benchmark (`go test -bench .`) cho các đoạn mã quan trọng.

---

### III. Khả năng Kiểm thử & Bảo trì (Testability & Maintainability)

1.  **Interfaces để Decoupling và Testability:**
    - **Triết lý:** Go không có tính kế thừa lớp, nhưng sử dụng `interfaces` để đạt được tính đa hình và decoupling. `interfaces` trong Go là ngầm định (implicit) – một struct tự động thỏa mãn một `interface` nếu nó triển khai tất cả các phương thức của `interface` đó.
    - **Áp dụng:**
      - Sử dụng `interfaces` để định nghĩa các hợp đồng (contracts) giữa các thành phần, đặc biệt là giữa service layer và data persistence layer (Repository Pattern).
      - "Accept interfaces, return structs": Hàm nên chấp nhận `interfaces` làm tham số (để có thể truyền mock hoặc các triển khai khác nhau) nhưng trả về `structs` cụ thể (để cung cấp đầy đủ chức năng).
      - Điều này giúp dễ dàng mock các dependencies cho unit testing.

2.  **Xử lý lỗi rõ ràng (Explicit Error Handling):**
    - **Triết lý:** Go sử dụng giá trị trả về `error` làm cơ chế chính để xử lý lỗi, thay vì exceptions. Điều này buộc lập trình viên phải đối mặt và xử lý các trường hợp lỗi một cách tường minh.
    - **Áp dụng:**
      - Luôn kiểm tra `if err != nil`.
      - Trả về lỗi càng sớm càng tốt (`fail fast`).
      - Sử dụng `fmt.Errorf` với `%w` (từ Go 1.13) để wrap lỗi, duy trì chuỗi lỗi để dễ dàng gỡ lỗi và kiểm tra loại lỗi.
      - Cân nhắc khi nào nên `panic`/`recover` (chủ yếu cho các lỗi không thể phục hồi hoặc khởi tạo ứng dụng).

3.  **Tính nhất quán của mã (Code Consistency):**
    - **Triết lý:** Go rất chú trọng đến tính nhất quán thông qua các công cụ như `gofmt` (tự động định dạng mã) và `golint` (kiểm tra kiểu dáng).
    - **Áp dụng:** Luôn chạy `gofmt` và tuân thủ các quy tắc kiểu dáng của cộng đồng Go. Điều này giúp mã dễ đọc và bảo trì trên toàn bộ dự án và team.

---

### IV. Kiến trúc & Thiết kế hệ thống (Architecture & System Design)

1.  **Microservices & Bounded Contexts:**
    - **Triết lý:** Go là một lựa chọn tuyệt vời cho microservices do hiệu suất cao, khởi động nhanh và khả năng xử lý đồng thời. Triết lý DDD Bounded Contexts phù hợp tự nhiên với việc chia nhỏ các dịch vụ.
    - **Áp dụng:** Thiết kế mỗi dịch vụ xoay quanh một Bounded Context, mỗi dịch vụ sở hữu dữ liệu riêng của nó. Giảm thiểu coupling giữa các dịch vụ.

2.  **Eventual Consistency (Nhất quán cuối cùng) qua Message Queues:**
    - **Triết lý:** Trong các hệ thống phân tán, nhất quán mạnh (strong consistency) giữa các dịch vụ là khó và đắt đỏ. Nhất quán cuối cùng thường là đủ và linh hoạt hơn.
    - **Áp dụng:** Sử dụng message brokers (Kafka, NATS, RabbitMQ) để giao tiếp không đồng bộ giữa các dịch vụ. Áp dụng Saga Pattern để quản lý các giao dịch phân tán.

3.  **Resilience & Fault Tolerance (Khả năng phục hồi & Chống lỗi):**
    - **Triết lý:** Các hệ thống phân tán luôn có khả năng thất bại. Thiết kế ứng dụng để chịu đựng và phục hồi từ lỗi là tối quan trọng.
    - **Áp dụng:** Sử dụng các mẫu như Circuit Breaker, Retry Pattern với exponential backoff. Đảm bảo các hoạt động là idempotent.

4.  **Configuration over Convention (Cấu hình hơn Quy ước) - ở một mức độ:**
    - **Triết lý:** Mặc dù Go có nhiều quy ước, nó cũng cung cấp các cơ chế rõ ràng để cấu hình các thành phần (ví dụ: Functional Options Pattern) thay vì dựa vào các quy ước ngầm định hoặc magic string/annotation.
    - **Áp dụng:** Cung cấp các API dễ cấu hình và mở rộng cho các thư viện hoặc thành phần dịch vụ của bạn.

---

### V. Các nguyên tắc chung khác

1.  **Keep It Simple, Stupid (KISS):**
    - **Triết lý:** Luôn tìm kiếm giải pháp đơn giản nhất cho vấn đề.
    - **Áp dụng:** Tránh over-engineering. Một kiến trúc đơn giản thường dễ hiểu, dễ gỡ lỗi và dễ mở rộng hơn một kiến trúc phức tạp.

2.  **You Ain't Gonna Need It (YAGNI):**
    - **Triết lý:** Không thêm chức năng hoặc phức tạp hóa mã nếu bạn không thực sự cần nó ngay bây giờ.
    - **Áp dụng:** Phát triển dần dần, chỉ thêm những gì cần thiết. Chống lại cám dỗ dự đoán các nhu cầu tương lai quá mức.

---
