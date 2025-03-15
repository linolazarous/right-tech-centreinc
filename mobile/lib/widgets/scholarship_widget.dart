import 'package:flutter/material.dart';

class ScholarshipWidget extends StatelessWidget {
  final String name;
  final String description;

  ScholarshipWidget({required this.name, required this.description});

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
              name,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(description),
          ],
        ),
      ),
    );
  }
}