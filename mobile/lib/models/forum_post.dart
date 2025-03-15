class ForumPost {
  final String id;
  final String content;
  final String userId;

  ForumPost({required this.id, required this.content, required this.userId});

  factory ForumPost.fromJson(Map<String, dynamic> json) {
    return ForumPost(
      id: json['_id'],
      content: json['content'],
      userId: json['userId'],
    );
  }
}