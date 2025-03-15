# Deployment Guide

## 1. Backend Deployment
1. **AWS Lambda Setup:**
   - Install the Serverless Framework: `npm install -g serverless`.
   - Deploy the backend: `serverless deploy`.

2. **AWS RDS Setup:**
   - Create a PostgreSQL database on AWS RDS.
   - Update the `MONGO_URI` in `.env` with the RDS endpoint.

3. **AWS S3 Setup:**
   - Create an S3 bucket for storing course content.
   - Update the `AWS_S3_BUCKET` in `.env`.

## 2. Frontend Deployment
1. **AWS S3 Hosting:**
   - Build the React app: `npm run build`.
   - Upload the build files to S3: `aws s3 cp build/ s3://right-tech-frontend --recursive`.

2. **AWS CloudFront Setup:**
   - Create a CloudFront distribution for the S3 bucket.
   - Update the DNS settings to point to the CloudFront URL.

## 3. Mobile App Deployment
1. **iOS:**
   - Build the Flutter app: `flutter build ios`.
   - Upload the app to the Apple App Store using Xcode.

2. **Android:**
   - Build the Flutter app: `flutter build apk`.
   - Upload the app to the Google Play Store.

## 4. CI/CD Pipeline
- Use GitHub Actions to automate deployment.
- Example workflow file: `.github/workflows/ci-cd.yml`.