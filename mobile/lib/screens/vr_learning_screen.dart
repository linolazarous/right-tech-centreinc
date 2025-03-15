import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class VRLearningScreen extends StatefulWidget {
  @override
  _VRLearningScreenState createState() => _VRLearningScreenState();
}

class _VRLearningScreenState extends State<VRLearningScreen> {
  final TextEditingController _lessonNameController = TextEditingController();
  final TextEditingController _vrContentController = TextEditingController();
  Map<String, dynamic>? _lesson;

  Future<void> _createLesson() async {
    final response = await http.post(
      Uri.parse('/api/vrlearning/create'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'lessonName': _lessonNameController.text,
        'vrContent': _vrContentController.text,
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
      appBar: AppBar(title: Text("VR Learning")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _lessonNameController,
              decoration: InputDecoration(labelText: "Lesson Name"),
            ),
            TextField(
              controller: _vrContentController,
              decoration: InputDecoration(labelText: "VR Content"),
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