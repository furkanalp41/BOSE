import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../core/api_client.dart';
import '../../core/auth_store.dart';
import '../../core/theme.dart';
import '../../widgets/widgets.dart';
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

  String _formatBalance(dynamic raw) {
    final value = raw is num ? raw : num.tryParse('$raw') ?? 0;
    return NumberFormat.currency(symbol: '₺', decimalDigits: 2).format(value);
  }

  String _initials(String name) {
    final parts = name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty);
    if (parts.isEmpty) return '?';
    return parts.take(2).map((p) => p[0].toUpperCase()).join();
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
          IconButton(
            icon: const Icon(Icons.logout, color: BoseColors.loss),
            tooltip: 'Çıkış yap',
            onPressed: _logout,
          ),
        ],
      ),
      body: _error != null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: ErrorBanner(message: _error!),
              ),
            )
          : _profile == null
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: _load,
                  color: BoseColors.neon,
                  backgroundColor: BoseColors.surface,
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
                    children: [
                      _header(),
                      const SizedBox(height: 16),
                      _balanceCard(),
                      const SizedBox(height: 16),
                      _detailsCard(),
                    ],
                  ),
                ),
    );
  }

  Widget _header() {
    final name = _profile!['full_name']?.toString() ?? '-';
    final email = _profile!['email']?.toString() ?? '-';
    return GlassCard(
      padding: const EdgeInsets.all(18),
      child: Row(
        children: [
          Container(
            height: 60,
            width: 60,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [BoseColors.neon, BoseColors.cyan],
              ),
            ),
            alignment: Alignment.center,
            child: Text(
              _initials(name),
              style: const TextStyle(
                color: BoseColors.ink,
                fontWeight: FontWeight.w900,
                fontSize: 22,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    color: BoseColors.text,
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  email,
                  style: const TextStyle(color: BoseColors.muted, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _balanceCard() {
    return GlassCard(
      glow: true,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.account_balance_wallet_outlined,
                  color: BoseColors.neon, size: 18),
              SizedBox(width: 8),
              Text(
                'SANAL BAKİYE',
                style: TextStyle(
                  color: BoseColors.muted,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            _formatBalance(_profile!['virtual_balance'] ?? 0),
            style: const TextStyle(
              color: BoseColors.neon,
              fontSize: 34,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _detailsCard() {
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
      child: Column(
        children: [
          _statRow(Icons.person_outline, 'Ad Soyad',
              _profile!['full_name']?.toString() ?? '-'),
          const Divider(),
          _statRow(Icons.alternate_email, 'Email',
              _profile!['email']?.toString() ?? '-'),
          const Divider(),
          _statRow(Icons.shield_outlined, 'Rol',
              _profile!['role']?.toString() ?? '-'),
          const Divider(),
          _statRow(Icons.speed_outlined, 'Risk',
              _profile!['risk_level']?.toString() ?? '-'),
        ],
      ),
    );
  }

  Widget _statRow(IconData icon, String label, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: StatTile(icon: icon, label: label, value: value),
      );
}
