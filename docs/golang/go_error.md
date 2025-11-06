Chúng ta sẽ phân tích sâu các giải pháp và triết lý xử lý lỗi trong Go.

---

### I. Triết lý Xử lý Lỗi của Go: Explicit is Better Than Implicit

Khác với các ngôn ngữ dựa trên `try-catch` exception, Go không có `exception handling` theo nghĩa truyền thống. Thay vào đó, nó khuyến khích việc **trả về lỗi một cách tường minh** (explicit error return values).

**Các đặc điểm chính:**

1.  **Trả về `error` làm giá trị cuối cùng:** Các hàm có thể thất bại thường trả về một giá trị cùng với một giá trị kiểu `error` cuối cùng. Nếu hàm thành công, `error` sẽ là `nil`. Nếu thất bại, `error` sẽ chứa thông tin về lỗi.
    ```go
    value, err := SomeFunction(...)
    if err != nil {
        // Xử lý lỗi
        return nil, err // Hoặc một lỗi mới
    }
    // Sử dụng value
    ```
2.  **Lập trình phòng thủ (`Defensive Programming`):** Lập trình viên **buộc phải** kiểm tra và xử lý lỗi tại mỗi điểm mà lỗi có thể xảy ra. Điều này giúp ngăn ngừa việc bỏ qua lỗi và đảm bảo rằng mọi kịch bản lỗi đều được xem xét.
3.  **Lỗi là các giá trị:** `error` trong Go là một `interface` đơn giản:
    ```go
    type error interface {
        Error() string
    }
    ```
    Bất kỳ kiểu nào triển khai phương thức `Error() string` đều có thể là một lỗi. Điều này cho phép tạo ra các kiểu lỗi tùy chỉnh, mang lại nhiều ngữ cảnh hơn.
4.  **`panic` và `recover`:** Go có `panic` và `recover` nhưng chúng **không được khuyến khích** sử dụng cho việc xử lý các lỗi nghiệp vụ thông thường. `panic` nên được dùng cho các lỗi không thể phục hồi (ví dụ: lỗi lập trình, lỗi hệ thống nghiêm trọng) hoặc trong quá trình khởi tạo ứng dụng. `recover` được dùng để bắt `panic` và xử lý (ví dụ: ghi log và tắt ứng dụng một cách duyên dáng).

---

### II. Các Giải pháp Xử lý Lỗi Thực tế trong Go

#### 1. Trả về và Kiểm tra lỗi cơ bản (`nil` check)

Đây là cách phổ biến và cơ bản nhất.

```go
package main

import (
	"errors"
	"fmt"
	"strconv"
)

func parseNumber(s string) (int, error) {
	if s == "" {
		return 0, errors.New("input string cannot be empty")
	}
	num, err := strconv.Atoi(s)
	if err != nil {
		return 0, fmt.Errorf("failed to convert '%s' to integer: %w", s, err) // Sử dụng %w để bọc lỗi
	}
	return num, nil
}

func main() {
	// Trường hợp thành công
	num1, err1 := parseNumber("123")
	if err1 != nil {
		fmt.Println("Error:", err1)
	} else {
		fmt.Println("Parsed number 1:", num1)
	}

	// Trường hợp lỗi: chuỗi rỗng
	num2, err2 := parseNumber("")
	if err2 != nil {
		fmt.Println("Error:", err2) // Output: Error: input string cannot be empty
	} else {
		fmt.Println("Parsed number 2:", num2)
	}

	// Trường hợp lỗi: định dạng không hợp lệ
	num3, err3 := parseNumber("abc")
	if err3 != nil {
		fmt.Println("Error:", err3) // Output: Error: failed to convert 'abc' to integer: strconv.Atoi: parsing "abc": invalid syntax
	} else {
		fmt.Println("Parsed number 3:", num3)
	}
}
```

**Phân tích:**

- **Ưu điểm:** Rõ ràng, dễ hiểu, buộc lập trình viên phải suy nghĩ về lỗi.
- **Nhược điểm:** Dẫn đến nhiều dòng `if err != nil` (error checking tax), có thể làm giảm tính dễ đọc nếu không được quản lý tốt.
- **Cải tiến với `%w` (từ Go 1.13):** Cho phép "bọc" (wrap) một lỗi khác, tạo ra một chuỗi lỗi. Điều này rất hữu ích để thêm ngữ cảnh mà vẫn giữ được lỗi gốc.

#### 2. So sánh và kiểm tra lỗi

Khi bạn muốn kiểm tra xem một lỗi cụ thể có xảy ra hay không.

