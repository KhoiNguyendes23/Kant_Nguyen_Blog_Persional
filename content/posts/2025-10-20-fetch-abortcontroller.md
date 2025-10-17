---
title: "JavaScript Fetch API và AbortController: Quản lý và hủy Request"
description: "Sử dụng Fetch API để gọi API hiện đại trong JavaScript, kết hợp AbortController để hủy request và quản lý timeout hiệu quả."
date: 2025-10-25
tags: ["JavaScript", "Networking", "API"]
series: "Lập trình mạng với JavaScript"
---

### 🧠 Giới thiệu

`fetch()` là cách hiện đại và linh hoạt nhất để gọi API trong JavaScript.  
Nhưng bạn có biết — nếu server phản hồi chậm, hoặc người dùng rời trang giữa chừng, request đó vẫn tiếp tục chạy ngầm?  
Đây là lúc cần đến **AbortController** để "ngắt" request giữa chừng, tiết kiệm tài nguyên và tránh lỗi UI.

---

### 💻 Ví dụ: Gọi API với timeout

```javascript
// Hàm fetch có timeout
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("✅ Dữ liệu nhận được:", data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("⚠️ Request bị hủy do quá thời gian!");
    } else {
      console.error("❌ Lỗi:", err.message);
    }
  }
}

fetchWithTimeout("https://jsonplaceholder.typicode.com/todos/1", 3000);
```

### 🔍 Giải thích

- AbortController tạo ra một tín hiệu điều khiển (signal), truyền vào fetch().
- Khi gọi controller.abort(), request sẽ dừng ngay lập tức.
- Nếu bạn đặt setTimeout, bạn có thể tạo request timeout tùy ý.

### 🧩 Mẹo debug nhanh

- Dùng tab Network trong DevTools → chọn request → kiểm tra Status (canceled nếu bị hủy).
- Dùng console.time() / console.timeEnd() để đo thời gian thực thi.
- Thử API chậm (ví dụ https://httpstat.us/200?sleep=5000) để test timeout.

### ✅ Kết luận

Fetch + AbortController là cặp đôi quan trọng khi bạn muốn tối ưu UI/UX, nhất là trong SPA hoặc dashboard có nhiều API chạy song song.
Ở bài kế tiếp, ta sẽ dùng WebSocket để tạo kết nối hai chiều realtime.
