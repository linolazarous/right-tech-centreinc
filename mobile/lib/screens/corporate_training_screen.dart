import 'package:flutter/material.dart';
import '../widgets/corporate_training_widget.dart';
import '../services/corporate_training_service.dart';

class CorporateTrainingScreen extends StatefulWidget {
  @override
  _CorporateTrainingScreenState createState() => _CorporateTrainingScreenState();
}

class _CorporateTrainingScreenState extends State<CorporateTrainingScreen> {
  List<dynamic> trainings = [];

  @override
  void initState() {
    super.initState();
    fetchTrainings();
  }

  Future<void> fetchTrainings() async {
    final data = await CorporateTrainingService.getTrainings();
    setState(() {
      trainings = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Corporate Training'),
      ),
      body: ListView.builder(
        itemCount: trainings.length,
        itemBuilder: (context, index) {
          return CorporateTrainingWidget(
            programName: trainings[index]['programName'],
            companyName: trainings[index]['companyName'],
          );
        },
      ),
    );
  }
}