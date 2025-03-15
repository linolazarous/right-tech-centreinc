import 'package:flutter/material.dart';

class AnalyticsWidget extends StatelessWidget {
  final Map<String, dynamic> metrics;

  AnalyticsWidget({required this.metrics});

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
              'Engagement Metrics',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('Time Spent: ${metrics['timeSpent']} minutes'),
            Text('Quizzes Taken: ${metrics['quizzesTaken']}'),
            Text('Courses Completed: ${metrics['coursesCompleted']}'),
          ],
        ),
      ),
    );
  }
}