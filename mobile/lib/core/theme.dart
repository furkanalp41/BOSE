import 'package:flutter/material.dart';

ThemeData boseTheme() {
  final base = ThemeData.dark(useMaterial3: true);
  return base.copyWith(
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF10B981),
      surface: Color(0xFF0F172A),
      onPrimary: Colors.white,
    ),
    scaffoldBackgroundColor: const Color(0xFF0F172A),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF0F172A),
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    cardColor: const Color(0xFF1E293B),
  );
}
