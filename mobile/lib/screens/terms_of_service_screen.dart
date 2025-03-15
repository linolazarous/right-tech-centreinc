import 'package:flutter/material.dart';

class TermsOfServiceScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Terms of Service'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Text(
          'By using our platform, you agree to these Terms of Service.',
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}