Chào bạn,

Để thêm vai trò (role) cố định cho mỗi loại `Entry` (ví dụ: `DeveloperMessageEntry` luôn có `role: "developer"`), chúng ta không thể chỉ dùng bí danh kiểu (type alias) với kiểu generic `MessageEntry[T any]` ban đầu. Lý do là bí danh kiểu chỉ tạo ra một tên khác cho kiểu cơ bản; nó không cho phép bạn thay đổi hành vi hoặc giá trị mặc định của các trường.

Để đạt được điều này một cách mạnh mẽ (đảm bảo vai trò luôn đúng khi marshal sang JSON và kiểm tra khi unmarshal), chúng ta cần định nghĩa các cấu trúc cụ thể cho từng loại tin nhắn và sử dụng phương thức `MarshalJSON` và `UnmarshalJSON` tùy chỉnh.

### **Giải pháp với các cấu trúc cụ thể và `json.Marshaler`/`json.Unmarshaler`**

Chúng ta sẽ:

1.  Giữ lại `FlexibleStringContent` để xử lý nội dung `string` hoặc `[]string`.
2.  Tạo các cấu trúc riêng biệt cho `DeveloperMessage`, `SystemMessage`, `UserMessage`.
3.  Mỗi cấu trúc này sẽ triển khai `json.Marshaler` để tự động thêm trường `role` cố định khi chuyển đổi sang JSON.
4.  Mỗi cấu trúc cũng sẽ triển khai `json.Unmarshaler` để xác thực `role` khi chuyển đổi từ JSON.
5.  `InputPayload` sẽ chứa một slice của `interface{}` hoặc một interface chung mà tất cả các tin nhắn này triển khai, để có thể chứa các loại tin nhắn khác nhau.

