import 'package:freezed_annotation/freezed_annotation.dart';

part 'card_dto.freezed.dart';
part 'card_dto.g.dart';

/// Data Transfer Object for Card (API communication)
@freezed
class CardDto with _$CardDto {
  const factory CardDto({
    required String id,
    required String deckId,
    required String term,
    required String definition,
    String? example,
    String? imageUrl,
    String? audioUrl,
    required int position,
    required String learningState,
    required int interval,
    required int easeFactor,
    required int reviewCount,
    String? nextReview,
    String? lastReviewed,
    required String createdAt,
    required String updatedAt,
    @Default(false) bool isDeleted,
  }) = _CardDto;

  factory CardDto.fromJson(Map<String, dynamic> json) =>
      _$CardDtoFromJson(json);
}

/// DTO for creating a new card
@freezed
class CreateCardDto with _$CreateCardDto {
  const factory CreateCardDto({
    required String deckId,
    required String term,
    required String definition,
    String? example,
    String? imageUrl,
    String? audioUrl,
  }) = _CreateCardDto;

  factory CreateCardDto.fromJson(Map<String, dynamic> json) =>
      _$CreateCardDtoFromJson(json);
}

/// DTO for updating a card
@freezed
class UpdateCardDto with _$UpdateCardDto {
  const factory UpdateCardDto({
    String? term,
    String? definition,
    String? example,
    String? imageUrl,
    String? audioUrl,
    int? position,
  }) = _UpdateCardDto;

  factory UpdateCardDto.fromJson(Map<String, dynamic> json) =>
      _$UpdateCardDtoFromJson(json);
}

/// DTO for recording card progress (SRS update)
@freezed
class RecordProgressDto with _$RecordProgressDto {
  const factory RecordProgressDto({
    required String mode, // MCQ, WRITTEN, MIXED
    required bool isCorrect,
  }) = _RecordProgressDto;

  factory RecordProgressDto.fromJson(Map<String, dynamic> json) =>
      _$RecordProgressDtoFromJson(json);
}
