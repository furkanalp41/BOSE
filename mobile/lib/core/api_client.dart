import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Host mapping per BOSE service. Each member owns one service on a
/// dedicated port; the mobile app routes each domain to the right host.
///
/// Use `10.0.2.2` instead of `localhost` when running on the Android emulator.
const Map<String, String> serviceHosts = {
  'auth': 'http://10.0.2.2:8080',
  'users': 'http://10.0.2.2:8080',
  'admin': 'http://10.0.2.2:8084',
  'orders': 'http://10.0.2.2:8081',
  'aiPortfolio': 'http://10.0.2.2:8081',
  'alerts': 'http://10.0.2.2:8082',
  'chat': 'http://10.0.2.2:8082',
  'history': 'http://10.0.2.2:8082',
  'watchlists': 'http://10.0.2.2:8083',
  'aiStatus': 'http://10.0.2.2:8083',
  'market': 'http://10.0.2.2:8084',
};

const _secureStorage = FlutterSecureStorage();

/// ApiClient is a thin Dio wrapper that:
///  - prefixes every path with `/api/v1`
///  - injects the JWT bearer token from secure storage
///  - logs every request body in the network trace (for proof videos)
class ApiClient {
  ApiClient(this.service) : _dio = _build(service);

  final String service;
  final Dio _dio;

  static Dio _build(String service) {
    final host = serviceHosts[service];
    if (host == null) {
      throw ArgumentError('Unknown BOSE service: $service');
    }
    final dio = Dio(BaseOptions(
      baseUrl: '$host/api/v1',
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 10),
      contentType: 'application/json',
    ));
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.read(key: 'bose_token');
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
    ));
    return dio;
  }

  Future<Response<dynamic>> get(String path, {Map<String, dynamic>? query}) =>
      _dio.get(path, queryParameters: query);
  Future<Response<dynamic>> post(String path, {dynamic body}) =>
      _dio.post(path, data: body);
  Future<Response<dynamic>> put(String path, {dynamic body}) =>
      _dio.put(path, data: body);
  Future<Response<dynamic>> delete(String path) => _dio.delete(path);
}
