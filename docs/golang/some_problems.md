---

### Vấn đề: "List Provider and Commands"

Thường thì điều này đề cập đến việc:

1.  **Provider (Nhà cung cấp):** Một thực thể (hoặc một nhóm thực thể) có khả năng cung cấp một danh sách các "commands" (lệnh/chức năng) hoặc các "actions" để thực thi.
2.  **Command (Lệnh):** Một đơn vị công việc có thể thực thi, thường có tên, mô tả và logic riêng. Nó có thể cần các tham số đầu vào và trả về kết quả hoặc lỗi.
3.  **Yêu cầu:**
    - **Đăng ký (Registration):** Các lệnh có thể được đăng ký tĩnh (compile-time) hoặc động (run-time).
    - **Liệt kê (Listing):** Khả năng lấy danh sách tất cả các lệnh có sẵn.
    - **Thực thi (Execution):** Khả năng chọn và thực thi một lệnh theo tên hoặc ID.
    - **Mở rộng (Extensibility):** Dễ dàng thêm các lệnh mới mà không cần sửa đổi nhiều mã nguồn.
    - **Cấu hình (Configuration):** Các lệnh có thể cần cấu hình riêng.
    - **Dependency Injection (DI):** Các lệnh có thể cần các dependency (ví dụ: database client, logger).

---

### Giải pháp 1: Sử dụng `map[string]Command` Đơn giản

Đây là cách tiếp cận cơ bản nhất, phù hợp cho các trường hợp đơn giản với một tập hợp lệnh cố định.

**Cấu trúc:**

```go
package main

import (
	"fmt"
	"strings"
)

// Command là một interface định nghĩa hành vi của một lệnh
type Command interface {
	Name() string
	Description() string
	Execute(args []string) error
}

// HelloCommand là một triển khai cụ thể của Command
type HelloCommand struct{}

func (c *HelloCommand) Name() string        { return "hello" }
func (c *HelloCommand) Description() string { return "Says hello to the given name" }
func (c *HelloCommand) Execute(args []string) error {
	if len(args) < 1 {
		return fmt.Errorf("usage: hello <name>")
	}
	fmt.Printf("Hello, %s!\n", args[0])
	return nil
}

// ExitCommand là một triển khai khác
type ExitCommand struct{}

func (c *ExitCommand) Name() string        { return "exit" }
func (c *ExitCommand) Description() string { return "Exits the application" }
func (c *ExitCommand) Execute(args []string) error {
	fmt.Println("Exiting...")
	// In a real app, you might use os.Exit(0) here
	return nil // Or return a specific error to signal exit
}

// CommandRegistry quản lý danh sách các lệnh
type CommandRegistry struct {
	commands map[string]Command
}

func NewCommandRegistry() *CommandRegistry {
	return &CommandRegistry{
		commands: make(map[string]Command),
	}
}

func (r *CommandRegistry) Register(cmd Command) error {
	if _, exists := r.commands[cmd.Name()]; exists {
		return fmt.Errorf("command '%s' already registered", cmd.Name())
	}
	r.commands[cmd.Name()] = cmd
	fmt.Printf("Registered command: %s\n", cmd.Name())
	return nil
}

func (r *CommandRegistry) Get(name string) (Command, bool) {
	cmd, ok := r.commands[name]
	return cmd, ok
}

func (r *CommandRegistry) List() []Command {
	var cmds []Command
	for _, cmd := range r.commands {
		cmds = append(cmds, cmd)
	}
	// Optional: sort commands by name for consistent output
	return cmds
}

func main() {
	registry := NewCommandRegistry()

	// Register commands
	registry.Register(&HelloCommand{})
	registry.Register(&ExitCommand{})

	// List commands
	fmt.Println("\nAvailable commands:")
	for _, cmd := range registry.List() {
		fmt.Printf("  - %s: %s\n", cmd.Name(), cmd.Description())
	}

	// Execute commands
	fmt.Println("\nExecuting commands:")
	if cmd, ok := registry.Get("hello"); ok {
		if err := cmd.Execute([]string{"World"}); err != nil {
			fmt.Printf("Error executing hello: %v\n", err)
		}
	} else {
		fmt.Println("Command 'hello' not found.")
	}

	if cmd, ok := registry.Get("exit"); ok {
		if err := cmd.Execute(nil); err != nil {
			fmt.Printf("Error executing exit: %v\n", err)
		}
	} else {
		fmt.Println("Command 'exit' not found.")
	}

	if cmd, ok := registry.Get("unknown"); ok {
		cmd.Execute(nil)
	} else {
		fmt.Println("Command 'unknown' not found.")
	}
}
```

