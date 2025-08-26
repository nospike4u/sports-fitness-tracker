# Fitbit OAuth Setup Guide

This guide will help you set up OAuth authentication with Fitbit for your sports fitness tracker app.

## Prerequisites

1. A Fitbit developer account
2. A registered Fitbit application

## Step 1: Create a Fitbit Developer Application

1. Go to [https://dev.fitbit.com/apps](https://dev.fitbit.com/apps)
2. Sign in with your Fitbit account
3. Click "Register a New App"
4. Fill in the application details:
   - **Application Name**: Your app name (e.g., "Sports Fitness Tracker")
   - **Description**: Brief description of your app
   - **Application Website**: Your website URL (can be localhost for development)
   - **Organization**: Your organization name
   - **Organization Website**: Your organization website
   - **Terms of Service URL**: Your terms of service URL
   - **Privacy Policy URL**: Your privacy policy URL
   - **OAuth 2.0 Application Type**: Choose "Server" for production or "Personal" for development
   - **Redirect URL**: `http://localhost:8000/api/v1/oauth/fitbit/callback`
   - **Default Access Type**: Choose "Read & Write" or "Read-Only" based on your needs

5. Click "Register App"

## Step 2: Configure Environment Variables

1. Copy the `.env.example` file to `.env` in the server directory:
   ```bash
   cp server/.env.example server/.env
   ```

2. Update the `.env` file with your Fitbit app credentials:
   ```env
   # Fitbit OAuth Configuration
   FITBIT_CLIENT_ID=your-actual-client-id-from-fitbit
   FITBIT_CLIENT_SECRET=your-actual-client-secret-from-fitbit
   FITBIT_REDIRECT_URI=http://localhost:8000/api/v1/oauth/fitbit/callback
   
   # Other required variables
   PORT=8000
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/sports-fitness-tracker
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   ```

## Step 3: Install Dependencies

If you haven't already, install the required dependencies:

```bash
# Server dependencies
cd server
npm install

# Client dependencies  
cd ../client
npm install
```

## Step 4: Start the Application

1. Start MongoDB (if running locally)
2. Start the server:
   ```bash
   cd server
   npm run dev
   ```
3. Start the client:
   ```bash
   cd client
   npm run dev
   ```

## Step 5: Test the OAuth Flow

1. Navigate to `http://localhost:5173/dashboard`
2. In the "Fitbit Connection" section, click "Connect Fitbit"
3. You'll be redirected to Fitbit's authorization page
4. Log in with your Fitbit account and authorize the app
5. You'll be redirected back to your app with a success message
6. Your Fitbit data should now be displayed on the dashboard

## Available Fitbit Data Endpoints

Once connected, the following data is available:

- **Profile**: User profile information
- **Activities**: Daily activities, steps, calories, distance
- **Sleep**: Sleep duration, stages, efficiency
- **Heart Rate**: Resting heart rate, heart rate zones
- **Steps**: Step count and trends
- **Weight**: Weight logs and BMI

## API Endpoints

### OAuth Endpoints
- `POST /api/v1/oauth/fitbit/auth` - Initialize OAuth flow
- `GET /api/v1/oauth/fitbit/callback` - OAuth callback (handled by Fitbit)
- `GET /api/v1/oauth/fitbit/status/:userId` - Check connection status
- `DELETE /api/v1/oauth/fitbit/disconnect/:userId` - Disconnect account
- `POST /api/v1/oauth/fitbit/refresh/:userId` - Refresh tokens

### Data Endpoints
- `GET /api/v1/fitbit/profile/:userId` - Get user profile
- `GET /api/v1/fitbit/activities/:userId` - Get activities data
- `GET /api/v1/fitbit/sleep/:userId` - Get sleep data
- `GET /api/v1/fitbit/heartrate/:userId` - Get heart rate data
- `GET /api/v1/fitbit/steps/:userId` - Get steps data
- `GET /api/v1/fitbit/summary/:userId` - Get comprehensive daily summary

## Security Considerations

1. **Never expose client secrets**: Keep your `FITBIT_CLIENT_SECRET` secure and never include it in client-side code
2. **Use HTTPS in production**: Fitbit requires HTTPS for production apps
3. **Secure token storage**: Tokens are stored securely in MongoDB with automatic refresh
4. **Session management**: Ensure proper session security for user authentication

## Scopes

The app requests the following Fitbit scopes by default:
- `activity` - Access to activities data
- `heartrate` - Access to heart rate data
- `sleep` - Access to sleep data
- `profile` - Access to profile information
- `nutrition` - Access to nutrition data
- `weight` - Access to weight and body data

You can customize the requested scopes in the `FitbitConnection` component.

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Ensure your redirect URI in Fitbit exactly matches the one in your app
2. **"Invalid client"**: Check your client ID and secret are correct
3. **CORS errors**: Ensure your client URL is properly configured in the server CORS settings
4. **Token expired**: The app automatically refreshes tokens, but you can manually refresh using the refresh endpoint

### Development Tips

1. Use the Fitbit OAuth 2.0 tutorial: https://dev.fitbit.com/build/reference/web-api/troubleshooting-guide/oauth2-tutorial/
2. Check browser developer tools for network errors
3. Monitor server logs for detailed error messages
4. Use the "Try Again" functionality if authorization fails

## Production Deployment

For production deployment:

1. Update your Fitbit app settings with production URLs
2. Set `OAuth 2.0 Application Type` to "Server"
3. Use HTTPS for all URLs
4. Update environment variables with production values
5. Implement proper user authentication and session management
6. Consider implementing webhook subscriptions for real-time data updates

## Rate Limits

Fitbit API has rate limits:
- Personal apps: 150 requests per hour per user
- Client apps: 150 requests per hour per user  
- Server apps: 150 requests per hour per user

The app includes automatic token refresh and error handling for rate limits.
