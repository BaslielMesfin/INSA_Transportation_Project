import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bus_transport_app/models/bus_data.dart';

class RightDrawer extends StatelessWidget {
  const RightDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final busData = Provider.of<BusData>(context);
    final theme = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final isTablet = mediaQuery.size.width > 600;
    final userData = busData.userData;

    return Drawer(
      elevation: 16,
      child: Container(
        width: isTablet
            ? mediaQuery.size.width * 0.4
            : mediaQuery.size.width * 0.7,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              theme.primaryColor,
              theme.primaryColor.withValues(alpha: 0.8),
            ],
          ),
        ),
        child: Column(
          children: [
            _buildUserHeader(context, busData, userData, isTablet),
            const SizedBox(height: 20),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  _buildDrawerItem(
                    context,
                    icon: Icons.person,
                    title: 'My Profile',
                    onTap: () {
                      Navigator.pop(context);
                      _showProfileDialog(context, busData, userData);
                    },
                  ),
                  _buildDrawerItem(
                    context,
                    icon: Icons.history,
                    title: 'Travel History',
                    onTap: () {
                      Navigator.pop(context);
                      _showTravelHistory(context);
                    },
                  ),
                  _buildDrawerItem(
                    context,
                    icon: Icons.payment,
                    title: 'Payment Methods',
                    onTap: () {
                      Navigator.pop(context);
                      _showPaymentMethods(context);
                    },
                  ),
                  _buildDrawerItem(
                    context,
                    icon: Icons.notifications,
                    title: 'Notifications',
                    onTap: () {
                      Navigator.pop(context);
                      _showNotifications(context);
                    },
                  ),
                  _buildDrawerItem(
                    context,
                    icon: Icons.settings,
                    title: 'Settings',
                    onTap: () {
                      Navigator.pop(context);
                      _showSettings(context);
                    },
                  ),
                  _buildDrawerItem(
                    context,
                    icon: Icons.help,
                    title: 'Help & Support',
                    onTap: () {
                      Navigator.pop(context);
                      _showHelpSupport(context);
                    },
                  ),
                  _buildDrawerItem(
                    context,
                    icon: Icons.info,
                    title: 'About',
                    onTap: () {
                      Navigator.pop(context);
                      _showAbout(context);
                    },
                  ),
                  const Divider(color: Colors.white54),
                  _buildDrawerItem(
                    context,
                    icon: Icons.logout,
                    title: 'Logout',
                    color: Colors.red[200],
                    onTap: () {
                      Navigator.pop(context);
                      _showLogoutDialog(context, busData);
                    },
                  ),
                ],
              ),
            ),
            _buildFooter(context),
          ],
        ),
      ),
    );
  }

  Widget _buildUserHeader(
    BuildContext context,
    BusData busData,
    Map<String, dynamic>? userData,
    bool isTablet,
  ) {
    return UserAccountsDrawerHeader(
      decoration: const BoxDecoration(
        color: Colors.transparent,
      ),
      accountName: Text(
        userData?['name'] ?? 'User: ${busData.currentUser ?? "Guest"}',
        style: TextStyle(
          fontSize: isTablet ? 18 : 16,
          fontWeight: FontWeight.bold,
        ),
      ),
      accountEmail: Text(
        userData?['email'] ?? 'Premium Member',
        style: TextStyle(
          fontSize: isTablet ? 14 : 12,
        ),
      ),
      currentAccountPicture: const CircleAvatar(
        backgroundColor: Colors.white,
        child: Icon(
          Icons.person,
          size: 40,
          color: Colors.blue,
        ),
      ),
      otherAccountsPictures: [
        IconButton(
          icon: const Icon(Icons.edit, color: Colors.white),
          onPressed: () {
            Navigator.pop(context);
            _showEditProfileDialog(context, userData);
          },
        ),
      ],
    );
  }

  Widget _buildDrawerItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    Color? color,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: color ?? Colors.white,
        size: 24,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: color ?? Colors.white,
          fontSize: 16,
        ),
      ),
      onTap: onTap,
      trailing: const Icon(
        Icons.chevron_right,
        color: Colors.white70,
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          Divider(color: Colors.white54),
          SizedBox(height: 10),
          Text(
            'Passanger App v1.0.0',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          SizedBox(height: 5),
          Text(
            '© 2025 Bus Transport Inc.',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  void _showProfileDialog(
    BuildContext context,
    BusData busData,
    Map<String, dynamic>? userData,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('User Profile'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Phone: ${busData.currentUser ?? "Not available"}'),
            const SizedBox(height: 10),
            Text('Name: ${userData?['name'] ?? "Not available"}'),
            const SizedBox(height: 10),
            Text('Email: ${userData?['email'] ?? "Not available"}'),
            const SizedBox(height: 10),
            const Text('Membership: Premium'),
            const SizedBox(height: 10),
            const Text('Member Since: Jan 2023'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showEditProfileDialog(
      BuildContext context, Map<String, dynamic>? userData) {
    final nameController = TextEditingController(text: userData?['name']);
    final emailController = TextEditingController(text: userData?['email']);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Profile'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(labelText: 'Full Name'),
            ),
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // ignore: prefer_const_constructors
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Profile updated successfully!')),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showTravelHistory(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Travel History')),
          body: const Center(
            child: Text('Travel history will appear here'),
          ),
        ),
      ),
    );
  }

  void _showPaymentMethods(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Payment Methods')),
          body: const Center(
            child: Text('Payment methods will appear here'),
          ),
        ),
      ),
    );
  }

  void _showNotifications(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Notifications')),
          body: const Center(
            child: Text('Notifications will appear here'),
          ),
        ),
      ),
    );
  }

  void _showSettings(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Settings')),
          body: const Center(
            child: Text('Settings will appear here'),
          ),
        ),
      ),
    );
  }

  void _showHelpSupport(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Help & Support')),
          body: const Center(
            child: Text('Help and support content will appear here'),
          ),
        ),
      ),
    );
  }

  void _showAbout(BuildContext context) {
    showAboutDialog(
      context: context,
      applicationName: 'Passanger App',
      applicationVersion: '1.0.0',
      applicationLegalese: '© 2025 Bus Transport System inc.',
      children: const [
        Text(
            'This app helps you track buses in real-time and provides a seamless transportation experience.'),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context, BusData busData) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              busData.logout();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}
