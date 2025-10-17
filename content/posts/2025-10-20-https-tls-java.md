---
title: "HTTPS và TLS trong Java: Giao tiếp an toàn"
description: "Tìm hiểu HTTPS và TLS/SSL trong bảo mật giao tiếp mạng. Hướng dẫn gửi request HTTPS bằng Java HttpClient và các lưu ý về chứng chỉ."
date: 2025-10-24
tags: ["Java", "Networking", "Security", "HTTPS"]
series: "Lập trình mạng với Java"
---

🧠 **Tổng quan**

HTTPS (HTTP Secure) là phiên bản bảo mật của HTTP, sử dụng TLS/SSL để mã hóa dữ liệu truyền tải. Điều này đảm bảo:

- **Confidentiality**: Dữ liệu được mã hóa
- **Integrity**: Dữ liệu không bị thay đổi
- **Authentication**: Xác thực danh tính server

---

💻 **Code mẫu**

#### **HTTPS Request cơ bản**

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.io.IOException;

public class HttpsExample {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newBuilder()
            .build();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.github.com/users/octocat"))
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

#### **Custom SSL Context (cho self-signed certificates)**

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import java.io.IOException;

public class CustomSslExample {
    public static void main(String[] args) {
        try {
            // Tạo TrustManager chấp nhận tất cả certificates (CHỈ DÙNG CHO TEST!)
            TrustManager[] trustAllCerts = new TrustManager[] {
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                    public void checkServerTrusted(X509Certificate[] certs, String authType) { }
                }
            };

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            HttpClient client = HttpClient.newBuilder()
                .sslContext(sslContext)
                .build();

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://self-signed.badssl.com/"))
                .GET()
                .build();

            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

            System.out.println("Status: " + response.statusCode());
            System.out.println("Body: " + response.body());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### **HTTPS với Client Certificate**

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import javax.net.ssl.SSLContext;
import javax.net.ssl.KeyManagerFactory;
import java.security.KeyStore;
import java.io.FileInputStream;
import java.io.IOException;

public class ClientCertExample {
    public static void main(String[] args) {
        try {
            // Load client certificate
            KeyStore keyStore = KeyStore.getInstance("PKCS12");
            keyStore.load(new FileInputStream("client-cert.p12"), "password".toCharArray());

            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
            kmf.init(keyStore, "password".toCharArray());

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(kmf.getKeyManagers(), null, null);

            HttpClient client = HttpClient.newBuilder()
                .sslContext(sslContext)
                .build();

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.secure-server.com/data"))
                .GET()
                .build();

            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

            System.out.println("Status: " + response.statusCode());
            System.out.println("Body: " + response.body());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

🔍 **TLS Handshake Process**

1. **Client Hello**: Client gửi supported cipher suites
2. **Server Hello**: Server chọn cipher suite và gửi certificate
3. **Certificate Verification**: Client verify server certificate
4. **Key Exchange**: Trao đổi symmetric key
5. **Finished**: Bắt đầu giao tiếp mã hóa

---

⚠️ **Lưu ý bảo mật**

- **Không bao giờ** disable certificate verification trong production
- Sử dụng **HTTPS** cho tất cả API calls
- Kiểm tra **certificate validity** và **hostname verification**
- Cập nhật **TLS version** thường xuyên

---

💡 **Mẹo debug**

1. **Enable SSL Debug**: `-Djavax.net.ssl.debug=all`
2. **Check Certificate**: Dùng `openssl s_client -connect host:port`
3. **Verify Chain**: Kiểm tra certificate chain trong browser

---

✅ **Kết luận**

HTTPS và TLS là nền tảng bảo mật cho mọi giao tiếp mạng hiện đại.
Với series này, bạn đã nắm vững từ TCP Socket cơ bản đến HTTPS bảo mật trong Java!
