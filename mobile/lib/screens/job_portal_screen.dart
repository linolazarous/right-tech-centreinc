import 'package:flutter/material.dart';
import '../services/job_portal_service.dart';

class JobPortalScreen extends StatefulWidget {
    @override
    _JobPortalScreenState createState() => _JobPortalScreenState();
}

class _JobPortalScreenState extends State<JobPortalScreen> {
    final JobPortalService _jobService = JobPortalService('https://api.righttechcentre.com');
    List<dynamic> jobs = [];

    @override
    void initState() {
        super.initState();
        fetchJobs();
    }

    Future<void> fetchJobs() async {
        final userId = 'user123'; // Replace with actual user ID
        final data = await _jobService.getJobRecommendations(userId);
        setState(() {
            jobs = data;
        });
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text('Job Portal'),
            ),
            body: ListView.builder(
                itemCount: jobs.length,
                itemBuilder: (context, index) {
                    return ListTile(
                        title: Text(jobs[index]['title']),
                        subtitle: Text(jobs[index]['description']),
                    );
                },
            ),
        );
    }
}