import 'package:flutter/material.dart';
import '../widgets/proctoring_widget.dart';
import '../services/proctoring_service.dart';

class ProctoringScreen extends StatefulWidget {
  @override
  _ProctoringScreenState createState() => _ProctoringScreenState();
}

class _ProctoringScreenState extends State<ProctoringScreen> {
  Map<String, dynamic> result = {};

  @override
  void initState() {
    super.initState();
    fetchProctoringResult();
  }

  Future<void> fetchProctoringResult() async {
    final examData = { /* Mock exam data */ };
    final data = await ProctoringService.monitorExam(examData);
    setState(() {
      result = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Proctoring'),
      ),
      body: result.isEmpty
          ? Center(child: CircularProgressIndicator())
          : ProctoringWidget(result: result),
    );
  }
}