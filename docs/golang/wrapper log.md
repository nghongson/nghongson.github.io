Tuyệt vời! Việc bọc lỗi (error wrapping) là một kỹ thuật cực kỳ quan trọng trong Go để cung cấp ngữ cảnh (context) cho lỗi mà không làm mất đi lỗi gốc. Điều này đặc biệt hữu ích trong Application Layer, nơi bạn muốn chuyển đổi các lỗi cấp thấp (ví dụ: lỗi database, lỗi mạng) thành các lỗi có ý nghĩa hơn đối với nghiệp vụ hoặc hiển thị cho người dùng, đồng thời vẫn giữ lại thông tin chi tiết để gỡ lỗi.

### Tóm tắt ngắn gọn:

Error wrapping trong Go cho phép bạn "bao bọc" một lỗi mới xung quanh một lỗi hiện có, thêm thông tin ngữ cảnh. Go 1.13 đã giới thiệu các hàm `fmt.Errorf` với `%w` verb, `errors.Is`, và `errors.As` để hỗ trợ cơ chế này một cách chuẩn hóa.

### Các điểm chính và phân tích kỹ thuật:

1.  **Tại sao cần bọc lỗi?**

    - **Thêm ngữ cảnh:** Một lỗi "record not found" từ lớp repository sẽ trở thành "user with ID 123 not found" ở lớp dịch vụ, hoặc "failed to process order" ở lớp API.
    - **Giữ lại nguyên nhân gốc (Root Cause):** Mặc dù lỗi được bọc, bạn vẫn có thể truy cập lỗi gốc để gỡ lỗi hoặc xử lý cụ thể.
    - **Xử lý lỗi có điều kiện:** Cho phép bạn kiểm tra loại lỗi gốc mà không cần phải biết chính xác lỗi được bọc ở cấp độ nào.
    - **Tách biệt mối quan tâm:** Lớp ứng dụng có thể xử lý lỗi cụ thể từ lớp persistence mà không cần biết chi tiết triển khai của lớp persistence.

2.  **Cơ chế bọc lỗi trong Go (từ Go 1.13):**
    - **`fmt.Errorf` với `%w`:** Đây là cách chuẩn để bọc lỗi. Nó tạo ra một lỗi mới bao bọc lỗi `err` đã cho.
      ```go
      fmt.Errorf("failed to load user: %w", err)
      ```
    - **`errors.Is(err, target error)`:** Kiểm tra xem một lỗi trong chuỗi bọc có khớp với `target error` cụ thể hay không. Nó duyệt qua chuỗi lỗi được bọc.
      ```go
      if errors.Is(err, sql.ErrNoRows) {
          // Xử lý khi không tìm thấy bản ghi
      }
      ```
    - **`errors.As(err, &target error type)`:** Kiểm tra xem một lỗi trong chuỗi bọc có thể được gán cho một loại lỗi cụ thể hay không (ví dụ: một struct lỗi tùy chỉnh).
      ```go
      var customErr *MyCustomError
      if errors.As(err, &customErr) {
          // Xử lý lỗi tùy chỉnh và truy cập các trường của nó
      }
      ```
    - **`errors.Unwrap(err)`:** Trả về lỗi gốc được bọc bởi `err` (nếu có).

### Demo bọc lỗi trong Application Layer

Chúng ta sẽ sử dụng lại cấu trúc từ demo SQLite3, tập trung vào cách Application Layer xử lý và bọc lỗi từ Repository Layer.

**Cấu trúc ví dụ:**

- **Domain Layer:** Định nghĩa các struct `User` và interface `UserRepository`.
- **Infrastructure Layer:** Triển khai `sqliteUserRepository` (lớp persistence).
- **Application Layer:** Định nghĩa `UserService` và triển khai `userService` để xử lý logic nghiệp vụ và bọc lỗi từ repository.
- **Presentation Layer (Main function):** Gọi `UserService` và xử lý lỗi cuối cùng.

