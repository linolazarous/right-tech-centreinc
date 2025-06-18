class Course {
  final String id;
  final String title;
  final String slug;
  final String description;
  final String shortDescription;
  final String thumbnailUrl;
  final List<String> learningOutcomes;
  final List<String> prerequisites;
  final String difficulty;
  final int estimatedDuration; // in hours
  final double averageRating;
  final int ratingCount;
  final String instructorId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isPublished;
  final List<String> categories;
  final String? digitalOceanSpaceUrl; // For course content storage
  final String? doResourceId; // Reference to DO App Platform resource

  Course({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.shortDescription,
    required this.thumbnailUrl,
    required this.learningOutcomes,
    required this.prerequisites,
    required this.difficulty,
    required this.estimatedDuration,
    required this.averageRating,
    required this.ratingCount,
    required this.instructorId,
    required this.createdAt,
    required this.updatedAt,
    required this.isPublished,
    required this.categories,
    this.digitalOceanSpaceUrl,
    this.doResourceId,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['_id'],
      title: json['title'],
      slug: json['slug'],
      description: json['description'],
      shortDescription: json['shortDescription'] ?? '',
      thumbnailUrl: json['thumbnailUrl'],
      learningOutcomes: List<String>.from(json['learningOutcomes']),
      prerequisites: List<String>.from(json['prerequisites']),
      difficulty: json['difficulty'],
      estimatedDuration: json['estimatedDuration'],
      averageRating: json['averageRating']?.toDouble() ?? 0.0,
      ratingCount: json['ratingCount'] ?? 0,
      instructorId: json['instructorId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      isPublished: json['isPublished'] ?? false,
      categories: List<String>.from(json['categories']),
      digitalOceanSpaceUrl: json['digitalOceanSpaceUrl'],
      doResourceId: json['doResourceId'],
    );
  }

  Map<String, dynamic> toJson() => {
    '_id': id,
    'title': title,
    'slug': slug,
    'description': description,
    'thumbnailUrl': thumbnailUrl,
    'learningOutcomes': learningOutcomes,
    'prerequisites': prerequisites,
    'difficulty': difficulty,
    'estimatedDuration': estimatedDuration,
    'averageRating': averageRating,
    'ratingCount': ratingCount,
    'instructorId': instructorId,
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
    'isPublished': isPublished,
    'categories': categories,
    'digitalOceanSpaceUrl': digitalOceanSpaceUrl,
    'doResourceId': doResourceId,
  };
}
