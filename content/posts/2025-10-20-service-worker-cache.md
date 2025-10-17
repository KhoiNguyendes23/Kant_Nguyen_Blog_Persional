---
title: "Service Worker và Cache API: Xây dựng ứng dụng Offline-First"
description: "Tìm hiểu cách Service Worker hoạt động như proxy phía client và Cache API giúp ứng dụng web chạy offline mượt mà."
date: 2025-10-27
tags: ["JavaScript", "Networking", "PWA", "Service Worker"]
series: "Lập trình mạng với JavaScript"
---

🧠 **Giới thiệu**

Khi bạn vào một website mà vẫn chạy được dù mất mạng,
đó là nhờ Service Worker – một script hoạt động nền, đứng giữa trình duyệt và server, cho phép intercept và cache các request.

---

💻 **Code mẫu cơ bản**

#### `sw.js`

```javascript
const CACHE_NAME = "v1-cache";
const URLS = ["/", "/index.html", "/app.js", "/style.css"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
```

#### `app.js`

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("✅ Service Worker đã đăng ký");
  });
}
```

### 🔍 Giải thích

- Khi install, SW cache sẵn file tĩnh.
- Khi người dùng offline, fetch sẽ lấy từ cache.
- Dữ liệu động (API) có thể dùng cache chiến lược khác như stale-while-revalidate.

### 🧩 Mẹo kiểm thử

- Dùng DevTools → Application → Service Workers → tick "Offline".
- Reload trang, nếu vẫn chạy là SW hoạt động đúng.

### ✅ Kết luận

Service Worker giúp web app nhanh hơn, ổn định và hoạt động ngay cả khi mất mạng — nền tảng của Progressive Web App (PWA).
