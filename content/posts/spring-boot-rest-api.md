+++
date = '2025-10-16T03:12:00+07:00'
draft = false
title = 'Xây dựng REST API với Spring Boot'
description = 'Từng bước xây dựng REST API hoàn chỉnh với Spring Boot, từ controller đến database.'
tags = ['Spring Boot', 'REST API', 'Java', 'Backend']
+++

## Spring Boot là gì?

Spring Boot giúp chúng ta xây dựng ứng dụng Java một cách nhanh chóng và dễ dàng với các cấu hình tự động.

## Tạo REST Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
}
```

## Cấu hình Database

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog
    username: root
    password: password
```

## Kết luận

Spring Boot giúp chúng ta tập trung vào logic nghiệp vụ thay vì cấu hình phức tạp.
