import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

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
    final entries = _ticks.entries.toList()..sort((a, b) => a.key.compareTo(b.key));
    return Scaffold(
      appBar: AppBar(title: const Text('Canlı Fiyatlar')),
      body: _error != null
          ? Center(child: Text(_error!, style: const TextStyle(color: Colors.redAccent)))
          : entries.isEmpty
              ? const Center(child: Text('Canlı veri bekleniyor...'))
              : ListView.builder(
                  itemCount: entries.length,
                  itemBuilder: (_, i) {
                    final t = entries[i].value;
                    final change = (t['change24h'] ?? 0) as num;
                    final color = change >= 0 ? Colors.tealAccent : Colors.redAccent;
                    return ListTile(
                      title: Text(t['symbol']?.toString() ?? '-'),
                      subtitle: Text('${t['type']}'),
                      trailing: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('${t['price']}'),
                          Text('${change.toStringAsFixed(2)}%',
                              style: TextStyle(color: color)),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
