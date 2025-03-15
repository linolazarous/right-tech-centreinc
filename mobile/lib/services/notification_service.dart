import 'package:http/http.dart' as http;
import 'dart:convert';

class PushNotificationService {
  final String apiBaseUrl;

  PushNotificationService(this.apiBaseUrl);

  Future<dynamic> sendNotification(String userId, String message) async {
    final response = await http.post(
      Uri.parse('$apiBaseUrl/notifications/send'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'userId': userId, 'message': message}),
    );
    return json.decode(response.body);
  }
}