```go
package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3" // Import driver SQLite3
)

const dbFile = "users.db"

// --- Domain Layer ---

// User là struct đại diện cho một người dùng trong hệ thống
type User struct {
	ID    int
	Name  string
	Email string
}

// UserRepository là interface định nghĩa các hoạt động CRUD cho User
type UserRepository interface {
	CreateUser(ctx context.Context, user *User) error
	GetUserByID(ctx context.Context, id int) (*User, error)
	UpdateUser(ctx context.Context, user *User) error
	DeleteUser(ctx context.Context, id int) error
	// ... các phương thức khác
}

// --- Infrastructure Layer (Persistence) ---

// Custom error cho lớp persistence
var ErrUserNotFound = errors.New("user not found in repository")
var ErrDuplicateEmail = errors.New("duplicate email constraint violation")
var ErrDatabaseQueryFailed = errors.New("database query failed")

// sqliteUserRepository là triển khai của UserRepository cho SQLite
type sqliteUserRepository struct {
	db *sql.DB
}

func NewSQLiteUserRepository(db *sql.DB) UserRepository {
	return &sqliteUserRepository{db: db}
}

// createUsersTable là hàm nội bộ để tạo bảng, không phải một phần của interface
// Trong thực tế, điều này sẽ được quản lý bằng migration tool
func (r *sqliteUserRepository) createUsersTable(ctx context.Context) error {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL
	);`
	_, err := r.db.ExecContext(ctx, query)
	if err != nil {
		return fmt.Errorf("failed to create users table: %w", err)
	}
	log.Println("Database initialized: 'users' table ensured.")
	return nil
}

func (r *sqliteUserRepository) CreateUser(ctx context.Context, user *User) error {
	query := "INSERT INTO users (name, email) VALUES (?, ?)"
	res, err := r.db.ExecContext(ctx, query, user.Name, user.Email)
	if err != nil {
		// Kiểm tra lỗi trùng lặp email cụ thể cho SQLite
		if errors.Is(err, &sqlite3.Error{}) { // Sử dụng errors.Is với loại lỗi cụ thể
			sqliteErr := err.(sqlite3.Error) // Ép kiểu để truy cập Code
			if sqliteErr.Code == sqlite3.ErrConstraint && sqliteErr.ExtendedCode == sqlite3.ErrConstraintUnique {
				return fmt.Errorf("%w: %s", ErrDuplicateEmail, user.Email)
			}
		}
		return fmt.Errorf("%w: %v", ErrDatabaseQueryFailed, err) // Bọc lỗi SQL chung
	}
	id, err := res.LastInsertId()
	if err != nil {
		return fmt.Errorf("%w: failed to get last insert ID: %v", ErrDatabaseQueryFailed, err)
	}
	user.ID = int(id)
	log.Printf("Repo: User created: ID=%d, Name=%s, Email=%s", user.ID, user.Name, user.Email)
	return nil
}

func (r *sqliteUserRepository) GetUserByID(ctx context.Context, id int) (*User, error) {
	query := "SELECT id, name, email FROM users WHERE id = ?"
	user := &User{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(&user.ID, &user.Name, &user.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound // Trả về lỗi đặc trưng của repository
		}
		return nil, fmt.Errorf("%w: failed to query user by ID %d: %v", ErrDatabaseQueryFailed, id, err)
	}
	log.Printf("Repo: User retrieved: ID=%d, Name=%s, Email=%s", user.ID, user.Name, user.Email)
	return user, nil
}

