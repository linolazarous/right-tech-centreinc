import 'package:flutter/material.dart';

class ForumPostCard extends StatelessWidget {
  final String title;
  final String content;
  final String author;

  ForumPostCard({required this.title, required this.content, required this.author});

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
              title,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(content),
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