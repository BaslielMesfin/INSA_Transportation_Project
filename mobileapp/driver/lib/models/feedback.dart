class FeedbackModel {
  final String id;
  final String driverId;
  final String userId;
  final double rating;
  final String feedbackText;
  final DateTime timestamp;
  final bool isNewNotification;

  FeedbackModel({
    required this.id,
    required this.driverId,
    required this.userId,
    required this.rating,
    required this.feedbackText,
    required this.timestamp,
    this.isNewNotification = false,
  });

  factory FeedbackModel.fromJson(Map<String, dynamic> json) => FeedbackModel(
        id: json['id'] ?? '',
        driverId: json['driverId'] ?? '',
        userId: json['userId'] ?? '',
        rating: (json['rating'] as num).toDouble(),
        feedbackText: json['feedbackText'] ?? '',
        timestamp: DateTime.parse(json['timestamp'] ?? DateTime.now().toIso8601String()),
        isNewNotification: json['isNewNotification'] ?? false,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'driverId': driverId,
        'userId': userId,
        'rating': rating,
        'feedbackText': feedbackText,
        'timestamp': timestamp.toIso8601String(),
        'isNewNotification': isNewNotification,
      };
}
