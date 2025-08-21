import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bus_transport_app/models/bus_data.dart';

class TerminalScreen extends StatelessWidget {
  const TerminalScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final terminals = Provider.of<BusData>(context).terminals;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bus Terminals'),
      ),
      body: ListView.builder(
        itemCount: terminals.length,
        itemBuilder: (context, index) {
          final terminal = terminals[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: const Icon(Icons.location_on, size: 40),
              title: Text(
                terminal['name'],
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(terminal['location']),
              trailing: const Icon(Icons.directions_bus),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Selected: ${terminal['name']}')),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
