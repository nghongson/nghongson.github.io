Để tạo một wrapper hiển thị thông tin lỗi cho API trong Go, đặc biệt khi API của bạn được xây dựng theo phong cách microservices và sử dụng kiến trúc Domain-Driven Design (DDD) cùng với việc xử lý lỗi tường minh, chúng ta cần một giải pháp linh hoạt và có khả năng tùy chỉnh.

Mục tiêu chính là:

1.  **Trừu tượng hóa việc xử lý lỗi:** Ẩn đi chi tiết triển khai lỗi nội bộ khỏi client.
2.  **Định dạng nhất quán:** Đảm bảo phản hồi lỗi có cấu trúc đồng nhất.
3.  **Thân thiện với người dùng:** Hiển thị thông báo lỗi dễ hiểu cho client.
4.  **Ghi log chi tiết:** Giữ lại thông tin lỗi đầy đủ ở phía server để gỡ lỗi.
5.  **Ánh xạ trạng thái HTTP:** Chuyển đổi các loại lỗi nội bộ sang mã trạng thái HTTP phù hợp.
6.  **Tách biệt mối quan tâm:** Logic dịch lỗi nên tách biệt khỏi logic nghiệp vụ chính.

Giả sử API của bạn sử dụng `net/http` và định nghĩa các lỗi nghiệp vụ/domain cụ thể, cũng như các lỗi hạ tầng.

---

### Cấu trúc Lỗi Tùy chỉnh (Custom Error Structure)

Đầu tiên, chúng ta sẽ định nghĩa một `struct` lỗi tùy chỉnh để gói gọn thông tin lỗi có ý nghĩa cho client và cho việc ghi log.

```go
package apierrors

import (
	"fmt"
	"net/http"
)

// APIError là một struct tùy chỉnh để đóng gói thông tin lỗi cho phản hồi API
type APIError struct {
	Code    string `json:"code"`             // Mã lỗi định danh (ví dụ: "INVALID_INPUT", "NOT_FOUND")
	Message string `json:"message"`          // Thông báo lỗi thân thiện với người dùng
	Status  int    `json:"-"`                // Mã trạng thái HTTP (không hiển thị cho client)
	Details string `json:"details,omitempty"` // Chi tiết lỗi thêm (tùy chọn, có thể ẩn trong production)
	Err     error  `json:"-"`                // Lỗi gốc (internal error), không hiển thị cho client
}

// Implement the error interface for APIError
func (e *APIError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("API Error: %s (Status: %d, Code: %s, Message: %s) -> Original Error: %v", e.Code, e.Status, e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("API Error: %s (Status: %d, Code: %s, Message: %s)", e.Code, e.Status, e.Code, e.Message)
}

// Unwrap implements the errors.Unwrap interface, allowing errors.Is and errors.As to work
func (e *APIError) Unwrap() error {
	return e.Err
}

// NewAPIError tạo một APIError mới
func NewAPIError(status int, code, message string, originalErr error) *APIError {
	return &APIError{
		Status:  status,
		Code:    code,
		Message: message,
		Err:     originalErr,
	}
}

// Hàm tiện ích để tạo các loại lỗi phổ biến
func BadRequest(message string, originalErr error) *APIError {
	return NewAPIError(http.StatusBadRequest, "BAD_REQUEST", message, originalErr)
}

func NotFound(message string, originalErr error) *APIError {
	return NewAPIError(http.StatusNotFound, "NOT_FOUND", message, originalErr)
}

func InternalServerError(message string, originalErr error) *APIError {
	return NewAPIError(http.StatusInternalServerError, "INTERNAL_ERROR", message, originalErr)
}

func Unauthorized(message string, originalErr error) *APIError {
	return NewAPIError(http.StatusUnauthorized, "UNAUTHORIZED", message, originalErr)
}

func Forbidden(message string, originalErr error) *APIError {
	return NewAPIError(http.StatusForbidden, "FORBIDDEN", message, originalErr)
}

// Thêm các hàm lỗi khác tùy theo nhu cầu
```

---

### Wrapper cho HTTP Handler (Error Handler Middleware)

Để xử lý việc ánh xạ lỗi và trả về phản hồi lỗi một cách nhất quán, chúng ta sẽ tạo một middleware hoặc một hàm `wrapper`.

