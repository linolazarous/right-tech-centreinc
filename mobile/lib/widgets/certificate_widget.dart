import 'package:flutter/material.dart';

class CertificateWidget extends StatelessWidget {
  final String certificateHash;
  final bool isValid;

  CertificateWidget({required this.certificateHash, required this.isValid});

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
              'Certificate Verification',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('Certificate Hash: $certificateHash'),
            Text('Status: ${isValid ? 'Valid' : 'Invalid'}'),
          ],
        ),
      ),
    );
  }
}