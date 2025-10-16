+++
date = '2025-10-15T03:12:00+07:00'
draft = false
title = 'WebSocket cho ứng dụng real-time'
description = 'Tìm hiểu WebSocket và cách xây dựng ứng dụng real-time với Java.'
tags = ['WebSocket', 'Real-time', 'Java', 'Networking']
+++

## WebSocket là gì?

WebSocket là một giao thức truyền thông cho phép kết nối hai chiều giữa client và server.

## Ưu điểm của WebSocket

- Kết nối liên tục
- Truyền dữ liệu real-time
- Hiệu suất cao
- Hỗ trợ binary data

## Ví dụ với Spring Boot

```java
@MessageMapping("/chat")
@SendTo("/topic/messages")
public ChatMessage sendMessage(ChatMessage message) {
    return message;
}
```

## Ứng dụng thực tế

- Chat applications
- Live notifications
- Real-time gaming
- Stock market data

## Kết luận

WebSocket là công nghệ quan trọng cho các ứng dụng cần truyền dữ liệu real-time.