```go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"yourproject/apierrors" // Thay thế bằng đường dẫn gói của bạn
)

// Logger là một dependency mẫu
type Logger interface {
	Infof(format string, args ...interface{})
	Errorf(format string, args ...interface{})
}

type defaultLogger struct{}

func (d *defaultLogger) Infof(format string, args ...interface{}) { log.Printf("INFO: "+format, args...) }
func (d *defaultLogger) Errorf(format string, args ...interface{}) { log.Printf("ERROR: "+format, args...) }

// AppContext chứa các dependencies toàn cục của ứng dụng
type AppContext struct {
	Logger Logger
	// Thêm các dependencies khác như DB client, Config, v.v.
	// Ví dụ: customerRepo CustomerRepository
	//        productRepo ProductRepository
}

// CustomHandler là loại hàm handler của chúng ta.
// Nó trả về error để cho phép wrapper xử lý lỗi tập trung.
type CustomHandler func(w http.ResponseWriter, r *http.Request, appCtx *AppContext) error

// ErrorHandlerWrapper là một middleware để xử lý lỗi từ CustomHandler
func ErrorHandlerWrapper(appCtx *AppContext, handler CustomHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		err := handler(w, r, appCtx) // Gọi handler nghiệp vụ

		if err != nil {
			var apiErr *apierrors.APIError
			if errors.As(err, &apiErr) {
				// Đây là một APIError đã được định nghĩa, gửi phản hồi lỗi cụ thể
				appCtx.Logger.Errorf("Request %s %s failed (client error): %v", r.Method, r.URL.Path, apiErr)
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(apiErr.Status)
				json.NewEncoder(w).Encode(map[string]interface{}{
					"code":    apiErr.Code,
					"message": apiErr.Message,
					"details": apiErr.Details, // Tùy chọn: chỉ hiển thị trong môi trường dev/debug
				})
			} else {
				// Đây là một lỗi không phải APIError đã định nghĩa (internal server error)
				// Ghi log lỗi đầy đủ nhưng chỉ trả về thông báo chung cho client
				appCtx.Logger.Errorf("Request %s %s failed (internal server error): %v", r.Method, r.URL.Path, err)
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{
					"code":    "INTERNAL_ERROR",
					"message": "An unexpected error occurred. Please try again later.",
					// "details": err.Error(), // KHÔNG nên hiển thị lỗi nội bộ cho client trong production
				})
			}
		} else {
			// Request thành công
			appCtx.Logger.Infof("Request %s %s completed successfully in %s", r.Method, r.URL.Path, time.Since(start))
		}
	}
}
```

---

### Định nghĩa Lỗi Domain (Domain Errors)

Các lỗi nghiệp vụ/domain nên được định nghĩa một cách rõ ràng.

```go
package domain

import "errors"

// Định nghĩa các sentinel errors cho domain
var (
	ErrCustomerNotFound   = errors.New("customer with given ID not found")
	ErrInvalidCustomerID  = errors.New("invalid customer ID format")
	ErrProductOutOfStock  = errors.New("product is out of stock")
)

// Có thể định nghĩa các kiểu lỗi struct tùy chỉnh nếu cần thêm chi tiết
type InvalidInputError struct {
	Field   string
	Reason  string
	Err     error // original error
}

func (e *InvalidInputError) Error() string {
	return fmt.Sprintf("invalid input for field '%s': %s", e.Field, e.Reason)
}

func (e *InvalidInputError) Unwrap() error {
	return e.Err
}
```

---

### Ví dụ về HTTP Handler và Sử dụng Wrapper

