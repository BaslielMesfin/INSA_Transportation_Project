import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bus_transport_app/main.dart';

void main() {
  testWidgets('App loads without crashing', (WidgetTester tester) async {
    // Build our app and trigger a frame
    await tester.pumpWidget(const BusTransportApp());

    // Verify that the app loads by checking for the bottom navigation bar
    expect(find.byType(BottomNavigationBar), findsOneWidget);

    // Verify that the home screen is initially loaded
    expect(find.text('Real-time Bus Tracking'), findsOneWidget);
  });
}
