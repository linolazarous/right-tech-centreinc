import 'package:flutter/material.dart';
import '../widgets/accessibility_widget.dart';

class AccessibilityScreen extends StatefulWidget {
  @override
  _AccessibilityScreenState createState() => _AccessibilityScreenState();
}

class _AccessibilityScreenState extends State<AccessibilityScreen> {
  bool darkMode = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Accessibility'),
      ),
      body: AccessibilityWidget(
        darkMode: darkMode,
        onDarkModeChanged: (value) {
          setState(() {
            darkMode = value;
          });
        },
      ),
    );
  }
}