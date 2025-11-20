Việc `webonyx/graphql-php` thực hiện các promise trong quá trình xử lý GraphQL query là một cơ chế mạnh mẽ để tối ưu hóa hiệu suất, đặc biệt là trong môi trường PHP vốn dĩ là đồng bộ. Dưới đây là lý do và cách thức thực hiện:

### Tại sao `webonyx/graphql-php` lại sử dụng Promise?

1.  **Xử lý các tác vụ không đồng bộ (Asynchronous Operations):**
    - Trong một truy vấn GraphQL, các trường (fields) có thể cần lấy dữ liệu từ nhiều nguồn khác nhau: cơ sở dữ liệu, các API bên ngoài, hoặc các dịch vụ khác.
    - Một số tác vụ này có thể mất thời gian đáng kể (ví dụ: gọi HTTP API, truy vấn cơ sở dữ liệu phức tạp).
    - Nếu PHP thực hiện một cách hoàn toàn đồng bộ, mỗi lần lấy dữ liệu sẽ chặn toàn bộ luồng thực thi cho đến khi dữ liệu đó sẵn sàng, dẫn đến hiệu suất kém.
    - Promise cho phép trình thực thi GraphQL "hoãn" việc giải quyết giá trị của một trường cho đến khi dữ liệu cơ bản của nó sẵn sàng, mà không chặn toàn bộ quá trình thực thi.

2.  **Tối ưu hóa bằng Batching (Data Loaders):**
    - Đây là lý do quan trọng nhất. Một truy vấn GraphQL có thể yêu cầu nhiều đối tượng cùng loại (ví dụ: 10 sản phẩm) và mỗi đối tượng đó cần một thông tin phụ thuộc (ví dụ: tên danh mục của sản phẩm).
    - Nếu không có promise và batching, bạn sẽ thực hiện 10 truy vấn riêng biệt để lấy tên danh mục.
    - Với promise và Data Loaders (một pattern thường đi kèm với promise), trình thực thi có thể thu thập tất cả các yêu cầu về tên danh mục, sau đó gom chúng lại thành một truy vấn duy nhất (ví dụ: `SELECT name FROM category WHERE id IN (id1, id2, ..., id10)`).
    - Promise sẽ được trả về ngay lập tức cho mỗi sản phẩm, và khi truy vấn gom nhóm hoàn tất, tất cả các promise sẽ được giải quyết cùng lúc với dữ liệu đã được batch, giảm đáng kể số lượng truy vấn I/O.

3.  **Quản lý luồng điều khiển phức tạp:**
    - Khi một trường trả về một promise, trình thực thi biết rằng nó cần đợi promise đó được giải quyết trước khi chuyển sang các trường phụ thuộc hoặc hoàn thành toàn bộ phản hồi. Điều này giúp quản lý các mối quan hệ dữ liệu phức tạp một cách có trật tự.

### Promise được thực hiện như thế nào trong PHP và Magento?

PHP về bản chất là một ngôn ngữ đồng bộ (singleton process, run-to-completion). Do đó, "promise" trong PHP không giống hoàn toàn với promise trong JavaScript (nơi có event loop nội tại và non-blocking I/O). Thay vào đó, nó là một triển khai userland mô phỏng hành vi của promise.

1.  **Trong PHP (thư viện `webonyx/graphql-php`):**
    - `webonyx/graphql-php` thường tích hợp hoặc dựa trên các thư viện promise của PHP như `react/promise`.
    - **Đối tượng Promise:** Các thư viện này cung cấp một đối tượng `Promise` đại diện cho một giá trị sẽ có trong tương lai. Nó có các phương thức `then()`, `catch()`, `finally()` để đính kèm các callback sẽ được gọi khi promise được giải quyết (fulfilled) hoặc bị từ chối (rejected).
    - **Trình điều phối (Dispatcher/Loop):** Mặc dù PHP không có event loop sẵn có như Node.js, các thư viện promise sẽ sử dụng một cơ chế "tick" hoặc một trình điều phối để kiểm tra trạng thái của các promise đang chờ.
    - **Chờ đợi (Waiting):** Cuối cùng, tại một điểm nào đó trong quá trình thực thi (thường là sau khi tất cả các promise đã được tạo), trình thực thi sẽ gọi một phương thức "chờ" (ví dụ: `wait()` hoặc `Promise::all()->wait()`). Tại thời điểm này, luồng thực thi PHP sẽ **thực sự bị chặn** cho đến khi tất cả các promise đang chờ được giải quyết. Điểm khác biệt là việc chờ này xảy ra _sau khi_ các hoạt động I/O đã được gom nhóm hoặc khởi tạo, thay vì chờ từng hoạt động riêng lẻ.
    - **DataLoaders:** Các DataLoaders (ví dụ: `dataloader-php`) hoạt động bằng cách trì hoãn việc thực hiện truy vấn thực tế cho đến khi tất cả các ID cần thiết đã được thu thập trong cùng một "tick" của event loop giả lập, sau đó thực hiện một truy vấn duy nhất và giải quyết tất cả các promise liên quan.

2.  **Trong Magento 2:**
    - Magento sử dụng `webonyx/graphql-php` làm thư viện GraphQL chính.
    - Khi một yêu cầu GraphQL đến, nó được xử lý bởi `\Magento\Webapi\Controller\Rest`, sau đó chuyển đến `\Magento\Framework\GraphQl\Query\QueryProcessor::process`.
    - Bên trong `QueryProcessor::process`, phương thức `executeQuery` của `webonyx/graphql-php` sẽ được gọi.
    - Các resolver trong Magento (ví dụ: các lớp triển khai `ResolverInterface`) có thể trả về:
      - Một giá trị trực tiếp (đồng bộ).
      - Một `Promise` (không đồng bộ, thường là từ một Data Loader).
    - Nếu một resolver trả về một `Promise`, trình thực thi của `webonyx/graphql-php` sẽ thêm promise đó vào danh sách các promise cần được giải quyết.
    - Magento khuyến khích sử dụng Data Loaders để tối ưu hóa hiệu suất. Ví dụ, khi bạn truy vấn danh sách sản phẩm và cần lấy thông tin thuộc tính cho từng sản phẩm, một Data Loader có thể thu thập tất cả các ID sản phẩm và ID thuộc tính cần thiết, sau đó thực hiện một hoặc một vài truy vấn cơ sở dữ liệu được tối ưu hóa để lấy tất cả dữ liệu cùng một lúc, và sau đó giải quyết các promise cho từng sản phẩm.
    - Cơ chế `QueryProcessor` trong Magento, như đã đề cập trong ngữ cảnh, sử dụng mô hình Chain of Responsibility để xử lý các bước như xác thực, ủy quyền, và caching. Việc xử lý promise diễn ra trong phần _thực thi query_ của chuỗi này, nơi `webonyx/graphql-php` đảm nhận vai trò chính. Cuối cùng, kết quả từ các promise đã được giải quyết sẽ được tổng hợp lại thành phản hồi GraphQL cuối cùng.

Tóm lại, việc sử dụng promise trong `webonyx/graphql-php` và Magento là một kỹ thuật tối ưu hóa hiệu suất quan trọng, cho phép gom nhóm các yêu cầu I/O và mô phỏng hành vi không đồng bộ để giảm độ trễ và tải cho hệ thống, đặc biệt hiệu quả với các Data Loader.
