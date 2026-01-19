import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dio/dio.dart';
import '../models/auth_user.dart';
import '../../../../core/constants/app_constants.dart';

/// Authentication Repository
/// Handles authentication API calls and token storage
class AuthRepository {
  final FlutterSecureStorage _secureStorage;
  final Dio _dio;
  
  // Storage keys
  static const String _keyAccessToken = 'access_token';
  static const String _keyUserId = 'user_id';
  static const String _keyEmail = 'user_email';

  AuthRepository({
    FlutterSecureStorage? secureStorage,
    Dio? dio,
  })  : _secureStorage = secureStorage ?? const FlutterSecureStorage(),
        _dio = dio ??
            Dio(BaseOptions(
              baseUrl: ApiConstants.baseUrl,
              connectTimeout: const Duration(seconds: 30),
              receiveTimeout: const Duration(seconds: 30),
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            ));

  /// Login with email and password
  /// Returns AuthUser on success, throws exception on failure
  Future<AuthUser> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/v1/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      // Backend returns: { token, userId, email, message }
      final authUser = AuthUser.fromJson(response.data);
      
      // Save to secure storage
      await _saveAuthData(authUser);
      
      return authUser;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception('Email hoặc mật khẩu không đúng');
      }
      throw Exception('Lỗi kết nối: ${e.message}');
    }
  }

  /// Register new user
  Future<AuthUser> register({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/v1/auth/register',
        data: {
          'email': email,
          'password': password,
        },
      );

      final authUser = AuthUser.fromJson(response.data);
      await _saveAuthData(authUser);
      
      return authUser;
    } on DioException catch (e) {
      if (e.response?.statusCode == 409) {
        throw Exception('Email đã tồn tại');
      }
      throw Exception('Lỗi kết nối: ${e.message}');
    }
  }

  /// Logout user
  Future<void> logout() async {
    await _secureStorage.delete(key: _keyAccessToken);
    await _secureStorage.delete(key: _keyUserId);
    await _secureStorage.delete(key: _keyEmail);
  }

  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }

  /// Get stored access token
  Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: _keyAccessToken);
  }

  /// Get stored user ID
  Future<String?> getUserId() async {
    return await _secureStorage.read(key: _keyUserId);
  }

  /// Get stored email
  Future<String?> getEmail() async {
    return await _secureStorage.read(key: _keyEmail);
  }

  /// Get current auth user if logged in
  Future<AuthUser?> getCurrentUser() async {
    final token = await getAccessToken();
    final userId = await getUserId();
    final email = await getEmail();

    if (token == null || userId == null || email == null) {
      return null;
    }

    return AuthUser(
      token: token,
      userId: userId,
      email: email,
    );
  }

  /// Save authentication data to secure storage
  Future<void> _saveAuthData(AuthUser authUser) async {
    await _secureStorage.write(key: _keyAccessToken, value: authUser.token);
    await _secureStorage.write(key: _keyUserId, value: authUser.userId);
    await _secureStorage.write(key: _keyEmail, value: authUser.email);
  }

  /// Update stored access token
  Future<void> updateAccessToken(String token) async {
    await _secureStorage.write(key: _keyAccessToken, value: token);
  }
}
