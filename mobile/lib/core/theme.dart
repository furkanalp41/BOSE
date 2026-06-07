import 'package:flutter/material.dart';

/// BOSE "go-lab" palette — a premium dark trading theme.
/// These constants are reused across the reusable widgets and feature
/// screens so the neon language stays consistent everywhere.
class BoseColors {
  BoseColors._();

  /// Neon green — primary accent, also used for gains.
  static const Color neon = Color(0xFF00FF88);

  /// Electric cyan — secondary accent.
  static const Color cyan = Color(0xFF00CFFF);

  /// Loss / danger red.
  static const Color loss = Color(0xFFFF3B5C);

  /// App background (near-black).
  static const Color background = Color(0xFF050508);

  /// Elevated surface (cards, sheets).
  static const Color surface = Color(0xFF13131F);

  /// App-bar / chrome surface.
  static const Color chrome = Color(0xFF0F0F1A);

  /// Input fill.
  static const Color field = Color(0xFF1A1A2E);

  /// Foreground on neon / dark backgrounds.
  static const Color ink = Color(0xFF050508);

  /// Primary text on dark surfaces.
  static const Color text = Color(0xFFE2E8F0);

  /// Muted / secondary text.
  static const Color muted = Color(0xFF94A3B8);

  /// Hairline border used on glass cards.
  static const Color border = Color(0x33FFFFFF);

  /// Returns the gain/loss colour for a numeric delta.
  static Color delta(num value) => value >= 0 ? neon : loss;
}

ThemeData boseTheme() {
  const scheme = ColorScheme.dark(
    primary: BoseColors.neon,
    secondary: BoseColors.cyan,
    surface: BoseColors.surface,
    error: BoseColors.loss,
    onPrimary: BoseColors.ink,
    onSecondary: BoseColors.ink,
    onSurface: BoseColors.text,
    onError: BoseColors.ink,
  );

  ButtonStyle neonButtonStyle() => ButtonStyle(
        backgroundColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.disabled)
              ? BoseColors.neon.withValues(alpha: 0.30)
              : BoseColors.neon,
        ),
        foregroundColor: const WidgetStatePropertyAll(BoseColors.ink),
        overlayColor:
            WidgetStatePropertyAll(BoseColors.ink.withValues(alpha: 0.08)),
        elevation: const WidgetStatePropertyAll(0),
        padding: const WidgetStatePropertyAll(
          EdgeInsets.symmetric(horizontal: 22, vertical: 16),
        ),
        textStyle: const WidgetStatePropertyAll(
          TextStyle(fontWeight: FontWeight.w800, fontSize: 15, letterSpacing: 0.3),
        ),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: scheme,
    scaffoldBackgroundColor: BoseColors.background,
    canvasColor: BoseColors.background,
    splashColor: BoseColors.neon.withValues(alpha: 0.08),
    highlightColor: BoseColors.neon.withValues(alpha: 0.06),
    dividerColor: BoseColors.border,
    appBarTheme: const AppBarThemeData(
      backgroundColor: BoseColors.chrome,
      foregroundColor: BoseColors.text,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        color: BoseColors.text,
        fontSize: 20,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.2,
      ),
    ),
    inputDecorationTheme: InputDecorationThemeData(
      filled: true,
      fillColor: BoseColors.field,
      labelStyle: const TextStyle(color: BoseColors.muted),
      floatingLabelStyle: const TextStyle(color: BoseColors.neon),
      hintStyle: const TextStyle(color: BoseColors.muted),
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BoseColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BoseColors.neon, width: 1.6),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BoseColors.loss),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BoseColors.loss, width: 1.6),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(style: neonButtonStyle()),
    elevatedButtonTheme: ElevatedButtonThemeData(style: neonButtonStyle()),
    textButtonTheme: TextButtonThemeData(
      style: ButtonStyle(
        foregroundColor: const WidgetStatePropertyAll(BoseColors.cyan),
        overlayColor:
            WidgetStatePropertyAll(BoseColors.cyan.withValues(alpha: 0.08)),
        textStyle: const WidgetStatePropertyAll(
          TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
    ),
    cardTheme: CardThemeData(
      color: BoseColors.surface,
      elevation: 0,
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: BoseColors.border),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: BoseColors.chrome,
      indicatorColor: BoseColors.neon.withValues(alpha: 0.16),
      elevation: 0,
      height: 68,
      labelTextStyle: WidgetStateProperty.resolveWith(
        (states) => TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: states.contains(WidgetState.selected)
              ? BoseColors.neon
              : BoseColors.muted,
        ),
      ),
      iconTheme: WidgetStateProperty.resolveWith(
        (states) => IconThemeData(
          color: states.contains(WidgetState.selected)
              ? BoseColors.neon
              : BoseColors.muted,
        ),
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: BoseColors.neon,
      foregroundColor: BoseColors.ink,
      elevation: 0,
    ),
    snackBarTheme: const SnackBarThemeData(
      backgroundColor: BoseColors.surface,
      contentTextStyle: TextStyle(color: BoseColors.text),
      behavior: SnackBarBehavior.floating,
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: BoseColors.surface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: BoseColors.border),
      ),
    ),
    listTileTheme: const ListTileThemeData(
      iconColor: BoseColors.muted,
      textColor: BoseColors.text,
    ),
    dividerTheme: const DividerThemeData(
      color: BoseColors.border,
      thickness: 1,
      space: 1,
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(
      color: BoseColors.neon,
    ),
    segmentedButtonTheme: SegmentedButtonThemeData(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? BoseColors.neon
              : BoseColors.field,
        ),
        foregroundColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? BoseColors.ink
              : BoseColors.text,
        ),
        side: const WidgetStatePropertyAll(
          BorderSide(color: BoseColors.border),
        ),
        textStyle: const WidgetStatePropertyAll(
          TextStyle(fontWeight: FontWeight.w700),
        ),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
    ),
    textSelectionTheme: const TextSelectionThemeData(
      cursorColor: BoseColors.neon,
      selectionColor: Color(0x3300FF88),
      selectionHandleColor: BoseColors.neon,
    ),
  );
}
