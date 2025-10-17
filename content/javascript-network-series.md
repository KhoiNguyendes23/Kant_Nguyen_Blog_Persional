---
title: "Lập trình mạng với JavaScript"
description: "Khám phá các kỹ thuật lập trình mạng hiện đại trong JavaScript — từ Fetch API, WebSocket đến Service Worker và DevTools Network."
date: 2025-10-25
series: "Lập trình mạng với JavaScript"
---

## 🎯 Giới thiệu

Series **Lập trình mạng với JavaScript** sẽ đưa bạn từ những thao tác cơ bản như gọi API bằng `fetch()` cho đến các kỹ thuật cao cấp như **AbortController**, **WebSocket realtime**, và **Service Worker offline-first**.  
Bạn sẽ hiểu rõ cách web “nói chuyện” với mạng, và làm chủ những công cụ giúp bạn debug và tối ưu hóa hiệu năng.

**📚 Bao gồm:**

1. Fetch API & AbortController
2. WebSocket – Chat realtime
3. Service Worker & Cache API
4. DevTools Network – Phân tích API & hiệu năng

---

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
Đây là lúc cần đến **AbortController** để “ngắt” request giữa chừng, tiết kiệm tài nguyên và tránh lỗi UI.

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
🔍 Giải thích
AbortController tạo ra một tín hiệu điều khiển (signal), truyền vào fetch().

Khi gọi controller.abort(), request sẽ dừng ngay lập tức.

Nếu bạn đặt setTimeout, bạn có thể tạo request timeout tùy ý.

🧩 Mẹo debug nhanh
Dùng tab Network trong DevTools → chọn request → kiểm tra Status (canceled nếu bị hủy).

Dùng console.time() / console.timeEnd() để đo thời gian thực thi.

Thử API chậm (ví dụ https://httpstat.us/200?sleep=5000) để test timeout.

✅ Kết luận
Fetch + AbortController là cặp đôi quan trọng khi bạn muốn tối ưu UI/UX, nhất là trong SPA hoặc dashboard có nhiều API chạy song song.
Ở bài kế tiếp, ta sẽ dùng WebSocket để tạo kết nối hai chiều realtime.

title: "Xây dựng ứng dụng Chat Realtime với WebSocket"
description: "Tìm hiểu giao thức WebSocket để giao tiếp hai chiều thời gian thực giữa client và server. Hướng dẫn tạo ứng dụng chat mini bằng Node.js."
date: 2025-10-26
tags: ["JavaScript", "Networking", "WebSocket", "Node.js"]
series: "Lập trình mạng với JavaScript"
🧠 Giới thiệu
HTTP chỉ cho phép client gửi yêu cầu trước.
Nếu bạn muốn hai chiều realtime — ví dụ chat, thông báo, game online — thì cần đến WebSocket.

💻 Cấu trúc ứng dụng
pgsql
Copy code
chat-app/
├── server.js
└── index.html
🖥 server.js (Node.js + ws)
javascript
Copy code
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", ws => {
  console.log("Client connected");
  ws.on("message", msg => {
    console.log("Received:", msg.toString());
    // gửi lại cho tất cả client
    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(msg.toString());
    });
  });
});
console.log("✅ Server WebSocket chạy tại ws://localhost:8080");
💬 index.html
html
Copy code
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Realtime Chat</title></head>
<body>
  <h3>💬 Chat Realtime</h3>
  <div id="messages"></div>
  <input id="msg" placeholder="Nhập tin nhắn..." autofocus>
  <script>
    const ws = new WebSocket("ws://localhost:8080");
    const msgBox = document.getElementById("msg");
    const messages = document.getElementById("messages");

    ws.onmessage = (e) => {
      const p = document.createElement("p");
      p.textContent = e.data;
      messages.appendChild(p);
    };

    msgBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        ws.send(msgBox.value);
        msgBox.value = "";
      }
    });
  </script>
