import 'package:flutter/material.dart';

class ProctoringWidget extends StatelessWidget {
  final Map<String, dynamic> result;

  ProctoringWidget({required this.result});

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
              'Proctoring Results',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('Face Detected: ${result['faceDetected'] ? 'Yes' : 'No'}'),
            Text('Suspicious Activity: ${result['suspiciousActivity'] ? 'Yes' : 'No'}'),
            Text('Behavior Analysis: ${result['behaviorAnalysis']}'),
          ],
        ),
      ),
    );
  }
}