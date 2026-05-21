import 'package:flutter/material.dart';

import '../../core/api_client.dart';

/// Watchlists screen — owned by Enes.
/// Hits GET/POST/PUT/DELETE /api/v1/watchlists on port 8083.
class WatchlistsScreen extends StatefulWidget {
  const WatchlistsScreen({super.key});

  @override
  State<WatchlistsScreen> createState() => _WatchlistsScreenState();
}

class _WatchlistsScreenState extends State<WatchlistsScreen> {
  final _api = ApiClient('watchlists');
  List<Map<String, dynamic>> _lists = [];
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
      final res = await _api.get('/watchlists');
      final raw = (res.data as Map)['data'];
      setState(() => _lists = (raw as List).cast<Map<String, dynamic>>());
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _create() async {
    final ctl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Yeni İzleme Listesi'),
        content: TextField(controller: ctl, decoration: const InputDecoration(labelText: 'Liste Adı')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('İptal')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Oluştur')),
        ],
      ),
    );
    if (ok != true || ctl.text.trim().isEmpty) return;
    try {
      await _api.post('/watchlists', body: {'name': ctl.text.trim()});
      await _refresh();
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  Future<void> _delete(int id) async {
    try {
      await _api.delete('/watchlists/$id');
      await _refresh();
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('İzleme Listeleri')),
      floatingActionButton: FloatingActionButton(
        onPressed: _create,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!, style: const TextStyle(color: Colors.redAccent)))
              : RefreshIndicator(
                  onRefresh: _refresh,
                  child: ListView.separated(
                    itemCount: _lists.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (_, i) {
                      final w = _lists[i];
                      final assets = (w['assets'] as List?)?.cast<Map<String, dynamic>>() ?? [];
                      return Dismissible(
                        key: ValueKey(w['id']),
                        background: Container(
                          color: Colors.redAccent,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: const Icon(Icons.delete, color: Colors.white),
                        ),
                        direction: DismissDirection.endToStart,
                        onDismissed: (_) => _delete((w['id'] as num).toInt()),
                        child: ListTile(
                          title: Text(w['name']?.toString() ?? '-'),
                          subtitle: Text('${assets.length} varlık'),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
