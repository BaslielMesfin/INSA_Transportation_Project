import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bus_transport_app/models/bus_data.dart';
import 'package:bus_transport_app/widgets/bus_info_card.dart';
import 'package:bus_transport_app/screens/leaflet_map_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Real-time Bus Tracking'),
        actions: [
          IconButton(
            icon: const Icon(Icons.map),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const LeafletMapScreen(),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 3,
            child: Container(
              color: Colors.grey[300],
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.map, size: 50, color: Colors.grey),
                    SizedBox(height: 10),
                    Text('Map View (Currently Disabled)'),
                    SizedBox(height: 10),
                    Text('Tap the map icon in the app bar to view the map'),
                  ],
                ),
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Available Buses',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            flex: 2,
            child: Consumer<BusData>(
              builder: (context, busData, child) {
                return ListView.builder(
                  itemCount: busData.buses.length,
                  itemBuilder: (context, index) {
                    final bus = busData.buses[index];
                    return BusInfoCard(bus: bus);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
