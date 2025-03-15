import 'package:flutter/material.dart';

class AccessibilityWidget extends StatelessWidget {
  final bool darkMode;
  final Function(bool) onDarkModeChanged;

  AccessibilityWidget({required this.darkMode, required this.onDarkModeChanged});

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
              'Accessibility Settings',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Text('Dark Mode'),
                Switch(
                  value: darkMode,
                  onChanged: onDarkModeChanged,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}