```go
package main

import (
	"encoding/json"
	"fmt"
	"time"
)

// --- Kiểu dữ liệu tùy chỉnh cho nội dung tin nhắn linh hoạt ---

// FlexibleStringContent có thể đại diện cho một chuỗi đơn lẻ hoặc một mảng các chuỗi.
// Nó sẽ tự động xử lý việc marshal/unmarshal JSON.
type FlexibleStringContent struct {
	Single   string
	Array    []string
	isSingle bool // true nếu ban đầu là một chuỗi, false nếu là mảng
}

// NewFlexibleStringContent tạo một FlexibleStringContent từ một chuỗi đơn.
func NewFlexibleStringContent(s string) FlexibleStringContent {
	return FlexibleStringContent{Single: s, isSingle: true}
}

// NewFlexibleStringContentArray tạo một FlexibleStringContent từ một mảng chuỗi.
func NewFlexibleStringContentArray(a []string) FlexibleStringContent {
	return FlexibleStringContent{Array: a, isSingle: false}
}

// MarshalJSON triển khai giao diện json.Marshaler cho FlexibleStringContent.
// Nó sẽ marshal thành một chuỗi hoặc một mảng chuỗi tùy thuộc vào nội dung.
func (f FlexibleStringContent) MarshalJSON() ([]byte, error) {
	if f.isSingle {
		return json.Marshal(f.Single)
	}
	return json.Marshal(f.Array)
}

// UnmarshalJSON triển khai giao diện json.Unmarshaler cho FlexibleStringContent.
// Nó sẽ cố gắng unmarshal thành một chuỗi, sau đó là một mảng chuỗi.
func (f *FlexibleStringContent) UnmarshalJSON(data []byte) error {
	// Thử unmarshal thành chuỗi đơn
	var s string
	if err := json.Unmarshal(data, &s); err == nil {
		f.Single = s
		f.isSingle = true
		return nil
	}

	// Nếu thất bại, thử unmarshal thành mảng chuỗi
	var a []string
	if err := json.Unmarshal(data, &a); err == nil {
		f.Array = a
		f.isSingle = false
		return nil
	}

	return fmt.Errorf("content must be a string or an array of strings")
}

// --- Định nghĩa Interface Message chung ---
// Để InputPayload có thể chứa các loại tin nhắn khác nhau, chúng ta cần một interface chung.
type Message interface {
	GetRole() string // Để có thể kiểm tra vai trò từ bên ngoài
	json.Marshaler
	json.Unmarshaler
}

// --- Các cấu trúc tin nhắn cụ thể với vai trò cố định ---

// DeveloperMessage đại diện cho một tin nhắn từ nhà phát triển.
type DeveloperMessage struct {
	Content string `json:"content"`
	Name    string `json:"name,omitempty"`
}

// GetRole triển khai phương thức của interface Message.
func (m DeveloperMessage) GetRole() string { return "developer" }

// MarshalJSON để đảm bảo role luôn là "developer" khi marshal.
func (m DeveloperMessage) MarshalJSON() ([]byte, error) {
	// Sử dụng một struct ẩn danh để thêm trường Role vào JSON output
	aux := struct {
		Role string `json:"role"`
		DeveloperMessage
	}{
		Role:             "developer",
		DeveloperMessage: m, // Embeds the original struct's fields
	}
	return json.Marshal(aux)
}

// UnmarshalJSON để đảm bảo role là "developer" khi unmarshal.
func (m *DeveloperMessage) UnmarshalJSON(data []byte) error {
	// Sử dụng một struct ẩn danh để đọc Role và các trường khác
	aux := struct {
		Role    string `json:"role"`
		Content string `json:"content"`
		Name    string `json:"name,omitempty"`
	}{}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	if aux.Role != "developer" {
		return fmt.Errorf("expected role 'developer' for DeveloperMessage, got '%s'", aux.Role)
	}
	m.Content = aux.Content
	m.Name = aux.Name
	return nil
}

// SystemMessage đại diện cho một tin nhắn từ hệ thống.
type SystemMessage struct {
	Content FlexibleStringContent `json:"content"`
	Name    string                `json:"name,omitempty"`
}

// GetRole triển khai phương thức của interface Message.
func (m SystemMessage) GetRole() string { return "system" }

// MarshalJSON để đảm bảo role luôn là "system" khi marshal.
func (m SystemMessage) MarshalJSON() ([]byte, error) {
	aux := struct {
		Role string `json:"role"`
		SystemMessage
	}{
		Role:          "system",
		SystemMessage: m,
	}
	return json.Marshal(aux)
}

// UnmarshalJSON để đảm bảo role là "system" khi unmarshal.
func (m *SystemMessage) UnmarshalJSON(data []byte) error {
	aux := struct {
		Role    string          `json:"role"`
		Content json.RawMessage `json:"content"` // Dùng RawMessage để xử lý FlexibleStringContent sau
		Name    string          `json:"name,omitempty"`
	}{}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	if aux.Role != "system" {
		return fmt.Errorf("expected role 'system' for SystemMessage, got '%s'", aux.Role)
	}
	// Unmarshal content vào FlexibleStringContent
	if err := json.Unmarshal(aux.Content, &m.Content); err != nil {
		return fmt.Errorf("failed to unmarshal SystemMessage content: %w", err)
	}
	m.Name = aux.Name
	return nil
}

// UserMessage đại diện cho một tin nhắn từ người dùng.
type UserMessage struct {
	Content FlexibleStringContent `json:"content"`
	Name    string                `json:"name,omitempty"`
}

// GetRole triển khai phương thức của interface Message.
func (m UserMessage) GetRole() string { return "user" }

// MarshalJSON để đảm bảo role luôn là "user" khi marshal.
func (m UserMessage) MarshalJSON() ([]byte, error) {
	aux := struct {
		Role string `json:"role"`
		UserMessage
	}{
		Role:        "user",
		UserMessage: m,
	}
	return json.Marshal(aux)
}

// UnmarshalJSON để đảm bảo role là "user" khi unmarshal.
func (m *UserMessage) UnmarshalJSON(data []byte) error {
	aux := struct {
		Role    string          `json:"role"`
		Content json.RawMessage `json:"content"` // Dùng RawMessage để xử lý FlexibleStringContent sau
		Name    string          `json:"name,omitempty"`
	}{}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	if aux.Role != "user" {
		return fmt.Errorf("expected role 'user' for UserMessage, got '%s'", aux.Role)
	}
	// Unmarshal content vào FlexibleStringContent
	if err := json.Unmarshal(aux.Content, &m.Content); err != nil {
		return fmt.Errorf("failed to unmarshal UserMessage content: %w", err)
	}
	m.Name = aux.Name
	return nil
}

// --- Cấu trúc InputPayload ---

// StreamOptions chứa các tùy chọn cho hành vi streaming.
type StreamOptions struct {
	IncludeUsage bool `json:"include_usage"`
}

// InputPayload là cấu trúc cấp cao nhất đại diện cho toàn bộ body request JSON.
// Messages giờ đây là một slice của interface Message, cho phép chứa các loại tin nhắn khác nhau.
type InputPayload struct {
	Model         string         `json:"model"`
	Messages      []Message      `json:"messages"` // Slice of Message interface
	Temperature   *float64       `json:"temperature,omitempty"`
	Stream        *bool          `json:"stream,omitempty"`
	StreamOptions *StreamOptions `json:"stream_options,omitempty"`
}

// UnmarshalJSON cho InputPayload để xử lý các loại tin nhắn hỗn hợp.
func (p *InputPayload) UnmarshalJSON(data []byte) error {
	// Bước 1: Unmarshal các trường cố định và Messages dưới dạng RawMessage
	aux := struct {
		Model         string            `json:"model"`
		Messages      []json.RawMessage `json:"messages"`
		Temperature   *float64          `json:"temperature,omitempty"`
		Stream        *bool             `json:"stream,omitempty"`
		StreamOptions *StreamOptions    `json:"stream_options,omitempty"`
	}{}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	p.Model = aux.Model
	p.Temperature = aux.Temperature
	p.Stream = aux.Stream
	p.StreamOptions = aux.StreamOptions

	// Bước 2: Duyệt qua từng RawMessage trong Messages và xác định kiểu dựa trên trường 'role'
	p.Messages = make([]Message, len(aux.Messages))
	for i, rawMsg := range aux.Messages {
		var temp struct {
			Role string `json:"role"`
		}
		if err := json.Unmarshal(rawMsg, &temp); err != nil {
			return fmt.Errorf("failed to determine role for message %d: %w", i, err)
		}

		switch temp.Role {
		case "developer":
			var msg DeveloperMessage
			if err := json.Unmarshal(rawMsg, &msg); err != nil {
				return fmt.Errorf("failed to unmarshal DeveloperMessage %d: %w", i, err)
			}
			p.Messages[i] = msg
		case "system":
			var msg SystemMessage
			if err := json.Unmarshal(rawMsg, &msg); err != nil {
				return fmt.Errorf("failed to unmarshal SystemMessage %d: %w", i, err)
			}
			p.Messages[i] = msg
		case "user":
			var msg UserMessage
			if err := json.Unmarshal(rawMsg, &msg); err != nil {
				return fmt.Errorf("failed to unmarshal UserMessage %d: %w", i, err)
			}
			p.Messages[i] = msg
		default:
			return fmt.Errorf("unsupported message role '%s' for message %d", temp.Role, i)
		}
	}
	return nil
}


// Hàm trợ giúp để tạo con trỏ cho các giá trị tùy chọn
func ptr[T any](v T) *T {
	return &v
}

func main() {
	// --- Ví dụ sử dụng DeveloperMessage ---
	devMsg := DeveloperMessage{
		Content: "Execute function 'calculate_total'.",
		Name:    "my_dev_bot",
	}
	fmt.Println("--- Developer Message ---")
	devJSON, _ := json.MarshalIndent(devMsg, "", "  ")
	fmt.Println(string(devJSON))
	// Unmarshal để kiểm tra
	var devMsgUnmarshal DeveloperMessage
	_ = json.Unmarshal(devJSON, &devMsgUnmarshal)
	fmt.Printf("Unmarshal check: Role=%s, Content=%s\n", devMsgUnmarshal.GetRole(), devMsgUnmarshal.Content)
	fmt.Println()

	// --- Ví dụ sử dụng SystemMessage (Content là string) ---
	sysMsgSingle := SystemMessage{
		Content: NewFlexibleStringContent("Bạn là một trợ lý AI hữu ích."),
	}
	fmt.Println("--- System Message (Content: single string) ---")
	sysSingleJSON, _ := json.MarshalIndent(sysMsgSingle, "", "  ")
	fmt.Println(string(sysSingleJSON))
	var sysMsgSingleUnmarshal SystemMessage
	_ = json.Unmarshal(sysSingleJSON, &sysMsgSingleUnmarshal)
	fmt.Printf("Unmarshal check: Role=%s, Content=%s\n", sysMsgSingleUnmarshal.GetRole(), sysMsgSingleUnmarshal.Content.Single)
	fmt.Println()

	// --- Ví dụ sử dụng UserMessage (Content là []string) ---
	userMsgArray := UserMessage{
		Content: NewFlexibleStringContentArray([]string{"Hãy tóm tắt lịch sử của ngôn ngữ Go.", "Sau đó cho ví dụ về generics."}),
	}
	fmt.Println("--- User Message (Content: array of strings) ---")
	userArrayJSON, _ := json.MarshalIndent(userMsgArray, "", "  ")
	fmt.Println(string(userArrayJSON))
	var userMsgArrayUnmarshal UserMessage
	_ = json.Unmarshal(userArrayJSON, &userMsgArrayUnmarshal)
	fmt.Printf("Unmarshal check: Role=%s, Content=%v\n", userMsgArrayUnmarshal.GetRole(), userMsgArrayUnmarshal.Content.Array)
	fmt.Println()

	// --- Ví dụ InputPayload với các loại tin nhắn hỗn hợp ---
	payloadMixedMessages := InputPayload{
		Model: "gpt-4o",
		Messages: []Message{
			devMsg,
			sysMsgSingle,
			userMsgArray,
			&UserMessage{ // Thêm một tin nhắn user khác
				Content: NewFlexibleStringContent("Cảm ơn bạn!"),
				Name:    "Alice",
			},
		},
		Temperature: ptr(0.5),
		Stream:      ptr(true),
		StreamOptions: &StreamOptions{
			IncludeUsage: true,
		},
	}
	fmt.Println("--- InputPayload với các loại tin nhắn hỗn hợp ---")
	payloadMixedJSON, _ := json.MarshalIndent(payloadMixedMessages, "", "  ")
	fmt.Println(string(payloadMixedJSON))
	fmt.Println()

	// --- Unmarshal một InputPayload với các loại tin nhắn hỗn hợp ---
	fmt.Println("--- Unmarshal InputPayload với các loại tin nhắn hỗn hợp ---")
	var unmarshaledPayload InputPayload
	err := json.Unmarshal(payloadMixedJSON, &unmarshaledPayload)
	if err != nil {
		fmt.Printf("Unmarshal error: %v\n", err)
	} else {
		fmt.Printf("Model: %s\n", unmarshaledPayload.Model)
		for i, msg := range unmarshaledPayload.Messages {
			fmt.Printf("  Message %d: Role=%s, Type=%T\n", i, msg.GetRole(), msg)
			// Để truy cập nội dung cụ thể, bạn có thể dùng type assertion
			switch m := msg.(type) {
			case DeveloperMessage:
				fmt.Printf("    Content: %s, Name: %s\n", m.Content, m.Name)
			case SystemMessage:
				if m.Content.isSingle {
					fmt.Printf("    Content: %s, Name: %s\n", m.Content.Single, m.Name)
				} else {
					fmt.Printf("    Content: %v, Name: %s\n", m.Content.Array, m.Name)
				}
			case UserMessage:
				if m.Content.isSingle {
					fmt.Printf("    Content: %s, Name: %s\n", m.Content.Single, m.Name)
				} else {
					fmt.Printf("    Content: %v, Name: %s\n", m.Content.Array, m.Name)
				}
			}
		}
	}
}
```

