import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../widgets/widgets.dart';

/// Market order screen — owned by Cem.
/// Hits POST /api/v1/orders/market on port 8081.
class MarketOrderScreen extends StatefulWidget {
  const MarketOrderScreen({super.key});

  @override
  State<MarketOrderScreen> createState() => _MarketOrderScreenState();
}

class _MarketOrderScreenState extends State<MarketOrderScreen> {
  final _api = ApiClient('orders');
  final _symbol = TextEditingController(text: 'THYAO');
  final _quantity = TextEditingController(text: '10');
  String _side = 'BUY';
  String? _result;
  String? _error;
  bool _loading = false;

  Future<void> _submit() async {
    setState(() {
      _loading = true;
      _result = null;
      _error = null;
    });
    try {
      final res = await _api.post('/orders/market', body: {
        'symbol': _symbol.text.trim().toUpperCase(),
        'side': _side,
        'quantity': double.tryParse(_quantity.text) ?? 0,
      });
      final order = (res.data as Map)['order'] as Map<String, dynamic>;
      setState(() {
        _result = 'Emir #${order['id']} ${_side == 'BUY' ? 'AL' : 'SAT'} '
            'fiyat ${order['filledPrice']}';
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isBuy = _side == 'BUY';
    final sideColor = isBuy ? BoseColors.neon : BoseColors.loss;
    return Scaffold(
      appBar: AppBar(title: const Text('Piyasa Emri')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          GlassCard(
            glow: true,
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Container(
                      height: 38,
                      width: 38,
                      decoration: BoxDecoration(
                        color: sideColor.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        isBuy ? Icons.trending_up : Icons.trending_down,
                        color: sideColor,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Yeni Piyasa Emri',
                        style: TextStyle(
                          color: BoseColors.text,
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                AppTextField(
                  controller: _symbol,
                  label: 'Sembol',
                  hint: 'THYAO',
                  icon: Icons.tag,
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),
                AppTextField(
                  controller: _quantity,
                  label: 'Adet',
                  hint: '10',
                  icon: Icons.numbers,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 18),
                const Text(
                  'YÖN',
                  style: TextStyle(
                    color: BoseColors.muted,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 8),
                SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(
                      value: 'BUY',
                      label: Text('AL'),
                      icon: Icon(Icons.arrow_upward),
                    ),
                    ButtonSegment(
                      value: 'SELL',
                      label: Text('SAT'),
                      icon: Icon(Icons.arrow_downward),
                    ),
                  ],
                  selected: {_side},
                  onSelectionChanged: (s) => setState(() => _side = s.first),
                ),
                const SizedBox(height: 24),
                NeonButton(
                  label: _loading
                      ? 'Gönderiliyor...'
                      : (isBuy ? 'AL Emri Gönder' : 'SAT Emri Gönder'),
                  icon: Icons.bolt,
                  loading: _loading,
                  color: sideColor,
                  onPressed: _loading ? null : _submit,
                ),
              ],
            ),
          ),
          if (_result != null) ...[
            const SizedBox(height: 16),
            _resultCard(),
          ],
          if (_error != null) ...[
            const SizedBox(height: 16),
            ErrorBanner(message: _error!),
          ],
        ],
      ),
    );
  }

  Widget _resultCard() {
    return GlassCard(
      borderColor: BoseColors.neon.withValues(alpha: 0.5),
      padding: const EdgeInsets.all(18),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: BoseColors.neon, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Emir Gerçekleşti',
                  style: TextStyle(
                    color: BoseColors.neon,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _result!,
                  style: const TextStyle(color: BoseColors.text, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
