---
title: "Sử dụng Java 11 HttpClient để làm việc với REST API"
description: "Hướng dẫn chi tiết cách dùng HttpClient, HttpRequest và HttpResponse trong Java 11 để gửi GET/POST, xử lý JSON và làm việc bất đồng bộ."
date: 2025-10-23
tags: ["Java", "Networking", "API", "Java 11"]
series: "Lập trình mạng với Java"
---

🧠 **Tổng quan**

Java 11 đã giới thiệu `HttpClient` API hiện đại, thay thế cho `HttpURLConnection` cũ kỹ. HttpClient hỗ trợ HTTP/2, async programming, và có API đơn giản hơn nhiều.

---

💻 **Code mẫu**

#### **GET Request cơ bản**

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.io.IOException;

public class HttpClientExample {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/posts/1"))
            .GET()
            .build();

        try {
            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

            System.out.println("Status: " + response.statusCode());
            System.out.println("Body: " + response.body());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

#### **POST Request với JSON**

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.io.IOException;

public class PostExample {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();

        String jsonData = """
            {
                "title": "Bài viết mới",
                "body": "Nội dung bài viết",
                "userId": 1
            }
            """;

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/posts"))
            .header("Content-Type", "application/json")
            .POST(BodyPublishers.ofString(jsonData))
            .build();

        try {
            HttpResponse<String> response = client.send(request,
                BodyHandlers.ofString());

            System.out.println("Status: " + response.statusCode());
            System.out.println("Response: " + response.body());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

#### **Async Request**

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.concurrent.CompletableFuture;

public class AsyncExample {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/posts"))
            .GET()
            .build();

        CompletableFuture<HttpResponse<String>> future =
            client.sendAsync(request, HttpResponse.BodyHandlers.ofString());

        future.thenAccept(response -> {
            System.out.println("Async Response: " + response.body());
        });

        // Chờ async request hoàn thành
        future.join();
    }
}
```

---

🔍 **Các tính năng nổi bật**

- **HTTP/2 Support**: Tự động sử dụng HTTP/2 khi server hỗ trợ
- **Async Programming**: Hỗ trợ CompletableFuture
- **Request/Response Interceptors**: Có thể customize request/response
- **Connection Pooling**: Tự động quản lý connection pool

---

💡 **Mẹo sử dụng**

1. **Reuse HttpClient**: Tạo một instance và dùng lại cho nhiều request
2. **Timeout**: Sử dụng `.timeout(Duration.ofSeconds(30))` để set timeout
3. **Headers**: Dùng `.header("Key", "Value")` để thêm custom headers
4. **Error Handling**: Luôn check `response.statusCode()` trước khi xử lý body

---

✅ **Kết luận**

HttpClient trong Java 11 là công cụ mạnh mẽ và hiện đại để làm việc với REST API.
Tiếp theo, chúng ta sẽ tìm hiểu về HTTPS và TLS để đảm bảo giao tiếp an toàn.
