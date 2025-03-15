import 'package:http/http.dart' as http;
import 'dart:convert';

class JobPortalService {
  final String apiBaseUrl;

  JobPortalService(this.apiBaseUrl);

  Future<dynamic> getJobRecommendations(String userId) async {
    final response = await http.get(Uri.parse('$apiBaseUrl/jobs/recommendations/$userId'));
    return json.decode(response.body);
  }
}