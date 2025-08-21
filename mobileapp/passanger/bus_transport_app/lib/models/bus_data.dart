import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:latlong2/latlong.dart'; // Make sure this import is correct

class BusData extends ChangeNotifier {
  bool _isLoggedIn = false;
  String? _currentUser;

  final Map<String, Map<String, dynamic>> _users = {
    '1234567890': {
      'password': 'password',
      'name': 'Demo User',
      'email': 'demo@example.com',
    },
  };

  final List<Map<String, dynamic>> _buses = [
    {
      'id': 'B001',
      'name': 'Downtown Express',
      'route': 'Main St → City Center',
      'position': const LatLng(40.7128, -74.0060), // Using latlong2.LatLng
      'capacity': 0.7,
      'eta': '10 min',
      'driver': 'John Smith',
      'vehicle': 'Mercedes-Benz Citaro',
      'plate': 'ABC-123',
      'rating': 4.5,
    },
    {
      'id': 'B002',
      'name': 'University Line',
      'route': 'Campus → Library',
      'position': const LatLng(40.7589, -73.9851), // Using latlong2.LatLng
      'capacity': 0.4,
      'eta': '5 min',
      'driver': 'Sarah Johnson',
      'vehicle': 'Volvo 7900',
      'plate': 'XYZ-789',
      'rating': 4.2,
    },
  ];

  final List<Map<String, dynamic>> _terminals = [
    {
      'id': 'T001',
      'name': 'Central Terminal',
      'location': 'Downtown Plaza',
      'position': const LatLng(40.7128, -74.0060), // Using latlong2.LatLng
    },
    {
      'id': 'T002',
      'name': 'North Terminal',
      'location': 'University Avenue',
      'position': const LatLng(40.7589, -73.9851), // Using latlong2.LatLng
    },
  ];

  bool get isLoggedIn => _isLoggedIn;
  String? get currentUser => _currentUser;
  List<Map<String, dynamic>> get buses => _buses;
  List<Map<String, dynamic>> get terminals => _terminals;
  Map<String, dynamic>? get userData =>
      _currentUser != null ? _users[_currentUser] : null;

  Future<bool> login(String phoneNumber, String password) async {
    await Future.delayed(const Duration(seconds: 1));

    if (_users.containsKey(phoneNumber) &&
        _users[phoneNumber]!['password'] == password) {
      _isLoggedIn = true;
      _currentUser = phoneNumber;
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<bool> register(
      String phoneNumber, String password, String name, String email) async {
    await Future.delayed(const Duration(seconds: 1));

    if (_users.containsKey(phoneNumber)) {
      return false;
    }

    _users[phoneNumber] = {
      'password': password,
      'name': name,
      'email': email,
    };

    _isLoggedIn = true;
    _currentUser = phoneNumber;
    notifyListeners();
    return true;
  }

  Future<bool> resetPassword(String phoneNumber, String newPassword) async {
    await Future.delayed(const Duration(seconds: 1));

    if (_users.containsKey(phoneNumber)) {
      _users[phoneNumber]!['password'] = newPassword;
      notifyListeners();
      return true;
    }
    return false;
  }

  void logout() {
    _isLoggedIn = false;
    _currentUser = null;
    notifyListeners();
  }

  void updateBusPosition(String busId, LatLng newPosition) {
    final index = _buses.indexWhere((bus) => bus['id'] == busId);
    if (index != -1) {
      _buses[index]['position'] = newPosition;
      notifyListeners();
    }
  }

  void submitFeedback(String busId, double rating, String comment) {
    debugPrint('Feedback for $busId: Rating=$rating, Comment=$comment');

    final busIndex = _buses.indexWhere((bus) => bus['id'] == busId);
    if (busIndex != -1) {
      double currentRating = _buses[busIndex]['rating'];
      int currentRatings = _buses[busIndex]['ratingCount'] ?? 1;
      double newRating =
          ((currentRating * currentRatings) + rating) / (currentRatings + 1);

      _buses[busIndex]['rating'] = double.parse(newRating.toStringAsFixed(1));
      _buses[busIndex]['ratingCount'] = currentRatings + 1;
      notifyListeners();
    }
  }
}