### **Phân tích và Thảo luận Kỹ thuật Chuyên sâu:**

1.  **Loại bỏ Generic `MessageEntry[T any]` cho trường hợp này:**
    - Khi bạn muốn cố định một giá trị (như `role`) cho một kiểu cụ thể, việc sử dụng generic type aliases (ví dụ: `DeveloperMessageEntry = MessageEntry[string]`) không cho phép bạn thay đổi hành vi marshalling/unmarshalling hoặc ép buộc một giá trị cụ thể.
    - Do đó, chúng ta quay lại việc định nghĩa các struct cụ thể cho từng loại tin nhắn (`DeveloperMessage`, `SystemMessage`, `UserMessage`).

2.  **Sử dụng `json.Marshaler` và `json.Unmarshaler` cho `Role` cố định:**
    - **`MarshalJSON`:** Đây là phương pháp chính để đảm bảo trường `role` luôn có giá trị mong muốn khi cấu trúc được chuyển đổi thành JSON.
      - Chúng ta sử dụng một `struct` ẩn danh bên trong `MarshalJSON` để tạo ra một cấu trúc tạm thời. Cấu trúc tạm thời này có trường `Role` với giá trị cố định và nhúng (`embed`) cấu trúc gốc của tin nhắn (`DeveloperMessage`, `SystemMessage`, v.v.).
      - Khi `json.Marshal` được gọi trên `aux`, nó sẽ tạo ra JSON với trường `role` đã cố định và tất cả các trường khác từ cấu trúc gốc.
    - **`UnmarshalJSON`:** Đây là phương pháp để xử lý dữ liệu JSON đến và đảm bảo rằng `role` khớp với giá trị mong đợi cho kiểu tin nhắn đó.
      - Tương tự, một `struct` ẩn danh được sử dụng để đọc tất cả các trường từ JSON.
      - Sau khi unmarshal vào `aux`, chúng ta kiểm tra giá trị của `aux.Role`. Nếu nó không khớp, chúng ta trả về lỗi, đảm bảo tính toàn vẹn của dữ liệu.
      - Đối với các trường `Content` linh hoạt (`FlexibleStringContent`), chúng ta sử dụng `json.RawMessage` để đọc nội dung thô ban đầu, sau đó unmarshal nó một cách riêng biệt vào kiểu `FlexibleStringContent` để tận dụng logic `UnmarshalJSON` của nó.

