import 'dart:async';
import 'package:flutter/material.dart';

import '../models/feedback.dart';

class FeedbackService extends ChangeNotifier {
  final List<FeedbackModel> _feedbacks = [
    FeedbackModel(
      id: 'f1',
      driverId: 'd1',
      userId: 'u1',
      rating: 4.5,
      feedbackText: 'Great driving, very professional!',
      timestamp: DateTime.now().subtract(const Duration(days: 2, hours: 1)),
      isNewNotification: false,
    ),
    FeedbackModel(
      id: 'f2',
      driverId: 'd3',
      userId: 'u2',
      rating: 3.8,
      feedbackText: 'Arrived a bit late but good service.',
      timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
      isNewNotification: false,
    ),
  ];

  final StreamController<List<FeedbackModel>> _feedbackController = StreamController.broadcast();

  FeedbackService() {
    _startSimulatedNewFeedback();
    _feedbackController.add(List.unmodifiable(_feedbacks));
  }

  Stream<List<FeedbackModel>> get feedbackStream => _feedbackController.stream;

  List<FeedbackModel> get currentFeedbacks => List.unmodifiable(_feedbacks);

  double get averageRating {
    if (_feedbacks.isEmpty) return 0.0;
    double sum = 0;
    for (var f in _feedbacks) {
      sum += f.rating;
    }
    return sum / _feedbacks.length;
  }

  int get newFeedbackCount => _feedbacks.where((f) => f.isNewNotification).length;

  // This method simulates incoming new feedbacks every 45 seconds
  void _startSimulatedNewFeedback() {
    Timer.periodic(const Duration(seconds: 45), (timer) {
      final newFeedback = FeedbackModel(
        id: 'f${_feedbacks.length + 1}',
        driverId: 'd1',
        userId: 'u${_feedbacks.length + 1}',
        rating: 4.0 + (0.5 * (_feedbacks.length % 2)),
        feedbackText: 'New feedback message #${_feedbacks.length + 1}',
        timestamp: DateTime.now(),
        isNewNotification: true,
      );
      _feedbacks.insert(0, newFeedback);
      _feedbackController.add(List.unmodifiable(_feedbacks));
      notifyListeners();
    });
  }

  void markFeedbacksAsRead() {
    var changed = false;
    for (var i = 0; i < _feedbacks.length; i++) {
      if (_feedbacks[i].isNewNotification) {
        _feedbacks[i] = FeedbackModel(
          id: _feedbacks[i].id,
          driverId: _feedbacks[i].driverId,
          userId: _feedbacks[i].userId,
          rating: _feedbacks[i].rating,
          feedbackText: _feedbacks[i].feedbackText,
          timestamp: _feedbacks[i].timestamp,
          isNewNotification: false,
        );
        changed = true;
      }
    }
    if (changed) {
      _feedbackController.add(List.unmodifiable(_feedbacks));
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _feedbackController.close();
    super.dispose();
  }
}
