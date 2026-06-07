import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../widgets/widgets.dart';

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
        content: AppTextField(
          controller: ctl,
          label: 'Liste Adı',
          icon: Icons.bookmark_outline,
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _create,
        icon: const Icon(Icons.playlist_add),
        label: const Text('Yeni Liste',
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
                  child: _lists.isEmpty
                      ? _emptyState()
                      : ListView.separated(
                          padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
                          itemCount: _lists.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: 12),
                          itemBuilder: (_, i) {
                            final w = _lists[i];
                            final assets = (w['assets'] as List?)
                                    ?.cast<Map<String, dynamic>>() ??
                                [];
                            return Dismissible(
                              key: ValueKey(w['id']),
                              direction: DismissDirection.endToStart,
                              onDismissed: (_) =>
                                  _delete((w['id'] as num).toInt()),
                              background: Container(
                                alignment: Alignment.centerRight,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 24),
                                decoration: BoxDecoration(
                                  color: BoseColors.loss.withValues(alpha: 0.18),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                      color: BoseColors.loss
                                          .withValues(alpha: 0.4)),
                                ),
                                child: const Icon(Icons.delete_outline,
                                    color: BoseColors.loss),
                              ),
                              child: _listCard(w, assets.length),
                            );
                          },
                        ),
                ),
    );
  }

  Widget _listCard(Map<String, dynamic> w, int assetCount) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            height: 44,
            width: 44,
            decoration: BoxDecoration(
              color: BoseColors.cyan.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.bookmarks_outlined,
                color: BoseColors.cyan, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  w['name']?.toString() ?? '-',
                  style: const TextStyle(
                    color: BoseColors.text,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$assetCount varlık',
                  style:
                      const TextStyle(color: BoseColors.muted, fontSize: 13),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: BoseColors.muted),
        ],
      ),
    );
  }

  Widget _emptyState() {
    return ListView(
      children: const [
        SizedBox(height: 120),
        Icon(Icons.bookmark_border, color: BoseColors.muted, size: 48),
        SizedBox(height: 16),
        Center(
          child: Text(
            'Henüz izleme listesi yok',
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
            'İlk listeni oluşturmak için sağ alttaki butonu kullan.',
            style: TextStyle(color: BoseColors.muted, fontSize: 13),
          ),
        ),
      ],
    );
  }
}
