import 'package:http/http.dart' as http;
import 'dart:convert';

class ScholarshipService {
  final String apiBaseUrl;

  ScholarshipService(this.apiBaseUrl);

  Future<dynamic> allocateScholarship(String studentId, String criteria) async {
    final response = await http.post(
      Uri.parse('$apiBaseUrl/scholarships/allocate'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'studentId': studentId, 'criteria': criteria}),
    );
    return json.decode(response.body);
  }
}