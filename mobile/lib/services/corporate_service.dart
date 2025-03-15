import 'package:http/http.dart' as http;
import 'dart:convert';

class CorporateTrainingService {
  final String apiBaseUrl;

  CorporateTrainingService(this.apiBaseUrl);

  Future<dynamic> createTraining(Map<String, dynamic> trainingData) async {
    final response = await http.post(
      Uri.parse('$apiBaseUrl/corporate/training'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(trainingData),
    );
    return json.decode(response.body);
  }
}