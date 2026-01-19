import 'package:uuid/uuid.dart';

/// Utility for generating UUIDs
class UuidUtils {
  static const _uuid = Uuid();

  /// Generate a new UUID v4
  static String generate() {
    return _uuid.v4();
  }

  /// Validate if a string is a valid UUID
  static bool isValid(String? value) {
    if (value == null || value.isEmpty) return false;
    
    final uuidPattern = RegExp(
      r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
      caseSensitive: false,
    );
    
    return uuidPattern.hasMatch(value);
  }
}
