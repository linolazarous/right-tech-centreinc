import 'package:flutter/material.dart';

class PushNotificationScreen extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text('Push Notifications'),
            ),
            body: Center(
                child: Text('Stay updated with real-time notifications.'),
            ),
        );
    }
}