import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/card.dart' as domain;
import '../../domain/repositories/flashcard_repository.dart';
import 'repository_provider.dart';

part 'card_list_provider.g.dart';

/// Provider for managing card list state for a specific deck
@riverpod
class CardList extends _$CardList {
  @override
  Future<List<domain.Card>> build(String deckId) async {
    return _fetchCards();
  }

  Future<List<domain.Card>> _fetchCards() async {
    try {
      final repository = ref.read(flashcardRepositoryProvider);
      return await repository.getCardsByDeckId(deckId: arg);
    } catch (e) {
      rethrow;
    }
  }

  /// Refresh the card list
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _fetchCards());
  }

  /// Add a new card to the deck
  Future<void> addCard({
    required String front,
    required String back,
    String? example,
  }) async {
    final repository = ref.read(flashcardRepositoryProvider);
    await repository.createCard(
      deckId: arg,
      front: front,
      back: back,
      example: example,
    );
    await refresh();
  }

  /// Update an existing card
  Future<void> updateCard({
    required String cardId,
    required String front,
    required String back,
    String? example,
  }) async {
    final repository = ref.read(flashcardRepositoryProvider);
    await repository.updateCard(
      cardId: cardId,
      front: front,
      back: back,
      example: example,
    );
    await refresh();
  }

  /// Delete a card
  Future<void> deleteCard(String cardId) async {
    final repository = ref.read(flashcardRepositoryProvider);
    await repository.deleteCard(cardId: cardId);
    await refresh();
  }

  /// Toggle star status
  Future<void> toggleStar(String cardId, bool isStarred) async {
    final repository = ref.read(flashcardRepositoryProvider);
    // Find the card to update
    final currentCards = state.value ?? [];
    final card = currentCards.firstWhere((c) => c.id == cardId);
    
    await repository.updateCard(
      cardId: cardId,
      front: card.front,
      back: card.back,
      example: card.example,
      isStarred: !isStarred,
    );
    await refresh();
  }
}
