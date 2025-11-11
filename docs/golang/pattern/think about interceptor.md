Mẫu Interceptor (Interceptor Pattern) trong Go là một kỹ thuật mạnh mẽ để thêm các hành vi xử lý bổ sung (cross-cutting concerns) vào một request hoặc một cuộc gọi hàm, trước hoặc sau khi logic chính được thực thi. Nó giúp tách biệt các mối quan tâm này khỏi logic nghiệp vụ cốt lõi, làm cho mã nguồn sạch hơn, dễ bảo trì và tái sử dụng hơn.

### Tóm tắt ngắn gọn:

Mẫu Interceptor cho phép bạn "chặn" (intercept) các yêu cầu hoặc cuộc gọi hàm để thực hiện các tác vụ như ghi log, xác thực, ủy quyền, đo lường hiệu suất, xử lý lỗi, v.v., ở một lớp riêng biệt mà không làm thay đổi logic nghiệp vụ chính.

### Các điểm chính và phân tích kỹ thuật:

1.  **Mục đích và Vai trò:**

    - **Tách biệt các mối quan tâm (Separation of Concerns):** Giúp tách logic nghiệp vụ (ví dụ: xử lý đơn hàng) khỏi các chức năng bổ trợ (ví dụ: kiểm tra quyền truy cập).
    - **Tái sử dụng (Reusability):** Các interceptor có thể được áp dụng cho nhiều handler hoặc service khác nhau mà không cần viết lại mã.
    - **Giảm trùng lặp mã (Reduced Boilerplate):** Tránh việc lặp đi lặp lại cùng một đoạn mã cho các chức năng chung.
    - **Mở rộng (Extensibility):** Dễ dàng thêm hoặc bớt các interceptor mà không ảnh hưởng đến logic cốt lõi.