func (r *sqliteUserRepository) UpdateUser(ctx context.Context, user *User) error {
	query := "UPDATE users SET name = ?, email = ? WHERE id = ?"
	res, err := r.db.ExecContext(ctx, query, user.Name, user.Email, user.ID)
	if err != nil {
		if errors.Is(err, &sqlite3.Error{}) {
			sqliteErr := err.(sqlite3.Error)
			if sqliteErr.Code == sqlite3.ErrConstraint && sqliteErr.ExtendedCode == sqlite3.ErrConstraintUnique {
				return fmt.Errorf("%w: %s", ErrDuplicateEmail, user.Email)
			}
		}
		return fmt.Errorf("%w: failed to update user with ID %d: %v", ErrDatabaseQueryFailed, user.ID, err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("%w: failed to get rows affected for update: %v", ErrDatabaseQueryFailed, err)
	}
	if rowsAffected == 0 {
		return ErrUserNotFound // User không tồn tại để cập nhật
	}
	log.Printf("Repo: User updated: ID=%d, NewName=%s, NewEmail=%s", user.ID, user.Name, user.Email)
	return nil
}

func (r *sqliteUserRepository) DeleteUser(ctx context.Context, id int) error {
	query := "DELETE FROM users WHERE id = ?"
	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("%w: failed to delete user with ID %d: %v", ErrDatabaseQueryFailed, id, err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("%w: failed to get rows affected for delete: %v", ErrDatabaseQueryFailed, err)
	}
	if rowsAffected == 0 {
		return ErrUserNotFound // User không tồn tại để xóa
	}
	log.Printf("Repo: User deleted: ID=%d", id)
	return nil
}


// --- Application Layer (Service) ---

// Custom errors cho lớp ứng dụng
var ErrUserAlreadyExists = errors.New("user with this email already exists")
var ErrUserDoesNotExist = errors.New("user does not exist")
var ErrInvalidInput = errors.New("invalid input")
var ErrServiceUnavailable = errors.New("service temporarily unavailable") // Lỗi chung khi có vấn đề với persistence

// UserService là interface cho lớp ứng dụng xử lý logic nghiệp vụ liên quan đến User
type UserService interface {
	RegisterUser(ctx context.Context, name, email string) (*User, error)
	FetchUser(ctx context.Context, id int) (*User, error)
	ChangeUserEmail(ctx context.Context, id int, newEmail string) error
	RemoveUser(ctx context.Context, id int) error
}

// userService là triển khai của UserService
type userService struct {
	userRepo UserRepository
}

func NewUserService(repo UserRepository) UserService {
	return &userService{userRepo: repo}
}

func (s *userService) RegisterUser(ctx context.Context, name, email string) (*User, error) {
	if name == "" || email == "" {
		return nil, fmt.Errorf("%w: name and email cannot be empty", ErrInvalidInput)
	}

	newUser := &User{Name: name, Email: email}
	err := s.userRepo.CreateUser(ctx, newUser)
	if err != nil {
		if errors.Is(err, ErrDuplicateEmail) { // Kiểm tra lỗi cụ thể từ repository
			return nil, fmt.Errorf("%w: %s", ErrUserAlreadyExists, email) // Bọc lại thành lỗi của Application Layer
		}
		// Bọc các lỗi khác từ repository thành lỗi chung của service
		return nil, fmt.Errorf("%w: failed to register user %s: %v", ErrServiceUnavailable, name, err)
	}
	log.Printf("Service: User registered: ID=%d, Name=%s", newUser.ID, newUser.Name)
	return newUser, nil
}

func (s *userService) FetchUser(ctx context.Context, id int) (*User, error) {
	if id <= 0 {
		return nil, fmt.Errorf("%w: user ID must be positive", ErrInvalidInput)
	}

	user, err := s.userRepo.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) { // Kiểm tra lỗi cụ thể từ repository
			return nil, fmt.Errorf("%w: ID %d", ErrUserDoesNotExist, id) // Bọc lại thành lỗi của Application Layer
		}
		return nil, fmt.Errorf("%w: failed to fetch user ID %d: %v", ErrServiceUnavailable, id, err)
	}
	log.Printf("Service: User fetched: ID=%d", user.ID)
	return user, nil
}

func (s *userService) ChangeUserEmail(ctx context.Context, id int, newEmail string) error {
	if id <= 0 || newEmail == "" {
		return fmt.Errorf("%w: user ID must be positive and email cannot be empty", ErrInvalidInput)
	}

	// Lấy user để đảm bảo tồn tại (hoặc có thể bỏ qua nếu repo.UpdateUser tự kiểm tra)
	// Đây là logic nghiệp vụ: cần đảm bảo user tồn tại trước khi cập nhật
	user, err := s.userRepo.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return fmt.Errorf("%w: ID %d", ErrUserDoesNotExist, id)
		}
		return fmt.Errorf("%w: failed to verify user existence for ID %d: %v", ErrServiceUnavailable, id, err)
	}

	user.Email = newEmail
	err = s.userRepo.UpdateUser(ctx, user)
	if err != nil {
		if errors.Is(err, ErrDuplicateEmail) {
			return fmt.Errorf("%w: %s", ErrUserAlreadyExists, newEmail)
		}
		if errors.Is(err, ErrUserNotFound) { // Có thể xảy ra nếu user bị xóa giữa chừng
			return fmt.Errorf("%w: ID %d", ErrUserDoesNotExist, id)
		}
		return fmt.Errorf("%w: failed to update email for user ID %d: %v", ErrServiceUnavailable, id, err)
	}
	log.Printf("Service: User ID %d email changed to %s", id, newEmail)
	return nil
}

