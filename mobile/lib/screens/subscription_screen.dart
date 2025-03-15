import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SubscriptionScreen extends StatefulWidget {
  final String userId;

  SubscriptionScreen({required this.userId});

  @override
  _SubscriptionScreenState createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  List<dynamic> _subscriptions = [];

  Future<void> _fetchSubscriptions() async {
    final response = await http.get(Uri.parse('/api/subscriptions/${widget.userId}'));
    if (response.statusCode == 200) {
      setState(() {
        _subscriptions = json.decode(response.body);
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchSubscriptions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Subscriptions")),
      body: ListView.builder(
        itemCount: _subscriptions.length,
        itemBuilder: (context, index) {
          final subscription = _subscriptions[index];
          return ListTile(
            title: Text("Plan: ${subscription['plan']}"),
            subtitle: Text("Duration: ${subscription['duration']} months"),
          );
        },
      ),
    );
  }
}