2.  **Cách triển khai trong Go:**

    - **HTTP Middleware (cho Web Servers):** Đây là hình thức phổ biến nhất của interceptor trong các ứng dụng web Go. Một middleware là một hàm bao bọc (wrapper function) nhận vào một `http.Handler` và trả về một `http.Handler` khác.

      ```go
      package main

      import (
          "fmt"
          "log"
          "net/http"
          "time"
      )

      // LoggingMiddleware là một interceptor ghi log thời gian xử lý của mỗi request
      func LoggingMiddleware(next http.Handler) http.Handler {
          return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
              start := time.Now()
              next.ServeHTTP(w, r) // Gọi handler tiếp theo trong chuỗi
              duration := time.Since(start)
              log.Printf("[%s] %s %s took %s", r.Method, r.URL.Path, r.RemoteAddr, duration)
          })
      }

      // AuthMiddleware là một interceptor kiểm tra xác thực cơ bản
      func AuthMiddleware(next http.Handler) http.Handler {
          return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
              // Giả sử logic xác thực đơn giản
              if r.Header.Get("X-API-KEY") != "secret" {
                  http.Error(w, "Unauthorized", http.StatusUnauthorized)
                  return
              }
              next.ServeHTTP(w, r)
          })
      }

      func helloHandler(w http.ResponseWriter, r *http.Request) {
          fmt.Fprintf(w, "Hello, Go Interceptor Pattern!")
      }

      func main() {
          // Áp dụng các middleware theo thứ tự: Auth -> Logging -> helloHandler
          // Thứ tự quan trọng: Auth trước để chặn request nếu không xác thực
          // Logging sau để ghi log cả các request bị chặn bởi Auth (nếu Auth trả về lỗi ngay)
          // hoặc ghi log request thành công.
          finalHandler := LoggingMiddleware(AuthMiddleware(http.HandlerFunc(helloHandler)))

          http.Handle("/", finalHandler)
          log.Println("Server starting on :8080")
          log.Fatal(http.ListenAndServe(":8080", nil))
      }
      ```

      Trong ví dụ trên, `LoggingMiddleware` và `AuthMiddleware` là các interceptor. Chúng tạo thành một chuỗi (chain) xử lý, nơi mỗi interceptor có thể thực hiện công việc của mình trước khi chuyển request cho interceptor tiếp theo hoặc handler cuối cùng.

    - **gRPC Interceptors:** gRPC tích hợp sẵn cơ chế interceptor, gọi là "middleware" trong ngữ cảnh HTTP. Có hai loại:

      - **Unary Interceptors:** Dành cho các cuộc gọi RPC đơn (request-response).
      - **Stream Interceptors:** Dành cho các cuộc gọi RPC dạng stream.
        Chúng cho phép bạn chặn các cuộc gọi đến và đi, thêm logic như xác thực, ghi log, tracing, hoặc xử lý lỗi tập trung.

      ```go
      package main

      import (
          "context"
          "log"
          "net"
          "time"

          "google.golang.org/grpc"
          "google.golang.org/grpc/codes"
          "google.golang.org/grpc/status"

          // Giả sử bạn có file proto đã compile thành service.pb.go
          // "path/to/your/proto/service"
      )

      // Ví dụ: Unary Interceptor cho gRPC
      func UnaryServerInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
          start := time.Now()
          // Logic trước khi gọi handler
          log.Printf("Incoming request: Method=%s, Type=Unary", info.FullMethod)

          // Kiểm tra xác thực (ví dụ)
          // if err := authenticate(ctx); err != nil {
          //     return nil, status.Errorf(codes.Unauthenticated, "authentication failed: %v", err)
          // }

          // Gọi handler chính
          resp, err := handler(ctx, req)

          // Logic sau khi gọi handler
          duration := time.Since(start)
          log.Printf("Request completed: Method=%s, Duration=%s, Error=%v", info.FullMethod, duration, err)

          return resp, err
      }

      // Cách đăng ký interceptor với server gRPC
      func main() {
          lis, err := net.Listen("tcp", ":50051")
          if err != nil {
              log.Fatalf("failed to listen: %v", err)
          }

          // Tạo server gRPC với Unary Interceptor
          s := grpc.NewServer(
              grpc.UnaryInterceptor(UnaryServerInterceptor),
              // grpc.StreamInterceptor(StreamServerInterceptor), // Nếu có stream interceptor
          )

          // Đăng ký service của bạn với server
          // service.RegisterYourServiceServer(s, &yourServiceServer{})

          log.Printf("gRPC server listening on %v", lis.Addr())
          if err := s.Serve(lis); err != nil {
              log.Fatalf("failed to serve: %v", err)
          }
      }
      ```

    - **Function Composition (Tổng quát):** Bạn cũng có thể áp dụng mẫu interceptor cho các hàm Go thông thường bằng cách sử dụng composition.

      ```go
      type BusinessLogic func(ctx context.Context, data string) (string, error)
      type Interceptor func(next BusinessLogic) BusinessLogic

      func LoggingInterceptor(next BusinessLogic) BusinessLogic {
          return func(ctx context.Context, data string) (string, error) {
              log.Printf("Calling business logic with data: %s", data)
              res, err := next(ctx, data)
              log.Printf("Business logic returned: %s, error: %v", res, err)
              return res, err
          }
      }

      func AuthenticationInterceptor(next BusinessLogic) BusinessLogic {
          return func(ctx context.Context, data string) (string, error) {
              // Giả sử có logic kiểm tra xác thực từ context
              if user := ctx.Value("user"); user == nil {
                  return "", fmt.Errorf("unauthenticated access")
              }
              return next(ctx, data)
          }
      }

      func MyBusinessFunction(ctx context.Context, data string) (string, error) {
          // Logic nghiệp vụ chính
          return "Processed: " + data, nil
      }

      func main() {
          // Xây dựng chuỗi interceptor
          chainedLogic := LoggingInterceptor(AuthenticationInterceptor(MyBusinessFunction))

          // Gọi hàm đã được bao bọc
          ctx := context.WithValue(context.Background(), "user", "admin") // Giả định user đã xác thực
          result, err := chainedLogic(ctx, "some input")
          if err != nil {
              log.Printf("Error: %v", err)
          } else {
              log.Printf("Final result: %s", result)
          }

          ctxUnauthorized := context.Background() // Không có user
          _, errUnauthorized := chainedLogic(ctxUnauthorized, "some input")
          if errUnauthorized != nil {
              log.Printf("Error (unauthorized): %v", errUnauthorized)
          }
      }
      ```