3.  **Interface `Message` và `InputPayload`:**
    - Để `InputPayload` có thể chứa một slice các loại tin nhắn khác nhau (`DeveloperMessage`, `SystemMessage`, `UserMessage`), chúng ta cần một interface chung mà tất cả chúng đều triển khai.
    - Interface `Message` được định nghĩa với `GetRole() string`, `json.Marshaler`, và `json.Unmarshaler`. Mỗi cấu trúc tin nhắn cụ thể sẽ triển khai interface này.
    - `InputPayload.Messages` giờ đây là `[]Message`. Điều này cho phép chúng ta thêm bất kỳ loại tin nhắn nào triển khai interface `Message` vào slice này.

4.  **`InputPayload.UnmarshalJSON` để xử lý các loại tin nhắn hỗn hợp:**
    - Đây là phần phức tạp nhất. Khi `json.Unmarshal` gặp `[]Message`, nó không biết phải khởi tạo loại `struct` cụ thể nào cho mỗi phần tử.
    - Chúng ta cần triển khai `UnmarshalJSON` tùy chỉnh cho `InputPayload`:
      - Đầu tiên, unmarshal `Messages` thành một slice `[]json.RawMessage`. Điều này giữ nguyên dữ liệu JSON thô của từng tin nhắn.
      - Sau đó, duyệt qua từng `json.RawMessage`. Đối với mỗi `RawMessage`:
        - Tạm thời unmarshal chỉ trường `role` để xác định loại tin nhắn.
        - Dựa trên giá trị `role`, unmarshal `RawMessage` đó vào loại `struct` cụ thể (`DeveloperMessage`, `SystemMessage`, `UserMessage`).
        - Gán instance của `struct` cụ thể đó vào slice `p.Messages`.

