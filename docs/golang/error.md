`fmt.Errorf` và `errors.New` đều là các hàm dùng để tạo ra một giá trị lỗi (error value) trong Go, nhưng chúng có những mục đích và khả năng khác nhau đáng kể. Sự khác biệt chính nằm ở khả năng định dạng chuỗi và đặc biệt là khả năng bao bọc lỗi (error wrapping).

Dưới đây là phân tích chi tiết:

### 1. `errors.New(text string) error`

- **Mục đích chính:** Tạo ra một đối tượng lỗi **đơn giản, tĩnh (static)** với một thông báo cố định.
- **Cách hoạt động:** Nó nhận vào một chuỗi `text` và trả về một giá trị `error` có phương thức `Error()` trả về chính chuỗi đó.
- **Đặc điểm:**
  - **Không có khả năng định dạng:** Bạn không thể truyền các tham số động để xây dựng thông báo lỗi. Thông báo lỗi phải là một chuỗi cố định.
  - **Không có khả năng bao bọc lỗi:** Nó không có cơ chế để "nhớ" một lỗi gốc khác.
  - **So sánh bằng Identity (Sentinel Errors):** Đây là trường hợp sử dụng chính của `errors.New`. Vì nó luôn trả về cùng một đối tượng lỗi cho cùng một chuỗi (hoặc ít nhất là một đối tượng có identity ổn định), bạn có thể định nghĩa các lỗi "sentinel" (lỗi cờ hiệu) ở cấp độ gói và so sánh trực tiếp chúng bằng toán tử `==` (trước Go 1.13) hoặc tốt hơn là `errors.Is` (từ Go 1.13 trở đi).
- **Khi nào sử dụng:**
  - Để định nghĩa các lỗi chuẩn, chung cho toàn bộ ứng dụng hoặc gói, ví dụ: `ErrNotFound`, `ErrInvalidInput`, `ErrPermissionDenied`.
  - Khi bạn muốn kiểm tra xem một lỗi trả về có phải là một trong các lỗi được định nghĩa trước này hay không.

#### Ví dụ `errors.New`:

```go
package main

import (
	"errors"
	"fmt"
)

// Định nghĩa lỗi sentinel
var ErrInsufficientFunds = errors.New("insufficient funds")
var ErrAccountNotFound = errors.New("account not found")

func withdraw(amount, balance int) error {
	if amount > balance {
		return ErrInsufficientFunds // Trả về lỗi sentinel
	}
	// ... logic rút tiền ...
	return nil
}

func main() {
	err := withdraw(150, 100)
	if err != nil {
		fmt.Println("Withdrawal error:", err) // Output: Withdrawal error: insufficient funds
		if errors.Is(err, ErrInsufficientFunds) {
			fmt.Println("Specifically, not enough money.")
		}
	}

	err = ErrAccountNotFound // Một lỗi khác
	if errors.Is(err, ErrAccountNotFound) {
		fmt.Println("Account related error detected.")
	}
}
```

### 2. `fmt.Errorf(format string, a ...any) error`

- **Mục đích chính:** Tạo ra một đối tượng lỗi **có định dạng (formatted)**, cho phép bạn xây dựng thông báo lỗi động và có khả năng **bao bọc (wrap)** các lỗi khác.
- **Cách hoạt động:** Nó nhận một chuỗi định dạng (như `fmt.Printf`) và các đối số, sau đó trả về một giá trị `error` với thông báo đã được định dạng.
- **Đặc điểm:**
  - **Có khả năng định dạng:** Sử dụng các động từ định dạng (ví dụ: `%s`, `%d`, `%v`) để chèn giá trị của biến vào thông báo lỗi, tạo ra các thông báo lỗi chi tiết và ngữ cảnh.
  - **Có khả năng bao bọc lỗi (`%w` - từ Go 1.13):** Đây là tính năng mạnh mẽ nhất. Bằng cách sử dụng động từ định dạng `%w` với một đối tượng `error` làm đối số, `fmt.Errorf` tạo ra một lỗi mới mà "ghi nhớ" lỗi gốc. Điều này tạo ra một chuỗi lỗi (error chain) và cho phép bạn sử dụng `errors.Is` và `errors.As` để kiểm tra lỗi gốc.
  - **Không dùng để so sánh bằng Identity:** Vì thông báo lỗi thường là động, bạn không nên sử dụng `==` để so sánh lỗi được tạo bởi `fmt.Errorf`. Thay vào đó, nếu bạn cần kiểm tra loại lỗi gốc, hãy sử dụng `errors.Is` hoặc `errors.As` với lỗi được bao bọc.