3.  **Lợi ích trong thiết kế hệ thống và Microservices:**

    - **Khả năng mở rộng (Scalability):** Interceptor không trực tiếp cải thiện khả năng mở rộng ngang, nhưng nó giúp giữ cho mã dịch vụ gọn gàng, cho phép các dịch vụ tập trung vào logic nghiệp vụ và dễ dàng được nhân rộng.
    - **Phi kết nối dịch vụ (Service Decoupling):** Bằng cách tách các mối quan tâm chung ra khỏi logic dịch vụ, bạn giảm sự phụ thuộc và cho phép các dịch vụ phát triển độc lập hơn.
    - **Hiệu suất (Performance):** Mặc dù việc thêm các interceptor có thể gây ra một chút overhead nhỏ do thêm các lớp gọi hàm, nhưng lợi ích về tổ chức mã và khả năng bảo trì thường lớn hơn nhiều. Đối với các tác vụ I/O nặng như ghi log hoặc tracing, overhead này là không đáng kể so với thời gian I/O. Quan trọng là các interceptor phải được viết hiệu quả, tránh các thao tác tốn kém không cần thiết.
    - **Tính đồng thời (Concurrency):** Các interceptor trong Go thường được thiết kế để hoạt động an toàn trong môi trường đồng thời (ví dụ: `http.HandlerFunc` nhận `http.ResponseWriter` và `*http.Request` riêng biệt cho mỗi request). Không có vấn đề đặc biệt về đồng thời nếu các interceptor không sử dụng các biến trạng thái dùng chung không được bảo vệ.
    - **DDD (Domain-Driven Design):** Interceptor hỗ trợ DDD bằng cách giữ cho các Aggregates và Entities trong Domain Layer tập trung vào logic nghiệp vụ, trong khi các vấn đề kỹ thuật như xác thực, ghi log được xử lý ở các lớp ngoài (Application Layer hoặc Infrastructure Layer) thông qua interceptor.

4.  **Các trường hợp sử dụng phổ biến:**

    - **Logging và Monitoring:** Ghi lại thông tin về request, response, thời gian xử lý, lỗi.
    - **Authentication và Authorization:** Kiểm tra token, session, quyền truy cập của người dùng.
    - **Tracing và Correlation IDs:** Chèn và truyền các ID theo dõi qua các dịch vụ khác nhau để gỡ lỗi và phân tích.
    - **Error Handling:** Xử lý lỗi tập trung, biến đổi lỗi thành các định dạng chuẩn.
    - **Metrics:** Thu thập số liệu về hiệu suất, số lượng request.
    - **Rate Limiting:** Hạn chế số lượng request từ một nguồn cụ thể.
    - **Caching:** Kiểm tra cache trước khi gọi logic nghiệp vụ chính.

### Kết luận:

Mẫu Interceptor là một công cụ thiết yếu trong bộ công cụ của nhà phát triển Go, đặc biệt khi xây dựng các hệ thống microservices và API. Nó thúc đẩy các nguyên tắc thiết kế tốt như tách biệt mối quan tâm và tái sử dụng, dẫn đến mã nguồn sạch hơn, dễ quản lý hơn và khả năng mở rộng tốt hơn. Việc áp dụng đúng cách các interceptor (dưới dạng middleware HTTP hoặc interceptor gRPC) là chìa khóa để xây dựng các hệ thống Go mạnh mẽ và linh hoạt.
Mẫu Interceptor trong Go thường được đặt ở các lớp (layers) xử lý yêu cầu hoặc cuộc gọi hàm, **trước** hoặc **sau** khi logic nghiệp vụ chính được thực thi. Vị trí cụ thể phụ thuộc vào loại ứng dụng và framework bạn đang sử dụng, nhưng mục tiêu chung là đặt nó ở nơi nó có thể "chặn" luồng điều khiển một cách hiệu quả để thực hiện các mối quan tâm xuyên suốt (cross-cutting concerns).