func (s *userService) RemoveUser(ctx context.Context, id int) error {
	if id <= 0 {
		return fmt.Errorf("%w: user ID must be positive", ErrInvalidInput)
	}

	err := s.userRepo.DeleteUser(ctx, id)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return fmt.Errorf("%w: ID %d", ErrUserDoesNotExist, id)
		}
		return fmt.Errorf("%w: failed to remove user ID %d: %v", ErrServiceUnavailable, id, err)
	}
	log.Printf("Service: User ID %d removed", id)
	return nil
}


// --- Main Function (Presentation Layer / Entry Point) ---

func main() {
	os.Remove(dbFile) // Xóa DB cũ cho demo

	db, err := sql.Open("sqlite3", dbFile)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err = db.PingContext(ctx); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	log.Println("Successfully connected to SQLite database.")

	repo := NewSQLiteUserRepository(db)
	// Khởi tạo bảng (thực tế dùng migration tool)
	if err := repo.(*sqliteUserRepository).createUsersTable(ctx); err != nil {
		log.Fatalf("Failed to initialize repository table: %v", err)
	}

	userService := NewUserService(repo)

	// --- Test Cases ---

	fmt.Println("\n--- Registering Users ---")
	user1, err := userService.RegisterUser(ctx, "Alice", "alice@example.com")
	if err != nil {
		log.Printf("Error registering Alice: %v", err)
	} else {
		fmt.Printf("Registered: %+v\n", user1)
	}

	user2, err := userService.RegisterUser(ctx, "Bob", "bob@example.com")
	if err != nil {
		log.Printf("Error registering Bob: %v", err)
	} else {
		fmt.Printf("Registered: %+v\n", user2)
	}

	fmt.Println("\n--- Attempting to register user with duplicate email ---")
	_, err = userService.RegisterUser(ctx, "Charlie", "alice@example.com")
	if err != nil {
		fmt.Printf("Handled error: %v (Is ErrUserAlreadyExists: %t)\n", err, errors.Is(err, ErrUserAlreadyExists))
	}

	fmt.Println("\n--- Fetching Users ---")
	fetchedUser1, err := userService.FetchUser(ctx, user1.ID)
	if err != nil {
		log.Printf("Error fetching user %d: %v", user1.ID, err)
	} else {
		fmt.Printf("Fetched: %+v\n", fetchedUser1)
	}

	fmt.Println("\n--- Attempting to fetch non-existent user ---")
	_, err = userService.FetchUser(ctx, 999)
	if err != nil {
		fmt.Printf("Handled error: %v (Is ErrUserDoesNotExist: %t)\n", err, errors.Is(err, ErrUserDoesNotExist))
	}

	fmt.Println("\n--- Changing User Email ---")
	if user2 != nil {
		err = userService.ChangeUserEmail(ctx, user2.ID, "robert@example.com")
		if err != nil {
			log.Printf("Error changing email for user %d: %v", user2.ID, err)
		} else {
			fmt.Printf("Email changed for user %d.\n", user2.ID)
			fetchedUser2, _ := userService.FetchUser(ctx, user2.ID)
			fmt.Printf("Updated user: %+v\n", fetchedUser2)
		}
	}

	fmt.Println("\n--- Attempting to change email to an existing one ---")
	if user1 != nil {
		err = userService.ChangeUserEmail(ctx, user1.ID, "robert@example.com")
		if err != nil {
			fmt.Printf("Handled error: %v (Is ErrUserAlreadyExists: %t)\n", err, errors.Is(err, ErrUserAlreadyExists))
		}
	}

	fmt.Println("\n--- Removing User ---")
	if user1 != nil {
		err = userService.RemoveUser(ctx, user1.ID)
		if err != nil {
			log.Printf("Error removing user %d: %v", user1.ID, err)
		} else {
			fmt.Printf("Removed user %d.\n", user1.ID)
		}
	}

	fmt.Println("\n--- Attempting to remove non-existent user ---")
	_, err = userService.FetchUser(ctx, user1.ID) // user1 đã bị xóa
	if err != nil {
		fmt.Printf("Handled error: %v (Is ErrUserDoesNotExist: %t)\n", err, errors.Is(err, ErrUserDoesNotExist))
	}


	fmt.Println("\nDemo finished successfully!")
}

