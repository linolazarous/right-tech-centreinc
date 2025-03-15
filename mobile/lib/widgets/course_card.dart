import 'package:flutter/material.dart';

class CourseCard extends StatelessWidget {
  final String title;
  final String description;
  final String instructor;

  CourseCard({required this.title, required this.description, required this.instructor});

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
            Text(description),
            SizedBox(height: 8),
            Text(
              'Instructor: $instructor',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}