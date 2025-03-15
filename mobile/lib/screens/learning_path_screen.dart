import 'package:flutter/material.dart';
import '../widgets/learning_path_widget.dart';
import '../services/learning_path_service.dart';

class LearningPathScreen extends StatefulWidget {
  @override
  _LearningPathScreenState createState() => _LearningPathScreenState();
}

class _LearningPathScreenState extends State<LearningPathScreen> {
  List<dynamic> courses = [];

  @override
  void initState() {
    super.initState();
    fetchLearningPath();
  }

  Future<void> fetchLearningPath() async {
    final userId = 'user123'; // Replace with actual user ID
    final data = await LearningPathService.getLearningPath(userId);
    setState(() {
      courses = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Learning Path'),
      ),
      body: courses.isEmpty
          ? Center(child: CircularProgressIndicator())
          : LearningPathWidget(courses: courses),
    );
  }
}