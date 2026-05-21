import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/api_client.dart';
import '../../core/auth_store.dart';
import 'login_screen.dart';

/// Profile screen — owned by Furkan.
/// Hits GET/PUT /api/v1/users/:id on port 8080.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _api = ApiClient('users');
  Map<String, dynamic>? _profile;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final id = context.read<AuthStore>().userId;
    if (id == null) return;
    try {
      final res = await _api.get('/users/$id');
      setState(() => _profile = (res.data as Map)['user'] as Map<String, dynamic>);
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  Future<void> _logout() async {
    await context.read<AuthStore>().clear();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AuthStore>();
    if (!store.isAuthenticated) {
      return const LoginScreen();
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: _logout),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _error != null
            ? Text(_error!, style: const TextStyle(color: Colors.redAccent))
            : _profile == null
                ? const Center(child: CircularProgressIndicator())
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _row('Ad Soyad', _profile!['full_name']?.toString() ?? '-'),
                      _row('Email', _profile!['email']?.toString() ?? '-'),
                      _row('Rol', _profile!['role']?.toString() ?? '-'),
                      _row('Risk', _profile!['risk_level']?.toString() ?? '-'),
                      _row('Bakiye',
                          (_profile!['virtual_balance'] ?? 0).toString()),
                    ],
                  ),
      ),
    );
  }

  Widget _row(String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(color: Colors.white70)),
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      );
}
