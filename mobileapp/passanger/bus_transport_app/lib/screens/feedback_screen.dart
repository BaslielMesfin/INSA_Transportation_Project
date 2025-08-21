import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bus_transport_app/models/bus_data.dart';

class FeedbackScreen extends StatelessWidget {
  const FeedbackScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final buses = Provider.of<BusData>(context).buses;
    final TextEditingController commentController = TextEditingController();
    double rating = 3.0;
    String? selectedBusId;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Feedback & Rating'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Bus:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            DropdownButton<String>(
              hint: const Text('Choose a bus'),
              value: selectedBusId,
              isExpanded: true,
              items: buses.map((bus) {
                return DropdownMenuItem<String>(
                  value: bus['id'],
                  child: Text('${bus['name']} (${bus['id']})'),
                );
              }).toList(),
              onChanged: (value) {
                selectedBusId = value;
              },
            ),
            const SizedBox(height: 20),
            const Text(
              'Your Rating:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            CustomRatingBar(
              onRatingUpdate: (newRating) {
                rating = newRating;
              },
            ),
            const SizedBox(height: 20),
            const Text(
              'Comments:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            TextField(
              controller: commentController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'Enter your feedback here...',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (selectedBusId != null) {
                    Provider.of<BusData>(context, listen: false).submitFeedback(
                      selectedBusId!,
                      rating,
                      commentController.text,
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Feedback submitted!')),
                    );
                    commentController.clear();
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please select a bus')),
                    );
                  }
                },
                child: const Text('Submit Feedback'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CustomRatingBar extends StatefulWidget {
  final Function(double) onRatingUpdate;

  const CustomRatingBar({Key? key, required this.onRatingUpdate})
      : super(key: key);

  @override
  State<CustomRatingBar> createState() => _CustomRatingBarState();
}

class _CustomRatingBarState extends State<CustomRatingBar> {
  double currentRating = 3.0;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (index) {
        return IconButton(
          icon: Icon(
            index < currentRating.floor()
                ? Icons.star
                : (index < currentRating ? Icons.star_half : Icons.star_border),
            color: Colors.amber,
            size: 36,
          ),
          onPressed: () {
            setState(() {
              currentRating = index + 1.0;
              widget.onRatingUpdate(currentRating);
            });
          },
        );
      }),
    );
  }
}
