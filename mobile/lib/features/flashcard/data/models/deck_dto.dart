import 'package:freezed_annotation/freezed_annotation.dart';

part 'deck_dto.freezed.dart';
part 'deck_dto.g.dart';

/// Data Transfer Object for Deck (API communication)
@freezed
class DeckDto with _$DeckDto {
  const factory DeckDto({
    required String id,
    required String userId,
    required String title,
    String? description,
    String? folderId,
    required String createdAt,
    required String updatedAt,
    String? lastViewedAt,
    @Default(false) bool isDeleted,
  }) = _DeckDto;

  factory DeckDto.fromJson(Map<String, dynamic> json) =>
      _$DeckDtoFromJson(json);
}

/// DTO for creating a new deck
@freezed
class CreateDeckDto with _$CreateDeckDto {
  const factory CreateDeckDto({
    required String title,
    String? description,
    String? folderId,
  }) = _CreateDeckDto;

  factory CreateDeckDto.fromJson(Map<String, dynamic> json) =>
      _$CreateDeckDtoFromJson(json);
}

/// DTO for updating a deck
@freezed
class UpdateDeckDto with _$UpdateDeckDto {
  const factory UpdateDeckDto({
    String? title,
    String? description,
    String? folderId,
  }) = _UpdateDeckDto;

  factory UpdateDeckDto.fromJson(Map<String, dynamic> json) =>
      _$UpdateDeckDtoFromJson(json);
}
