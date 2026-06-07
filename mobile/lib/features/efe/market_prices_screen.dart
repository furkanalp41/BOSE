import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../../core/theme.dart';
import '../../widgets/widgets.dart';

/// Live market prices screen — owned by Efe.
/// Streams from ws://10.0.2.2:8084/api/v1/market/stream.
/// Falls back to a "no data yet" placeholder until the first tick arrives.
class MarketPricesScreen extends StatefulWidget {
  const MarketPricesScreen({super.key});

  @override
  State<MarketPricesScreen> createState() => _MarketPricesScreenState();
}

class _MarketPricesScreenState extends State<MarketPricesScreen> {
  WebSocketChannel? _channel;
  StreamSubscription? _sub;
  final Map<String, Map<String, dynamic>> _ticks = {};
  String? _error;

  @override
  void initState() {
    super.initState();
    _connect();
  }

  void _connect() {
    try {
      _channel = WebSocketChannel.connect(
        Uri.parse('ws://10.0.2.2:8084/api/v1/market/stream'),
      );
      _sub = _channel!.stream.listen(
        (msg) {
          try {
            final t = jsonDecode(msg as String) as Map<String, dynamic>;
            final sym = t['symbol'] as String;
            setState(() => _ticks[sym] = t);
          } catch (_) {}
        },
        onError: (e) => setState(() => _error = e.toString()),
      );
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  void dispose() {
    _sub?.cancel();
    _channel?.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final entries = _ticks.entries.toList()
      ..sort((a, b) => a.key.compareTo(b.key));
    final live = _error == null && entries.isNotEmpty;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Canlı Fiyatlar'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: _LiveBadge(live: live),
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
          : entries.isEmpty
              ? _waiting()
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
                  itemCount: entries.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (_, i) => _tickCard(entries[i].value),
                ),
    );
  }

  Widget _tickCard(Map<String, dynamic> t) {
    final change = (t['change24h'] ?? 0) as num;
    final up = change >= 0;
    final color = BoseColors.delta(change);
    final symbol = t['symbol']?.toString() ?? '-';
    final type = t['type']?.toString() ?? '';
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            height: 46,
            width: 46,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Text(
              symbol.isNotEmpty ? symbol[0] : '?',
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w900,
                fontSize: 20,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  symbol,
                  style: const TextStyle(
                    color: BoseColors.text,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                if (type.isNotEmpty) ...[
                  const SizedBox(height: 3),
                  Text(
                    type,
                    style: const TextStyle(
                      color: BoseColors.muted,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${t['price']}',
                style: const TextStyle(
                  color: BoseColors.text,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(up ? Icons.arrow_drop_up : Icons.arrow_drop_down,
                        color: color, size: 18),
                    Text(
                      '${change.toStringAsFixed(2)}%',
                      style: TextStyle(
                        color: color,
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _waiting() {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            height: 28,
            width: 28,
            child: CircularProgressIndicator(strokeWidth: 2.4),
          ),
          SizedBox(height: 18),
          Text(
            'Canlı veri bekleniyor...',
            style: TextStyle(
              color: BoseColors.text,
              fontSize: 15,
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: 6),
          Text(
            'Piyasa akışına bağlanılıyor.',
            style: TextStyle(color: BoseColors.muted, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

/// A small live/offline indicator pill for the app bar.
class _LiveBadge extends StatelessWidget {
  const _LiveBadge({required this.live});

  final bool live;

  @override
  Widget build(BuildContext context) {
    final color = live ? BoseColors.neon : BoseColors.muted;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            height: 8,
            width: 8,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            live ? 'CANLI' : 'BEKLE',
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}
