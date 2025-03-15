import 'package:flutter/material.dart';
import 'screens/accessibility_screen.dart';
import 'screens/analytics_screen.dart';
import 'screens/ar_learning_screen.dart';
import 'screens/arvr_screen.dart';
import 'screens/certificate_screen.dart';
import 'screens/community_forum_screen.dart';
import 'screens/content_localization_screens.dart';
import 'screens/corporate_training_screen.dart';
import 'screens/courses_screen.dart';
import 'screens/forum_screen.dart';
import 'screens/home_screen_ad.dart';
import 'screens/interview_preparation_screen.dart';
import 'screens/job_portal_screen.dart';
import 'screens/language_switcher_screen.dart';
import 'screens/learning_path_screen.dart';
import 'screens/live_class_screen.dart';
import 'screens/metaverse_screen.dart';
import 'screens/micro_learning_screen.dart';
import 'screens/offline_learning_screen.dart';
import 'screens/privacy_policy_screen.dart';
import 'screens/proctoring_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/push_notification_screen.dart';
import 'screens/scholarship_screen.dart';
import 'screens/study_groups_screen.dart';
import 'screens/subscription_screen.dart';
import 'screens/terms_of_service_screen.dart';
import 'screens/virtual_tutor_screen.dart';
import 'screens/vr_learning_screen.dart';
import 'screens/home_screen.dart'; // Import the home_screen.dart file

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Right Tech Centre',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomeScreen(), // Use the HomeScreen from home_screen.dart
      routes: {
        '/accessibility': (context) => AccessibilityScreen(),
        '/analytics': (context) => AnalyticsScreen(),
        '/ar-learning': (context) => ARLearningScreen(),
        '/arvr': (context) => ARVRScreen(),
        '/certificate': (context) => CertificateScreen(),
        '/community-forum': (context) => CommunityForumScreen(),
        '/content-localization': (context) => ContentLocalizationScreen(),
        '/corporate-training': (context) => CorporateTrainingScreen(),
        '/courses': (context) => CoursesScreen(),
        '/forum': (context) => ForumScreen(),
        '/home-ad': (context) => HomeScreenAd(),
        '/interview-preparation': (context) => InterviewPreparationScreen(),
        '/job-portal': (context) => JobPortalScreen(),
        '/language-switcher': (context) => LanguageSwitcherScreen(),
        '/learning-path': (context) => LearningPathScreen(),
        '/live-class': (context) => LiveClassScreen(),
        '/metaverse': (context) => MetaverseScreen(),
        '/micro-learning': (context) => MicroLearningScreen(),
        '/offline-learning': (context) => OfflineLearningScreen(),
        '/privacy-policy': (context) => PrivacyPolicyScreen(),
        '/proctoring': (context) => ProctoringScreen(),
        '/profile': (context) => ProfileScreen(),
        '/push-notification': (context) => PushNotificationScreen(),
        '/scholarship': (context) => ScholarshipScreen(),
        '/study-groups': (context) => StudyGroupsScreen(),
        '/subscription': (context) => SubscriptionScreen(),
        '/terms-of-service': (context) => TermsOfServiceScreen(),
        '/virtual-tutor': (context) => VirtualTutorScreen(),
        '/vr-learning': (context) => VRLearningScreen(),
      },
    );
  }
}