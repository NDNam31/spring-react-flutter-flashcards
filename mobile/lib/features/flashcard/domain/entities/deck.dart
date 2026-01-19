/// Domain Entity: Deck
/// Pure Dart class representing a flashcard deck
class Deck {
  final String id;
  final String userId;
  final String title;
  final String? description;
  final String? folderId;
  final int syncStatus;
  final DateTime? serverUpdatedAt;
  final DateTime localUpdatedAt;
  final DateTime createdAt;
  final bool isDeleted;

  const Deck({
    required this.id,
    required this.userId,
    required this.title,
    this.description,
    this.folderId,
    required this.syncStatus,
    this.serverUpdatedAt,
    required this.localUpdatedAt,
    required this.createdAt,
    this.isDeleted = false,
  });

  /// Copy with method for creating modified copies
  Deck copyWith({
    String? id,
    String? userId,
    String? title,
    String? description,
    String? folderId,
    int? syncStatus,
    DateTime? serverUpdatedAt,
    DateTime? localUpdatedAt,
    DateTime? createdAt,
    bool? isDeleted,
  }) {
    return Deck(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description ?? this.description,
      folderId: folderId ?? this.folderId,
      syncStatus: syncStatus ?? this.syncStatus,
      serverUpdatedAt: serverUpdatedAt ?? this.serverUpdatedAt,
      localUpdatedAt: localUpdatedAt ?? this.localUpdatedAt,
      createdAt: createdAt ?? this.createdAt,
      isDeleted: isDeleted ?? this.isDeleted,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Deck && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
