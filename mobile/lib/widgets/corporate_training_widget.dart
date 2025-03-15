import 'package:flutter/material.dart';

class CorporateTrainingWidget extends StatelessWidget {
  final String programName;
  final String companyName;

  CorporateTrainingWidget({required this.programName, required this.companyName});

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
              programName,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('Offered by $companyName'),
          ],
        ),
      ),
    );
  }
}