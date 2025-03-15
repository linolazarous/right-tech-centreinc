import 'package:flutter/material.dart';
import '../widgets/navbar.dart'; // Import the Navbar widget
import '../widgets/course_card.dart'; // Import the CourseCard widget

class HomeScreen extends StatelessWidget {
  // List of courses
  final List<Map<String, String>> courses = [
    {
      'title': 'React Mastery',
      'description': 'Learn React from scratch',
      'instructor': 'John Doe'
    },
    {
      'title': 'Node.js Basics',
      'description': 'Introduction to Node.js',
      'instructor': 'Jane Smith'
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Right Tech Centre'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Course List Section
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Featured Courses',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: courses.length,
                    itemBuilder: (context, index) {
                      return CourseCard(
                        title: courses[index]['title']!,
                        description: courses[index]['description']!,
                        instructor: courses[index]['instructor']!,
                      );
                    },
                  ),
                ],
              ),
            ),

            // Navigation Buttons Section
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Explore More',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  Wrap(
                    spacing: 8.0,
                    runSpacing: 8.0,
                    children: [
                      _buildNavigationButton(context, '/accessibility', "Accessibility"),
                      _buildNavigationButton(context, '/analytics', "Analytics"),
                      _buildNavigationButton(context, '/ar-learning', "AR Learning"),
                      _buildNavigationButton(context, '/arvr', "AR/VR"),
                      _buildNavigationButton(context, '/certificate', "Certificate"),
                      _buildNavigationButton(context, '/community-forum', "Community Forum"),
                      _buildNavigationButton(context, '/content-localization', "Content Localization"),
                      _buildNavigationButton(context, '/corporate-training', "Corporate Training"),
                      _buildNavigationButton(context, '/courses', "Courses"),
                      _buildNavigationButton(context, '/forum', "Forum"),
                      _buildNavigationButton(context, '/home-ad', "Home AD"),
                      _buildNavigationButton(context, '/interview-preparation', "Interview Preparation"),
                      _buildNavigationButton(context, '/job-portal', "Job Portal"),
                      _buildNavigationButton(context, '/language-switcher', "Language Switcher"),
                      _buildNavigationButton(context, '/learning-path', "Learning Path"),
                      _buildNavigationButton(context, '/live-class', "Live Class"),
                      _buildNavigationButton(context, '/metaverse', "Metaverse"),
                      _buildNavigationButton(context, '/micro-learning', "Micro Learning"),
                      _buildNavigationButton(context, '/offline-learning', "Offline Learning"),
                      _buildNavigationButton(context, '/privacy-policy', "Privacy Policy"),
                      _buildNavigationButton(context, '/proctoring', "Proctoring"),
                      _buildNavigationButton(context, '/profile', "Profile"),
                      _buildNavigationButton(context, '/push-notification', "Push Notification"),
                      _buildNavigationButton(context, '/scholarship', "Scholarship"),
                      _buildNavigationButton(context, '/study-groups', "Study Groups"),
                      _buildNavigationButton(context, '/subscription', "Subscription"),
                      _buildNavigationButton(context, '/terms-of-service', "Terms of Service"),
                      _buildNavigationButton(context, '/virtual-tutor', "Virtual Tutor"),
                      _buildNavigationButton(context, '/vr-learning', "VR Learning"),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Navbar(), // Add the Navbar at the bottom
    );
  }

  // Helper method to create navigation buttons
  Widget _buildNavigationButton(BuildContext context, String route, String text) {
    return ElevatedButton(
      onPressed: () {
        Navigator.pushNamed(context, route);
      },
      child: Text(text),
    );
  }
}