**Ưu điểm:**

- Đơn giản, dễ hiểu và dễ triển khai.
- Sử dụng `interface` giúp decoupling các lệnh khỏi logic đăng ký/thực thi.
- Dễ dàng liệt kê và thực thi.

**Nhược điểm:**

- **Không có DI:** Các lệnh tự tạo dependencies của chúng hoặc không có. Để truyền dependencies (ví dụ: logger, database client), bạn phải truyền chúng vào constructor của từng Command hoặc vào `Execute` method.
- **Không có Lifecycle:** Khó quản lý lifecycle của các lệnh (ví dụ: khởi tạo tài nguyên, giải phóng tài nguyên).
- **Không có Grouping/Metadata phức tạp:** Nếu bạn muốn nhóm các lệnh, hoặc có thêm metadata (ví dụ: `auth_required: true`), cần phải mở rộng `Command` interface và `CommandRegistry`.

---

### Giải pháp 2: Functional Options Pattern cho Cấu hình và `Provider` Interface

Để khắc phục vấn đề về DI và cấu hình, chúng ta có thể kết hợp `Functional Options Pattern` và mở rộng khái niệm `Provider`.

**Cấu trúc:**

```go
package main

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"
)

// Logger là một dependency mẫu
type Logger interface {
	Infof(format string, args ...interface{})
	Errorf(format string, args ...interface{})
}

type defaultLogger struct{}

func (d *defaultLogger) Infof(format string, args ...interface{}) { log.Printf("INFO: "+format, args...) }
func (d *defaultLogger) Errorf(format string, args ...interface{}) { log.Printf("ERROR: "+format, args...) }

// Command interface vẫn giữ nguyên
type Command interface {
	Name() string
	Description() string
	Execute(ctx Context, args []string) error // Context now includes dependencies
}

// ApplicationContext chứa các dependencies dùng chung
type ApplicationContext struct {
	Logger Logger
	// Thêm các dependencies khác như DBClient, Config, v.v.
}

// Context cho mỗi lệnh thực thi, có thể là con của context.Context chuẩn Go
type Context struct {
	// Có thể chứa context.Context của Go để quản lý cancellation, deadline
	// goCtx context.Context
	AppCtx *ApplicationContext
}

// --- Commands with dependencies ---

type GreetCommand struct {
	Greeting string
}

func (c *GreetCommand) Name() string        { return "greet" }
func (c *GreetCommand) Description() string { return "Greets the given name with a custom message" }
func (c *GreetCommand) Execute(ctx Context, args []string) error {
	if len(args) < 1 {
		ctx.AppCtx.Logger.Errorf("usage: greet <name>")
		return fmt.Errorf("usage: greet <name>")
	}
	ctx.AppCtx.Logger.Infof("Executing greet command for %s", args[0])
	fmt.Printf("%s, %s!\n", c.Greeting, args[0])
	return nil
}

// --- Functional Options for Command Creation ---

type CommandOption func(*CommandBuilder)

type CommandBuilder struct {
	command Command
}

func WithGreeting(msg string) CommandOption {
	return func(cb *CommandBuilder) {
		if gc, ok := cb.command.(*GreetCommand); ok {
			gc.Greeting = msg
		}
	}
}

// NewGreetCommand factory function
func NewGreetCommand(opts ...CommandOption) *GreetCommand {
	cmd := &GreetCommand{Greeting: "Hello"} // Default greeting
	builder := &CommandBuilder{command: cmd}
	for _, opt := range opts {
		opt(builder)
	}
	return cmd
}

// --- Provider Interface ---

// CommandProvider là một interface cho các đối tượng có thể cung cấp lệnh
type CommandProvider interface {
	GetCommands(appCtx *ApplicationContext) []Command
}

// BasicProvider implements CommandProvider
type BasicProvider struct {
	commands []Command
}

func NewBasicProvider() *BasicProvider {
	return &BasicProvider{}
}

func (p *BasicProvider) AddCommand(cmd Command) {
	p.commands = append(p.commands, cmd)
}

func (p *BasicProvider) GetCommands(appCtx *ApplicationContext) []Command {
	// In a more complex scenario, providers might dynamically create commands
	// or perform additional setup using appCtx here.
	return p.commands
}

// CommandRegistry cải tiến
type CommandRegistry struct {
	commands map[string]Command
	appCtx   *ApplicationContext
	mu       sync.RWMutex
}

func NewCommandRegistry(appCtx *ApplicationContext) *CommandRegistry {
	return &CommandRegistry{
		commands: make(map[string]Command),
		appCtx:   appCtx,
	}
}

func (r *CommandRegistry) RegisterProvider(provider CommandProvider) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, cmd := range provider.GetCommands(r.appCtx) {
		if _, exists := r.commands[cmd.Name()]; exists {
			r.appCtx.Logger.Errorf("Command '%s' from provider already registered. Skipping.", cmd.Name())
			continue
		}
		r.commands[cmd.Name()] = cmd
		r.appCtx.Logger.Infof("Registered command: %s", cmd.Name())
	}
}

func (r *CommandRegistry) Get(name string) (Command, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	cmd, ok := r.commands[name]
	return cmd, ok
}

func (r *CommandRegistry) List() []Command {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var cmds []Command
	for _, cmd := range r.commands {
		cmds = append(cmds, cmd)
	}
	return cmds
}

func main() {
	appCtx := &ApplicationContext{
		Logger: &defaultLogger{},
	}

	registry := NewCommandRegistry(appCtx)

	// Create a provider and register commands with functional options
	basicProvider := NewBasicProvider()
	basicProvider.AddCommand(NewGreetCommand()) // Default greeting
	basicProvider.AddCommand(NewGreetCommand(WithGreeting("Hiya"))) // Custom greeting

	registry.RegisterProvider(basicProvider)

	// List commands
	fmt.Println("\nAvailable commands:")
	for _, cmd := range registry.List() {
		fmt.Printf("  - %s: %s\n", cmd.Name(), cmd.Description())
	}

	// Execute commands
	fmt.Println("\nExecuting commands:")
	execCtx := Context{AppCtx: appCtx} // Context for execution

	if cmd, ok := registry.Get("greet"); ok {
		if err := cmd.Execute(execCtx, []string{"Alice"}); err != nil {
			appCtx.Logger.Errorf("Error executing greet: %v", err)
		}
	} else {
		appCtx.Logger.Errorf("Command 'greet' not found.")
	}

	if cmd, ok := registry.Get("greet"); ok {
		// This will still execute the first 'greet' command registered
		// demonstrating that if you need different instances, you need to register them with different names
		if err := cmd.Execute(execCtx, []string{"Bob"}); err != nil {
			appCtx.Logger.Errorf("Error executing greet: %v", err)
		}
	}

	// For commands needing different config, they would have different names or be instantiated differently
	// For instance:
	// basicProvider.AddCommand(NewGreetCommand(WithGreeting("Hola"), WithName("hola"))) // If command name can be changed
	// This shows the limitation if multiple commands share the same Name() but have different configurations.
	// You might need to make Command.Name() dynamic based on config, or use a "command factory".
}
```

