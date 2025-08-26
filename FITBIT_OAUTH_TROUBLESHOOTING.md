# Fitbit OAuth "Invalid redirect_uri" Error - Troubleshooting Guide

## Error Description
```
"The app you're trying to connect did not provide valid information to Fitbit. Please report this issue to them.
Developer information: invalid_request - Invalid redirect_uri parameter value"
```

## Root Cause
This error occurs when the `redirect_uri` sent to Fitbit doesn't **exactly** match the one configured in your Fitbit app settings.

## Step-by-Step Fix

### 1. Check Your Current Configuration

First, visit the debug endpoint to see your current configuration:
```
GET http://localhost:8000/api/v1/oauth/fitbit/debug
```

This will show you:
- Your current FITBIT_CLIENT_ID
- Your current FITBIT_REDIRECT_URI  
- Expected redirect URI

### 2. Verify Your Fitbit App Settings

1. Go to [https://dev.fitbit.com/apps](https://dev.fitbit.com/apps)
2. Click on your app
3. Check the **Redirect URL** field
4. It must **exactly** match: `http://localhost:8000/api/v1/oauth/fitbit/callback`

**Common Mismatches:**
- ❌ `http://localhost:3000/api/v1/oauth/fitbit/callback` (wrong port)
- ❌ `http://localhost:8000/oauth/fitbit/callback` (missing /api/v1)
- ❌ `https://localhost:8000/api/v1/oauth/fitbit/callback` (https instead of http)
- ❌ `http://localhost:8000/api/v1/oauth/fitbit/callback/` (trailing slash)
- ✅ `http://localhost:8000/api/v1/oauth/fitbit/callback` (correct)

### 3. Update Your Fitbit App

If the redirect URI doesn't match:
1. Click "Edit Application Settings"
2. Update the **Redirect URL** to: `http://localhost:8000/api/v1/oauth/fitbit/callback`
3. Save the changes

### 4. Verify Environment Variables

Check your `server/.env` file contains:
```env
FITBIT_CLIENT_ID=your-actual-client-id
FITBIT_CLIENT_SECRET=your-actual-client-secret
FITBIT_REDIRECT_URI=http://localhost:8000/api/v1/oauth/fitbit/callback
PORT=8000
```

### 5. Test the Configuration

1. Restart your server: `cd server && npm run dev`
2. Test the debug endpoint: `GET http://localhost:8000/api/v1/oauth/fitbit/debug`
3. Try the OAuth flow again

## Additional Debugging Steps

### Check Server Logs
Look for these console logs when making the OAuth request:
```
OAuth auth request received: { userId: '...', scopes: [...] }
Environment check passed
FITBIT_CLIENT_ID: your-client-id
FITBIT_REDIRECT_URI: http://localhost:8000/api/v1/oauth/fitbit/callback
Generated PKCE parameters
Generated auth URL: https://www.fitbit.com/oauth2/authorize?...
```

### Verify the Generated URL
The generated authorization URL should look like:
```
https://www.fitbit.com/oauth2/authorize?
client_id=YOUR_CLIENT_ID&
response_type=code&
code_challenge=CODE_CHALLENGE&
code_challenge_method=S256&
redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fv1%2Foauth%2Ffitbit%2Fcallback&
scope=activity+heartrate+sleep+profile+nutrition+weight&
state=RANDOM_STATE
```

Note: The `redirect_uri` is URL-encoded in the query string.

### Common Issues and Solutions

#### Issue: 204 No Content Response
**Cause**: Server not sending proper JSON response
**Solution**: Check for:
- Missing `res.json()` call
- CORS issues
- Express middleware order

#### Issue: "Client ID not found"
**Cause**: Incorrect or missing FITBIT_CLIENT_ID
**Solution**: 
1. Verify client ID in Fitbit app settings
2. Update your .env file
3. Restart server

#### Issue: "Invalid client"
**Cause**: Incorrect client secret or ID
**Solution**: Double-check credentials from Fitbit app

### Test Commands

```bash
# 1. Check debug endpoint
curl -X GET http://localhost:8000/api/v1/oauth/fitbit/debug

# 2. Test OAuth initialization
curl -X POST http://localhost:8000/api/v1/oauth/fitbit/auth \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","scopes":["activity","profile"]}'

# 3. Check if server is running on correct port
curl -X GET http://localhost:8000/
```

### Production Considerations

For production deployment:
1. Update Fitbit app redirect URI to your production domain
2. Use HTTPS (required by Fitbit for production)
3. Update environment variables accordingly

Example production redirect URI:
```
https://yourdomain.com/api/v1/oauth/fitbit/callback
```

## Still Having Issues?

If you're still getting the error after following these steps:

1. **Double-check the exact redirect URI** - even a single character difference will cause this error
2. **Try deleting and recreating** your Fitbit app with the correct redirect URI
3. **Check for trailing spaces** in your .env file values
4. **Verify your server is actually running on port 8000** - check the console output when starting the server

The most common cause is a simple mismatch between the redirect URI in your Fitbit app settings and the one in your code. They must be **identical**.
