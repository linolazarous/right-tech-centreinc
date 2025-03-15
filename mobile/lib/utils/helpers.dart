class Helpers {
  static String formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  static String truncateText(String text, int maxLength) {
    return text.length > maxLength ? '${text.substring(0, maxLength)}...' : text;
  }
}