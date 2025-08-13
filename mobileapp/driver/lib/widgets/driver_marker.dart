import 'package:flutter/material.dart';

import '../models/driver.dart';

class DriverMarker extends StatelessWidget {
  final Driver driver;

  const DriverMarker({super.key, required this.driver});

  @override
  Widget build(BuildContext context) {
    final isOnline = driver.status == DriverStatus.online;

    return Tooltip(
      message: '${driver.name}\nStatus: ${isOnline ? "Online" : "Offline"}',
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: isOnline ? Colors.green.shade600 : Colors.grey.shade500,
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 2),
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 4,
              offset: Offset(1, 1),
            ),
          ],
        ),
        child: Center(
          child: Icon(
            Icons.local_taxi,
            color: Colors.white,
            size: 20,
          ),
        ),
      ),
    );
  }
}
