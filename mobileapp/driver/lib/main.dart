import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'screens/login_page.dart';
import 'screens/home_page.dart';
import 'services/auth_service.dart';
import 'services/driver_service.dart';
import 'services/feedback_service.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => DriverService()),
        ChangeNotifierProvider(create: (_) => FeedbackService()),
      ],
      child: const DriverFeedbackApp(),
    ),
  );
}

class DriverFeedbackApp extends StatelessWidget {
  const DriverFeedbackApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Driver',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginPage(),
        '/home': (context) => const HomePage(),
      },
    );
  }
}
