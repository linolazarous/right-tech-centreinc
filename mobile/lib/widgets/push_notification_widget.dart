import 'package:flutter/material.dart';

class NotificationWidget extends StatelessWidget {
  final String message;
  final String timestamp;

  NotificationWidget({required this.message, required this.timestamp});

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
              message,
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 8),
            Text(
              timestamp,
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}