**Ưu điểm:**

- **Dependency Injection:** `ApplicationContext` và `Context` cho phép truyền các dependencies cần thiết cho các lệnh.
- **Cấu hình linh hoạt:** `Functional Options Pattern` cho phép cấu hình các lệnh một cách rõ ràng và có thể mở rộng.
- **Grouping Commands:** `CommandProvider` cho phép nhóm các lệnh và cung cấp chúng theo từng lô. Điều này rất hữu ích cho các mô-đun hoặc plugin.
- **Lifecycle Management (Cải thiện):** `GetCommands(appCtx *ApplicationContext)` của `Provider` có thể được dùng để khởi tạo hoặc cấu hình các lệnh dựa trên context ứng dụng.

**Nhược điểm:**

- Phức tạp hơn giải pháp 1.
- Vẫn có thể gặp vấn đề nếu nhiều lệnh cấu hình khác nhau lại có cùng `Name()`. Có thể giải quyết bằng cách thay đổi `Name()` thành một trường được cấu hình, hoặc bằng cách sử dụng Command Factories.

---

### Giải pháp 3: Command Factories và Factory Pattern

Nếu bạn cần tạo các instance lệnh khác nhau với các cấu hình khác nhau nhưng vẫn muốn thực thi chúng bằng một tên chung, hoặc nếu các lệnh đòi hỏi khởi tạo phức tạp, `Factory Pattern` là lựa chọn tốt.

