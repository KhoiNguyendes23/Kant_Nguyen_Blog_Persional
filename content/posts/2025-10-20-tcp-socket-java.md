---
title: "TCP Socket trong Java: Xây dựng Client-Server đầu tiên"
description: "Tìm hiểu kiến thức nền tảng về TCP Socket trong Java, cách ServerSocket và Socket hoạt động, và kỹ thuật xử lý luồng I/O với ví dụ thực tế."
date: 2025-10-20
tags: ["Java", "Networking"]
series: "Lập trình mạng với Java"
---

🧠 **Tổng quan**

Trong lập trình mạng, giao thức TCP (Transmission Control Protocol) là nền tảng cho hầu hết các giao tiếp đáng tin cậy trên Internet, từ duyệt web (HTTP) đến gửi email (SMTP). TCP đảm bảo dữ liệu được gửi đi một cách tuần tự và không bị lỗi.

Trong Java, chúng ta sử dụng cặp đôi `ServerSocket` (phía máy chủ) và `Socket` (phía máy khách) để tạo ra một kết nối TCP. Máy chủ sẽ lắng nghe trên một **port** cụ thể, trong khi máy khách sẽ chủ động kết nối đến địa chỉ IP và port đó. Sau khi kết nối được thiết lập, hai bên có thể trao đổi dữ liệu qua các **luồng (streams)**.

Bài viết này sẽ hướng dẫn bạn xây dựng một ứng dụng Client-Server đơn giản: Client gửi tin nhắn từ bàn phím, và Server nhận rồi in ra màn hình.

---

💻 **Code mẫu**

#### `Server.java`

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.io.IOException;

public class SimpleTcpServer {
    public static void main(String[] args) {
        int port = 6868;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server đang lắng nghe trên port " + port);
            Socket clientSocket = serverSocket.accept();
            System.out.println("Client đã kết nối: " + clientSocket.getInetAddress().getHostAddress());

            try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter writer = new PrintWriter(clientSocket.getOutputStream(), true)
            ) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("Nhận từ client: " + line);
                    writer.println("Server đã nhận: " + line);
                }
            }
            System.out.println("Client đã ngắt kết nối.");
        } catch (IOException e) {
            System.err.println("Lỗi server: " + e.getMessage());
        }
    }
}
```

#### `Client.java`

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.io.IOException;

public class SimpleTcpClient {
    public static void main(String[] args) {
        String hostname = "localhost";
        int port = 6868;

        try (
            Socket socket = new Socket(hostname, port);
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader serverReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in))
        ) {
            System.out.println("Đã kết nối tới server. Nhập tin nhắn và nhấn Enter để gửi.");
            System.out.println("Nhập 'exit' để thoát.");
            String userInput;
            while (!"exit".equalsIgnoreCase(userInput = consoleReader.readLine())) {
                writer.println(userInput);
                System.out.println("Phản hồi từ server: " + serverReader.readLine());
            }
        } catch (IOException e) {
            System.err.println("Lỗi client: " + e.getMessage());
        }
        System.out.println("Đã ngắt kết nối.");
    }
}
```

✅ **Kết luận**

Bạn đã xây dựng thành công ứng dụng Client-Server cơ bản bằng TCP trong Java.
Tiếp theo: chúng ta sẽ nâng cấp nó thành Server đa luồng để phục vụ nhiều client đồng thời.
