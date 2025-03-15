import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ARLearningScreen extends StatefulWidget {
  @override
  _ARLearningScreenState createState() => _ARLearningScreenState();
}

class _ARLearningScreenState extends State<ARLearningScreen> {
  final TextEditingController _lessonNameController = TextEditingController();
  final TextEditingController _arContentController = TextEditingController();
  Map<String, dynamic>? _lesson;

  Future<void> _createLesson() async {
    final response = await http.post(
      Uri.parse('/api/arlearning/create'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'lessonName': _lessonNameController.text,
        'arContent': _arContentController.text,
      }),
    );
    if (response.statusCode == 201) {
      setState(() {
        _lesson = json.decode(response.body);
      });
    } else {
      print('Error creating lesson: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("AR Learning")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _lessonNameController,
              decoration: InputDecoration(labelText: "Lesson Name"),
            ),
            TextField(
              controller: _arContentController,
              decoration: InputDecoration(labelText: "AR Content"),
              maxLines: 5,
            ),
            ElevatedButton(
              onPressed: _createLesson,
              child: Text("Create Lesson"),
            ),
            if (_lesson != null) Text(JsonEncoder.withIndent('  ').convert(_lesson)),
          ],
        ),
      ),
    );
  }
}