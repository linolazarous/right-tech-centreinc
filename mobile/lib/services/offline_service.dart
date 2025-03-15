import 'package:http/http.dart' as http;
import 'dart:convert';

class OfflineLearningService {
  final String apiBaseUrl;

  OfflineLearningService(this.apiBaseUrl);

  Future<dynamic> downloadCourse(String courseId) async {
    final response = await http.get(Uri.parse('$apiBaseUrl/offline/download/$courseId'));
    return json.decode(response.body);
  }
}