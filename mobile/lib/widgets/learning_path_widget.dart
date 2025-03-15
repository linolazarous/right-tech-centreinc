import 'package:flutter/material.dart';

class LearningPathWidget extends StatelessWidget {
  final List<dynamic> courses;

  LearningPathWidget({required this.courses});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: courses.length,
      itemBuilder: (context, index) {
        return Card(
          margin: EdgeInsets.all(8.0),
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  courses[index]['title'],
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 8),
                Text(courses[index]['description']),
              ],
            ),
          ),
        );
      },
    );
  }
}