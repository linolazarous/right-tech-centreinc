import 'package:flutter/material.dart';
import 'package:i18next/i18next.dart';

class LanguageSwitcherScreen extends StatefulWidget {
  @override
  _LanguageSwitcherScreenState createState() => _LanguageSwitcherScreenState();
}

class _LanguageSwitcherScreenState extends State<LanguageSwitcherScreen> {
  String _language = 'en';

  void _changeLanguage(String language) {
    setState(() {
      _language = language;
    });
    I18Next.of(context).changeLanguage(language);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Language Switcher")),
      body: Center(
        child: DropdownButton<String>(
          value: _language,
          onChanged: (String? newValue) {
            if (newValue != null) {
              _changeLanguage(newValue);
            }
          },
          items: <String>['en', 'es', 'fr', 'zh']
              .map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ),
      ),
    );
  }
}