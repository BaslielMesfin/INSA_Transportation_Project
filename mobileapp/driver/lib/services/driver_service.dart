import 'dart:async';
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';

import '../models/driver.dart';

class DriverService extends ChangeNotifier {
  final List<Driver> _drivers = [
    Driver(
      id: 'd1',
      name: 'Dawit',
      status: DriverStatus.online,
      location: LatLng(9.0192, 38.7525),
      averageRating: 4.3,
    ),
    Driver(
      id: 'd2',
      name: 'Yonas',
      status: DriverStatus.offline,
      location: LatLng(9.011285554303473, 38.74726167918787),
      averageRating: 3.9,
    ),
    Driver(
      id: 'd3',
      name: 'Abebe',
      status: DriverStatus.online,
      location: LatLng(9.010668465801745, 38.760969685670815),
      averageRating: 4.7,
    ),
    Driver(
      id: 'd4',
      name: 'Netsanet',
      status: DriverStatus.offline,
      location: LatLng(9.00467490368316, 38.76793057864822),
      averageRating: 4.1,
    ),
  ];

  final StreamController<List<Driver>> _driversController = StreamController.broadcast();

  DriverService() {
    // Simulate periodic updates for driver locations or statuses
    _updateDriversPeriodically();
  }

  List<Driver> get currentDrivers => List.unmodifiable(_drivers);

  Stream<List<Driver>> get driversStream => _driversController.stream;

  void _updateDriversPeriodically() {
    Timer.periodic(const Duration(seconds: 15), (timer) {
      // For demonstration, toggle driver statuses randomly and shift locations slightly
      for (var i = 0; i < _drivers.length; i++) {
        final driver = _drivers[i];
        final newStatus = driver.status == DriverStatus.online
            ? DriverStatus.offline
            : DriverStatus.online;

        final newLocation = LatLng(
          driver.location.latitude + (0.001 * (i % 2 == 0 ? 1 : -1)),
          driver.location.longitude + (0.0015 * (i % 2 == 0 ? -1 : 1)),
        );

        _drivers[i] = Driver(
          id: driver.id,
          name: driver.name,
          status: newStatus,
          location: newLocation,
          averageRating: driver.averageRating,
        );
      }
      _driversController.add(List.unmodifiable(_drivers));
      notifyListeners();
    });

    // Initial emit
    _driversController.add(List.unmodifiable(_drivers));
  }

  @override
  void dispose() {
    _driversController.close();
    super.dispose();
  }
}
