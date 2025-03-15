import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MicroLearningScreen extends StatefulWidget {
  @override
  _MicroLearningScreenState createState() => _MicroLearningScreenState();
}

class _MicroLearningScreenState extends State<MicroLearningScreen> {
  List<dynamic> _lessons = [];

  Future<void> _fetchLessons() async {
    final response = await http.get(Uri.parse('/api/microlearning'));
    if (response.statusCode == 200) {
      setState(() {
        _lessons = json.decode(response.body);
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchLessons();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Microlearning")),
      body: ListView.builder(
        itemCount: _lessons.length,
        itemBuilder: (context, index) {
          final lesson = _lessons[index];
          return ListTile(
            title: Text(lesson['title']),
            subtitle: Text(lesson['content']),
            trailing: Text("${lesson['duration']} mins"),
          );
        },
      ),
    );
  }
}