```

### Phân tích kỹ thuật về bọc lỗi trong Application Layer:

1.  **Phân tầng lỗi rõ ràng:**

    - **Infrastructure Layer (Repository):** Định nghĩa các lỗi cấp thấp, chi tiết về persistence (ví dụ: `ErrUserNotFound`, `ErrDuplicateEmail`, `ErrDatabaseQueryFailed`). Các lỗi này thường là kết quả trực tiếp từ các thao tác database hoặc driver.
    - **Application Layer (Service):** Định nghĩa các lỗi cấp cao hơn, có ý nghĩa nghiệp vụ (ví dụ: `ErrUserAlreadyExists`, `ErrUserDoesNotExist`, `ErrInvalidInput`, `ErrServiceUnavailable`). Đây là những lỗi mà lớp Presentation hoặc các dịch vụ khác sẽ quan tâm.

2.  **Chuyển đổi lỗi (Error Translation/Wrapping):**

    - Trong `userService`, khi gọi các phương thức của `userRepo` và nhận về lỗi, chúng ta sử dụng `errors.Is()` để kiểm tra lỗi gốc.
    - Nếu lỗi gốc là một lỗi đã biết từ `userRepo` (ví dụ: `ErrUserNotFound`, `ErrDuplicateEmail`), `userService` sẽ bọc lỗi đó bằng một lỗi có ý nghĩa nghiệp vụ hơn và trả về:
      ```go
      if errors.Is(err, ErrDuplicateEmail) {
          return nil, fmt.Errorf("%w: %s", ErrUserAlreadyExists, email)
      }
      ```
    - Nếu lỗi từ `userRepo` không phải là lỗi cụ thể mà service muốn xử lý riêng (ví dụ: lỗi kết nối database, lỗi truy vấn không xác định), service có thể bọc nó bằng một lỗi chung như `ErrServiceUnavailable` để chỉ ra rằng có vấn đề ở lớp thấp hơn mà service không thể xử lý chi tiết.
      ```go
      return nil, fmt.Errorf("%w: failed to register user %s: %v", ErrServiceUnavailable, name, err)
      ```
      Lưu ý: `fmt.Errorf("%w: %v", ...)` là một cách tốt để bọc lỗi và thêm thông điệp mới. `%w` giữ lại lỗi gốc cho `errors.Is`/`errors.As`, còn `%v` (hoặc `%s`) hiển thị thông điệp của lỗi gốc trong chuỗi lỗi mới.

3.  **Lợi ích của việc bọc lỗi trong Application Layer:**

    - **API lỗi ổn định cho lớp trên:** Lớp Presentation (hoặc các client của microservice) chỉ cần xử lý một tập hợp lỗi đã biết từ `UserService` mà không cần biết về `sql.ErrNoRows` hay `sqlite3.Error`. Điều này giảm coupling.
    - **Thông điệp lỗi rõ ràng hơn:** Lỗi `ErrUserAlreadyExists` dễ hiểu hơn nhiều đối với người dùng hoặc hệ thống gọi so với `ErrDuplicateEmail`.
    - **Dễ gỡ lỗi:** Mặc dù lỗi được bọc, `errors.Is()` và `errors.As()` vẫn cho phép chúng ta kiểm tra lỗi gốc. Khi in lỗi (hoặc ghi log), chuỗi lỗi được bọc sẽ hiển thị đầy đủ ngữ cảnh từ trên xuống dưới, giúp xác định nguyên nhân gốc.
    - **Xử lý lỗi tập trung:** Lớp ứng dụng có thể quyết định cách xử lý các loại lỗi khác nhau: trả về lỗi cụ thể cho client, ghi log chi tiết, hoặc kích hoạt cảnh báo.

4.  **Considerations for Microservices/DDD:**
    - Trong kiến trúc microservices, các lỗi từ một dịch vụ thường được chuyển đổi thành các mã lỗi (error codes) hoặc thông báo lỗi chuẩn hóa qua gRPC Status hoặc HTTP Status Codes và JSON error bodies. Việc bọc lỗi trong Application Layer giúp dịch vụ dễ dàng ánh xạ (map) các lỗi nghiệp vụ nội bộ sang định dạng lỗi chuẩn hóa này.
    - **Domain-Driven Design:** Lỗi trong Application Layer nên phản ánh các quy tắc nghiệp vụ (domain rules) bị vi phạm. Ví dụ, `ErrUserAlreadyExists` là một lỗi domain, trong khi `ErrDuplicateEmail` là một chi tiết triển khai của persistence.

Bằng cách áp dụng error wrapping một cách có hệ thống, các ứng dụng Go có thể đạt được khả năng xử lý lỗi mạnh mẽ, dễ bảo trì và cung cấp thông tin hữu ích cho cả người dùng và nhà phát triển.
