import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import 'package:bus_transport_app/models/bus_data.dart';

class LeafletMapScreen extends StatefulWidget {
  const LeafletMapScreen({Key? key}) : super(key: key);

  @override
  State<LeafletMapScreen> createState() => _LeafletMapScreenState();
}

class _LeafletMapScreenState extends State<LeafletMapScreen> {
  late MapController mapController;
  final LatLng _initialPosition =
      const LatLng(9.0192, 38.7525); // Addis Ababa, Ethiopia
  late Timer _timer;

  // Track which marker is selected
  String? _selectedMarkerId;
  LatLng? _selectedMarkerPosition;
  Map<String, dynamic>? _selectedMarkerData;

  @override
  void initState() {
    super.initState();
    mapController = MapController();
    // Start a timer to update bus positions every 5 seconds
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      _updateBusPositions();
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  void _updateBusPositions() {
    final busData = Provider.of<BusData>(context, listen: false);

    for (var bus in busData.buses) {
      final currentPosition = bus['position'] as LatLng;
      final newPosition = LatLng(
        currentPosition.latitude + (Random().nextDouble() - 0.5) * 0.001,
        currentPosition.longitude + (Random().nextDouble() - 0.5) * 0.001,
      );
      busData.updateBusPosition(bus['id'], newPosition);
    }
  }

  void _onMarkerTap(String id, LatLng position, Map<String, dynamic> data) {
    setState(() {
      _selectedMarkerId = id;
      _selectedMarkerPosition = position;
      _selectedMarkerData = data;
    });

    // Center the map on the selected marker
    mapController.move(position, 15.0);
  }

  void _closeInfoPanel() {
    setState(() {
      _selectedMarkerId = null;
      _selectedMarkerPosition = null;
      _selectedMarkerData = null;
    });
  }

  // Method to calculate distance between two points
  double _calculateDistance(LatLng start, LatLng end) {
    const double earthRadius = 6371; // Earth's radius in kilometers

    final double dLat = _degreesToRadians(end.latitude - start.latitude);
    final double dLon = _degreesToRadians(end.longitude - start.longitude);

    final double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_degreesToRadians(start.latitude)) *
            cos(_degreesToRadians(end.latitude)) *
            sin(dLon / 2) *
            sin(dLon / 2);

    final double c = 2 * atan2(sqrt(a), sqrt(1 - a));

    return earthRadius * c; // Distance in kilometers
  }

  double _degreesToRadians(double degrees) {
    return degrees * (pi / 180);
  }

  @override
  Widget build(BuildContext context) {
    final busData = Provider.of<BusData>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bus Map'),
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            onPressed: () {
              mapController.move(_initialPosition, 14.0);
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: mapController,
            options: MapOptions(
              center: _initialPosition,
              zoom: 12.0,
              minZoom: 5.0,
              maxZoom: 18.0,
            ),
            children: [
              TileLayer(
                urlTemplate:
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                subdomains: const ['a', 'b', 'c'],
                userAgentPackageName: 'com.example.bus_transport_app',
              ),
              // Terminal markers
              MarkerLayer(
                markers: busData.terminals.map((terminal) {
                  final position = terminal['position'] as LatLng;
                  return Marker(
                    point: position,
                    width: 80.0,
                    height: 80.0,
                    builder: (ctx) => GestureDetector(
                      onTap: () =>
                          _onMarkerTap(terminal['id'], position, terminal),
                      child: Icon(
                        Icons.location_on,
                        color: _selectedMarkerId == terminal['id']
                            ? Colors.red
                            : Colors.blue,
                        size: 40,
                      ),
                    ),
                  );
                }).toList(),
              ),
              // Bus markers
              MarkerLayer(
                markers: busData.buses.map((bus) {
                  final position = bus['position'] as LatLng;
                  return Marker(
                    point: position,
                    width: 80.0,
                    height: 80.0,
                    builder: (ctx) => GestureDetector(
                      onTap: () => _onMarkerTap(bus['id'], position, bus),
                      child: Icon(
                        Icons.directions_bus,
                        color: _selectedMarkerId == bus['id']
                            ? Colors.red
                            : Colors.green,
                        size: 40,
                      ),
                    ),
                  );
                }).toList(),
              ),
              // Route lines for buses
              PolylineLayer(
                polylines: busData.buses.map((bus) {
                  final position = bus['position'] as LatLng;
                  // Create a simple route line
                  final points = [
                    position,
                    LatLng(
                      position.latitude + 0.01,
                      position.longitude + 0.01,
                    ),
                  ];
                  return Polyline(
                    points: points,
                    strokeWidth: 3.0,
                    color: Colors.blue,
                  );
                }).toList(),
              ),
            ],
          ),
          // Information panel
          if (_selectedMarkerData != null)
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8.0),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 4.0,
                      offset: const Offset(0.0, 2.0),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _selectedMarkerData!['name'],
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18.0,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: _closeInfoPanel,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8.0),
                    if (_selectedMarkerData!['location'] != null)
                      Text(
                        'Location: ${_selectedMarkerData!['location']}',
                        style: const TextStyle(fontSize: 16.0),
                      ),
                    if (_selectedMarkerData!['route'] != null) ...[
                      const SizedBox(height: 4.0),
                      Text(
                        'Route: ${_selectedMarkerData!['route']}',
                        style: const TextStyle(fontSize: 16.0),
                      ),
                    ],
                    if (_selectedMarkerData!['eta'] != null) ...[
                      const SizedBox(height: 4.0),
                      Text(
                        'ETA: ${_selectedMarkerData!['eta']}',
                        style: const TextStyle(fontSize: 16.0),
                      ),
                    ],
                    if (_selectedMarkerData!['driver'] != null) ...[
                      const SizedBox(height: 4.0),
                      Text(
                        'Driver: ${_selectedMarkerData!['driver']}',
                        style: const TextStyle(fontSize: 16.0),
                      ),
                    ],
                    // Use _selectedMarkerPosition to show distance from user's location
                    if (_selectedMarkerPosition != null) ...[
                      const SizedBox(height: 8.0),
                      Text(
                        'Distance from center: ${_calculateDistance(_initialPosition, _selectedMarkerPosition!).toStringAsFixed(2)} km',
                        style:
                            const TextStyle(fontSize: 14.0, color: Colors.grey),
                      ),
                    ],
                    // Add a button to get directions to the selected location
                    const SizedBox(height: 12.0),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          // In a real app, this would open directions
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content:
                                    Text('Directions feature coming soon!')),
                          );
                        },
                        child: const Text('Get Directions'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
