---
title: "Phân tích và gỡ lỗi API với tab Network của DevTools"
description: "Hướng dẫn sử dụng tab Network trong công cụ phát triển trình duyệt để kiểm tra, phân tích và tối ưu các request API."
date: 2025-10-28
tags: ["JavaScript", "Networking", "Debugging", "DevTools"]
series: "Lập trình mạng với JavaScript"
---

🧠 **Giới thiệu**

Nếu bạn làm việc với API mà không biết tab Network trong DevTools,
thì bạn đang bỏ lỡ một trong những công cụ debug mạnh nhất của lập trình web.

---

🔍 **Những phần chính trong tab Network**

| Mục       | Ý nghĩa                                  |
| --------- | ---------------------------------------- |
| Name      | Tên file/request                         |
| Status    | Mã phản hồi HTTP                         |
| Type      | Loại tài nguyên (xhr, fetch, js, img...) |
| Initiator | Ai gọi request                           |
| Time      | Thời gian xử lý                          |
| Waterfall | Biểu đồ thời gian chi tiết               |

---

💡 **Ví dụ thực tế**

Gọi API trong JS:

```javascript
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((res) => res.json())
  .then(console.log);
```

Mở DevTools → tab Network

Chọn request → xem Headers, Response, Timing
→ Bạn sẽ thấy toàn bộ vòng đời của request.

---

🧩 **Mẹo debug**

- Dùng Copy → Copy as cURL để test API trong terminal.
- Kiểm tra lỗi CORS ở phần Headers → Response headers.
- Dùng filter -method:OPTIONS để ẩn preflight requests.

---

✅ **Kết luận**

Hiểu tab Network giúp bạn không chỉ debug tốt hơn mà còn tối ưu hiệu năng web.
Kết thúc series này, bạn đã nắm trọn chuỗi kỹ thuật mạng trong JavaScript — từ gọi API, realtime, offline cho đến phân tích.
