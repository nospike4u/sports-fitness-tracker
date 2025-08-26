import crypto from 'crypto';

/**
 * OAuth 2.0 PKCE (Proof Key for Code Exchange) utilities for Fitbit API
 */

/**
 * Generate a cryptographically random code verifier (43-128 characters)
 */
export const generateCodeVerifier = () => {
  return crypto.randomBytes(32).toString('base64url');
};

/**
 * Generate code challenge from code verifier using SHA256 and base64url encoding
 */
export const generateCodeChallenge = (codeVerifier) => {
  return crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
};

/**
 * Generate a random state parameter for CSRF protection
 */
export const generateState = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Build Fitbit authorization URL with PKCE parameters
 */
export const buildAuthorizationUrl = (clientId, redirectUri, codeChallenge, state, scopes = []) => {
  const defaultScopes = [
    'activity',
    'heartrate',
    'location',
    'nutrition',
    'oxygen_saturation',
    'profile',
    'respiratory_rate',
    'settings',
    'sleep',
    'social',
    'temperature',
    'weight'
  ];
  
  const scopeString = scopes.length > 0 ? scopes.join(' ') : defaultScopes.join(' ');
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_uri: redirectUri,
    scope: scopeString,
    state: state
  });

  return `https://www.fitbit.com/oauth2/authorize?${params.toString()}`;
};

/**
 * Exchange authorization code for access and refresh tokens
 */
export const exchangeCodeForTokens = async (clientId, clientSecret, code, codeVerifier, redirectUri) => {
  const tokenUrl = 'https://api.fitbit.com/oauth2/token';
  
  const body = new URLSearchParams({
    client_id: clientId,
    code: code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  };

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers,
      body: body.toString()
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Token exchange failed: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`OAuth token exchange error: ${error.message}`);
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (clientId, clientSecret, refreshToken) => {
  const tokenUrl = 'https://api.fitbit.com/oauth2/token';
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  };

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers,
      body: body.toString()
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Token refresh failed: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`OAuth token refresh error: ${error.message}`);
  }
};

/**
 * Make authenticated request to Fitbit API
 */
export const makeFitbitApiRequest = async (accessToken, endpoint) => {
  const baseUrl = 'https://api.fitbit.com/1';
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Fitbit API request failed: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Fitbit API error: ${error.message}`);
  }
};
