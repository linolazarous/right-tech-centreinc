import 'package:flutter/material.dart';
import '../widgets/study_group_widget.dart';
import '../services/social_service.dart';

class StudyGroupsScreen extends StatefulWidget {
  @override
  _StudyGroupsScreenState createState() => _StudyGroupsScreenState();
}

class _StudyGroupsScreenState extends State<StudyGroupsScreen> {
  List<dynamic> groups = [];

  @override
  void initState() {
    super.initState();
    fetchGroups();
  }

  Future<void> fetchGroups() async {
    final data = await SocialService.getStudyGroups();
    setState(() {
      groups = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Study Groups'),
      ),
      body: ListView.builder(
        itemCount: groups.length,
        itemBuilder: (context, index) {
          return StudyGroupWidget(
            name: groups[index]['name'],
            members: groups[index]['members'].map((member) => member['name']).toList(),
          );
        },
      ),
    );
  }
}