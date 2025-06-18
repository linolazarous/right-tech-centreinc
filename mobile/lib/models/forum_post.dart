class ForumPost {
  final String id;
  final String content;
  final String userId;
  final String courseId;
  final List<String> upvotedBy;
  final List<String> downvotedBy;
  final List<String> tags;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isPinned;
  final bool isClosed;
  final String? digitalOceanAssetUrl; // For attached files
  final String? doBucketReference; // DO Spaces bucket reference

  ForumPost({
    required this.id,
    required this.content,
    required this.userId,
    required this.courseId,
    required this.upvotedBy,
    required this.downvotedBy,
    required this.tags,
    required this.createdAt,
    required this.updatedAt,
    required this.isPinned,
    required this.isClosed,
    this.digitalOceanAssetUrl,
    this.doBucketReference,
  });

  factory ForumPost.fromJson(Map<String, dynamic> json) {
    return ForumPost(
      id: json['_id'],
      content: json['content'],
      userId: json['userId'],
      courseId: json['courseId'],
      upvotedBy: List<String>.from(json['upvotedBy'] ?? []),
      downvotedBy: List<String>.from(json['downvotedBy'] ?? []),
      tags: List<String>.from(json['tags'] ?? []),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      isPinned: json['isPinned'] ?? false,
      isClosed: json['isClosed'] ?? false,
      digitalOceanAssetUrl: json['digitalOceanAssetUrl'],
      doBucketReference: json['doBucketReference'],
    );
  }

  int get voteCount => upvotedBy.length - downvotedBy.length;

  Map<String, dynamic> toJson() => {
    '_id': id,
    'content': content,
    'userId': userId,
    'courseId': courseId,
    'upvotedBy': upvotedBy,
    'downvotedBy': downvotedBy,
    'tags': tags,
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
    'isPinned': isPinned,
    'isClosed': isClosed,
    'digitalOceanAssetUrl': digitalOceanAssetUrl,
    'doBucketReference': doBucketReference,
  };
}