### **Ưu điểm của cách tiếp cận này:**

- **Đảm bảo vai trò cố định:** `role` luôn được thiết lập đúng khi marshal và được xác thực khi unmarshal.
- **An toàn kiểu:** Mặc dù `Messages []Message` sử dụng interface, nhưng việc sử dụng `UnmarshalJSON` tùy chỉnh giúp khôi phục các kiểu cụ thể một cách an toàn và kiểm tra tính toàn vẹn.
- **Linh hoạt:** `InputPayload` có thể chứa một hỗn hợp các loại tin nhắn khác nhau.
- **Rõ ràng:** Mã rõ ràng về mục đích của từng loại tin nhắn và cách chúng được xử lý.

Chào bạn,

Câu hỏi của bạn rất hay và chạm đến một điểm quan trọng trong việc sử dụng generic types trong Go: **khi nào thì generic types thực sự phù hợp và khi nào thì không thể thay thế các phương pháp truyền thống (như custom `MarshalJSON`/`UnmarshalJSON`)?**

Trong trường hợp bạn muốn _cố định giá trị của một trường_ (như `role`) cho một kiểu cụ thể và đồng thời _xác thực giá trị đó_ khi unmarshal, generic types không thể trực tiếp làm điều đó một cách mạnh mẽ như bạn mong muốn.

**Tại sao Generic Types không thể trực tiếp cố định giá trị trường `role`?**

1.  **Generic Types là về kiểu, không phải giá trị:** Generic types trong Go cho phép bạn viết mã hoạt động với nhiều _kiểu dữ liệu_ khác nhau (ví dụ: `T` có thể là `string`, `int`, `MyStruct`), nhưng chúng không cho phép bạn truyền _giá trị_ (như chuỗi `"developer"`) làm tham số kiểu và sau đó sử dụng giá trị đó để khởi tạo một trường hoặc thay đổi hành vi logic.
2.  **`MarshalJSON`/`UnmarshalJSON` hoạt động trên các kiểu cụ thể:** Các phương thức `json.Marshaler` và `json.Unmarshaler` được định nghĩa trên các kiểu `struct` cụ thể. Khi bạn có `DeveloperMessageEntry = MessageEntry[string]`, `DeveloperMessageEntry` chỉ là một bí danh cho `MessageEntry[string]`. Bạn không thể định nghĩa một phương thức `MarshalJSON` riêng cho `DeveloperMessageEntry` mà không định nghĩa cho `MessageEntry[string]` nói chung. Và nếu bạn định nghĩa cho `MessageEntry[string]`, nó sẽ áp dụng cho _tất cả_ các `MessageEntry` có `Content` là `string`, không chỉ riêng `DeveloperMessageEntry`.

**Tuy nhiên, chúng ta vẫn có thể sử dụng generic types để giảm sự trùng lặp (boilerplate) cho các phần chung của tin nhắn!**

Chúng ta có thể định nghĩa một "core" message generic chứa các phần chung (`Content`, `Name`) và sau đó nhúng (embed) nó vào các struct tin nhắn cụ thể của bạn. Các struct cụ thể này vẫn sẽ cần `MarshalJSON`/`UnmarshalJSON` riêng để xử lý trường `role` cố định và xác thực.

### **Giải pháp Kết hợp Generic Types và Custom JSON Methods**

