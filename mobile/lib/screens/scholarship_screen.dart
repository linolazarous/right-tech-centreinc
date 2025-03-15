import 'package:flutter/material.dart';

class ScholarshipScreen extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text('Scholarship Management'),
            ),
            body: Center(
                child: Text('Apply for scholarships and manage your applications.'),
            ),
        );
    }
}