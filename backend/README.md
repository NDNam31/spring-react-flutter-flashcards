# Flashcards Backend 🎴

Backend cho ứng dụng học tiếng Anh (Anki + Quizlet Clone)

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Data JPA**
- **PostgreSQL**
- **Lombok**
- **Docker Compose**
- **Hypersistence Utils** (PostgreSQL Array support)

## Cấu trúc Database

Database được thiết kế với 5 bảng chính:
- `users` - Quản lý tài khoản người dùng
- `decks` - Bộ thẻ flashcard (hỗ trợ soft delete)
- `cards` - Thẻ flashcard (hỗ trợ soft delete, PostgreSQL array cho tags)
- `card_progress` - Tiến trình học tập với thuật toán SRS (Spaced Repetition System)
- `study_log` - Lịch sử ôn tập

## Cài đặt & Chạy

### 1. Khởi động Database với Docker Compose

```bash
docker-compose up -d
```

Database sẽ tự động khởi tạo schema từ file `database.sql`

### 2. Build & Run Application

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

Application sẽ chạy tại `http://localhost:8080`

## Cấu hình

### Database Connection

Xem file `src/main/resources/application.properties`:
- URL: `jdbc:postgresql://localhost:5432/flashcards_db`
- Username: `flashcards_user`
- Password: `flashcards_password`

### Hibernate Configuration

- DDL Auto: `validate` (chỉ validate schema, không tự động tạo/sửa)
- Show SQL: `true` (hiển thị SQL queries trong console)
- Format SQL: `true` (format SQL cho dễ đọc)

## Entities

### User
- Email/Password authentication
- Timestamps tracking

### Deck
- Hỗ trợ soft delete
- Source tracking (LOCAL/ANKI/QUIZLET)
- Timestamps tracking

### Card
- Hỗ trợ soft delete
- PostgreSQL array cho tags
- Multimedia support (image_url, audio_url)
- Position ordering

### CardProgress
- Spaced Repetition System (SRS)
- Learning states: NEW, LEARNING_MCQ, LEARNING_TYPING, REVIEWING, RELEARNING
- SM-2 algorithm parameters (interval, ease_factor, repetitions)

### StudyLog
- Grade tracking: AGAIN, HARD, GOOD, EASY
- Time tracking (ms)
- Review history

## Dependencies chính

- `spring-boot-starter-web` - REST API
- `spring-boot-starter-data-jpa` - JPA/Hibernate
- `spring-boot-starter-security` - Security framework
- `postgresql` - PostgreSQL driver
- `hypersistence-utils-hibernate-63` - PostgreSQL array support
- `lombok` - Code generation

## Tính năng đặc biệt

### 1. Soft Delete
Entities `Deck` và `Card` sử dụng soft delete:
- `@SQLDelete` - Update `is_deleted = true` thay vì xóa thật
- `@Where(clause = "is_deleted = false")` - Auto filter trong queries

### 2. PostgreSQL Array Support
Entity `Card` sử dụng `List<String>` cho tags:
- `@Type(ListArrayType.class)` từ Hypersistence Utils
- Mapping với `text[]` trong PostgreSQL

### 3. Timestamp Auditing
Tự động tracking thời gian:
- `@CreationTimestamp` - Tự động set khi tạo
- `@UpdateTimestamp` - Tự động update khi sửa

## Development

### Logging
- Hibernate SQL queries: `DEBUG`
- Application: `DEBUG`
- SQL parameters: `TRACE`

### Hot Reload
Spring Boot DevTools được enable để hỗ trợ hot reload trong development.

## Next Steps

1. Implement Repository layer
2. Implement Service layer
3. Implement REST Controllers
4. Add JWT Authentication
5. Add API Documentation (Swagger/OpenAPI)
6. Add Unit Tests & Integration Tests
