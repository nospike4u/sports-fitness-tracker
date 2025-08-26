import express from 'express';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  makeFitbitApiRequest
} from '../utils/oauth.js';
import FitbitToken from '../Models/fitbitTokenModel.js';

const router = express.Router();

// Store for temporary OAuth state (in production, use Redis or database)
const oauthStates = new Map();

/**
 * GET /api/v1/oauth/fitbit/debug
 * Debug endpoint to check Fitbit configuration
 */
router.get('/fitbit/debug', (req, res) => {
  const config = {
    FITBIT_CLIENT_ID: process.env.FITBIT_CLIENT_ID || 'NOT SET',
    FITBIT_REDIRECT_URI: process.env.FITBIT_REDIRECT_URI || 'NOT SET',
    CLIENT_URL: process.env.CLIENT_URL || 'NOT SET',
    PORT: process.env.PORT || 'NOT SET'
  };
  
  console.log('Debug config:', config);
  
  res.json({
    message: 'Fitbit OAuth Debug Info',
    config,
    expectedRedirectUri: 'http://localhost:8000/api/v1/oauth/fitbit/callback',
    note: 'Make sure your Fitbit app redirect URI exactly matches expectedRedirectUri'
  });
});

/**
 * POST /api/v1/oauth/fitbit/auth
 * Initialize OAuth flow - generate PKCE parameters and authorization URL
 */
router.post('/fitbit/auth', async (req, res) => {
  try {
    console.log('OAuth auth request received:', req.body);
    const { userId, scopes } = req.body;

    if (!userId) {
      console.log('Missing userId in request');
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check environment variables
    if (!process.env.FITBIT_CLIENT_ID) {
      console.error('FITBIT_CLIENT_ID not set in environment');
      return res.status(500).json({ error: 'Fitbit client ID not configured' });
    }

    if (!process.env.FITBIT_REDIRECT_URI) {
      console.error('FITBIT_REDIRECT_URI not set in environment');
      return res.status(500).json({ error: 'Fitbit redirect URI not configured' });
    }

    console.log('Environment check passed');
    console.log('FITBIT_CLIENT_ID:', process.env.FITBIT_CLIENT_ID);
    console.log('FITBIT_REDIRECT_URI:', process.env.FITBIT_REDIRECT_URI);

    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();

    console.log('Generated PKCE parameters');

    // Store OAuth state temporarily
    oauthStates.set(state, {
      userId,
      codeVerifier,
      timestamp: Date.now()
    });

    // Clean up old states (older than 10 minutes)
    for (const [key, value] of oauthStates.entries()) {
      if (Date.now() - value.timestamp > 10 * 60 * 1000) {
        oauthStates.delete(key);
      }
    }

    const authUrl = buildAuthorizationUrl(
      process.env.FITBIT_CLIENT_ID,
      process.env.FITBIT_REDIRECT_URI,
      codeChallenge,
      state,
      scopes
    );

    console.log('Generated auth URL:', authUrl);

    const response = {
      authUrl,
      state
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('OAuth initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize OAuth flow' });
  }
});

/**
 * GET /api/v1/oauth/fitbit/callback
 * Handle OAuth callback from Fitbit
 */
router.get('/fitbit/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.status(400).json({ error: `OAuth error: ${error}` });
    }

    if (!code || !state) {
      return res.status(400).json({ error: 'Missing authorization code or state' });
    }

    // Verify state and get stored OAuth data
    const oauthData = oauthStates.get(state);
    if (!oauthData) {
      return res.status(400).json({ error: 'Invalid or expired state parameter' });
    }

    // Clean up used state
    oauthStates.delete(state);

    // Exchange code for tokens
    const tokenData = await exchangeCodeForTokens(
      process.env.FITBIT_CLIENT_ID,
      process.env.FITBIT_CLIENT_SECRET,
      code,
      oauthData.codeVerifier,
      process.env.FITBIT_REDIRECT_URI
    );

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Store or update tokens in database
    await FitbitToken.findOneAndUpdate(
      { userId: oauthData.userId },
      {
        userId: oauthData.userId,
        fitbitUserId: tokenData.user_id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type,
        expiresAt,
        scopes: tokenData.scope.split(' ')
      },
      { upsert: true, new: true }
    );

    // Redirect to frontend success page
    res.redirect(`${process.env.CLIENT_URL}/oauth/success`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/oauth/error?message=${encodeURIComponent(error.message)}`);
  }
});

/**
 * GET /api/v1/oauth/fitbit/status/:userId
 * Check OAuth connection status for a user
 */
router.get('/fitbit/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const tokenData = await FitbitToken.findOne({ userId });

    if (!tokenData) {
      return res.json({ connected: false });
    }

    res.json({
      connected: true,
      fitbitUserId: tokenData.fitbitUserId,
      scopes: tokenData.scopes,
      expiresAt: tokenData.expiresAt,
      isExpired: tokenData.isExpired(),
      expiresSoon: tokenData.expiresSoon()
    });
  } catch (error) {
    console.error('OAuth status check error:', error);
    res.status(500).json({ error: 'Failed to check OAuth status' });
  }
});

/**
 * DELETE /api/v1/oauth/fitbit/disconnect/:userId
 * Disconnect Fitbit account for a user
 */
router.delete('/fitbit/disconnect/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    await FitbitToken.findOneAndDelete({ userId });

    res.json({ message: 'Fitbit account disconnected successfully' });
  } catch (error) {
    console.error('OAuth disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect Fitbit account' });
  }
});

/**
 * POST /api/v1/oauth/fitbit/refresh/:userId
 * Manually refresh tokens for a user
 */
router.post('/fitbit/refresh/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const tokenData = await FitbitToken.findOne({ userId });

    if (!tokenData) {
      return res.status(404).json({ error: 'No Fitbit connection found' });
    }

    const newTokenData = await refreshAccessToken(
      process.env.FITBIT_CLIENT_ID,
      process.env.FITBIT_CLIENT_SECRET,
      tokenData.refreshToken
    );

    const expiresAt = new Date(Date.now() + newTokenData.expires_in * 1000);

    await FitbitToken.findOneAndUpdate(
      { userId },
      {
        accessToken: newTokenData.access_token,
        refreshToken: newTokenData.refresh_token,
        expiresAt,
        scopes: newTokenData.scope.split(' ')
      }
    );

    res.json({ message: 'Tokens refreshed successfully' });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh tokens' });
  }
});

export default router;
