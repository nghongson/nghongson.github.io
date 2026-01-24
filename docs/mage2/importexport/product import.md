Class `\Magento\CatalogImportExport\Model\Import\Product` là "trái tim" của hệ thống Import sản phẩm trong Magento 2. Nó được thiết kế để xử lý dữ liệu cực lớn bằng cách chia nhỏ quá trình thành nhiều giai đoạn nhằm tối ưu bộ nhớ.

Dưới đây là phân tích chi tiết về luồng dữ liệu và nơi lưu trữ:

---

### 1. Dữ liệu được lưu vào đâu trước khi Import?

Trước khi dữ liệu thực sự được đưa vào các bảng sản phẩm (`catalog_product_entity`), nó trải qua hai trạng thái lưu trữ tạm thời:

#### A. Trạng thái Upload (File tạm)

Khi bạn upload file CSV từ Admin, file này được lưu tạm thời trong thư mục `var/import/` hoặc `var/tmp/`.

#### B. Trạng thái Database Tạm (Bảng `importexport_importdata`)

Đây là điểm mấu chốt. Để tránh việc đọc file CSV khổng lồ nhiều lần (gây tốn I/O và RAM), Magento chuyển toàn bộ nội dung file CSV vào database.

- **Tên bảng:** `importexport_importdata`.
- **Cấu trúc:** Bảng này lưu dữ liệu dưới dạng các bản ghi (rows). Cột `data` trong bảng này chứa nội dung của một dòng CSV đã được serialize hoặc chuyển thành JSON.
- **Lợi ích:** Việc truy vấn dữ liệu từ DB nhanh hơn và ổn định hơn nhiều so với việc mở một file CSV có hàng trăm nghìn dòng.

---

### 2. Luồng hoạt động (Workflow)

Quá trình hoạt động của Class này chia làm 2 giai đoạn chính: **Validation** (Kiểm tra) và **Import** (Thực thi).

#### Giai đoạn 1: Validation (Check Data)

1. Hệ thống đọc file CSV.
2. Ghi dữ liệu vào bảng `importexport_importdata`.
3. Class `Product.php` gọi hàm `validateData()`. Nó quét qua các dòng trong bảng tạm để kiểm tra:

- SKU có trống không?
- Attribute set có tồn tại không?
- Các giá trị của Dropdown/Multiselect có hợp lệ không?

4. Kết quả (lỗi, cảnh báo) được trả về cho giao diện Admin.

#### Giai đoạn 2: Import (Processing)

Khi bạn nhấn nút "Import", hàm `_importData()` được gọi. Quá trình này không chạy một lúc hết toàn bộ mà chia làm nhiều bước (Behaviors):

1. **`_saveProducts()`**: Xử lý các thông tin cơ bản ở bảng chính (`catalog_product_entity`).
2. **`_saveAttributes()`**: Đây là phần nặng nhất. Nó bóc tách các cột trong CSV để map vào các bảng EAV (varchar, int, decimal...).
3. **`_saveStockItem()`**: Cập nhật số lượng kho vào bảng `cataloginventory_stock_item`.
4. **`_saveLinks()`**: Xử lý sản phẩm liên quan (Related, Up-sell, Cross-sell).

---

### 3. Dữ liệu được lấy ra như thế nào?

Trong code của `Product.php`, việc lấy dữ liệu từ bảng tạm được thực hiện thông qua một đối tượng gọi là **Source Adapter**.

- **Cơ chế:** Sử dụng `\Magento\ImportExport\Model\ResourceModel\Import\Data`.
- **Cách lấy:** \* Hệ thống khởi tạo một con trỏ (Iterator) để duyệt qua bảng `importexport_importdata`.
- Hàm `getNextRow()` hoặc `_getSource()` sẽ lấy từng dòng dữ liệu từ bảng tạm lên.
- Dữ liệu sau đó được đưa vào một mảng `$rowData`.

---

### 4. Tại sao cách này lại tối ưu?

Thay vì dùng Repository hay Model (`$product->save()`), Class này sử dụng **Direct SQL Queries**:

- Nó gom các bản ghi thành từng lô (Batch - mặc định khoảng 100 dòng).
- Sử dụng câu lệnh `INSERT ... ON DUPLICATE KEY UPDATE`.
- **Kết quả:** Tốc độ import có thể đạt hàng nghìn sản phẩm mỗi phút, điều mà vòng lặp `$product->save()` không bao giờ làm được.
