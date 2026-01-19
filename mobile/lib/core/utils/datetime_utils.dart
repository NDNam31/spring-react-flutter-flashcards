/// Utility functions for date and time operations
class DateTimeUtils {
  /// Convert DateTime to ISO 8601 string for database storage
  static String toIso8601(DateTime dateTime) {
    return dateTime.toUtc().toIso8601String();
  }

  /// Parse ISO 8601 string from database
  static DateTime? fromIso8601(String? isoString) {
    if (isoString == null || isoString.isEmpty) return null;
    try {
      return DateTime.parse(isoString);
    } catch (e) {
      return null;
    }
  }

  /// Get current timestamp as ISO 8601 string
  static String now() {
    return DateTime.now().toUtc().toIso8601String();
  }

  /// Check if date is in the past
  static bool isPast(String? isoString) {
    final date = fromIso8601(isoString);
    if (date == null) return false;
    return date.isBefore(DateTime.now());
  }

  /// Check if date is in the future
  static bool isFuture(String? isoString) {
    final date = fromIso8601(isoString);
    if (date == null) return false;
    return date.isAfter(DateTime.now());
  }

  /// Calculate days between two dates
  static int daysBetween(DateTime from, DateTime to) {
    final fromDate = DateTime(from.year, from.month, from.day);
    final toDate = DateTime(to.year, to.month, to.day);
    return toDate.difference(fromDate).inDays;
  }

  /// Add days to a date and return ISO string
  static String addDays(DateTime date, int days) {
    return date.add(Duration(days: days)).toUtc().toIso8601String();
  }

  /// Format date for display (e.g., "Jan 19, 2026")
  static String formatDate(DateTime date) {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  /// Format date and time for display (e.g., "Jan 19, 2026 at 3:45 PM")
  static String formatDateTime(DateTime date) {
    final formattedDate = formatDate(date);
    final hour = date.hour > 12 ? date.hour - 12 : date.hour;
    final period = date.hour >= 12 ? 'PM' : 'AM';
    final minute = date.minute.toString().padLeft(2, '0');
    return '$formattedDate at $hour:$minute $period';
  }

  /// Get relative time string (e.g., "2 hours ago", "in 3 days")
  static String getRelativeTime(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.isNegative) {
      // Future date
      final future = date.difference(now);
      if (future.inDays > 0) {
        return 'in ${future.inDays} ${future.inDays == 1 ? 'day' : 'days'}';
      } else if (future.inHours > 0) {
        return 'in ${future.inHours} ${future.inHours == 1 ? 'hour' : 'hours'}';
      } else if (future.inMinutes > 0) {
        return 'in ${future.inMinutes} ${future.inMinutes == 1 ? 'minute' : 'minutes'}';
      } else {
        return 'in a moment';
      }
    } else {
      // Past date
      if (difference.inDays > 0) {
        return '${difference.inDays} ${difference.inDays == 1 ? 'day' : 'days'} ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours} ${difference.inHours == 1 ? 'hour' : 'hours'} ago';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes} ${difference.inMinutes == 1 ? 'minute' : 'minutes'} ago';
      } else {
        return 'just now';
      }
    }
  }
}
