import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

import 'core/auth_store.dart';
import 'core/theme.dart';
import 'features/cem/market_order_screen.dart';
import 'features/efe/market_prices_screen.dart';
import 'features/enes/watchlists_screen.dart';
import 'features/furkan/login_screen.dart';
import 'features/furkan/profile_screen.dart';
import 'features/salih/alerts_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final store = AuthStore(const FlutterSecureStorage());
  await store.load();
  runApp(BoseApp(store: store));
}

class BoseApp extends StatelessWidget {
  const BoseApp({super.key, required this.store});

  final AuthStore store;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<AuthStore>.value(
      value: store,
      child: MaterialApp(
        title: 'BOSE',
        theme: boseTheme(),
        debugShowCheckedModeBanner: false,
        home: const _Root(),
      ),
    );
  }
}

class _Root extends StatelessWidget {
  const _Root();

  @override
  Widget build(BuildContext context) {
    final store = context.watch<AuthStore>();
    if (!store.isAuthenticated) {
      return const LoginScreen();
    }
    return const _HomeShell();
  }
}

/// _HomeShell is the bottom-nav container that surfaces one feature
/// module per developer. Each tab is a self-contained screen owned
/// end-to-end by its team member.
class _HomeShell extends StatefulWidget {
  const _HomeShell();

  @override
  State<_HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<_HomeShell> {
  int _index = 0;

  final _tabs = const <Widget>[
    ProfileScreen(),         // Furkan
    MarketOrderScreen(),     // Cem
    AlertsScreen(),          // Salih
    WatchlistsScreen(),      // Enes
    MarketPricesScreen(),    // Efe
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _index, children: _tabs),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.person), label: 'Profil'),
          NavigationDestination(icon: Icon(Icons.swap_horiz), label: 'Emir'),
          NavigationDestination(icon: Icon(Icons.notifications), label: 'Alarm'),
          NavigationDestination(icon: Icon(Icons.list), label: 'Liste'),
          NavigationDestination(icon: Icon(Icons.show_chart), label: 'Piyasa'),
        ],
      ),
    );
  }
}
