import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_database.dart';

/// Provider for AppDatabase singleton
final appDatabaseProvider = Provider<AppDatabase>((ref) {
  return AppDatabase();
});
