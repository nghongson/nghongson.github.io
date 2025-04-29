CrowdSec là một hệ thống bảo mật nguồn mở, phát hiện xâm nhập dựa trên hành vi. "Scenarios" (kịch bản) trong CrowdSec định nghĩa các hành vi đáng ngờ mà hệ thống sẽ phát hiện. Việc kiểm tra (test) các scenarios là rất quan trọng để đảm bảo chúng hoạt động chính xác và phát hiện được các mối đe dọa mong muốn. Dưới đây là các bước và phương pháp để kiểm tra scenarios trong CrowdSec:

**1. Hiểu cấu trúc của một Scenario:**

Một scenario trong CrowdSec được viết bằng YAML và bao gồm các phần chính:

- **`description`:** Mô tả ngắn gọn về scenario.
- **`filter`:** Bộ lọc để chọn các sự kiện (events) cần xử lý. Sử dụng ngôn ngữ biểu thức của CrowdSec.
- **`groupby`:** Định nghĩa cách nhóm các sự kiện để đếm (ví dụ: theo IP nguồn, user).
- **`expression`:** Biểu thức logic để xác định khi nào một hành vi được coi là đáng ngờ (khi số lượng sự kiện vượt quá một ngưỡng nào đó trong một khoảng thời gian nhất định).
- **`name`:** Tên của scenario.
- **`parsers`:** Danh sách các parser được sử dụng bởi scenario.

**Ví dụ một Scenario (ssh-bf.yaml - Brute Force SSH):**

```yaml
name: crowdsecurity/ssh-bf
description: Detect brute force attacks on SSH
filter: evt.Meta.log_type == 'ssh' && evt.Parsed.ssh_auth_method == 'password'
groupby: evt.Meta.source_ip
expression: evt.Counter > 4
duration: 10m
parsers:
  - crowdsecurity/syslog-logs
  - crowdsecurity/ssh-logs
```

Scenario này phát hiện tấn công brute force vào SSH bằng cách đếm số lần đăng nhập thất bại bằng mật khẩu từ cùng một IP nguồn trong vòng 10 phút. Nếu số lần thất bại vượt quá 4, scenario sẽ được kích hoạt.

**2. Tạo môi trường kiểm tra cục bộ:**

Để kiểm tra scenarios, bạn nên tạo một môi trường kiểm tra cục bộ để tránh ảnh hưởng đến hệ thống production.

- **Clone Hub:** Clone repository chứa các scenarios, parsers và bouncers của CrowdSec:

  ```bash
  git clone https://github.com/crowdsecurity/hub.git
  ```

- **Tạo test:** Từ thư mục gốc của hub:

  ```bash
  cscli hubtest create <tên_test> --type syslog --ignore-parsers
  ```

  Ví dụ:

  ```bash
  cscli hubtest create myservice-bf --type syslog --ignore-parsers
  ```

  Lệnh này sẽ tạo một thư mục test tại `hub/.tests/<tên_test>` với các file sau:

  - `<tên_test>.log`: File log để bạn thêm các log mẫu.
  - `parser.assert`: File để kiểm tra parser (bạn có thể bỏ qua nếu dùng `--ignore-parsers`).
  - `scenario.assert`: File để kiểm tra scenario.
  - `config.yaml`: File cấu hình cho test.

**3. Cấu hình test:**

Trong file `config.yaml`, bạn cần thêm parser và scenario mà bạn muốn kiểm tra.

**Ví dụ `config.yaml`:**

```yaml
parsers:
  - crowdsecurity/syslog-logs
  - crowdsecurity/ssh-logs
scenarios:
  - crowdsecurity/ssh-bf
```

**4. Chuẩn bị log mẫu:**

Thêm các log mẫu vào file `<tên_test>.log` để mô phỏng các sự kiện.

**Ví dụ `<tên_test>.log` (mô phỏng tấn công brute force SSH):**

```
Dec  8 06:28:40 mymachine sshd[1234]: Failed password for invalid user test from 1.2.3.4 port 50000 ssh2
Dec  8 06:28:41 mymachine sshd[1235]: Failed password for root from 1.2.3.4 port 50001 ssh2
Dec  8 06:28:42 mymachine sshd[1236]: Failed password for user user1 from 1.2.3.4 port 50002 ssh2
Dec  8 06:28:43 mymachine sshd[1237]: Failed password for user admin from 1.2.3.4 port 50003 ssh2
Dec  8 06:28:44 mymachine sshd[1238]: Failed password for illegal user test2 from 1.2.3.4 port 50004 ssh2
```

**5. Viết assertions (kiểm định):**

Trong file `scenario.assert`, bạn định nghĩa các kiểm định để xác minh rằng scenario hoạt động như mong đợi.

**Ví dụ `scenario.assert`:**

```yaml
# Kiểm tra xem có 1 quyết định (decision) được tạo ra cho IP 1.2.3.4
- alert:
    source_ip: 1.2.3.4
    scenario: crowdsecurity/ssh-bf
    expected_count: 1
```

**6. Chạy test:**

Từ thư mục gốc của hub:

```bash
cscli hubtest run <tên_test>
```

Ví dụ:

```bash
cscli hubtest run myservice-bf
```

Lệnh này sẽ chạy test và so sánh kết quả với các assertions trong file `scenario.assert`. Nếu tất cả các kiểm định đều đúng, test sẽ thành công.

**7. Các lệnh `cscli` hữu ích:**

- `cscli scenarios list`: Liệt kê tất cả các scenarios đã được cài đặt.
- `cscli scenarios inspect <tên_scenario>`: Xem chi tiết về một scenario.
- `cscli parsers list`: Liệt kê tất cả các parsers đã được cài đặt.
- `cscli parsers inspect <tên_parser>`: Xem chi tiết về một parser.

**8. Mẹo và lưu ý:**

- **Kiểm tra từng bước:** Bắt đầu bằng cách kiểm tra parser trước khi kiểm tra scenario.
- **Log mẫu đa dạng:** Sử dụng các log mẫu đa dạng để kiểm tra scenario trong nhiều tình huống khác nhau.
- **Assertions cụ thể:** Viết các assertions cụ thể để kiểm tra các khía cạnh khác nhau của scenario.
- **Sử dụng `--debug`:** Sử dụng tùy chọn `--debug` với lệnh `cscli` để xem thông tin chi tiết về quá trình xử lý.

Bằng cách tuân theo các bước trên, bạn có thể kiểm tra scenarios của CrowdSec một cách hiệu quả và đảm bảo hệ thống bảo mật của bạn hoạt động tốt. Hãy nhớ tham khảo tài liệu chính thức của CrowdSec để biết thêm chi tiết: [https://docs.crowdsec.net/](https://docs.crowdsec.net/)