```go
package main

import (
	"encoding/json"
	"fmt"
	"time"
)

// --- Kiểu dữ liệu tùy chỉnh cho nội dung tin nhắn linh hoạt ---

// FlexibleStringContent có thể đại diện cho một chuỗi đơn lẻ hoặc một mảng các chuỗi.
type FlexibleStringContent struct {
	Single   string
	Array    []string
	isSingle bool // true nếu ban đầu là một chuỗi, false nếu là mảng
}

func NewFlexibleStringContent(s string) FlexibleStringContent {
	return FlexibleStringContent{Single: s, isSingle: true}
}

func NewFlexibleStringContentArray(a []string) FlexibleStringContent {
	return FlexibleStringContent{Array: a, isSingle: false}
}

func (f FlexibleStringContent) MarshalJSON() ([]byte, error) {
	if f.isSingle {
		return json.Marshal(f.Single)
	}
	return json.Marshal(f.Array)
}

func (f *FlexibleStringContent) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err == nil {
		f.Single = s
		f.isSingle = true
		return nil
	}

	var a []string
	if err := json.Unmarshal(data, &a); err == nil {
		f.Array = a
		f.isSingle = false
		return nil
	}

	return fmt.Errorf("content must be a string or an array of strings")
}

// --- Generic MessageCore để chứa các trường chung ---
// MessageCore giữ các trường chung của một tin nhắn, generic theo kiểu nội dung của nó.
type MessageCore[T any] struct {
	Content T      `json:"content"`
	Name    string `json:"name,omitempty"`
}

// --- Định nghĩa Interface Message chung ---
// Để InputPayload có thể chứa các loại tin nhắn khác nhau.
type Message interface {
	GetRole() string // Để có thể kiểm tra vai trò từ bên ngoài
	json.Marshaler
	json.Unmarshaler
}

// --- Các cấu trúc tin nhắn cụ thể với vai trò cố định và nhúng MessageCore ---

// DeveloperMessage đại diện cho một tin nhắn từ nhà phát triển.
type DeveloperMessage struct {
	MessageCore[string] // Nhúng MessageCore với Content là string
}

func (m DeveloperMessage) GetRole() string { return "developer" }

func (m DeveloperMessage) MarshalJSON() ([]byte, error) {
	aux := struct {
		Role string `json:"role"`
		MessageCore[string]
	}{
		Role:        "developer",
		MessageCore: m.MessageCore,
	}
	return json.Marshal(aux)
}

func (m *DeveloperMessage) UnmarshalJSON(data []byte) error {
	aux := struct {
		Role string `json:"role"`
		MessageCore[string]
	}{}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	if aux.Role != "developer" {
		return fmt.Errorf("expected role 'developer' for DeveloperMessage, got '%s'", aux.Role)
	}
	m.MessageCore = aux.MessageCore
	return nil
}

// SystemMessage đại diện cho một tin nhắn từ hệ thống.
type SystemMessage struct {
	MessageCore[FlexibleStringContent] // Nhúng MessageCore với Content là FlexibleStringContent
}

func (m SystemMessage) GetRole() string { return "system" }

func (m SystemMessage) MarshalJSON() ([]byte, error) {
	aux := struct {
		Role string `json:"role"`
		MessageCore[FlexibleStringContent]
	}{
		Role:        "system",
		MessageCore: m.MessageCore,
	}
	return json.Marshal(aux)
}

func (m *SystemMessage) UnmarshalJSON(data []byte) error {
	aux := struct {
		Role    string          `json:"role"`
		Content json.RawMessage `json:"content"` // Dùng RawMessage để xử lý FlexibleStringContent sau
		Name    string          `json:"name,omitempty"`
	}{}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	if aux.Role != "system" {
		return fmt.Errorf("expected role 'system' for SystemMessage, got '%s'", aux.Role)
	}
	// Unmarshal content vào FlexibleStringContent của MessageCore
	if err := json.Unmarshal(aux.Content, &m.Content); err != nil {
		return fmt.Errorf("failed to unmarshal SystemMessage content: %w", err)
	}
	m.Name = aux.Name // Gán lại name
	return nil
}

// UserMessage đại diện cho một tin nhắn từ người dùng.
type UserMessage struct {
	MessageCore[FlexibleStringContent] // Nhúng MessageCore với Content là FlexibleStringContent
}

func (m UserMessage) GetRole() string { return "user" }

func (m UserMessage) MarshalJSON() ([]byte, error) {
	aux := struct {
		Role string `json:"role"`
		MessageCore[FlexibleStringContent]
	}{
		Role:        "user",
		MessageCore: m.MessageCore,
	}
	return json.Marshal(aux)
}

func (m *UserMessage) UnmarshalJSON(data []byte) error {
	aux := struct {
		Role    string          `json:"role"`
		Content json.RawMessage `json:"content"` // Dùng RawMessage để xử lý FlexibleStringContent sau
		Name    string          `json:"name,omitempty"`
	}{}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	if aux.Role != "user" {
		return fmt.Errorf("expected role 'user' for UserMessage, got '%s'", aux.Role)
	}
	// Unmarshal content vào FlexibleStringContent của MessageCore
	if err := json.Unmarshal(aux.Content, &m.Content); err != nil {
		return fmt.Errorf("failed to unmarshal UserMessage content: %w", err)
	}
	m.Name = aux.Name // Gán lại name
	return nil
}

// --- Cấu trúc InputPayload ---

// StreamOptions chứa các tùy chọn cho hành vi streaming.
type StreamOptions struct {
	IncludeUsage bool `json:"include_usage"`
}

// InputPayload là cấu trúc cấp cao nhất đại diện cho toàn bộ body request JSON.
// Messages giờ đây là một slice của interface Message, cho phép chứa các loại tin nhắn khác nhau.
type InputPayload struct {
	Model         string         `json:"model"`
	Messages      []Message      `json:"messages"` // Slice of Message interface
	Temperature   *float64       `json:"temperature,omitempty"`
	Stream        *bool          `json:"stream,omitempty"`
	StreamOptions *StreamOptions `json:"stream_options,omitempty"`
}

// UnmarshalJSON cho InputPayload để xử lý các loại tin nhắn hỗn hợp.
func (p *InputPayload) UnmarshalJSON(data []byte) error {
	aux := struct {
		Model         string            `json:"model"`
		Messages      []json.RawMessage `json:"messages"`
		Temperature   *float64          `json:"temperature,omitempty"`
		Stream        *bool             `json:"stream,omitempty"`
		StreamOptions *StreamOptions    `json:"stream_options,omitempty"`
	}{}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	p.Model = aux.Model
	p.Temperature = aux.Temperature
	p.Stream = aux.Stream
	p.StreamOptions = aux.StreamOptions

	p.Messages = make([]Message, len(aux.Messages))
	for i, rawMsg := range aux.Messages {
		var temp struct {
			Role string `json:"role"`
		}
		if err := json.Unmarshal(rawMsg, &temp); err != nil {
			return fmt.Errorf("failed to determine role for message %d: %w", i, err)
		}

		switch temp.Role {
		case "developer":
			var msg DeveloperMessage
			if err := json.Unmarshal(rawMsg, &msg); err != nil {
				return fmt.Errorf("failed to unmarshal DeveloperMessage %d: %w", i, err)
			}
			p.Messages[i] = msg
		case "system":
			var msg SystemMessage
			if err := json.Unmarshal(rawMsg, &msg); err != nil {
				return fmt.Errorf("failed to unmarshal SystemMessage %d: %w", i, err)
			}
			p.Messages[i] = msg
		case "user":
			var msg UserMessage
			if err := json.Unmarshal(rawMsg, &msg); err != nil {
				return fmt.Errorf("failed to unmarshal UserMessage %d: %w", i, err)
			}
			p.Messages[i] = msg
		default:
			return fmt.Errorf("unsupported message role '%s' for message %d", temp.Role, i)
		}
	}
	return nil
}

// Hàm trợ giúp để tạo con trỏ cho các giá trị tùy chọn
func ptr[T any](v T) *T {
	return &v
}

func main() {
	// --- Ví dụ sử dụng DeveloperMessage ---
	devMsg := DeveloperMessage{
		MessageCore: MessageCore[string]{
			Content: "Execute function 'calculate_total'.",
			Name:    "my_dev_bot",
		},
	}
	fmt.Println("--- Developer Message ---")
	devJSON, _ := json.MarshalIndent(devMsg, "", "  ")
	fmt.Println(string(devJSON))
	var devMsgUnmarshal DeveloperMessage
	_ = json.Unmarshal(devJSON, &devMsgUnmarshal)
	fmt.Printf("Unmarshal check: Role=%s, Content=%s\n", devMsgUnmarshal.GetRole(), devMsgUnmarshal.Content)
	fmt.Println()

	// --- Ví dụ sử dụng SystemMessage (Content là string) ---
	sysMsgSingle := SystemMessage{
		MessageCore: MessageCore[FlexibleStringContent]{
			Content: NewFlexibleStringContent("Bạn là một trợ lý AI hữu ích."),
		},
	}
	fmt.Println("--- System Message (Content: single string) ---")
	sysSingleJSON, _ := json.MarshalIndent(sysMsgSingle, "", "  ")
	fmt.Println(string(sysSingleJSON))
	var sysMsgSingleUnmarshal SystemMessage
	_ = json.Unmarshal(sysSingleJSON, &sysMsgSingleUnmarshal)
	fmt.Printf("Unmarshal check: Role=%s, Content=%s\n", sysMsgSingleUnmarshal.GetRole(), sysMsgSingleUnmarshal.Content.Single)
	fmt.Println()

	// --- Ví dụ sử dụng UserMessage (Content là []string) ---
	userMsgArray := UserMessage{
		MessageCore: MessageCore[FlexibleStringContent]{
			Content: NewFlexibleStringContentArray([]string{"Hãy tóm tắt lịch sử của ngôn ngữ Go.", "Sau đó cho ví dụ về generics."}),
		},
	}
	fmt.Println("--- User Message (Content: array of strings) ---")
	userArrayJSON, _ := json.MarshalIndent(userMsgArray, "", "  ")
	fmt.Println(string(userArrayJSON))
	var userMsgArrayUnmarshal UserMessage
	_ = json.Unmarshal(userArrayJSON, &userMsgArrayUnmarshal)
	fmt.Printf("Unmarshal check: Role=%s, Content=%v\n", userMsgArrayUnmarshal.GetRole(), userMsgArrayUnmarshal.Content.Array)
	fmt.Println()

	// --- Ví dụ InputPayload với các loại tin nhắn hỗn hợp ---
	payloadMixedMessages := InputPayload{
		Model: "gpt-4o",
		Messages: []Message{
			devMsg,
			sysMsgSingle,
			userMsgArray,
			&UserMessage{ // Thêm một tin nhắn user khác
				MessageCore: MessageCore[FlexibleStringContent]{
					Content: NewFlexibleStringContent("Cảm ơn bạn!"),
					Name:    "Alice",
				},
			},
		},
		Temperature: ptr(0.5),
		Stream:      ptr(true),
		StreamOptions: &StreamOptions{
			IncludeUsage: true,
		},
	}
	fmt.Println("--- InputPayload với các loại tin nhắn hỗn hợp ---")
	payloadMixedJSON, _ := json.MarshalIndent(payloadMixedMessages, "", "  ")
	fmt.Println(string(payloadMixedJSON))
	fmt.Println()

	// --- Unmarshal một InputPayload với các loại tin nhắn hỗn hợp ---
	fmt.Println("--- Unmarshal InputPayload với các loại tin nhắn hỗn hợp ---")
	var unmarshaledPayload InputPayload
	err := json.Unmarshal(payloadMixedJSON, &unmarshaledPayload)
	if err != nil {
		fmt.Printf("Unmarshal error: %v\n", err)
	} else {
		fmt.Printf("Model: %s\n", unmarshaledPayload.Model)
		for i, msg := range unmarshaledPayload.Messages {
			fmt.Printf("  Message %d: Role=%s, Type=%T\n", i, msg.GetRole(), msg)
			// Để truy cập nội dung cụ thể, bạn có thể dùng type assertion
			switch m := msg.(type) {
			case DeveloperMessage:
				fmt.Printf("    Content: %s, Name: %s\n", m.Content, m.Name)
			case SystemMessage:
				if m.Content.isSingle {
					fmt.Printf("    Content: %s, Name: %s\n", m.Content.Single, m.Name)
				} else {
					fmt.Printf("    Content: %v, Name: %s\n", m.Content.Array, m.Name)
				}
			case UserMessage:
				if m.Content.isSingle {
					fmt.Printf("    Content: %s, Name: %s\n", m.Content.Single, m.Name)
				} else {
					fmt.Printf("    Content: %v, Name: %s\n", m.Content.Array, m.Name)
				}
			}
		}
	}
}
```

