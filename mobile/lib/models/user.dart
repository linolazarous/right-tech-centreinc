class User {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  final List<String> skills;
  final List<String> enrolledCourses;
  final List<String> completedCourses;
  final DateTime createdAt;
  final DateTime lastActiveAt;
  final String role;
  final String? digitalOceanSpaceUrl; // For user content storage
  final Map<String, dynamic>? doMetadata; // DO-specific metadata
  final String? timezone;
  final String? locale;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    required this.skills,
    required this.enrolledCourses,
    required this.completedCourses,
    required this.createdAt,
    required this.lastActiveAt,
    required this.role,
    this.digitalOceanSpaceUrl,
    this.doMetadata,
    this.timezone,
    this.locale,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      name: json['name'],
      email: json['email'],
      avatarUrl: json['avatarUrl'],
      skills: List<String>.from(json['skills'] ?? []),
      enrolledCourses: List<String>.from(json['enrolledCourses'] ?? []),
      completedCourses: List<String>.from(json['completedCourses'] ?? []),
      createdAt: DateTime.parse(json['createdAt']),
      lastActiveAt: DateTime.parse(json['lastActiveAt']),
      role: json['role'] ?? 'student',
      digitalOceanSpaceUrl: json['digitalOceanSpaceUrl'],
      doMetadata: json['doMetadata'] != null 
          ? Map<String, dynamic>.from(json['doMetadata'])
          : null,
      timezone: json['timezone'],
      locale: json['locale'],
    );
  }

  Map<String, dynamic> toJson() => {
    '_id': id,
    'name': name,
    'email': email,
    'avatarUrl': avatarUrl,
    'skills': skills,
    'enrolledCourses': enrolledCourses,
    'completedCourses': completedCourses,
    'createdAt': createdAt.toIso8601String(),
    'lastActiveAt': lastActiveAt.toIso8601String(),
    'role': role,
    'digitalOceanSpaceUrl': digitalOceanSpaceUrl,
    'doMetadata': doMetadata,
    'timezone': timezone,
    'locale': locale,
  };

  bool get isInstructor => role == 'instructor' || role == 'admin';
}
