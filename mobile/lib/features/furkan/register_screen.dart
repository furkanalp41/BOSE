import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/api_client.dart';
import '../../core/auth_store.dart';
import '../../core/theme.dart';
import '../../widgets/widgets.dart';
import 'profile_screen.dart';

/// Register screen — owned by Furkan.
/// Hits POST /api/v1/auth/register on port 8080.
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _name = TextEditingController();
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
      final res = await _api.post('/auth/register', body: {
        'full_name': _name.text.trim(),
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
      appBar: AppBar(title: const Text('Kayıt Ol')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const BrandHeader(subtitle: 'Yeni bir hesap oluştur'),
                  const SizedBox(height: 28),
                  GlassCard(
                    glow: true,
                    padding: const EdgeInsets.all(22),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text(
                          'Aramıza katıl',
                          style: TextStyle(
                            color: BoseColors.text,
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Sanal bakiye ile risksiz işlem yapmaya başla.',
                          style: TextStyle(color: BoseColors.muted, fontSize: 13),
                        ),
                        const SizedBox(height: 22),
                        AppTextField(
                          controller: _name,
                          label: 'Ad Soyad',
                          hint: 'Adınız ve soyadınız',
                          icon: Icons.badge_outlined,
                          textInputAction: TextInputAction.next,
                        ),
                        const SizedBox(height: 16),
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
                          label: 'Şifre (min 6)',
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
                          label: _loading ? 'Hesap açılıyor...' : 'Hesap Aç',
                          icon: Icons.person_add_alt_1,
                          loading: _loading,
                          onPressed: _loading ? null : _submit,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Zaten hesabınız var mı? Giriş yapın'),
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