### **Phân tích thay đổi và ý nghĩa kỹ thuật:**

1.  **`MessageCore[T any]` (Generic Core Struct):**
    - Chúng ta tạo một cấu trúc generic `MessageCore[T any]` chỉ chứa các trường **chung và linh hoạt** (`Content T`, `Name string`).
    - Đây là nơi generic types phát huy tác dụng tốt nhất: tái sử dụng cấu trúc cho `Content` và `Name` mà không cần lặp lại định nghĩa cho mỗi loại tin nhắn.

2.  **Nhúng `MessageCore` vào các struct cụ thể:**
    - `DeveloperMessage` giờ đây nhúng `MessageCore[string]`.
    - `SystemMessage` và `UserMessage` nhúng `MessageCore[FlexibleStringContent]`.
    - Khi bạn nhúng một struct, các trường của struct được nhúng sẽ "nâng lên" cấp độ của struct cha. Điều này có nghĩa là bạn có thể truy cập `m.Content` hoặc `m.Name` trực tiếp từ `DeveloperMessage` thay vì `m.MessageCore.Content`.
    - Quan trọng hơn, khi `json.Marshal` hoạt động trên `DeveloperMessage`, nó sẽ tự động marshal các trường của `MessageCore[string]` mà không cần bạn phải làm gì thêm, miễn là chúng không bị che khuất bởi các trường trùng tên.

