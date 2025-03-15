import 'package:flutter/material.dart';
import '../widgets/course_card.dart';

class CoursesScreen extends StatelessWidget {
  final List<Map<String, String>> courses = [
    {'title': 'React Mastery', 'description': 'Learn React from scratch', 'instructor': 'John Doe'},
    {'title': 'Node.js Basics', 'description': 'Introduction to Node.js', 'instructor': 'Jane Smith'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Courses'),
      ),
      body: ListView.builder(
        itemCount: courses.length,
        itemBuilder: (context, index) {
          return CourseCard(
            title: courses[index]['title']!,
            description: courses[index]['description']!,
            instructor: courses[index]['instructor']!,
          );
        },
      ),
    );
  }
}