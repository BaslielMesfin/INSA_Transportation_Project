class User {
  final String id;
  final String name;
  final String email;
  final String? profilePictureUrl;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.profilePictureUrl,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        email: json['email'] ?? '',
        profilePictureUrl: json['profilePictureUrl'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'profilePictureUrl': profilePictureUrl,
      };
}
