import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../data/repositories/auth_repository.dart';
import '../domain/models/auth_user.dart';

part 'auth_provider.g.dart';

/// Auth Repository Provider
@riverpod
AuthRepository authRepository(AuthRepositoryRef ref) {
  return AuthRepository();
}

/// Auth State Provider
/// Manages authentication state throughout the app
@riverpod
class Auth extends _$Auth {
  @override
  Future<AuthUser?> build() async {
    // Check if user is already logged in on app start
    final repository = ref.read(authRepositoryProvider);
    return await repository.getCurrentUser();
  }

  /// Login with email and password
  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = const AsyncValue.loading();
    
    try {
      final repository = ref.read(authRepositoryProvider);
      final authUser = await repository.login(email: email, password: password);
      state = AsyncValue.data(authUser);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }

  /// Register new user
  Future<void> register({
    required String email,
    required String password,
  }) async {
    state = const AsyncValue.loading();
    
    try {
      final repository = ref.read(authRepositoryProvider);
      final authUser = await repository.register(email: email, password: password);
      state = AsyncValue.data(authUser);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }

  /// Logout current user
  Future<void> logout() async {
    state = const AsyncValue.loading();
    
    try {
      final repository = ref.read(authRepositoryProvider);
      await repository.logout();
      state = const AsyncValue.data(null);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }

  /// Check if user is logged in
  bool get isLoggedIn {
    return state.value != null;
  }

  /// Get current user ID
  String? get userId {
    return state.value?.userId;
  }

  /// Get current user email
  String? get email {
    return state.value?.email;
  }

  /// Get current access token
  String? get accessToken {
    return state.value?.token;
  }
}
