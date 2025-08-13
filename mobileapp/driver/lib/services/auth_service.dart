import 'package:flutter/material.dart';

import '../models/user.dart';

class AuthService extends ChangeNotifier {
  User? _user;
  bool _loggedIn = false;
  bool _isLoading = false;
  String? _errorMessage;

  User? get user => _user;
  bool get isLoggedIn => _loggedIn;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> login({required String email, required String password}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    // Mock login delay
    await Future.delayed(const Duration(seconds: 2));

    // Mock validation
    if (email.isNotEmpty && password.isNotEmpty && password.length >= 4) {
      // Success: assign user object
      _user = User(
        id: '1',
        name: 'Demo User',
        email: email,
        profilePictureUrl:
            'https://tse1.mm.bing.net/th/id/OIP.7qw7v2DN1V4PuHF4zFAiAAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      );
      _loggedIn = true;
    } else {
      _errorMessage = 'Invalid email or password';
      _loggedIn = false;
      _user = null;
    }

    _isLoading = false;
    notifyListeners();
  }

  void logout() {
    _user = null;
    _loggedIn = false;
    _errorMessage = null;
    notifyListeners();
  }
}
