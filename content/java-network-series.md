---
title: "Lập trình mạng với Java"
description: "Khám phá thế giới lập trình mạng trong Java – từ Socket cơ bản, đa luồng, UDP đến HTTP/HTTPS và REST API. Series giúp bạn làm chủ giao tiếp mạng ở cấp độ backend."
date: 2025-10-20
series: "Lập trình mạng với Java"
---

## 🎯 Giới thiệu

Series **Lập trình mạng với Java** giúp bạn nắm vững nền tảng của các giao thức mạng quan trọng và cách triển khai chúng bằng Java.  
Từ việc hiểu cơ chế **TCP, UDP**, đến việc tương tác với **REST API** và **bảo mật HTTPS/TLS**, bạn sẽ có đủ hành trang để xây dựng backend ứng dụng mạng mạnh mẽ.

**📚 Bao gồm:**

1. TCP Socket – Xây dựng Client-Server đầu tiên
2. TCP đa luồng – Chat server nhiều người dùng
3. UDP – Truyền dữ liệu nhanh và không kết nối
4. Java 11 HttpClient – Làm việc với REST API
5. HTTPS & TLS – Giao tiếp an toàn trên mạng

---

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
Client.java
java
Copy code
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
✅ Kết luận

Bạn đã xây dựng thành công ứng dụng Client-Server cơ bản bằng TCP trong Java.
Tiếp theo: chúng ta sẽ nâng cấp nó thành Server đa luồng để phục vụ nhiều client đồng thời.
title: "Xây dựng TCP Server đa luồng trong Java"
description: "Nâng cấp TCP Server để xử lý nhiều client cùng lúc bằng Thread. Giải quyết bài toán blocking I/O hiệu quả cho ứng dụng mạng."
date: 2025-10-21
tags: ["Java", "Networking", "Multithreading"]
series: "Lập trình mạng với Java"
🧠 Tổng quan

Ở bài trước, server chỉ phục vụ được một client tại một thời điểm.
Bây giờ, chúng ta sẽ sử dụng đa luồng (multithreading) để server có thể phục vụ nhiều client cùng lúc.

💻 Code mẫu

MultiThreadedTcpServer.java
java
Copy code
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class MultiThreadedTcpServer {
    private static final int PORT = 6868;
    private static List<ClientHandler> clients = new ArrayList<>();

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Chat Server đang lắng nghe trên port " + PORT);
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client mới đã kết nối: " + clientSocket);
                ClientHandler clientThread = new ClientHandler(clientSocket, clients);
                clients.add(clientThread);
                new Thread(clientThread).start();
            }
        } catch (IOException e) {
            System.err.println("Lỗi Server: " + e.getMessage());
        }
    }
}
ClientHandler.java
java
Copy code
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.List;

class ClientHandler implements Runnable {
    private Socket clientSocket;
    private List<ClientHandler> clients;
    private PrintWriter writer;
    private BufferedReader reader;

    public ClientHandler(Socket socket, List<ClientHandler> clients) {
        try {
            this.clientSocket = socket;
            this.clients = clients;
            this.reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            this.writer = new PrintWriter(clientSocket.getOutputStream(), true);
        } catch (IOException e) {
            System.err.println("Lỗi ClientHandler: " + e.getMessage());
        }
    }

    @Override
    public void run() {
        try {
            String message;
            while ((message = reader.readLine()) != null) {
                System.out.println("Nhận từ " + clientSocket.getRemoteSocketAddress() + ": " + message);
                broadcast(message);
            }
        } catch (IOException e) {
            System.out.println("Client đã ngắt kết nối: " + clientSocket.getRemoteSocketAddress());
        } finally {
            try {
                clients.remove(this);
                clientSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void broadcast(String message) {
        for (ClientHandler client : clients) {
            if (client != this) {
                client.writer.println(clientSocket.getInetAddress().getHostName() + ": " + message);
            }
        }
    }
}
✅ Kết luận

Giờ đây server của bạn có thể phục vụ nhiều client song song.
Ở bài tiếp theo, chúng ta sẽ làm việc với UDP để hiểu sự khác biệt giữa TCP và UDP.
title: "Lập trình mạng với UDP và DatagramSocket trong Java"
description: "Khám phá giao thức UDP không kết nối qua DatagramSocket và DatagramPacket. So sánh sự khác biệt cốt lõi giữa UDP và TCP."
date: 2025-10-22
tags: ["Java", "Networking", "UDP"]
series: "Lập trình mạng với Java"
(nội dung bài UDP, DatagramSocket, DatagramPacket, so sánh TCP/UDP — như bạn đã gửi đầy đủ ở trên)

title: "Sử dụng Java 11 HttpClient để làm việc với REST API"
description: "Hướng dẫn chi tiết cách dùng HttpClient, HttpRequest và HttpResponse trong Java 11 để gửi GET/POST, xử lý JSON và làm việc bất đồng bộ."
date: 2025-10-23
tags: ["Java", "Networking", "API", "Java 11"]
series: "Lập trình mạng với Java"
(nội dung bài HttpClient – bạn đã gửi, tôi giữ nguyên format code, giải thích, mẹo)

title: "HTTPS và TLS trong Java: Giao tiếp an toàn"
description: "Tìm hiểu HTTPS và TLS/SSL trong bảo mật giao tiếp mạng. Hướng dẫn gửi request HTTPS bằng Java HttpClient và các lưu ý về chứng chỉ."
date: 2025-10-24
tags: ["Java", "Networking", "Security", "HTTPS"]
series: "Lập trình mạng với Java"
(nội dung bài HTTPS/TLS – handshake, TrustStore, hostname verification, kết luận)
```
