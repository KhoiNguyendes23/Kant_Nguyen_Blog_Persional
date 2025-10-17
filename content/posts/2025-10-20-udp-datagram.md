---
title: "Lập trình mạng với UDP và DatagramSocket trong Java"
description: "Khám phá giao thức UDP không kết nối qua DatagramSocket và DatagramPacket. So sánh sự khác biệt cốt lõi giữa UDP và TCP."
date: 2025-10-22
tags: ["Java", "Networking", "UDP"]
series: "Lập trình mạng với Java"
---

🧠 **Tổng quan**

UDP (User Datagram Protocol) là giao thức không kết nối, nhanh hơn TCP nhưng không đảm bảo độ tin cậy. UDP phù hợp cho các ứng dụng cần tốc độ cao như streaming, gaming, hoặc DNS lookup.

Trong Java, chúng ta sử dụng `DatagramSocket` và `DatagramPacket` để làm việc với UDP.

---

💻 **Code mẫu**

#### `UdpServer.java`

```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpServer {
    public static void main(String[] args) {
        int port = 6868;
        try (DatagramSocket socket = new DatagramSocket(port)) {
            System.out.println("UDP Server đang lắng nghe trên port " + port);

            byte[] buffer = new byte[1024];
            while (true) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);

                String message = new String(packet.getData(), 0, packet.getLength());
                System.out.println("Nhận từ " + packet.getAddress() + ": " + message);

                // Echo lại cho client
                String response = "Server nhận được: " + message;
                byte[] responseBytes = response.getBytes();
                DatagramPacket responsePacket = new DatagramPacket(
                    responseBytes,
                    responseBytes.length,
                    packet.getAddress(),
                    packet.getPort()
                );
                socket.send(responsePacket);
            }
        } catch (IOException e) {
            System.err.println("Lỗi UDP Server: " + e.getMessage());
        }
    }
}
```

#### `UdpClient.java`

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpClient {
    public static void main(String[] args) {
        String hostname = "localhost";
        int port = 6868;

        try (
            DatagramSocket socket = new DatagramSocket();
            BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in))
        ) {
            InetAddress serverAddress = InetAddress.getByName(hostname);
            System.out.println("UDP Client đã khởi tạo. Nhập tin nhắn và nhấn Enter để gửi.");
            System.out.println("Nhập 'exit' để thoát.");

            String userInput;
            while (!"exit".equalsIgnoreCase(userInput = consoleReader.readLine())) {
                // Gửi tin nhắn
                byte[] messageBytes = userInput.getBytes();
                DatagramPacket sendPacket = new DatagramPacket(
                    messageBytes,
                    messageBytes.length,
                    serverAddress,
                    port
                );
                socket.send(sendPacket);

                // Nhận phản hồi
                byte[] buffer = new byte[1024];
                DatagramPacket receivePacket = new DatagramPacket(buffer, buffer.length);
                socket.receive(receivePacket);

                String response = new String(receivePacket.getData(), 0, receivePacket.getLength());
                System.out.println("Phản hồi từ server: " + response);
            }
        } catch (IOException e) {
            System.err.println("Lỗi UDP Client: " + e.getMessage());
        }
        System.out.println("Đã ngắt kết nối.");
    }
}
```

---

🔍 **So sánh TCP vs UDP**

| Đặc điểm       | TCP                              | UDP                            |
| -------------- | -------------------------------- | ------------------------------ |
| **Kết nối**    | Có kết nối (connection-oriented) | Không kết nối (connectionless) |
| **Độ tin cậy** | Đảm bảo dữ liệu đến đúng thứ tự  | Không đảm bảo                  |
| **Tốc độ**     | Chậm hơn do overhead             | Nhanh hơn                      |
| **Sử dụng**    | HTTP, FTP, Email                 | DNS, Gaming, Streaming         |

---

✅ **Kết luận**

UDP phù hợp khi bạn cần tốc độ cao và có thể chấp nhận mất một số gói tin.
Tiếp theo, chúng ta sẽ học cách sử dụng Java 11 HttpClient để làm việc với REST API.
