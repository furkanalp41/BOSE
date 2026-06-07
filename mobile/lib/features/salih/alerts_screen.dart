import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../widgets/widgets.dart';

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
        content: StatefulBuilder(
          builder: (ctx, setLocal) => Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              AppTextField(
                controller: symbolCtl,
                label: 'Sembol',
                icon: Icons.tag,
              ),
              const SizedBox(height: 14),
              AppTextField(
                controller: priceCtl,
                label: 'Hedef Fiyat',
                icon: Icons.attach_money,
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 14),
              DropdownButtonFormField<String>(
                initialValue: cond,
                dropdownColor: BoseColors.surface,
                decoration: const InputDecoration(labelText: 'Koşul'),
                items: const [
                  DropdownMenuItem(
                      value: 'GREATER_THAN', child: Text('> üstüne çıkarsa')),
                  DropdownMenuItem(
                      value: 'LESS_THAN', child: Text('< altına inerse')),
                ],
                onChanged: (v) {
                  if (v != null) setLocal(() => cond = v);
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('İptal')),
          FilledButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('Oluştur')),
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addAlert,
        icon: const Icon(Icons.add_alert),
        label: const Text('Yeni Alarm',
            style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: ErrorBanner(message: _error!),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _refresh,
                  color: BoseColors.neon,
                  backgroundColor: BoseColors.surface,
                  child: _alerts.isEmpty
                      ? _emptyState()
                      : ListView.separated(
                          padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
                          itemCount: _alerts.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: 12),
                          itemBuilder: (_, i) => _alertCard(_alerts[i]),
                        ),
                ),
    );
  }

  Widget _alertCard(Map<String, dynamic> a) {
    final isGreater = a['condition'] == 'GREATER_THAN';
    final condColor = isGreater ? BoseColors.neon : BoseColors.loss;
    final triggered = a['triggeredAt'] != null;
    final active = a['isActive'] == true;
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            height: 44,
            width: 44,
            decoration: BoxDecoration(
              color: condColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              isGreater ? Icons.north_east : Icons.south_east,
              color: condColor,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      a['symbol']?.toString() ?? '-',
                      style: const TextStyle(
                        color: BoseColors.text,
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      isGreater ? '≥' : '≤',
                      style: TextStyle(
                        color: condColor,
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${a['targetPrice']}',
                      style: TextStyle(
                        color: condColor,
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                _statusChip(triggered, active, a['triggeredAt']),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, color: BoseColors.muted),
            onPressed: () => _delete((a['id'] as num).toInt()),
          ),
        ],
      ),
    );
  }

  Widget _statusChip(bool triggered, bool active, dynamic triggeredAt) {
    late final Color color;
    late final String text;
    if (triggered) {
      color = BoseColors.cyan;
      text = 'Tetiklendi: $triggeredAt';
    } else if (active) {
      color = BoseColors.neon;
      text = 'Aktif';
    } else {
      color = BoseColors.muted;
      text = 'Pasif';
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            height: 7,
            width: 7,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Flexible(
            child: Text(
              text,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                  color: color, fontSize: 12, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _emptyState() {
    return ListView(
      children: const [
        SizedBox(height: 120),
        Icon(Icons.notifications_off_outlined,
            color: BoseColors.muted, size: 48),
        SizedBox(height: 16),
        Center(
          child: Text(
            'Henüz alarm yok',
            style: TextStyle(
              color: BoseColors.text,
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        SizedBox(height: 6),
        Center(
          child: Text(
            'Sağ alttaki butondan yeni bir fiyat alarmı oluştur.',
            style: TextStyle(color: BoseColors.muted, fontSize: 13),
          ),
        ),
      ],
    );
  }
}
