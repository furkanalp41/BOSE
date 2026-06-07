import 'package:flutter/material.dart';

import '../core/theme.dart';

/// StatTile — a compact label/value pair used to render metrics
/// (balance, role, price, change, ...). The value can be tinted to signal
/// gains (neon) or losses (red).
class StatTile extends StatelessWidget {
  const StatTile({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.valueColor,
    this.large = false,
  });

  final String label;
  final String value;
  final IconData? icon;
  final Color? valueColor;

  /// When true, renders the value at hero size (used for prominent numbers).
  final bool large;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        if (icon != null) ...[
          Container(
            height: 38,
            width: 38,
            decoration: BoxDecoration(
              color: BoseColors.neon.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 19, color: BoseColors.neon),
          ),
          const SizedBox(width: 12),
        ],
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              color: BoseColors.muted,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          value,
          textAlign: TextAlign.right,
          style: TextStyle(
            color: valueColor ?? BoseColors.text,
            fontSize: large ? 20 : 15,
            fontWeight: large ? FontWeight.w800 : FontWeight.w700,
            letterSpacing: 0.2,
          ),
        ),
      ],
    );
  }
}
