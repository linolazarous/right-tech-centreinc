class AppConstants {
  // DigitalOcean Services Configuration
  static const String doApiBaseUrl = 'https://api.digitalocean.com/v2';
  static const String doSpacesEndpoint = 'https://{region}.digitaloceanspaces.com';
  static const String doCdnBaseUrl = 'https://{id}.cdn.digitaloceanspaces.com';
  
  // App Configuration
  static const String appBaseUrl = 'https://app.righttechcentre.com';
  static const String apiBaseUrl = 'https://api.righttechcentre.com';
  
  // Default DigitalOcean Region
  static const String defaultDoRegion = 'nyc3';
  
  // Storage Configuration
  static const String courseContentBucket = 'righttech-course-content';
  static const String userUploadsBucket = 'righttech-user-uploads';
  
  // API Endpoints
  static const String coursesEndpoint = '$apiBaseUrl/v1/courses';
  static const String usersEndpoint = '$apiBaseUrl/v1/users';
  static const String forumEndpoint = '$apiBaseUrl/v1/forum';
  
  // Cache Durations
  static const Duration defaultCacheDuration = Duration(minutes: 15);
  static const Duration longCacheDuration = Duration(hours: 1);
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Authentication
  static const String authTokenKey = 'x-do-auth-token';
  static const String apiKeyHeader = 'x-api-key';
  
  // Feature Flags
  static const bool enableDoSpacesUpload = true;
  static const bool enableDoCdn = true;
}
