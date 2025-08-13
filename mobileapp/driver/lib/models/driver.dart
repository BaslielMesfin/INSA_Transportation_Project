import 'package:latlong2/latlong.dart';

enum DriverStatus { online, offline }

class Driver {
  final String id;
  final String name;
  final DriverStatus status;
  final LatLng location;
  final double averageRating;

  Driver({
    required this.id,
    required this.name,
    required this.status,
    required this.location,
    required this.averageRating,
  });

  factory Driver.fromJson(Map<String, dynamic> json) {
    return Driver(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      status: (json['status'] as String).toLowerCase() == 'online'
          ? DriverStatus.online
          : DriverStatus.offline,
      location: LatLng(
        (json['location']['latitude'] as num).toDouble(),
        (json['location']['longitude'] as num).toDouble(),
      ),
      averageRating: (json['averageRating'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'status': status == DriverStatus.online ? 'online' : 'offline',
        'location': {
          'latitude': location.latitude,
          'longitude': location.longitude,
        },
        'averageRating': averageRating,
      };
}
