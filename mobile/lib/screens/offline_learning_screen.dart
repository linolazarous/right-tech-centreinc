import 'package:flutter/material.dart';

class OfflineLearningScreen extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text('Offline Learning'),
            ),
            body: Center(
                child: Text('Download course materials for offline access.'),
            ),
        );
    }
}