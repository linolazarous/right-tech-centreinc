import 'package:flutter/material.dart';
import '../widgets/analytics_widget.dart';
import '../services/analytics_service.dart';

class AnalyticsScreen extends StatefulWidget {
  @override
  _AnalyticsScreenState createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  Map<String, dynamic> metrics = {};

  @override
  void initState() {
    super.initState();
    fetchMetrics();
  }

  Future<void> fetchMetrics() async {
    final userId = 'user123'; // Replace with actual user ID
    final data = await AnalyticsService.getEngagementMetrics(userId);
    setState(() {
      metrics = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Analytics'),
      ),
      body: metrics.isEmpty
          ? Center(child: CircularProgressIndicator())
          : AnalyticsWidget(metrics: metrics),
    );
  }
}