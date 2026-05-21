import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// AuthStore keeps the JWT + cached user object in flutter_secure_storage
/// so secrets survive cold restarts without going into plain SharedPreferences.
class AuthStore extends ChangeNotifier {
  AuthStore(this._storage);

  final FlutterSecureStorage _storage;
  String? _token;
  Map<String, dynamic>? _user;

  String? get token => _token;
  Map<String, dynamic>? get user => _user;
  int? get userId => _user?['ID'] is int
      ? _user!['ID'] as int
      : (_user?['ID'] as num?)?.toInt();
  bool get isAuthenticated => _token != null && _token!.isNotEmpty;

  Future<void> load() async {
    _token = await _storage.read(key: 'bose_token');
    final raw = await _storage.read(key: 'bose_user');
    if (raw != null && raw.isNotEmpty) {
      _user = jsonDecode(raw) as Map<String, dynamic>;
    }
    notifyListeners();
  }

  Future<void> save(String token, Map<String, dynamic> user) async {
    _token = token;
    _user = user;
    await _storage.write(key: 'bose_token', value: token);
    await _storage.write(key: 'bose_user', value: jsonEncode(user));
    notifyListeners();
  }

  Future<void> clear() async {
    _token = null;
    _user = null;
    await _storage.delete(key: 'bose_token');
    await _storage.delete(key: 'bose_user');
    notifyListeners();
  }
}
