import 'package:http/http.dart' as http;
import 'dart:convert';

class ARVRService {
  final String apiBaseUrl;

  ARVRService(this.apiBaseUrl);

  Future<dynamic> generateARVRContent(String courseId) async {
    final response = await http.post(
      Uri.parse('$apiBaseUrl/arvr/generate'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'courseId': courseId}),
    );
    return json.decode(response.body);
  }
}