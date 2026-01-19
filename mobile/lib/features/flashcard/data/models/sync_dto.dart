import 'package:freezed_annotation/freezed_annotation.dart';
import 'deck_dto.dart';
import 'card_dto.dart';

part 'sync_dto.freezed.dart';
part 'sync_dto.g.dart';

/// Sync request sent to server
@freezed
class SyncRequestDto with _$SyncRequestDto {
  const factory SyncRequestDto({
    required String lastSyncTime, // ISO 8601 timestamp
    required List<DeckDto> decks,
    required List<CardDto> cards,
  }) = _SyncRequestDto;

  factory SyncRequestDto.fromJson(Map<String, dynamic> json) =>
      _$SyncRequestDtoFromJson(json);
}

/// Sync response from server
@freezed
class SyncResponseDto with _$SyncResponseDto {
  const factory SyncResponseDto({
    required String serverTime, // ISO 8601 timestamp
    required List<DeckDto> decks,
    required List<CardDto> cards,
    required List<String> deletedDeckIds,
    required List<String> deletedCardIds,
  }) = _SyncResponseDto;

  factory SyncResponseDto.fromJson(Map<String, dynamic> json) =>
      _$SyncResponseDtoFromJson(json);
}
