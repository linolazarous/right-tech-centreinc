import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class InterviewPreparationScreen extends StatefulWidget {
  @override
  _InterviewPreparationScreenState createState() => _InterviewPreparationScreenState();
}

class _InterviewPreparationScreenState extends State<InterviewPreparationScreen> {
  final TextEditingController _jobRoleController = TextEditingController();
  final TextEditingController _userResponsesController = TextEditingController();
  String _questions = "";
  String _feedback = "";

  Future<void> _fetchQuestions() async {
    final response = await http.post(
      Uri.parse('/api/interview/questions'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'jobRole': _jobRoleController.text,
      }),
    );
    if (response.statusCode == 200) {
      setState(() {
        _questions = json.decode(response.body)['questions'];
      });
    } else {
      print('Error fetching questions: ${response.body}');
    }
  }

  Future<void> _conductInterview() async {
    final response = await http.post(
      Uri.parse('/api/interview/mock-interview'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'jobRole': _jobRoleController.text,
        'userResponses': _userResponsesController.text,
      }),
    );
    if (response.statusCode == 200) {
      setState(() {
        _feedback = json.decode(response.body)['feedback'];
      });
    } else {
      print('Error conducting interview: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Interview Preparation")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _jobRoleController,
              decoration: InputDecoration(labelText: "Job Role"),
            ),
            ElevatedButton(
              onPressed: _fetchQuestions,
              child: Text("Get Questions"),
            ),
            if (_questions.isNotEmpty) Text(_questions),
            if (_questions.isNotEmpty) TextField(
              controller: _userResponsesController,
              decoration: InputDecoration(labelText: "Your Responses"),
              maxLines: 5,
            ),
            if (_questions.isNotEmpty) ElevatedButton(
              onPressed: _conductInterview,
              child: Text("Conduct Mock Interview"),
            ),
            if (_feedback.isNotEmpty) Text(_feedback),
          ],
        ),
      ),
    );
  }
}