```go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"yourproject/apierrors" // Thay thế bằng đường dẫn gói của bạn
	"yourproject/domain"   // Thay thế bằng đường dẫn gói của bạn
)

// Giả lập một dịch vụ (Service Layer)
type CustomerService struct {
	// ... dependencies ...
}

func (s *CustomerService) GetCustomer(id string) (map[string]interface{}, error) {
	if id == "" {
		return nil, domain.ErrInvalidCustomerID
	}
	if id == "404" {
		return nil, domain.ErrCustomerNotFound
	}
	if id == "500" {
		return nil, fmt.Errorf("database connection lost for customer %s", id) // Lỗi hạ tầng
	}
	return map[string]interface{}{"id": id, "name": "Test Customer"}, nil
}

// HTTP Handler sử dụng CustomHandler type
func GetCustomerHandler(w http.ResponseWriter, r *http.Request, appCtx *AppContext) error {
	customerID := r.URL.Query().Get("id")

	customer, err := appCtx.customerService.GetCustomer(customerID)
	if err != nil {
		// Ánh xạ lỗi domain hoặc lỗi hạ tầng sang APIError
		if errors.Is(err, domain.ErrInvalidCustomerID) {
			return apierrors.BadRequest("Customer ID is required or invalid.", err)
		}
		if errors.Is(err, domain.ErrCustomerNotFound) {
			return apierrors.NotFound(fmt.Sprintf("Customer with ID '%s' not found.", customerID), err)
		}
		// Ví dụ về lỗi InvalidInputError struct
		var invalidInputErr *domain.InvalidInputError
		if errors.As(err, &invalidInputErr) {
			return apierrors.BadRequest(fmt.Sprintf("Invalid input for %s: %s", invalidInputErr.Field, invalidInputErr.Reason), err)
		}

		// Nếu là một lỗi khác (internal server error), trả về lỗi chung
		return apierrors.InternalServerError("Failed to retrieve customer due to an internal issue.", err)
	}

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(customer)
}

// Main function để khởi tạo và chạy server
func main() {
	appCtx := &AppContext{
		Logger:          &defaultLogger{},
		customerService: &CustomerService{}, // Khởi tạo service layer
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/customers", ErrorHandlerWrapper(appCtx, GetCustomerHandler))

	log.Println("Server starting on :8080")
	// Test với:
	// curl http://localhost:8080/customers
	// curl http://localhost:8080/customers?id=
	// curl http://localhost:8080/customers?id=404
	// curl http://localhost:8080/customers?id=500
	// curl http://localhost:8080/customers?id=123
	if err := http.ListenAndServe(":8080", mux); err != nil {
		appCtx.Logger.Errorf("Server failed: %v", err)
	}
}
```

---

### Phân tích Giải pháp

1.  **Gói `apierrors` (`APIError` struct):**
    - **Mục đích:** Cung cấp một định dạng lỗi chuẩn cho phản hồi API.
    - **`Code`:** Mã lỗi tường minh cho client (ví dụ: `BAD_REQUEST`).
    - **`Message`:** Thông báo thân thiện với người dùng.
    - **`Status`:** Mã trạng thái HTTP (ẩn khỏi JSON response, chỉ dùng nội bộ).
    - **`Details`:** (Tùy chọn) Để cung cấp thêm thông tin cho client trong môi trường dev/debug.
    - **`Err`:** Lỗi gốc (`internal error`) được lưu trữ để ghi log chi tiết, **không bao giờ hiển thị** cho client.
    - **`Error()` method:** Triển khai `error interface` để `APIError` có thể được trả về như một `error` thông thường.
    - **`Unwrap()` method:** Rất quan trọng! Cho phép sử dụng `errors.Is` và `errors.As` để kiểm tra lỗi gốc ngay cả khi nó đã được `wrap` bên trong `APIError`. Điều này duy trì được chuỗi lỗi của Go.

2.  **`ErrorHandlerWrapper` (`Middleware`):**
    - **Mục đích:** Là một `Higher-Order Function` hoặc `Middleware` bao bọc các `CustomHandler`. Nó có trách nhiệm tập trung xử lý tất cả các lỗi được trả về từ handler.
    - **`handler(w, r, appCtx)`:** Gọi handler nghiệp vụ thực tế.
    - **`if err != nil`:** Nếu handler trả về một `error`:
      - **`errors.As(err, &apiErr)`:** Kiểm tra xem lỗi trả về có phải là một `*apierrors.APIError` hay không.
        - **Nếu CÓ:** Dịch vụ của bạn đã chủ động tạo ra một `APIError` với `Status`, `Code`, `Message` phù hợp. Wrapper chỉ việc ghi log lỗi đầy đủ (bao gồm `apiErr.Err` là lỗi gốc) và gửi phản hồi JSON đã định dạng cho client.
        - **Nếu KHÔNG:** Đây là một lỗi bất ngờ (internal server error) mà dịch vụ chưa chủ động ánh xạ sang `APIError`. Wrapper sẽ ghi log đầy đủ lỗi gốc (`err`) nhưng chỉ gửi một thông báo lỗi chung chung (e.g., "An unexpected error occurred.") và mã `500 Internal Server Error` cho client để tránh lộ thông tin nhạy cảm.
    - **Logging:** Ghi log các lỗi cả ở cấp độ client (những lỗi đã được xử lý) và cấp độ server (những lỗi không mong muốn).

