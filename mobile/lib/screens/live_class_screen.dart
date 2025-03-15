import 'package:flutter/material.dart';

class LiveClassScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Live Classes'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Join live classes and interact with instructors in real-time.',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                // Handle join live class
              },
              child: Text('Join Now'),
            ),
          ],
        ),
      ),
    );
  }
}