- **Khi nào sử dụng:**
  - Khi bạn cần một thông báo lỗi chi tiết, động, bao gồm các giá trị cụ thể từ ngữ cảnh xảy ra lỗi.
  - Khi bạn muốn thêm ngữ cảnh vào một lỗi đã tồn tại từ một tầng thấp hơn (ví dụ: lỗi từ database, lỗi từ thư viện bên thứ ba) mà vẫn giữ được thông tin về lỗi gốc. Điều này cực kỳ quan trọng trong các hệ thống nhiều tầng hoặc microservices.

#### Ví dụ `fmt.Errorf`:

```go
package main

import (
	"errors"
	"fmt"
	"strconv" // Để giả lập lỗi chuyển đổi số
)

// Một lỗi sentinel để kiểm tra
var ErrInvalidInput = errors.New("invalid input")

func parseAndProcess(input string) (int, error) {
	num, err := strconv.Atoi(input) // Có thể trả về lỗi
	if err != nil {
		// Bao bọc lỗi gốc từ strconv.Atoi và thêm ngữ cảnh
		return 0, fmt.Errorf("failed to parse input '%s': %w", input, ErrInvalidInput) // Sử dụng %w
	}
	if num < 0 {
		// Tạo lỗi định dạng đơn giản không bao bọc
		return 0, fmt.Errorf("number cannot be negative: %d", num)
	}
	return num * 2, nil
}

func main() {
	// Lỗi do không thể parse
	_, err := parseAndProcess("abc")
	if err != nil {
		fmt.Println("Error 1:", err)
		// Output: Error 1: failed to parse input 'abc': invalid input
		if errors.Is(err, ErrInvalidInput) { // Có thể kiểm tra lỗi gốc
			fmt.Println("Specifically, the input was invalid.")
		}
	}

	// Lỗi do số âm
	_, err = parseAndProcess("-5")
	if err != nil {
		fmt.Println("Error 2:", err)
		// Output: Error 2: number cannot be negative: -5
		// errors.Is(err, ErrInvalidInput) sẽ là false ở đây
	}

	// Thành công
	result, err := parseAndProcess("10")
	if err == nil {
		fmt.Println("Result:", result) // Output: Result: 20
	}
}
```

### Bảng so sánh tóm tắt:

| Đặc điểm               | `errors.New`                                            | `fmt.Errorf`                                                               |
| :--------------------- | :------------------------------------------------------ | :------------------------------------------------------------------------- |
| **Mục đích**           | Tạo lỗi tĩnh, có thể so sánh bằng identity.             | Tạo lỗi động, có định dạng, có thể bao bọc lỗi khác.                       |
| **Định dạng chuỗi**    | Không                                                   | Có (sử dụng các động từ định dạng như `%s`, `%d`, `%v`)                    |
| **Bao bọc lỗi (`%w`)** | Không                                                   | Có (từ Go 1.13 trở đi, dùng `%w` để tạo chuỗi lỗi)                         |
| **So sánh lỗi**        | Dùng `errors.Is(err, target)` (hoặc `==` trước Go 1.13) | Dùng `errors.Is(err, target)` hoặc `errors.As(err, &target)` (nếu có `%w`) |
| **Trường hợp sử dụng** | Định nghĩa lỗi sentinel (lỗi cờ hiệu)                   | Thêm ngữ cảnh vào lỗi, bao bọc lỗi, tạo thông báo lỗi chi tiết.            |
| **Tính linh hoạt**     | Thấp                                                    | Cao                                                                        |

### Kết luận:

- Sử dụng `errors.New` khi bạn cần định nghĩa một tập hợp các lỗi chuẩn, có thể nhận dạng và kiểm tra trực tiếp.
- Sử dụng `fmt.Errorf` khi bạn cần tạo một thông báo lỗi chi tiết, động, và đặc biệt là khi bạn muốn bao bọc một lỗi khác để thêm ngữ cảnh mà vẫn giữ được thông tin về lỗi gốc.

Trong các hệ thống Go hiện đại, đặc biệt là với Go 1.13 trở lên, `fmt.Errorf` với `%w` kết hợp với `errors.Is` và `errors.As` là cách tiếp cận được khuyến nghị để xử lý lỗi một cách mạnh mẽ và có cấu trúc.

