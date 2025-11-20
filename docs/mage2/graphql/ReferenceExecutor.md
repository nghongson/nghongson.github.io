`GraphQL\Executor\ReferenceExecutor` là trái tim của quá trình thực thi truy vấn GraphQL trong thư viện `webonyx/graphql-php`. Nó chịu trách nhiệm chính trong việc biên dịch một truy vấn GraphQL đã phân tích cú pháp (Abstract Syntax Tree - AST) thành dữ liệu thực tế dựa trên Schema đã định nghĩa.

### `GraphQL\Executor\ReferenceExecutor` là gì?

`ReferenceExecutor` là lớp triển khai mặc định của trình thực thi (executor) cho GraphQL trong `webonyx/graphql-php`. Tên "Reference" ngụ ý rằng đây là một triển khai tham chiếu, tuân thủ chặt chẽ đặc tả GraphQL và cung cấp một cách đáng tin cậy để thực thi các truy vấn.

### Cơ chế hoạt động chính

1.  **Duyệt cây AST:**
    - `ReferenceExecutor` nhận vào ba thành phần chính: `Schema`, `DocumentNode` (AST của truy vấn), và `rootValue` (giá trị gốc để bắt đầu thực thi).
    - Nó duyệt qua từng trường (field) được yêu cầu trong AST của truy vấn GraphQL, bắt đầu từ `rootValue`.

2.  **Giải quyết trường (Field Resolution):**
    - Đối với mỗi trường, executor xác định hàm giải quyết (resolver function) tương ứng. Hàm resolver này có thể được định nghĩa trong schema của trường đó, hoặc nó sẽ sử dụng một resolver mặc định nếu không có hàm nào được cung cấp.
    - Hàm resolver được gọi với bốn đối số:
      - `$source`: Giá trị của đối tượng cha (parent object) mà trường này thuộc về.
      - `$args`: Các đối số (arguments) được truyền vào trường từ truy vấn GraphQL.
      - `$context`: Một đối tượng ngữ cảnh dùng chung cho toàn bộ quá trình thực thi truy vấn (trong Magento, thường chứa các dịch vụ, session, v.v.).
      - `$info`: Một đối tượng chứa thông tin chi tiết về quá trình thực thi hiện tại (như AST của trường, schema, đường dẫn đến trường hiện tại, v.v.).

3.  **Xử lý giá trị trả về của Resolver:**
    - **Giá trị đồng bộ:** Nếu resolver trả về một giá trị trực tiếp (ví dụ: chuỗi, số, mảng, đối tượng), executor sẽ tiếp tục xử lý giá trị đó (ví dụ: đệ quy cho các trường con, chuyển đổi kiểu).
    - **Promise (Không đồng bộ):** Đây là điểm quan trọng nhất. Nếu resolver trả về một đối tượng `PromiseInterface` (ví dụ: từ thư viện `react/promise`), `ReferenceExecutor` sẽ không chặn ngay lập tức. Thay vào đó, nó sẽ:
      - Lưu trữ promise đó.
      - Tiếp tục xử lý các trường khác có thể được giải quyết đồng bộ hoặc tạo ra các promise khác.
      - Tại một điểm thích hợp (thường là khi tất cả các promise ở một cấp độ đã được tạo hoặc ở cuối quá trình thực thi), executor sẽ sử dụng cơ chế của thư viện promise (ví dụ: `Promise\all()` và `wait()`) để chờ tất cả các promise đó được giải quyết. Đây là lúc luồng thực thi PHP _thực sự bị chặn_, nhưng việc chặn này xảy ra _sau khi_ các hoạt động I/O đã được gom nhóm (batch) và khởi tạo, tối ưu hóa đáng kể hiệu suất.

4.  **Xử lý lỗi (Exception Handling):**
    - Nếu một resolver ném ra một `Exception` (đồng bộ) hoặc nếu một `Promise` được trả về bởi resolver bị `rejected` (không đồng bộ), `ReferenceExecutor` sẽ bắt lỗi đó.
    - Nó sẽ thêm thông tin lỗi vào mảng `errors` trong phản hồi GraphQL theo đặc tả (bao gồm `message`, `locations`, `path`).
    - Giá trị của trường bị lỗi trong phản hồi GraphQL thường sẽ là `null`.

5.  **Tập hợp kết quả:**
    - Sau khi tất cả các trường và promise đã được giải quyết, executor sẽ tập hợp tất cả các giá trị thành một cấu trúc dữ liệu JSON phù hợp với định dạng phản hồi GraphQL.

### Liên quan đến Promise và Data Loaders

Khả năng xử lý `PromiseInterface` của `ReferenceExecutor` là chìa khóa cho việc triển khai các mẫu tối ưu hóa hiệu suất như **Data Loaders**.

- **Không có Promise:** Nếu mỗi field resolver phải tự mình truy vấn dữ liệu một cách đồng bộ, một truy vấn GraphQL yêu cầu 10 sản phẩm và mỗi sản phẩm cần thông tin về danh mục của nó sẽ dẫn đến ít nhất 11 truy vấn DB (1 cho sản phẩm, 10 cho danh mục).
- **Với Promise và Data Loaders:** Mỗi resolver trả về một promise ngay lập tức. Data Loader sẽ thu thập tất cả các yêu cầu ID danh mục trong cùng một "tick" của quá trình thực thi, sau đó gom chúng lại thành **một truy vấn DB duy nhất** (ví dụ: `SELECT * FROM category WHERE id IN (...)`). Khi truy vấn duy nhất này hoàn tất, tất cả các promise đã được Data Loader trả về sẽ được giải quyết cùng lúc với dữ liệu đã được batch. `ReferenceExecutor` chờ đợi các promise này, sau đó tiếp tục cấu trúc phản hồi.

### Trong ngữ cảnh Magento 2

Magento 2 sử dụng `webonyx/graphql-php` để triển khai GraphQL.

- Khi bạn gửi một truy vấn GraphQL đến Magento, nó sẽ đi qua `\Magento\Webapi\Controller\Rest` và sau đó đến `\Magento\Framework\GraphQl\Query\QueryProcessor::process`.
- Bên trong `QueryProcessor::process`, phương thức `GraphQL::executeQuery` của `webonyx/graphql-php` được gọi, và chính phương thức này sẽ sử dụng `ReferenceExecutor` (mặc định) để thực sự chạy truy vấn.
- Các lớp resolver của Magento (triển khai `\Magento\Framework\GraphQl\Resolver\ResolverInterface`) là những hàm mà `ReferenceExecutor` gọi. Đây là nơi bạn sẽ tìm thấy logic nghiệp vụ của Magento, các lệnh gọi đến service layer, repositories, và nơi các Data Loaders được sử dụng để trả về promise, cho phép `ReferenceExecutor` tối ưu hóa việc tìm nạp dữ liệu.

Tóm lại, `GraphQL\Executor\ReferenceExecutor` là bộ não thực thi của GraphQL trong `webonyx/graphql-php`, chịu trách nhiệm duyệt truy vấn, gọi resolver, xử lý các giá trị đồng bộ và không đồng bộ (Promise), và tập hợp kết quả thành phản hồi cuối cùng, đồng thời quản lý lỗi theo đặc tả GraphQL. Khả năng xử lý promise của nó là nền tảng cho việc tối ưu hóa hiệu suất thông qua batching và Data Loaders.