**Cấu trúc (Chỉ tập trung vào phần Factory):**

```go
package main

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"
)

// Logger và Context như trên Solution 2

// Command interface như trên Solution 2

// MyServiceCommand là một lệnh cần một service cụ thể
type MyServiceCommand struct {
	ServiceID string
	Logger Logger // Dependency from AppContext
}

func (c *MyServiceCommand) Name() string        { return "myservice" }
func (c *MyServiceCommand) Description() string { return "Interacts with MyService" }
func (c *MyServiceCommand) Execute(ctx Context, args []string) error {
	ctx.AppCtx.Logger.Infof("Executing MyServiceCommand for ServiceID: %s", c.ServiceID)
	fmt.Printf("Interacting with service %s. Args: %v\n", c.ServiceID, args)
	return nil
}

// CommandFactory là một hàm để tạo Command
type CommandFactory func(appCtx *ApplicationContext, config map[string]string) (Command, error)

// Example Factory
func MyServiceCommandFactory(appCtx *ApplicationContext, config map[string]string) (Command, error) {
	serviceID := config["service_id"]
	if serviceID == "" {
		return nil, fmt.Errorf("service_id is required for MyServiceCommand")
	}
	return &MyServiceCommand{
		ServiceID: serviceID,
		Logger: appCtx.Logger, // Inject logger from appCtx
	}, nil
}

// CommandRegistry bây giờ lưu trữ factories
type CommandRegistryWithFactories struct {
	factories map[string]CommandFactory
	appCtx    *ApplicationContext
	mu        sync.RWMutex
}

func NewCommandRegistryWithFactories(appCtx *ApplicationContext) *CommandRegistryWithFactories {
	return &CommandRegistryWithFactories{
		factories: make(map[string]CommandFactory),
		appCtx:    appCtx,
	}
}

func (r *CommandRegistryWithFactories) RegisterFactory(name string, factory CommandFactory) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, exists := r.factories[name]; exists {
		return fmt.Errorf("factory '%s' already registered", name)
	}
	r.factories[name] = factory
	r.appCtx.Logger.Infof("Registered command factory: %s", name)
	return nil
}

// GetAndExecute tạo một instance command mỗi khi được gọi
func (r *CommandRegistryWithFactories) GetAndExecute(execCtx Context, name string, config map[string]string, args []string) error {
	r.mu.RLock()
	factory, ok := r.factories[name]
	r.mu.RUnlock()
	if !ok {
		return fmt.Errorf("command factory '%s' not found", name)
	}

	cmd, err := factory(r.appCtx, config)
	if err != nil {
		return fmt.Errorf("failed to create command instance '%s': %w", name, err)
	}

	return cmd.Execute(execCtx, args)
}

// main (chỉ ví dụ cách sử dụng)
func main() {
	appCtx := &ApplicationContext{
		Logger: &defaultLogger{},
	}
	registry := NewCommandRegistryWithFactories(appCtx)

	registry.RegisterFactory("myservice-a", MyServiceCommandFactory)
	registry.RegisterFactory("myservice-b", MyServiceCommandFactory)

	execCtx := Context{AppCtx: appCtx}

	// Execute an instance of myservice-a
	registry.GetAndExecute(execCtx, "myservice-a", map[string]string{"service_id": "A123"}, []string{"ping"})

	// Execute an instance of myservice-b with different config
	registry.GetAndExecute(execCtx, "myservice-b", map[string]string{"service_id": "B456"}, []string{"status"})

	// Attempt to execute with missing config
	if err := registry.GetAndExecute(execCtx, "myservice-a", nil, nil); err != nil {
		fmt.Printf("Error executing myservice-a without ID: %v\n", err)
	}
}
```

