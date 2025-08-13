import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:provider/provider.dart';

import '../models/feedback.dart';
import '../services/feedback_service.dart';

class FeedbackRatingDisplay extends StatelessWidget {
  const FeedbackRatingDisplay({super.key});

  @override
  Widget build(BuildContext context) {
    final feedbackService = context.watch<FeedbackService>();
    final feedbacks = feedbackService.currentFeedbacks;
    final averageRating = feedbackService.averageRating;
    final newCount = feedbackService.newFeedbackCount;

    return Card(
      elevation: 4,
      margin: const EdgeInsets.all(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text(
                  'Driver Rating: ',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 18,
                  ),
                ),
                RatingBarIndicator(
                  rating: averageRating,
                  itemBuilder: (context, _) => const Icon(
                    Icons.star,
                    color: Colors.amber,
                  ),
                  itemSize: 20,
                  itemCount: 5,
                ),
                const SizedBox(width: 8),
                Text(
                  averageRating.toStringAsFixed(2),
                  style: const TextStyle(fontSize: 16),
                ),
                const Spacer(),
                if (newCount > 0)
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(Icons.notifications, color: Colors.red.shade700),
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            color: Colors.red.shade700,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          constraints: const BoxConstraints(
                            minWidth: 14,
                            minHeight: 14,
                          ),
                          child: Text(
                            newCount.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      )
                    ],
                  ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 110,
              child: feedbacks.isEmpty
                  ? const Center(child: Text("No feedbacks yet"))
                  : ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: feedbacks.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        final f = feedbacks[index];
                        return FeedbackCard(feedback: f);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class FeedbackCard extends StatelessWidget {
  final FeedbackModel feedback;

  const FeedbackCard({super.key, required this.feedback});

  @override
  Widget build(BuildContext context) {
    // Since feedback userId is internal, we mock user name display
    final userDisplayName = 'User ${feedback.userId}';

    return Container(
      width: 220,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: feedback.isNewNotification ? Colors.yellow.shade100 : Colors.grey.shade100,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: feedback.isNewNotification ? Colors.orange.shade700 : Colors.grey.shade300,
          width: feedback.isNewNotification ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            userDisplayName,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
          ),
          const SizedBox(height: 4),
          RatingBarIndicator(
            rating: feedback.rating,
            itemBuilder: (context, _) => const Icon(
              Icons.star,
              color: Colors.amber,
            ),
            itemSize: 16,
            itemCount: 5,
          ),
          const SizedBox(height: 6),
          Text(
            feedback.feedbackText,
            style: const TextStyle(fontSize: 13),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          const Spacer(),
          Text(
            _formattedTimestamp(feedback.timestamp),
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey.shade600,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  String _formattedTimestamp(DateTime ts) {
    final now = DateTime.now();
    final diff = now.difference(ts);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inHours < 1) return '${diff.inMinutes} min ago';
    if (diff.inDays < 1) return '${diff.inHours} hr ago';
    return '${diff.inDays} day${diff.inDays > 1 ? 's' : ''} ago';
  }
}
