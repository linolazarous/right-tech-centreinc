import 'package:flutter/material.dart';
import '../widgets/forum_post_card.dart';

class ForumScreen extends StatelessWidget {
  final List<Map<String, String>> posts = [
    {'title': 'React Tips', 'content': 'Here are some tips for mastering React.', 'author': 'John Doe'},
    {'title': 'Node.js Best Practices', 'content': 'Learn the best practices for Node.js.', 'author': 'Jane Smith'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Forum'),
      ),
      body: ListView.builder(
        itemCount: posts.length,
        itemBuilder: (context, index) {
          return ForumPostCard(
            title: posts[index]['title']!,
            content: posts[index]['content']!,
            author: posts[index]['author']!,
          );
        },
      ),
    );
  }
}