import 'package:flutter/material.dart';

import '../../core/api_client.dart';

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
    return Scaffold(
      appBar: AppBar(title: const Text('Piyasa Emri')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _symbol,
              decoration: const InputDecoration(labelText: 'Sembol'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _quantity,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Adet'),
            ),
            const SizedBox(height: 12),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'BUY', label: Text('AL')),
                ButtonSegment(value: 'SELL', label: Text('SAT')),
              ],
              selected: {_side},
              onSelectionChanged: (s) => setState(() => _side = s.first),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _loading ? null : _submit,
              child: Text(_loading ? 'Gönderiliyor...' : 'Emri Gönder'),
            ),
            const SizedBox(height: 24),
            if (_result != null)
              Text(_result!, style: const TextStyle(color: Colors.tealAccent)),
            if (_error != null)
              Text(_error!, style: const TextStyle(color: Colors.redAccent)),
          ],
        ),
      ),
    );
  }
}
