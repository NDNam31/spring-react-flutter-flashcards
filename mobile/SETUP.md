# Flashcards Mobile App

Offline-first Flutter mobile application for flashcard learning with sync capabilities.

## 🏗️ Architecture

- **Pattern**: Clean Architecture
- **State Management**: Riverpod
- **Local Database**: Drift (SQLite)
- **HTTP Client**: Dio
- **Code Generation**: Freezed, JSON Serializable

## 📁 Project Structure

```
lib/
├── main.dart
├── core/
│   ├── constants/
│   │   └── app_constants.dart
│   ├── errors/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   └── utils/
├── features/
│   └── flashcard/
│       ├── data/
│       │   ├── datasources/
│       │   │   ├── local_db/
│       │   │   │   ├── app_database.dart
│       │   │   │   └── database_provider.dart
│       │   │   └── api_client/
│       │   ├── models/
│       │   │   ├── deck_dto.dart
│       │   │   ├── card_dto.dart
│       │   │   └── sync_dto.dart
│       │   └── repositories/
│       ├── domain/
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── usecases/
│       └── presentation/
│           ├── providers/
│           ├── pages/
│           └── widgets/
```

## 🗄️ Database Schema

### Decks Table
- `id` (TEXT, PK) - UUID from server
- `userId` (TEXT) - Owner user ID
- `title` (TEXT) - Deck title
- `description` (TEXT, nullable)
- `folderId` (TEXT, nullable)
- `syncStatus` (INTEGER) - 0=synced, 1=pending, 2=conflict
- `serverUpdatedAt` (TEXT, nullable) - ISO 8601 timestamp
- `localUpdatedAt` (TEXT) - ISO 8601 timestamp
- `createdAt` (TEXT) - ISO 8601 timestamp
- `isDeleted` (BOOLEAN) - Soft delete flag

### Cards Table
- `id` (TEXT, PK) - UUID from server
- `deckId` (TEXT, FK) - References Decks.id
- `front` (TEXT) - Card front (term/question)
- `back` (TEXT) - Card back (definition/answer)
- `example` (TEXT, nullable)
- `imageUrl` (TEXT, nullable)
- `audioUrl` (TEXT, nullable)
- `position` (INTEGER) - Order in deck
- `learningState` (TEXT) - NEW, LEARNING_MCQ, LEARNING_TYPING, REVIEWING, RELEARNING
- `interval` (INTEGER) - SRS interval in days
- `easeFactor` (INTEGER) - SRS ease factor (×100)
- `reviewCount` (INTEGER) - Number of reviews
- `nextReview` (TEXT, nullable) - ISO 8601 timestamp
- `lastReviewed` (TEXT, nullable) - ISO 8601 timestamp
- `syncStatus` (INTEGER) - 0=synced, 1=pending, 2=conflict
- `serverUpdatedAt` (TEXT, nullable)
- `localUpdatedAt` (TEXT)
- `createdAt` (TEXT)
- `isDeleted` (BOOLEAN)

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd mobile
flutter pub get
```

### 2. Generate Code
Run code generation for Drift, Freezed, and JSON serialization:

```bash
# One-time generation
flutter pub run build_runner build --delete-conflicting-outputs

# Or watch mode (auto-regenerate on changes)
flutter pub run build_runner watch --delete-conflicting-outputs
```

### 3. Run the App
```bash
flutter run
```

## 🔧 Development Workflow

### Adding New Tables
1. Define table class in `app_database.dart`
2. Add table to `@DriftDatabase` annotation
3. Run code generation
4. Increment `schemaVersion` and add migration if needed

### Creating DTOs
1. Create freezed class in `models/`
2. Add `part` directives for `.freezed.dart` and `.g.dart`
3. Run code generation

### Database Queries
All database queries are defined in `AppDatabase` class methods for easy access and testing.

## 📦 Key Dependencies

- `drift: ^2.16.0` - Type-safe SQL database
- `flutter_riverpod: ^2.5.1` - State management
- `dio: ^5.4.1` - HTTP client
- `freezed: ^2.4.7` - Immutable models
- `uuid: ^4.3.3` - UUID generation

## 🔄 Sync Strategy

1. **Local-First**: All changes saved to local DB immediately
2. **Sync on Network**: Background sync when online
3. **Conflict Resolution**: Server wins by default (serverUpdatedAt comparison)
4. **Pending Changes**: Track with `syncStatus` field

## 📝 Next Steps

1. ✅ Database schema created
2. ✅ DTOs defined
3. ⏭️ Implement repositories
4. ⏭️ Create domain entities and use cases
5. ⏭️ Build UI with Riverpod providers
6. ⏭️ Implement sync service
7. ⏭️ Add authentication
8. ⏭️ Implement SRS algorithm

## 🧪 Testing

```bash
# Run tests
flutter test

# Run with coverage
flutter test --coverage
```

## 📱 Platform Support

- ✅ Android
- ✅ iOS
- ✅ Web (with limitations on local storage)

## 🔐 Environment Variables

Create `.env` file in mobile/ directory:
```
API_BASE_URL=http://localhost:8080/api
```

---

**Author**: Senior Flutter Engineer  
**Architecture**: Offline-First Clean Architecture  
**Last Updated**: January 2026
