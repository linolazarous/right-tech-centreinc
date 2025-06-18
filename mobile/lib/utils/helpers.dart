import 'package:intl/intl.dart';
import 'constants.dart';

class AppHelpers {
  // Date/Time Formatting
  static String formatDate(DateTime date, {String format = 'dd/MM/yyyy'}) {
    return DateFormat(format).format(date);
  }

  static String formatDateTime(DateTime date) {
    return DateFormat('dd/MM/yyyy HH:mm').format(date);
  }

  static String timeAgo(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays > 365) {
      return '${(difference.inDays / 365).floor()}y ago';
    } else if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()}mo ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    }
    return 'Just now';
  }

  // Text Processing
  static String truncateText(String text, int maxLength, {bool showEllipsis = true}) {
    if (text.length <= maxLength) return text;
    return showEllipsis 
        ? '${text.substring(0, maxLength)}...' 
        : text.substring(0, maxLength);
  }

  static String capitalize(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }

  // DigitalOcean Helpers
  static String getDoSpaceUrl(String region, String bucket) {
    return AppConstants.doSpacesEndpoint
        .replaceAll('{region}', region)
        .replaceAll('{bucket}', bucket);
  }

  static String getDoCdnUrl(String id) {
    return AppConstants.doCdnBaseUrl.replaceAll('{id}', id);
  }

  // Validation
  static bool isValidEmail(String email) {
    return RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(email);
  }

  static bool isStrongPassword(String password) {
    return password.length >= 8 &&
        password.contains(RegExp(r'[A-Z]')) &&
        password.contains(RegExp(r'[a-z]')) &&
        password.contains(RegExp(r'[0-9]'));
  }

  // Network Helpers
  static String buildApiUrl(String endpoint, {Map<String, dynamic>? queryParams}) {
    final uri = Uri.parse(endpoint);
    return uri.replace(queryParameters: queryParams).toString();
  }
}