- **So sánh với sentinel errors (Lỗi canh gác):** Sử dụng các biến `error` được định nghĩa trước.

  ```go
  var ErrNotFound = errors.New("item not found")

  func GetItem(id string) (string, error) {
      if id == "404" {
          return "", ErrNotFound
      }
      return "Item " + id, nil
  }

  func main() {
      _, err := GetItem("404")
      if err != nil {
          if errors.Is(err, ErrNotFound) { // Sử dụng errors.Is để kiểm tra lỗi gốc (kể cả khi đã wrap)
              fmt.Println("Item was not found.")
          } else {
              fmt.Println("Another error occurred:", err)
          }
      }
  }
  ```

  **Phân tích:**
  - **Ưu điểm:** Đơn giản, dễ so sánh bằng `errors.Is()`.
  - **Nhược điểm:** Các `sentinel errors` là các biến global, có thể tạo ra coupling và xung đột tên nếu được sử dụng quá mức trong các gói khác nhau.

- **Sử dụng kiểu lỗi tùy chỉnh (`Custom Error Types`):** Tạo `struct` để triển khai `error interface`, cho phép mang theo nhiều thông tin hơn về lỗi.

  ```go
  type ValidationError struct {
      Field   string
      Message string
  }

  func (e *ValidationError) Error() string {
      return fmt.Sprintf("validation failed for field '%s': %s", e.Field, e.Message)
  }

  func ValidateInput(value string) error {
      if len(value) < 5 {
          return &ValidationError{Field: "value", Message: "must be at least 5 characters"}
      }
      return nil
  }

  func main() {
      err := ValidateInput("short")
      if err != nil {
          var validationErr *ValidationError
          if errors.As(err, &validationErr) { // Sử dụng errors.As để kiểm tra kiểu lỗi
              fmt.Printf("Validation error for field '%s': %s\n", validationErr.Field, validationErr.Message)
          } else {
              fmt.Println("Unknown error:", err)
          }
      }
  }
  ```

  **Phân tích:**
  - **Ưu điểm:** Mang lại ngữ cảnh phong phú hơn, cho phép kiểm tra chi tiết lỗi bằng `errors.As()`. Tốt cho việc phân loại lỗi và xử lý logic dựa trên loại lỗi.
  - **Nhược điểm:** Yêu cầu định nghĩa thêm các kiểu `struct`.

#### 3. Xử lý `panic` và `recover` (cho các trường hợp ngoại lệ)

`panic` và `recover` nên được sử dụng rất hạn chế, thường là cho các lỗi không thể phục hồi hoặc các tình huống không mong muốn mà ứng dụng không thể tiếp tục hoạt động.

- **`panic`:** Dừng luồng thực thi bình thường của goroutine hiện tại. Các hàm `deferred` sẽ được thực thi.
- **`recover`:** Chỉ hoạt động trong một hàm `deferred`. Nếu `panic` đang xảy ra, `recover` sẽ bắt nó và trả về giá trị được truyền cho `panic`. Sau khi `recover` thành công, luồng thực thi sẽ tiếp tục sau hàm `deferred`.

**Ví dụ:** Bảo vệ một HTTP handler khỏi `panic` đột ngột.

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime/debug" // Để lấy stack trace
)

func safeHandler(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("Panic in handler: %v\n%s", r, debug.Stack())
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()
		fn(w, r)
	}
}

func riskyHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Starting risky handler...")
	// Giả lập một lỗi không mong muốn hoặc điều kiện không hợp lệ
	if r.URL.Path == "/panic" {
		panic("something went terribly wrong!")
	}
	fmt.Fprintf(w, "Hello, you are at %s\n", r.URL.Path)
}

