import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class ApiService {
  final String baseUrl = Constants.apiBaseUrl;

  Future<dynamic> get(String endpoint) async {
    final response = await http.get(Uri.parse('$baseUrl/$endpoint'));
    return json.decode(response.body);
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    return json.decode(response.body);
  }
}