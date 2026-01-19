import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/deck.dart';
import 'repository_provider.dart';

part 'deck_list_provider.g.dart';

/// AsyncNotifier for managing the list of decks
@riverpod
class DeckList extends _$DeckList {
  @override
  Future<List<Deck>> build() async {
    // Fetch decks on initialization
    return _fetchDecks();
  }

  /// Fetch all decks from repository
  Future<List<Deck>> _fetchDecks() async {
    final repository = ref.read(flashcardRepositoryProvider);
    return await repository.getDecks();
  }

  /// Refresh the deck list
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _fetchDecks());
  }

  /// Add a new deck
  Future<void> addDeck({
    required String title,
    String? description,
  }) async {
    final repository = ref.read(flashcardRepositoryProvider);

    // Create deck in database
    await repository.createDeck(
      title: title,
      description: description,
    );

    // Refresh the list
    await refresh();
  }

  /// Update an existing deck
  Future<void> updateDeck({
    required String id,
    String? title,
    String? description,
  }) async {
    final repository = ref.read(flashcardRepositoryProvider);

    await repository.updateDeck(
      id: id,
      title: title,
      description: description,
    );

    await refresh();
  }

  /// Delete a deck
  Future<void> deleteDeck(String id) async {
    final repository = ref.read(flashcardRepositoryProvider);

    await repository.deleteDeck(id);

    await refresh();
  }
}
