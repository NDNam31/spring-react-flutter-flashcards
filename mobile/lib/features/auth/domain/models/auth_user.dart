/// Authentication User Model
/// Represents authenticated user data
class AuthUser {
  final String userId;
  final String email;
  final String token;

  const AuthUser({
    required this.userId,
    required this.email,
    required this.token,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      userId: json['userId'] as String,
      email: json['email'] as String,
      token: json['token'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'email': email,
      'token': token,
    };
  }
}