3.  **`MarshalJSON` và `UnmarshalJSON` tùy chỉnh vẫn cần thiết:**
    - Mặc dù `MessageCore` giúp giảm boilerplate cho `Content` và `Name`, nhưng để **cố định và xác thực trường `role`**, bạn _vẫn cần_ các phương thức `MarshalJSON` và `UnmarshalJSON` trên từng struct cụ thể (`DeveloperMessage`, `SystemMessage`, `UserMessage`).
    - **Trong `MarshalJSON`:** Chúng ta sử dụng một struct ẩn danh bao gồm trường `Role` với giá trị cố định và nhúng `MessageCore` đã được khởi tạo của tin nhắn hiện tại. Điều này đảm bảo `role` luôn được xuất ra đúng.
    - **Trong `UnmarshalJSON`:** Chúng ta đọc `role` và các trường khác vào một struct ẩn danh tạm thời. Sau đó, chúng ta kiểm tra `role` để đảm bảo nó khớp với giá trị mong đợi. Nếu khớp, chúng ta gán các trường đã đọc vào `MessageCore` của struct gốc. Đối với `FlexibleStringContent`, chúng ta vẫn cần đọc `Content` dưới dạng `json.RawMessage` và sau đó unmarshal riêng để tận dụng logic của `FlexibleStringContent`.

4.  **`InputPayload` và `[]Message`:**
    - Phần này không thay đổi so với giải pháp trước. `InputPayload` vẫn chứa `[]Message` (interface) và có `UnmarshalJSON` tùy chỉnh để phân loại và unmarshal từng tin nhắn dựa trên trường `role`.

**Tóm lại:**

- Bạn **không thể** dùng generic types để trực tiếp cố định giá trị của một trường (`role`) hoặc thay đổi hành vi `MarshalJSON`/`UnmarshalJSON` cho các bí danh kiểu.
- Bạn **có thể** dùng generic types (thông qua `MessageCore[T]`) để giảm sự trùng lặp trong định nghĩa các trường chung (`Content`, `Name`) cho các loại tin nhắn khác nhau.
- Để đạt được việc cố định và xác thực `role`, bạn **vẫn phải** viết các phương thức `MarshalJSON` và `UnmarshalJSON` tùy chỉnh cho từng kiểu tin nhắn cụ thể (`DeveloperMessage`, `SystemMessage`, `UserMessage`).
