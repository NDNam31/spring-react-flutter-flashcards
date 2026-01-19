import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/flashcard_repository.dart';

// 👇 SỬA LẠI 2 DÒNG IMPORT NÀY (Thêm ../../data/)
import '../../data/datasources/local_db/database_provider.dart';
import '../../data/repositories/flashcard_repository_impl.dart';

final flashcardRepositoryProvider = Provider<FlashcardRepository>((ref) {
  // Lấy database từ tầng Data
  final database = ref.watch(appDatabaseProvider);

  // Khởi tạo Repository Implementation
  return FlashcardRepositoryImpl(database);
});