`errors.As` là một hàm trong gói `errors` của Go (được giới thiệu từ Go 1.13), dùng để kiểm tra xem một lỗi trong chuỗi lỗi (error chain) có phải là một **kiểu cụ thể** nào đó hay không, và nếu có, nó sẽ gán lỗi đó vào một biến đích.

### Ý nghĩa và Mục đích chính:

1.  **Kiểm tra kiểu lỗi cụ thể (Type-based Error Inspection):** Trong khi `errors.Is` kiểm tra xem một lỗi có phải là một **giá trị lỗi cụ thể** (sentinel error) hay không, `errors.As` kiểm tra xem có lỗi nào trong chuỗi lỗi khớp với một **kiểu lỗi cụ thể** mà bạn định nghĩa hay không.
2.  **Trích xuất dữ liệu từ lỗi (Extracting Data from Errors):** Đây là điểm mạnh nhất của `errors.As`. Khi bạn có một kiểu lỗi tùy chỉnh (custom error type) chứa thêm thông tin (ví dụ: mã lỗi HTTP, mã lỗi cơ sở dữ liệu, thông tin xác thực, chi tiết lỗi validation), `errors.As` cho phép bạn trích xuất đối tượng lỗi có kiểu đó để truy cập các trường dữ liệu bổ sung.
3.  **Xử lý lỗi có điều kiện (Conditional Error Handling):** Nó cho phép bạn thực hiện các hành động khác nhau tùy thuộc vào loại lỗi cụ thể đã xảy ra, ngay cả khi lỗi đó đã được bao bọc (wrapped) bởi các lỗi khác.

### Cú pháp:

```go
func As(err error, target any) bool
```

- `err`: Lỗi mà bạn muốn kiểm tra (có thể là một lỗi đã được bao bọc).
- `target`: Một **con trỏ** đến một kiểu lỗi mà bạn muốn khớp. Ví dụ: `var myErr *MyCustomError; errors.As(err, &myErr)`.
- **Trả về:** `true` nếu tìm thấy một lỗi khớp với kiểu của `target` trong chuỗi lỗi và gán nó vào `target`; ngược lại trả về `false`.

### Cách hoạt động (Phân tích kỹ thuật):

`errors.As` sẽ duyệt qua chuỗi lỗi (error chain) được tạo ra bởi `fmt.Errorf` với `%w` hoặc các lỗi khác triển khai phương thức `Unwrap()`. Đối với mỗi lỗi trong chuỗi:

1.  Nó kiểm tra xem lỗi hiện tại có thể được gán cho kiểu mà `target` trỏ đến hay không.
2.  Nếu có thể gán, nó sẽ gán lỗi đó vào `target` và trả về `true`.
3.  Nếu không, nó sẽ tiếp tục unwrapping lỗi tiếp theo trong chuỗi và lặp lại quá trình.
4.  Nếu không tìm thấy lỗi nào khớp sau khi duyệt hết chuỗi, nó trả về `false`.

### Ví dụ minh họa:

Hãy tạo một kiểu lỗi tùy chỉnh để biểu diễn lỗi validation:

