# URL Configuration Summary

This document summarizes all the localhost URLs used in the application to ensure consistency.

## Development Environment Ports

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Backend Server** | 8000 | `http://localhost:8000` | Express.js API server |
| **Frontend Client** | 5173 | `http://localhost:5173` | Vite React development server |
| **MongoDB** | 27017 | `mongodb://localhost:27017` | Local MongoDB instance (if used) |

## Important URLs

### Server-side (.env)
```env
PORT=8000
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
FITBIT_REDIRECT_URI=http://localhost:8000/api/v1/oauth/fitbit/callback
```

### Client-side (config/env.js)
```javascript
API_BASE_URL: 'http://localhost:8000/api/v1'
CLIENT_URL: 'http://localhost:5173'
```

### Fitbit OAuth Configuration
- **Redirect URI**: `http://localhost:8000/api/v1/oauth/fitbit/callback`
- **OAuth Flow**: Client (5173) → Server (8000) → Fitbit → Server (8000) → Client (5173)

## Files Updated for Consistency

### Server Files
- ✅ `server/.env` - Corrected port and added missing variables
- ✅ `server/.env.example` - Updated to use port 8000
- ✅ `server/server.js` - CORS configured for port 5173

### Client Files  
- ✅ `client/src/services/oauthService.js` - Updated API_BASE_URL to port 8000
- ✅ `client/src/services/api.jsx` - Updated to use centralized config
- ✅ `client/src/config/env.js` - New centralized configuration
- ✅ `client/.env.example` - Added example environment variables
- ❌ `client/.env` - Removed (OAuth credentials should only be server-side)

### Documentation
- ✅ `FITBIT_OAUTH_SETUP.md` - Updated all references to use correct ports

## Legacy Issues Fixed

### Before (Inconsistent)
- Some files used port 3000
- Some files used port 8000  
- OAuth service pointed to wrong port
- Client had OAuth credentials (security issue)

### After (Consistent)
- Server always runs on port 8000
- Client always runs on port 5173
- All API calls point to port 8000
- OAuth credentials only on server
- Centralized configuration management

## Testing the Configuration

1. **Start the server**: `cd server && npm run dev` (should show "Server is running on Port 8000")
2. **Start the client**: `cd client && npm run dev` (should open http://localhost:5173)
3. **Test API connectivity**: Frontend should successfully connect to backend
4. **Test OAuth flow**: Fitbit redirect should work correctly

## Important Notes

- **Never put OAuth secrets in client code** - they're now only in server/.env
- **CORS is configured** - server accepts requests from client port 5173
- **Session cookies work** - withCredentials: true is set for API calls
- **Environment flexibility** - can override defaults with .env files

## Production Considerations

For production deployment, update these URLs:
- Server: Your actual domain/IP
- Client: Your actual frontend domain
- Fitbit redirect URI: Your production server callback URL
- Enable HTTPS for all production URLs
