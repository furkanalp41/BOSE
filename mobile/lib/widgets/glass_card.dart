import 'package:flutter/material.dart';

import '../core/theme.dart';

/// GlassCard — a translucent, rounded "frosted" panel used as the primary
/// content container across BOSE. Dependency-free (no blur plugins): the
/// glass effect is faked with a subtle gradient + hairline border.
class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.onTap,
    this.borderColor,
    this.glow = false,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final Color? borderColor;

  /// When true, adds a faint neon outer glow (used for hero panels).
  final bool glow;

  @override
  Widget build(BuildContext context) {
    final card = DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF1B1B2B),
            Color(0xFF12121C),
          ],
        ),
        border: Border.all(color: borderColor ?? BoseColors.border),
        boxShadow: glow
            ? [
                BoxShadow(
                  color: BoseColors.neon.withValues(alpha: 0.12),
                  blurRadius: 24,
                  spreadRadius: -6,
                ),
              ]
            : const [
                BoxShadow(
                  color: Color(0x33000000),
                  blurRadius: 16,
                  offset: Offset(0, 8),
                ),
              ],
      ),
      child: Padding(padding: padding, child: child),
    );

    if (onTap == null) return Container(margin: margin, child: card);

    return Container(
      margin: margin,
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          splashColor: BoseColors.neon.withValues(alpha: 0.08),
          highlightColor: BoseColors.neon.withValues(alpha: 0.04),
          child: card,
        ),
      ),
    );
  }
}