```go
package main

import (
	"errors"
	"fmt"
)

// 1. Định nghĩa một kiểu lỗi tùy chỉnh
type ValidationError struct {
	Field   string
	Message string
	Code    int // Mã lỗi cụ thể cho validation
}

// ValidationError phải triển khai interface error
func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error on field '%s': %s (code: %d)", e.Field, e.Message, e.Code)
}

// 2. Một hàm có thể trả về ValidationError
func validateInput(email string) error {
	if email == "" {
		return &ValidationError{Field: "email", Message: "cannot be empty", Code: 1001}
	}
	if len(email) < 5 || !isEmailValid(email) { // isEmailValid là hàm giả định
		return &ValidationError{Field: "email", Message: "invalid format", Code: 1002}
	}
	return nil
}

// Hàm giả định kiểm tra định dạng email
func isEmailValid(email string) bool {
	return true // Đơn giản hóa cho ví dụ
}

// 3. Một hàm khác bao bọc lỗi từ validateInput
func registerUser(email, password string) error {
	err := validateInput(email)
	if err != nil {
		// Bao bọc lỗi validation bằng fmt.Errorf với %w
		return fmt.Errorf("failed to register user with email '%s': %w", email, err)
	}
	// ... logic đăng ký người dùng ...
	return nil
}

func main() {
	// Trường hợp 1: Lỗi validation email rỗng
	err1 := registerUser("", "password123")
	if err1 != nil {
		fmt.Println("--- Error 1 ---")
		fmt.Println("Full error:", err1) // Output: Full error: failed to register user with email '': validation error on field 'email': cannot be empty (code: 1001)

		var vErr *ValidationError // Khai báo biến con trỏ đến kiểu lỗi tùy chỉnh
		if errors.As(err1, &vErr) { // Sử dụng errors.As để kiểm tra và trích xuất
			fmt.Printf("Detected ValidationError: Field='%s', Message='%s', Code=%d\n", vErr.Field, vErr.Message, vErr.Code)
			// Output: Detected ValidationError: Field='email', Message='cannot be empty', Code=1001
		} else {
			fmt.Println("Error 1 is not a ValidationError.")
		}
	}

	fmt.Println("\n-----------------\n")

	// Trường hợp 2: Một lỗi khác không phải ValidationError (ví dụ: lỗi cơ sở dữ liệu)
	dbError := errors.New("database connection lost")
	wrappedDbError := fmt.Errorf("failed to save user: %w", dbError)

	if wrappedDbError != nil {
		fmt.Println("--- Error 2 ---")
		fmt.Println("Full error:", wrappedDbError) // Output: Full error: failed to save user: database connection lost

		var vErr *ValidationError
		if errors.As(wrappedDbError, &vErr) {
			fmt.Println("Error 2 is a ValidationError.")
		} else {
			fmt.Println("Error 2 is NOT a ValidationError.")
			// Output: Error 2 is NOT a ValidationError.
		}
	}
}
```

### So sánh với `errors.Is`:

- **`errors.Is(err, target)`:** Dùng để kiểm tra **giá trị** của lỗi. `target` thường là một lỗi sentinel (ví dụ: `io.EOF`, `os.ErrNotExist`) được định nghĩa bằng `errors.New`. Nó trả về `true` nếu `err` hoặc bất kỳ lỗi nào trong chuỗi của `err` là `target` (hoặc `target` bao bọc `err` nếu `target` cũng là một lỗi có thể unwrap).
  - **Ví dụ:** `if errors.Is(err, os.ErrNotExist)`
- **`errors.As(err, &target)`:** Dùng để kiểm tra **kiểu** của lỗi. `target` phải là một con trỏ đến một kiểu lỗi cụ thể (thường là một struct tùy chỉnh) để bạn có thể trích xuất dữ liệu từ nó.
  - **Ví dụ:** `var vErr *ValidationError; if errors.As(err, &vErr)`

### Lợi ích trong thiết kế hệ thống và Microservices:

- **Xử lý lỗi chi tiết:** Cho phép các tầng cao hơn của ứng dụng hiểu rõ hơn về nguyên nhân gốc rễ của lỗi và phản ứng phù hợp. Ví dụ, một API Gateway có thể chuyển đổi `ValidationError` thành mã lỗi HTTP 400 Bad Request với các chi tiết cụ thể về trường bị lỗi, trong khi một lỗi cơ sở dữ liệu có thể được chuyển thành 500 Internal Server Error.
- **Tách biệt mối quan tâm:** Logic nghiệp vụ có thể định nghĩa các kiểu lỗi domain-specific, và các lớp hạ tầng có thể bao bọc chúng, nhưng các lớp xử lý lỗi vẫn có thể trích xuất và hiểu được lỗi domain gốc.
- **Debug và Monitoring hiệu quả hơn:** Bằng cách trích xuất dữ liệu từ lỗi, bạn có thể ghi log các thông tin quan trọng (như `Field`, `Message`, `Code` trong `ValidationError`) giúp việc gỡ lỗi và giám sát trở nên dễ dàng hơn rất nhiều.
- **Mã nguồn sạch hơn:** Tránh được việc phân tích chuỗi lỗi bằng cách kiểm tra chuỗi thông báo lỗi (error string matching), vốn rất dễ vỡ và khó bảo trì.

`errors.As` là một phần không thể thiếu của chiến lược xử lý lỗi hiện đại trong Go, đặc biệt quan trọng khi làm việc với các hệ thống phức tạp, nơi các lỗi có thể được bao bọc qua nhiều lớp và dịch vụ.
