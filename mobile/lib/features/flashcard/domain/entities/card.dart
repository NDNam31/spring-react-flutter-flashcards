/// Domain Entity: Card
/// Pure Dart class representing a flashcard
class Card {
  final String id;
  final String deckId;
  final String front;
  final String back;
  final String? example;
  final String? imageUrl;
  final String? audioUrl;
  final int position;
  final String learningState;
  final int interval;
  final int easeFactor;
  final int reviewCount;
  final DateTime? nextReview;
  final DateTime? lastReviewed;
  final int syncStatus;
  final DateTime? serverUpdatedAt;
  final DateTime localUpdatedAt;
  final DateTime createdAt;
  final bool isDeleted;

  const Card({
    required this.id,
    required this.deckId,
    required this.front,
    required this.back,
    this.example,
    this.imageUrl,
    this.audioUrl,
    required this.position,
    required this.learningState,
    required this.interval,
    required this.easeFactor,
    required this.reviewCount,
    this.nextReview,
    this.lastReviewed,
    required this.syncStatus,
    this.serverUpdatedAt,
    required this.localUpdatedAt,
    required this.createdAt,
    this.isDeleted = false,
  });

  /// Copy with method for creating modified copies
  Card copyWith({
    String? id,
    String? deckId,
    String? front,
    String? back,
    String? example,
    String? imageUrl,
    String? audioUrl,
    int? position,
    String? learningState,
    int? interval,
    int? easeFactor,
    int? reviewCount,
    DateTime? nextReview,
    DateTime? lastReviewed,
    int? syncStatus,
    DateTime? serverUpdatedAt,
    DateTime? localUpdatedAt,
    DateTime? createdAt,
    bool? isDeleted,
  }) {
    return Card(
      id: id ?? this.id,
      deckId: deckId ?? this.deckId,
      front: front ?? this.front,
      back: back ?? this.back,
      example: example ?? this.example,
      imageUrl: imageUrl ?? this.imageUrl,
      audioUrl: audioUrl ?? this.audioUrl,
      position: position ?? this.position,
      learningState: learningState ?? this.learningState,
      interval: interval ?? this.interval,
      easeFactor: easeFactor ?? this.easeFactor,
      reviewCount: reviewCount ?? this.reviewCount,
      nextReview: nextReview ?? this.nextReview,
      lastReviewed: lastReviewed ?? this.lastReviewed,
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
    return other is Card && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
