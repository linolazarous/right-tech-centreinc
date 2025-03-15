import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ContentLocalizationScreen extends StatefulWidget {
  @override
  _ContentLocalizationScreenState createState() => _ContentLocalizationScreenState();
}

class _ContentLocalizationScreenState extends State<ContentLocalizationScreen> {
  final TextEditingController _textController = TextEditingController();
  String _targetLanguage = "es";
  String _translatedText = "";

  Future<void> _translateText() async {
    final response = await http.post(
      Uri.parse('/api/localization/translate'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'text': _textController.text,
        'targetLanguage': _targetLanguage,
      }),
    );
    if (response.statusCode == 200) {
      setState(() {
        _translatedText = json.decode(response.body)['translatedText'];
      });
    } else {
      print('Error translating text: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Content Localization")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _textController,
              decoration: InputDecoration(labelText: "Enter text to translate"),
              maxLines: 5,
            ),
            DropdownButton<String>(
              value: _targetLanguage,
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    _targetLanguage = newValue;
                  });
                }
              },
              items: <String>['es', 'fr', 'zh']
                  .map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            ElevatedButton(
              onPressed: _translateText,
              child: Text("Translate"),
            ),
            if (_translatedText.isNotEmpty) Text(_translatedText),
          ],
        ),
      ),
    );
  }
}