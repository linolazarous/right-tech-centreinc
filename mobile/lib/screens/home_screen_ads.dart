import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HomeScreen extends StatefulWidget {
  final String userId;

  HomeScreen({required this.userId});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _adContent = "";

  Future<void> _fetchAd() async {
    final response = await http.get(Uri.parse('/api/ads?userId=${widget.userId}'));
    if (response.statusCode == 200) {
      setState(() {
        _adContent = json.decode(response.body)['content'];
      });
    } else {
      print('Error fetching ad: ${response.body}');
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchAd();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Home"),
      ),
      body: Column(
        children: [
          Text("Welcome to Right Tech Centre"),
          if (_adContent.isNotEmpty) Text(_adContent),
        ],
      ),
    );
  }
}