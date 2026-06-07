import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/api_client.dart';
import '../../core/auth_store.dart';
import '../../core/theme.dart';
import '../../widgets/widgets.dart';
import 'profile_screen.dart';
import 'register_screen.dart';

/// Login screen — owned by Furkan.
/// Hits POST /api/v1/auth/login on port 8080.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _api = ApiClient('auth');
  String? _error;
  bool _loading = false;

  Future<void> _submit() async {
    setState(() {
      _error = null;
      _loading = true;
    });
    try {
      final res = await _api.post('/auth/login', body: {
        'email': _email.text.trim(),
        'password': _password.text,
      });
      final data = res.data as Map<String, dynamic>;
      final token = data['token'] as String;
      final user = data['user'] as Map<String, dynamic>;
      await context.read<AuthStore>().save(token, user);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const ProfileScreen()),
      );
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const BrandHeader(subtitle: 'Borsa & Kripto Simülasyonu'),
                  const SizedBox(height: 32),
                  GlassCard(
                    glow: true,
                    padding: const EdgeInsets.all(22),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text(
                          'Tekrar hoş geldin',
                          style: TextStyle(
                            color: BoseColors.text,
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Hesabına giriş yap ve işleme başla.',
                          style: TextStyle(color: BoseColors.muted, fontSize: 13),
                        ),
                        const SizedBox(height: 22),
                        AppTextField(
                          controller: _email,
                          label: 'Email',
                          hint: 'ornek@bose.com',
                          icon: Icons.alternate_email,
                          keyboardType: TextInputType.emailAddress,
                          textInputAction: TextInputAction.next,
                        ),
                        const SizedBox(height: 16),
                        AppTextField(
                          controller: _password,
                          label: 'Şifre',
                          hint: '••••••••',
                          icon: Icons.lock_outline,
                          obscureText: true,
                          textInputAction: TextInputAction.done,
                          onSubmitted: (_) => _loading ? null : _submit(),
                        ),
                        if (_error != null) ...[
                          const SizedBox(height: 16),
                          ErrorBanner(message: _error!),
                        ],
                        const SizedBox(height: 24),
                        NeonButton(
                          label: _loading ? 'Giriş yapılıyor...' : 'Giriş Yap',
                          icon: Icons.login,
                          loading: _loading,
                          onPressed: _loading ? null : _submit,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  TextButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const RegisterScreen()),
                    ),
                    child: const Text('Hesabınız yok mu? Kayıt olun'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
