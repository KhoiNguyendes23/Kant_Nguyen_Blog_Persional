---
title: "Xây dựng ứng dụng Chat Realtime với WebSocket"
description: "Tìm hiểu giao thức WebSocket để giao tiếp hai chiều thời gian thực giữa client và server. Hướng dẫn tạo ứng dụng chat mini bằng Node.js."
date: 2025-10-26
tags: ["JavaScript", "Networking", "WebSocket", "Node.js"]
series: "Lập trình mạng với JavaScript"
---

🧠 **Giới thiệu**

HTTP chỉ cho phép client gửi yêu cầu trước.
Nếu bạn muốn hai chiều realtime — ví dụ chat, thông báo, game online — thì cần đến WebSocket.

---

💻 **Cấu trúc ứng dụng**

```
chat-app/
├── server.js
└── index.html
```

🖥 **server.js (Node.js + ws)**

```javascript
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    // gửi lại cho tất cả client
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(msg.toString());
    });
  });
});
console.log("✅ Server WebSocket chạy tại ws://localhost:8080");
```

💬 **index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Realtime Chat</title>
  </head>
  <body>
    <h3>💬 Chat Realtime</h3>
    <div id="messages"></div>
    <input id="msg" placeholder="Nhập tin nhắn..." autofocus />
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
```

### 🔍 Giải thích

- WebSocket tạo kết nối giữ nguyên giữa client và server.
- Server có thể gửi tin nhắn bất kỳ lúc nào (push).
- wss.clients cho phép broadcast tới tất cả người dùng.

### 🧩 Mẹo debug

- Dùng tab Network → WS trong Chrome để xem frame gửi/nhận.
- Khi mất mạng, onclose sẽ gọi: có thể viết reconnect logic (setTimeout(connect, 2000)).

### ✅ Kết luận

WebSocket mở ra nền tảng cho các ứng dụng realtime: chat, bảng điều khiển trực tiếp, giám sát, game.
Tiếp theo, ta sẽ học cách làm ứng dụng Offline-First với Service Worker.
