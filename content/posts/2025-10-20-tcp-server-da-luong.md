---
title: "Xây dựng TCP Server đa luồng trong Java"
description: "Nâng cấp TCP Server để xử lý nhiều client cùng lúc bằng Thread. Giải quyết bài toán blocking I/O hiệu quả cho ứng dụng mạng."
date: 2025-10-21
tags: ["Java", "Networking", "Multithreading"]
series: "Lập trình mạng với Java"
---

🧠 **Tổng quan**

Ở bài trước, server chỉ phục vụ được một client tại một thời điểm.
Bây giờ, chúng ta sẽ sử dụng đa luồng (multithreading) để server có thể phục vụ nhiều client cùng lúc.

---

💻 **Code mẫu**

#### `MultiThreadedTcpServer.java`

```java
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
```

#### `ClientHandler.java`

```java
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
```

✅ **Kết luận**

Giờ đây server của bạn có thể phục vụ nhiều client song song.
Ở bài tiếp theo, chúng ta sẽ làm việc với UDP để hiểu sự khác biệt giữa TCP và UDP.
