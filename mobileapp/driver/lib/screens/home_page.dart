import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

import '../models/driver.dart';
import '../widgets/driver_marker.dart';
import '../widgets/feedback_rating_display.dart';
import '../services/auth_service.dart';
import '../services/driver_service.dart';
import '../services/feedback_service.dart';
import '../models/feedback.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final LatLng _initialLocation = LatLng(9.0192, 38.7525); // Addis Ababa, Ethiopia

  late AuthService _authService;
  late DriverService _driverService;
  late FeedbackService _feedbackService;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _authService = context.read<AuthService>();
    _driverService = context.read<DriverService>();
    _feedbackService = context.read<FeedbackService>();
  }

  Future<void> _logout() async {
    _authService.logout();
    if (!mounted) return;
    Navigator.pushReplacementNamed(context, '/login');
  }

  void _onFeedbackSectionTap() {
    // Mark new notifications as read on tap
    _feedbackService.markFeedbacksAsRead();
  }

  @override
  Widget build(BuildContext context) {
    final user = _authService.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          StreamBuilder<List<FeedbackModel>>(
              stream: _feedbackService.feedbackStream,
              builder: (context, snapshot) {
                final newFeedbackCount = snapshot.data
                        ?.where((f) => f.isNewNotification)
                        .length ??
                    0;
                return IconButton(
                  icon: Stack(
                    children: [
                      const Icon(Icons.feedback),
                      if (newFeedbackCount > 0)
                        Positioned(
                          right: 0,
                          top: 0,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              color: Colors.red.shade700,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            constraints: const BoxConstraints(
                              minWidth: 14,
                              minHeight: 14,
                            ),
                            child: Text(
                              newFeedbackCount.toString(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                    ],
                  ),
                  onPressed: _onFeedbackSectionTap,
                  tooltip: 'New feedbacks',
                );
              }),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'logout') _logout();
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            children: [
              UserAccountsDrawerHeader(
                accountName: Text(user?.name ?? 'User'),
                accountEmail: Text(user?.email ?? ''),
                currentAccountPicture: CircleAvatar(
                  backgroundImage: user?.profilePictureUrl != null
                      ? NetworkImage(user!.profilePictureUrl!)
                      : null,
                  backgroundColor: Colors.grey.shade300,
                  child: user?.profilePictureUrl == null
                      ? const Icon(Icons.person, size: 42)
                      : null,
                ),
              ),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Logout'),
                onTap: _logout,
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: StreamBuilder<List<Driver>>(
                stream: _driverService.driversStream,
                initialData: _driverService.currentDrivers,
                builder: (context, snapshot) {
                  final drivers = snapshot.data ?? [];
                  return FlutterMap(
                    options: MapOptions(
                      center: _initialLocation,
                      zoom: 13.0,
                      interactiveFlags:
                          InteractiveFlag.all & ~InteractiveFlag.rotate,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate:
                            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        subdomains: const ['a', 'b', 'c'],
                        userAgentPackageName: 'com.example.driver_feedback_app',
                      ),
                      MarkerLayer(
                        markers: drivers
                            .map(
                              (driver) => Marker(
                                width: 44,
                                height: 44,
                                point: driver.location,
                                builder: (context) =>
                                    DriverMarker(driver: driver),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  );
                }),
          ),
          GestureDetector(
            onTap: _onFeedbackSectionTap,
            child: const FeedbackRatingDisplay(),
          ),
        ],
      ),
    );
  }
}