</body>
</html>
🔍 Giải thích
WebSocket tạo kết nối giữ nguyên giữa client và server.

Server có thể gửi tin nhắn bất kỳ lúc nào (push).

wss.clients cho phép broadcast tới tất cả người dùng.

🧩 Mẹo debug
Dùng tab Network → WS trong Chrome để xem frame gửi/nhận.

Khi mất mạng, onclose sẽ gọi: có thể viết reconnect logic (setTimeout(connect, 2000)).

✅ Kết luận
WebSocket mở ra nền tảng cho các ứng dụng realtime: chat, bảng điều khiển trực tiếp, giám sát, game.
Tiếp theo, ta sẽ học cách làm ứng dụng Offline-First với Service Worker.

title: "Service Worker và Cache API: Xây dựng ứng dụng Offline-First"
description: "Tìm hiểu cách Service Worker hoạt động như proxy phía client và Cache API giúp ứng dụng web chạy offline mượt mà."
date: 2025-10-27
tags: ["JavaScript", "Networking", "PWA", "Service Worker"]
series: "Lập trình mạng với JavaScript"
🧠 Giới thiệu
Khi bạn vào một website mà vẫn chạy được dù mất mạng,
đó là nhờ Service Worker – một script hoạt động nền, đứng giữa trình duyệt và server, cho phép intercept và cache các request.

💻 Code mẫu cơ bản
sw.js
javascript
Copy code
const CACHE_NAME = "v1-cache";
const URLS = ["/", "/index.html", "/app.js", "/style.css"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
app.js
javascript
Copy code
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("✅ Service Worker đã đăng ký");
  });
}
🔍 Giải thích
Khi install, SW cache sẵn file tĩnh.

Khi người dùng offline, fetch sẽ lấy từ cache.

Dữ liệu động (API) có thể dùng cache chiến lược khác như stale-while-revalidate.

🧩 Mẹo kiểm thử
Dùng DevTools → Application → Service Workers → tick “Offline”.

Reload trang, nếu vẫn chạy là SW hoạt động đúng.

✅ Kết luận
Service Worker giúp web app nhanh hơn, ổn định và hoạt động ngay cả khi mất mạng — nền tảng của Progressive Web App (PWA).

title: "Phân tích và gỡ lỗi API với tab Network của DevTools"
description: "Hướng dẫn sử dụng tab Network trong công cụ phát triển trình duyệt để kiểm tra, phân tích và tối ưu các request API."
date: 2025-10-28
tags: ["JavaScript", "Networking", "Debugging", "DevTools"]
series: "Lập trình mạng với JavaScript"
🧠 Giới thiệu
Nếu bạn làm việc với API mà không biết tab Network trong DevTools,
thì bạn đang bỏ lỡ một trong những công cụ debug mạnh nhất của lập trình web.

🔍 Những phần chính trong tab Network
Mục	Ý nghĩa
Name	Tên file/request
Status	Mã phản hồi HTTP
Type	Loại tài nguyên (xhr, fetch, js, img...)
Initiator	Ai gọi request
Time	Thời gian xử lý
Waterfall	Biểu đồ thời gian chi tiết

💡 Ví dụ thực tế
Gọi API trong JS:

javascript
Copy code
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then(res => res.json())
  .then(console.log);
Mở DevTools → tab Network

Chọn request → xem Headers, Response, Timing
→ Bạn sẽ thấy toàn bộ vòng đời của request.

🧩 Mẹo debug
Dùng Copy → Copy as cURL để test API trong terminal.

Kiểm tra lỗi CORS ở phần Headers → Response headers.

Dùng filter -method:OPTIONS để ẩn preflight requests.

✅ Kết luận
Hiểu tab Network giúp bạn không chỉ debug tốt hơn mà còn tối ưu hiệu năng web.
Kết thúc series này, bạn đã nắm trọn chuỗi kỹ thuật mạng trong JavaScript — từ gọi API, realtime, offline cho đến phân tích.
```
