import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/terminal_screen.dart';
import 'screens/feedback_screen.dart';
import 'screens/login_screen.dart';
import 'package:bus_transport_app/widgets/rtght_drawer.dart';
import 'models/bus_data.dart';

void main() {
  runApp(const BusTransportApp());
}

class BusTransportApp extends StatelessWidget {
  const BusTransportApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => BusData(),
      child: MaterialApp(
        title: 'Bus Transport',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final busData = Provider.of<BusData>(context);

    if (busData.isLoggedIn) {
      return const MainScreen();
    } else {
      return const LoginScreen();
    }
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  final List<Widget> _screens = [
    const HomeScreen(),
    const TerminalScreen(),
    const FeedbackScreen(),
  ];

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    final busData = Provider.of<BusData>(context);

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('Bus Transport'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              busData.logout();
            },
          ),
        ],
      ),
      // Fixed: Changed from 'endDrawer' to 'drawer'
      drawer: const RightDrawer(),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.directions_bus),
            label: 'Buses',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.location_on),
            label: 'Terminals',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.star),
            label: 'Feedback',
          ),
        ],
      ),
    );
  }
}