3.  **Lỗi Domain (gói `domain`):**
    - **Mục đích:** Định nghĩa các lỗi có ý nghĩa trong miền nghiệp vụ của bạn (ví dụ: `ErrCustomerNotFound`, `ErrInvalidCustomerID`).
    - **Cách sử dụng:** Các `service layer` của bạn sẽ trả về những lỗi này.
    - Trong `HTTP Handler`, bạn sẽ ánh xạ các lỗi `domain` này sang các `apierrors.APIError` phù hợp với phản hồi HTTP.

4.  **Cấu trúc `AppContext` và DI:**
    - `AppContext` cho phép truyền các dependencies cần thiết (như Logger, CustomerService) vào các handler một cách sạch sẽ. Điều này giúp các handler dễ kiểm thử hơn và tuân thủ nguyên tắc DI.

### Luồng Xử lý Lỗi

1.  Một `http.Request` đến `ErrorHandlerWrapper`.
2.  `ErrorHandlerWrapper` gọi `CustomHandler` của bạn (`GetCustomerHandler`).
3.  Trong `GetCustomerHandler`, bạn gọi các `service layer` (ví dụ: `customerService.GetCustomer`).
4.  `Service layer` thực hiện logic nghiệp vụ và có thể trả về:
    - `nil` (thành công).
    - `domain.ErrCustomerNotFound` (lỗi nghiệp vụ).
    - `fmt.Errorf("database error: %w", dbErr)` (lỗi hạ tầng).
    - `&domain.InvalidInputError{...}` (lỗi struct tùy chỉnh).
5.  `GetCustomerHandler` nhận lỗi từ `service layer`, sử dụng `errors.Is` hoặc `errors.As` để kiểm tra loại lỗi, sau đó chuyển đổi chúng thành một `*apierrors.APIError` phù hợp (hoặc để nguyên lỗi hạ tầng).
6.  `ErrorHandlerWrapper` nhận `error` từ `GetCustomerHandler`.
7.  Nếu lỗi đó là `*apierrors.APIError`, nó sẽ trích xuất thông tin, ghi log `apiErr.Err` (lỗi gốc), và trả về JSON chuẩn cho client với mã trạng thái HTTP phù hợp.
8.  Nếu lỗi không phải là `*apierrors.APIError`, nó được coi là lỗi nội bộ không mong muốn, ghi log đầy đủ và trả về `500 Internal Server Error` với thông báo chung cho client.

---

### Mở rộng và Cải tiến

- **Metadata cho lỗi:** Bạn có thể thêm các trường như `TraceID`, `RequestID` vào `APIError` để tiện cho việc debug.
- **Localization:** Thêm trường `lang` hoặc `locale` vào `APIError` để hỗ trợ đa ngôn ngữ.
- **Validation Errors:** Tạo một kiểu `APIError` chuyên biệt cho các lỗi validation, có thể chứa một danh sách các lỗi trường cụ thể.
- **OpenAPI/Swagger:** Thiết lập các định nghĩa lỗi trong OpenAPI của bạn để client biết các phản hồi lỗi có thể có.
- **Environment-Specific Details:** Kiểm tra biến môi trường (`ENV`) để quyết định liệu có nên hiển thị `apiErr.Details` hoặc stack trace của lỗi `500` cho client hay không (chỉ trong dev/staging).
- **Logging Context:** Sử dụng các thư viện logging mạnh mẽ như `zap` hoặc `zerolog` để thêm các trường ngữ cảnh (như `request_id`, `user_id`) vào log lỗi.

Giải pháp này cung cấp một cơ chế xử lý lỗi mạnh mẽ, linh hoạt và Go idiomatic, giúp bạn xây dựng các API bền vững và dễ bảo trì.
