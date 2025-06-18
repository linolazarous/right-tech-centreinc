import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:right_tech_centre/routes/app_router.dart';
import 'package:right_tech_centre/services/do_spaces_service.dart';
import 'package:right_tech_centre/services/do_app_platform_service.dart';
import 'package:right_tech_centre/utils/connectivity_wrapper.dart';
import 'package:right_tech_centre/utils/error_boundary.dart';
import 'package:right_tech_centre/theme/app_theme.dart';

void main() async {
  // Ensure Flutter binding is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await dotenv.load(fileName: '.env');

  // Initialize DigitalOcean services
  await DoSpacesService.initialize(
    accessKey: dotenv.get('DO_SPACES_ACCESS_KEY'),
    secretKey: dotenv.get('DO_SPACES_SECRET_KEY'),
    region: dotenv.get('DO_SPACES_REGION', 'nyc3'),
    bucketName: dotenv.get('DO_SPACES_BUCKET'),
  );

  await DoAppPlatformService.initialize(
    apiKey: dotenv.get('DO_API_KEY'),
    appId: dotenv.get('DO_APP_ID'),
  );

  // System UI configuration
  await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

  runApp(
    ErrorBoundary(
      child: RightTechCentreApp(),
    ),
  );
}

class RightTechCentreApp extends StatelessWidget {
  final AppRouter _router = AppRouter();

  RightTechCentreApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Right Tech Centre',
      debugShowCheckedModeBanner: dotenv.get('ENV') != 'production',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: _router.config(),
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaleFactor: 1.0, // Prevent system text scaling
          ),
          child: ConnectivityWrapper(
            child: child!,
          ),
        );
      },
    );
  }
}
