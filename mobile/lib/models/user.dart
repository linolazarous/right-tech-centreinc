class User {
  final String id;
  final String name;
  final String email;
  final List<String> skills;
  final List<String> enrolledCourses;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.skills,
    required this.enrolledCourses,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      name: json['name'],
      email: json['email'],
      skills: List<String>.from(json['skills']),
      enrolledCourses: List<String>.from(json['enrolledCourses']),
    );
  }
}