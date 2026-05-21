import 'package:flutter/material.dart';

import '../../core/api_client.dart';

/// Alerts screen — owned by Salih.
/// Hits GET/POST/DELETE /api/v1/alerts on port 8082.
class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  final _api = ApiClient('alerts');
  List<Map<String, dynamic>> _alerts = [];
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  Future<void> _refresh() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.get('/alerts');
      final raw = (res.data as Map)['data'];
      setState(() {
        _alerts = (raw as List).cast<Map<String, dynamic>>();
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _addAlert() async {
    final symbolCtl = TextEditingController(text: 'BTCUSDT');
    final priceCtl = TextEditingController(text: '70000');
    String cond = 'GREATER_THAN';
    final created = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Yeni Alarm'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: symbolCtl, decoration: const InputDecoration(labelText: 'Sembol')),
            TextField(controller: priceCtl, decoration: const InputDecoration(labelText: 'Hedef Fiyat')),
            DropdownButton<String>(
              value: cond,
              items: const [
                DropdownMenuItem(value: 'GREATER_THAN', child: Text('> üstüne çıkarsa')),
                DropdownMenuItem(value: 'LESS_THAN', child: Text('< altına inerse')),
              ],
              onChanged: (v) {
                if (v != null) cond = v;
              },
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('İptal')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Oluştur')),
        ],
      ),
    );
    if (created != true) return;
    try {
      await _api.post('/alerts', body: {
        'symbol': symbolCtl.text.trim().toUpperCase(),
        'targetPrice': double.tryParse(priceCtl.text) ?? 0,
        'condition': cond,
      });
      await _refresh();
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  Future<void> _delete(int id) async {
    try {
      await _api.delete('/alerts/$id');
      await _refresh();
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fiyat Alarmları')),
      floatingActionButton: FloatingActionButton(
        onPressed: _addAlert,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!, style: const TextStyle(color: Colors.redAccent)))
              : RefreshIndicator(
                  onRefresh: _refresh,
                  child: ListView.separated(
                    itemCount: _alerts.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (_, i) {
                      final a = _alerts[i];
                      return ListTile(
                        title: Text('${a['symbol']} ${a['condition']} ${a['targetPrice']}'),
                        subtitle: Text(a['triggeredAt'] != null
                            ? 'Tetiklendi: ${a['triggeredAt']}'
                            : (a['isActive'] == true ? 'Aktif' : 'Pasif')),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete_outline),
                          onPressed: () => _delete((a['id'] as num).toInt()),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