Dưới đây là các vị trí phổ biến và phân tích kỹ thuật:

### 1. Trong các ứng dụng Web HTTP (HTTP Middleware)

- **Vị trí:** Đây là trường hợp phổ biến nhất. Interceptor được triển khai dưới dạng **HTTP Middleware**. Chúng thường được cấu hình ở **lớp Application Layer** (lớp ứng dụng) hoặc gần hơn với **Infrastructure Layer** (lớp hạ tầng), nơi các yêu cầu HTTP đến được xử lý ban đầu.
- **Chi tiết:**
  - Bạn sẽ thấy chúng được áp dụng khi định nghĩa các route hoặc khi cấu hình một router (ví dụ: `Gorilla Mux`, `Chi`, `Gin`).
  - Mỗi middleware sẽ bao bọc `http.Handler` tiếp theo trong chuỗi, tạo thành một "stack" hoặc "chain" xử lý.
  - **Mục đích:** Xử lý xác thực, ủy quyền, ghi log, đo lường hiệu suất, nén, CORS, v.v., trước khi yêu cầu đến handler cuối cùng chứa logic nghiệp vụ.
- **Ví dụ Code Placement:**

  ```go
  func main() {
      router := mux.NewRouter()

      // Các interceptor (middleware) được áp dụng theo thứ tự ngược lại với chuỗi gọi
      // LoggingMiddleware sẽ chạy ngoài cùng, AuthMiddleware chạy bên trong nó
      // Cuối cùng là handler nghiệp vụ
      router.Handle("/api/v1/resource", LoggingMiddleware(AuthMiddleware(http.HandlerFunc(myBusinessHandler)))).Methods("GET")

      log.Fatal(http.ListenAndServe(":8080", router))
  }
  ```

  Hoặc với các framework có sẵn middleware chain:

  ```go
  // Với Gin framework
  func main() {
      r := gin.Default() // gin.Default() đã bao gồm Logging và Recovery middleware
      r.Use(AuthMiddlewareGin()) // Thêm middleware xác thực

      r.GET("/api/v1/resource", myBusinessHandlerGin)

      r.Run(":8080")
  }
  ```

### 2. Trong các ứng dụng gRPC (gRPC Interceptors)

- **Vị trí:** gRPC có cơ chế interceptor tích hợp sẵn cho cả phía server và client. Chúng được cấu hình khi khởi tạo `grpc.Server` hoặc `grpc.ClientConn`.
- **Chi tiết:**
  - **Server-side Unary/Stream Interceptors:** Đặt ở **lớp Application Layer**, bao bọc các lời gọi RPC đến các phương thức dịch vụ của bạn. Chúng được đăng ký khi bạn tạo `grpc.NewServer()`.
  - **Client-side Unary/Stream Interceptors:** Đặt ở **lớp Infrastructure Layer** (phía client), bao bọc các lời gọi RPC đi từ client đến server. Chúng được đăng ký khi bạn tạo `grpc.Dial()`.
  - **Mục đích:** Ghi log, xác thực, tracing, xử lý lỗi, retry logic, circuit breaking cho các cuộc gọi RPC.
- **Ví dụ Code Placement:**

  ```go
  // Server-side
  func main() {
      lis, _ := net.Listen("tcp", ":50051")
      s := grpc.NewServer(
          grpc.UnaryInterceptor(serverLoggingInterceptor),
          // grpc.StreamInterceptor(...)
      )
      // service.RegisterMyServiceServer(s, &myServiceServer{})
      s.Serve(lis)
  }

  // Client-side
  func main() {
      conn, _ := grpc.Dial(
          "localhost:50051",
          grpc.WithTransportCredentials(insecure.NewCredentials()),
          grpc.WithUnaryInterceptor(clientAuthInterceptor),
          // grpc.WithStreamInterceptor(...)
      )
      defer conn.Close()
      // client := service.NewMyServiceClient(conn)
      // client.CallMethod(...)
  }
  ```

