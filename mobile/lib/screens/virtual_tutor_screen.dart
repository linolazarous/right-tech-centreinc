import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class VirtualTutorScreen extends StatefulWidget {
  final String userId;

  VirtualTutorScreen({required this.userId});

  @override
  _VirtualTutorScreenState createState() => _VirtualTutorScreenState();
}

class _VirtualTutorScreenState extends State<VirtualTutorScreen> {
  final TextEditingController _questionController = TextEditingController();
  String _answer = "";

  Future<void> _askTutor() async {
    final response = await http.post(
      Uri.parse('/api/virtualtutor/ask'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'userId': widget.userId,
        'question': _questionController.text,
      }),
    );
    if (response.statusCode == 200) {
      setState(() {
        _answer = json.decode(response.body)['answer'];
      });
    } else {
      print('Error asking tutor: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Virtual Tutor")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _questionController,
              decoration: InputDecoration(labelText: "Ask a question"),
            ),
            ElevatedButton(
              onPressed: _askTutor,
              child: Text("Ask"),
            ),
            if (_answer.isNotEmpty) Text(_answer),
          ],
        ),
      ),
    );
  }
}