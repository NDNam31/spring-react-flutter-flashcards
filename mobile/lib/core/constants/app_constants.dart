/// API Endpoints
class ApiConstants {
  static const String baseUrl = 'http://localhost:8080/api';
  
  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  
  // Deck endpoints
  static const String decks = '/decks';
  static String deck(String id) => '/decks/$id';
  
  // Card endpoints
  static String deckCards(String deckId) => '/decks/$deckId/cards';
  static String card(String id) => '/cards/$id';
  
  // Sync endpoint
  static const String sync = '/sync';
}

/// Database Constants
class DbConstants {
  static const String dbName = 'flashcards.db';
  static const int dbVersion = 1;
}

/// Sync Status
enum SyncStatus {
  synced(0),
  pending(1),
  conflict(2);

  final int value;
  const SyncStatus(this.value);

  static SyncStatus fromValue(int value) {
    return SyncStatus.values.firstWhere(
      (e) => e.value == value,
      orElse: () => SyncStatus.pending,
    );
  }
}