**Ưu điểm:**

- **DI và Cấu hình mạnh mẽ:** Factory có thể nhận `appCtx` và `config` để tạo instance lệnh được cấu hình đầy đủ.
- **Instance mới mỗi lần thực thi:** Đảm bảo mỗi lần thực thi lệnh là độc lập, phù hợp cho các lệnh có trạng thái.
- **Quản lý Lifecycle của Command:** Logic khởi tạo phức tạp có thể nằm trong factory.
- **Linh hoạt:** Các lệnh có thể được cấu hình rất khác nhau nhưng vẫn được tạo ra bởi cùng một factory, được gọi bằng một tên logic.

**Nhược điểm:**

- Phức tạp nhất trong ba giải pháp.
- Việc liệt kê các lệnh không còn chỉ là `List()` các instance, mà cần mô tả cách tạo chúng hoặc các cấu hình phổ biến.

---

### Giải pháp 4: Sử dụng `reflect` (Nâng cao & Cần cân nhắc)

Một giải pháp khác, đặc biệt hữu ích cho các hệ thống plugin hoặc CLI tools phức tạp, là sử dụng `reflect` để đăng ký các hàm hoặc `struct` mà không cần một interface chung ban đầu. Tuy nhiên, việc sử dụng `reflect` cần cẩn thận vì nó có thể làm mã khó đọc hơn, làm mất đi tính an toàn kiểu dữ liệu (type safety) và có chi phí hiệu năng nhỏ.

**Khi sử dụng:**

- Xây dựng hệ thống plugin nơi các plugin có thể định nghĩa các hàm có chữ ký khác nhau.
- CLI tools tự động ánh xạ các đối số dòng lệnh vào tham số hàm.

**Ưu điểm:**

- Cực kỳ linh hoạt, có thể xử lý các lệnh có chữ ký rất khác nhau.
- Đăng ký gọn gàng hơn ở mức khai báo.

**Nhược điểm:**

- Sử dụng reflection làm mất đi type safety tại compile-time. Lỗi chỉ xuất hiện tại runtime.
- Hiệu năng thấp hơn một chút.
- Mã phức tạp hơn để đọc và debug.

**(Không cung cấp ví dụ code chi tiết cho Reflect ở đây vì nó yêu cầu một cuộc thảo luận sâu hơn về xử lý type, arg parsing và error handling, vượt ra ngoài phạm vi một câu trả lời ngắn gọn, và thường chỉ được khuyến nghị cho các trường hợp rất đặc biệt.)**

---

### Các cân nhắc chung và Best Practices:

1.  **Sử dụng `context.Context` của Go:**
    - **Bắt buộc:** Thay đổi `Execute` method của `Command` interface để nhận `ctx context.Context` (của Go) làm tham số đầu tiên.
    - Điều này cho phép bạn truyền tín hiệu hủy bỏ, deadline và các giá trị request-scoped xuống các lệnh, rất quan trọng cho các lệnh chạy lâu dài hoặc trong môi trường microservice.

2.  **Xử lý lỗi:**
    - Các lệnh nên trả về `error`. Logic gọi lệnh cần kiểm tra và xử lý lỗi một cách thích hợp.
    - Sử dụng `fmt.Errorf` với `%w` để bọc lỗi và bảo toàn chuỗi lỗi.

3.  **Tên lệnh & Định danh:**
    - Đảm bảo tên lệnh là duy nhất.
    - Cân nhắc về cách bạn muốn đặt tên các lệnh (ví dụ: `api.user.get`, `db.migrate`).

4.  **Logging và Metrics:**
    - Truyền `Logger` và `MetricsCollector` làm dependencies qua `ApplicationContext` để các lệnh có thể ghi log và phát ra metrics.
    - Sử dụng `context.WithValue` của Go để truyền các `trace_id` hoặc `request_id` để theo dõi lệnh.

5.  **Giao diện người dùng (nếu là CLI):**
    - Đối với các công cụ CLI, hãy cân nhắc sử dụng các thư viện như `cobra` hoặc `urfave/cli` để xử lý phân tích đối số, cờ (flags) và tạo cấu trúc lệnh phân cấp. Các thư viện này thường có cơ chế đăng ký lệnh riêng của chúng.

---