func main() {
	http.HandleFunc("/", safeHandler(riskyHandler))
	log.Println("Server listening on :8080")
	// Test: curl http://localhost:8080/ok
	// Test: curl http://localhost:8080/panic
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

**Phân tích:**

- **Ưu điểm:** Cung cấp một "lưới an toàn" cho các lỗi nghiêm trọng, cho phép ứng dụng ghi log lỗi và tiếp tục chạy (hoặc tắt một cách duyên dáng).
- **Nhược điểm:** **Không phải là cơ chế xử lý lỗi chung.** Lạm dụng `panic`/`recover` sẽ làm mã khó hiểu, khó bảo trì và tương tự như `exception handling` trong các ngôn ngữ khác, điều mà Go muốn tránh. Chỉ dùng cho các trường hợp không thể phục hồi.

#### 4. Logging Lỗi & Metrics

Việc xử lý lỗi không chỉ là trả về giá trị mà còn là ghi lại thông tin để gỡ lỗi và giám sát.

```go
import (
	"fmt"
	"log" // Hoặc logger tùy chỉnh như zap, zerolog
	"os"
)

func processFile(filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		log.Printf("ERROR: Failed to open file '%s': %v", filename, err) // Ghi log chi tiết lỗi
		return fmt.Errorf("could not process file: %w", err) // Trả về lỗi đã wrap
	}
	defer f.Close()
	// ... xử lý file ...
	log.Printf("INFO: File '%s' processed successfully", filename) // Ghi log thành công
	return nil
}

// Trong môi trường microservice, bạn sẽ dùng các thư viện logging structured
// và gửi metrics (ví dụ: Prometheus) khi lỗi xảy ra.
func main() {
	if err := processFile("non_existent.txt"); err != nil {
		fmt.Printf("Application level error: %v\n", err)
		// Send metric: errors_total_count++
	}
}
```

**Phân tích:**

- **Ưu điểm:** Cung cấp khả năng quan sát (observability) cho ứng dụng. Ghi log cung cấp ngữ cảnh để gỡ lỗi, metrics giúp theo dõi sức khỏe hệ thống.
- **Nhược điểm:** Đòi hỏi lập trình viên phải chủ động thêm các câu lệnh log và metrics.

#### 5. Thiết kế API và Domain-Driven Error Handling

Trong kiến trúc microservice hoặc DDD, cách bạn định nghĩa và xử lý lỗi có thể liên quan đến các khái niệm nghiệp vụ.

- **API Gateway/Frontend:** Có thể cần dịch các lỗi nội bộ thành các mã trạng thái HTTP hoặc thông báo lỗi thân thiện với người dùng.
- **Domain Errors:** Định nghĩa các lỗi có ý nghĩa trong miền nghiệp vụ (ví dụ: `ErrInvalidCustomerStatus`, `ErrProductOutOfStock`).
- **Application Errors:** Các lỗi liên quan đến cơ sở hạ tầng hoặc logic ứng dụng (ví dụ: `ErrDatabaseConnectionFailed`, `ErrServiceUnavailable`).

**Ví dụ:**

```go
// Define domain-specific errors
var (
	ErrCustomerNotFound   = errors.New("customer not found")
	ErrInsufficientFunds  = errors.New("insufficient funds")
)

type OrderService struct {
	repo CustomerRepository // Interface
}

func (s *OrderService) PlaceOrder(customerID string, amount float64) error {
	customer, err := s.repo.GetCustomer(customerID)
	if err != nil {
		if errors.Is(err, ErrCustomerNotFound) { // Check domain error from repository
			return fmt.Errorf("place order failed: %w", err)
		}
		return fmt.Errorf("failed to retrieve customer: %w", err) // Wrap repository infrastructure error
	}

	if customer.Balance < amount {
		return ErrInsufficientFunds // Return domain error
	}

	// ... logic để tạo order và cập nhật balance ...
	return nil
}

// Trong một HTTP handler, bạn sẽ dịch các lỗi này:
func handlePlaceOrder(w http.ResponseWriter, r *http.Request) {
    // ... parse request ...
    err := orderService.PlaceOrder("cust123", 100.0)
    if err != nil {
        if errors.Is(err, ErrCustomerNotFound) {
            http.Error(w, err.Error(), http.StatusNotFound)
            return
        }
        if errors.Is(err, ErrInsufficientFunds) {
            http.Error(w, err.Error(), http.StatusPaymentRequired) // 402 Payment Required
            return
        }
        // Generic server error for other types of errors
        http.Error(w, "internal server error", http.StatusInternalServerError)
        return
    }
    // ... success response ...
}
```

**Phân tích:**

- **Ưu điểm:** Lỗi có ý nghĩa hơn trong ngữ cảnh nghiệp vụ, giúp API client dễ dàng hiểu và xử lý. Tách biệt lỗi hạ tầng với lỗi nghiệp vụ.
- **Nhược điểm:** Đòi hỏi thiết kế lỗi cẩn thận và quá trình "dịch" lỗi qua các tầng của ứng dụng.

---

### III. Khi nào nên dùng loại lỗi nào?

- **`errors.New` / `fmt.Errorf` (không `%w`):** Cho các lỗi đơn giản, không cần so sánh cụ thể, hoặc các lỗi ở cấp thấp nhất không có lỗi gốc để wrap.
- **`fmt.Errorf` với `%w`:** **Thường xuyên sử dụng** để thêm ngữ cảnh và bảo toàn chuỗi lỗi khi lỗi được truyền qua các tầng gọi hàm.
- **`errors.Is` với `sentinel errors`:** Dùng cho các lỗi cụ thể mà bạn muốn so sánh một cách rõ ràng (ví dụ: lỗi `EOF`, `ErrNoRows` của SQL, hoặc các lỗi nghiệp vụ chung). **Hạn chế số lượng sentinel errors** để tránh gây ra coupling không cần thiết.
- **`errors.As` với `custom error types` (struct):** Dùng khi bạn cần mang theo thông tin bổ sung về lỗi (ví dụ: tên trường bị lỗi, mã lỗi, URL) và muốn xử lý dựa trên cấu trúc của lỗi.
- **`panic`/`recover`:** Chỉ cho các lỗi không thể phục hồi (ví dụ: lỗi cấu hình ứng dụng nghiêm trọng, lập trình viên sai logic dẫn đến nil pointer dereference). Không dùng cho lỗi nghiệp vụ.

---
