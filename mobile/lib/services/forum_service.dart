import 'package:http/http.dart' as http;
import 'dart:convert';

class CommunityForumService {
  final String apiBaseUrl;

  CommunityForumService(this.apiBaseUrl);

  Future<dynamic> createPost(Map<String, dynamic> postData) async {
    final response = await http.post(
      Uri.parse('$apiBaseUrl/forum/posts'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(postData),
    );
    return json.decode(response.body);
  }

  Future<dynamic> getPosts() async {
    final response = await http.get(Uri.parse('$apiBaseUrl/forum/posts'));
    return json.decode(response.body);
  }
}