### 3. Trong Service Layer hoặc Repository Layer (Function Decorators/Wrappers)

- **Vị trí:** Mặc dù không phải lúc nào cũng được gọi là "Interceptor Pattern" một cách chính thức, nhưng ý tưởng bao bọc một hàm hoặc một interface để thêm chức năng bổ sung (Decorator Pattern) là rất giống. Điều này thường xảy ra ở **lớp Application Layer** hoặc **Domain Layer** (khi bao bọc các service), hoặc **Infrastructure Layer** (khi bao bọc các repository).
- **Chi tiết:**
  - Bạn có thể tạo các "decorator" hoặc "wrapper" cho các interface service hoặc repository của mình.
  - Điều này hữu ích cho việc thêm logic như ghi log chi tiết cho từng phương thức service, quản lý giao dịch (transaction management), hoặc caching ở cấp độ service/repository.
- **Ví dụ Code Placement:**

  ```go
  // Giả định một interface Service
  type UserService interface {
      GetUser(ctx context.Context, id string) (*User, error)
  }

  // Một implementation Service
  type userServiceImpl struct { /* ... */ }
  func (s *userServiceImpl) GetUser(ctx context.Context, id string) (*User, error) { /* ... */ }

  // Một Interceptor/Decorator cho UserService
  type loggingUserService struct {
      next UserService
  }

  func NewLoggingUserService(next UserService) UserService {
      return &loggingUserService{next: next}
  }

  func (l *loggingUserService) GetUser(ctx context.Context, id string) (*User, error) {
      log.Printf("Calling GetUser with ID: %s", id)
      user, err := l.next.GetUser(ctx, id)
      log.Printf("GetUser returned user: %v, error: %v", user, err)
      return user, err
  }

  func main() {
      // Khởi tạo service gốc
      baseService := &userServiceImpl{}
      // Bao bọc nó bằng interceptor/decorator
      userService := NewLoggingUserService(baseService)

      // Sử dụng service đã được bao bọc
      ctx := context.Background()
      userService.GetUser(ctx, "123")
  }
  ```

### Tóm tắt về vị trí theo các lớp kiến trúc:

- **Application Layer:** Đây là nơi phổ biến nhất cho các Interceptor/Middleware, đặc biệt là khi xử lý các yêu cầu đến từ bên ngoài hệ thống (HTTP, gRPC). Chúng giúp quản lý luồng điều khiển và áp dụng các chính sách toàn cục trước khi yêu cầu chạm đến logic nghiệp vụ cốt lõi.
- **Infrastructure Layer:** Các interceptor client-side gRPC hoặc các wrapper quanh các driver cơ sở dữ liệu (ví dụ: để ghi log các truy vấn SQL) sẽ nằm ở đây. Chúng quản lý cách dịch vụ tương tác với các hệ thống bên ngoài hoặc các tài nguyên hạ tầng.
- **Domain Layer:** Ít phổ biến hơn cho Interceptor Pattern một cách trực tiếp, vì Domain Layer nên tập trung vào logic nghiệp vụ thuần túy. Tuy nhiên, các decorator cho các Domain Service có thể được coi là một dạng interceptor nếu chúng thêm các hành vi kỹ thuật (như caching cho một Aggregation Root) mà không làm thay đổi ngữ nghĩa nghiệp vụ.

**Nguyên tắc chung:** Đặt interceptor ở điểm mà bạn muốn "chặn" luồng xử lý và thêm logic bổ sung, nhưng **luôn bên ngoài logic nghiệp vụ cốt lõi**. Điều này đảm bảo rằng logic nghiệp vụ của bạn vẫn sạch sẽ, tập trung vào domain và dễ kiểm thử.
