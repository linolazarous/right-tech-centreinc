import 'package:flutter/material.dart';
import '../widgets/certificate_widget.dart';
import '../services/blockchain_service.dart';

class CertificateScreen extends StatefulWidget {
  @override
  _CertificateScreenState createState() => _CertificateScreenState();
}

class _CertificateScreenState extends State<CertificateScreen> {
  String certificateHash = '';
  bool isValid = false;

  Future<void> verifyCertificate() async {
    final result = await BlockchainService.verifyCertificate(certificateHash);
    setState(() {
      isValid = result['success'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Certificate Verification'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'Enter Certificate Hash',
              ),
              onChanged: (value) {
                setState(() {
                  certificateHash = value;
                });
              },
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: verifyCertificate,
              child: Text('Verify'),
            ),
            SizedBox(height: 16),
            CertificateWidget(
              certificateHash: certificateHash,
              isValid: isValid,
            ),
          ],
        ),
      ),
    );
  }
}