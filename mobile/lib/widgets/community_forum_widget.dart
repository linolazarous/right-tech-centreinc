import 'package:flutter/material.dart';

class ForumWidget extends StatelessWidget {
  final String content;
  final String author;

  ForumWidget({required this.content, required this.author});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8.0),
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              content,
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 8),
            Text(
              'Posted by $author',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}