import 'package:flutter/material.dart';

class BusInfoCard extends StatelessWidget {
  final Map<String, dynamic> bus;

  const BusInfoCard({Key? key, required this.bus}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.directions_bus, size: 30),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    bus['name'],
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getCapacityColor(bus['capacity']),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${(bus['capacity'] * 100).toInt()}% full',
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text('Route: ${bus['route']}'),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.access_time, size: 20),
                const SizedBox(width: 5),
                Text('ETA: ${bus['eta']}'),
                const SizedBox(width: 20),
                const Icon(Icons.person, size: 20),
                const SizedBox(width: 5),
                Text('Driver: ${bus['driver']}'),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.directions_car, size: 20),
                const SizedBox(width: 5),
                Text('${bus['vehicle']} (${bus['plate']})'),
                const Spacer(),
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 18),
                    Text(' ${bus['rating']}'),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getCapacityColor(double capacity) {
    if (capacity < 0.5) return Colors.green;
    if (capacity < 0.8) return Colors.orange;
    return Colors.red;
  }
}
