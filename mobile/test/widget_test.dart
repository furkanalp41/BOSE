// Smoke tests for the BOSE design system (theme + reusable widget kit).
//
// The previous default counter-app boilerplate referenced a `MyApp` class
// that does not exist in this project, which broke `flutter analyze`. These
// tests build the real theme and widgets so the suite compiles and passes.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bose_mobile/core/theme.dart';
import 'package:bose_mobile/widgets/widgets.dart';

void main() {
  testWidgets('boseTheme builds a dark Material 3 theme', (tester) async {
    final theme = boseTheme();
    expect(theme.useMaterial3, isTrue);
    expect(theme.brightness, Brightness.dark);
    expect(theme.colorScheme.primary, BoseColors.neon);
  });

  testWidgets('NeonButton renders its label and fires onPressed',
      (tester) async {
    var tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        theme: boseTheme(),
        home: Scaffold(
          body: NeonButton(
            label: 'Giriş Yap',
            onPressed: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('Giriş Yap'), findsOneWidget);
    await tester.tap(find.byType(NeonButton));
    expect(tapped, isTrue);
  });

  testWidgets('StatTile shows its label and value', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: boseTheme(),
        home: const Scaffold(
          body: StatTile(label: 'Bakiye', value: '1.000'),
        ),
      ),
    );

    expect(find.text('Bakiye'), findsOneWidget);
    expect(find.text('1.000'), findsOneWidget);
  });

  test('BoseColors.delta returns neon for gains and loss red for drops', () {
    expect(BoseColors.delta(1), BoseColors.neon);
    expect(BoseColors.delta(0), BoseColors.neon);
    expect(BoseColors.delta(-1), BoseColors.loss);
  });
}
