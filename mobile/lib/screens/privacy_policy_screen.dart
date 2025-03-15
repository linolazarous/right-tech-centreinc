import 'package:flutter/material.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Privacy Policy'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Text(
          'This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.',
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}