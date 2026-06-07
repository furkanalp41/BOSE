import 'package:flutter/material.dart';

import '../core/theme.dart';

/// BrandHeader — the BOSE neon brand lockup shown on the auth screens.
class BrandHeader extends StatelessWidget {
  const BrandHeader({super.key, required this.subtitle});

  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          height: 72,
          width: 72,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [BoseColors.neon, BoseColors.cyan],
            ),
            boxShadow: [
              BoxShadow(
                color: BoseColors.neon.withValues(alpha: 0.35),
                blurRadius: 26,
                spreadRadius: -4,
              ),
            ],
          ),
          child: const Icon(Icons.candlestick_chart,
              color: BoseColors.ink, size: 38),
        ),
        const SizedBox(height: 18),
        const Text(
          'BOSE',
          style: TextStyle(
            color: BoseColors.text,
            fontSize: 34,
            fontWeight: FontWeight.w900,
            letterSpacing: 6,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          subtitle,
          style: const TextStyle(color: BoseColors.muted, fontSize: 13),
        ),
      ],
    );
  }
}
