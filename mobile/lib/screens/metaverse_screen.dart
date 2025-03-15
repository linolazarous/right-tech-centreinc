import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MetaverseScreen extends StatefulWidget {
  @override
  _MetaverseScreenState createState() => _MetaverseScreenState();
}

class _MetaverseScreenState extends State<MetaverseScreen> {
  final TextEditingController _campusNameController = TextEditingController();
  Map<String, dynamic>? _campus;

  Future<void> _createCampus() async {
    final response = await http.post(
      Uri.parse('/api/metaverse/create'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'campusName': _campusNameController.text,
      }),
    );
    if (response.statusCode == 201) {
      setState(() {
        _campus = json.decode(response.body);
      });
    } else {
      print('Error creating campus: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Metaverse")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _campusNameController,
              decoration: InputDecoration(labelText: "Campus Name"),
            ),
            ElevatedButton(
              onPressed: _createCampus,
              child: Text("Create Campus"),
            ),
            if (_campus != null) Text(JsonEncoder.withIndent('  ').convert(_campus)),
          ],
        ),
      ),
    );
  }
}