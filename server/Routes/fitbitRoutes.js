import express from 'express';
import { makeFitbitApiRequest, refreshAccessToken } from '../utils/oauth.js';
import FitbitToken from '../Models/fitbitTokenModel.js';

const router = express.Router();

/**
 * Middleware to ensure valid Fitbit access token
 */
const ensureValidToken = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    let tokenData = await FitbitToken.findOne({ userId });
    
    if (!tokenData) {
      return res.status(404).json({ error: 'No Fitbit connection found. Please connect your Fitbit account first.' });
    }

    // Check if token needs refresh
    if (tokenData.isExpired() || tokenData.expiresSoon()) {
      try {
        const newTokenData = await refreshAccessToken(
          process.env.FITBIT_CLIENT_ID,
          process.env.FITBIT_CLIENT_SECRET,
          tokenData.refreshToken
        );

        const expiresAt = new Date(Date.now() + newTokenData.expires_in * 1000);

        tokenData = await FitbitToken.findOneAndUpdate(
          { userId },
          {
            accessToken: newTokenData.access_token,
            refreshToken: newTokenData.refresh_token,
            expiresAt,
            scopes: newTokenData.scope.split(' ')
          },
          { new: true }
        );
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return res.status(401).json({ 
          error: 'Token refresh failed. Please reconnect your Fitbit account.',
          reconnectRequired: true
        });
      }
    }

    req.fitbitToken = tokenData;
    next();
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Failed to validate Fitbit token' });
  }
};

/**
 * GET /api/v1/fitbit/profile/:userId
 * Get user profile information
 */
router.get('/profile/:userId', ensureValidToken, async (req, res) => {
  try {
    const profileData = await makeFitbitApiRequest(
      req.fitbitToken.accessToken,
      '/user/-/profile.json'
    );

    res.json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

/**
 * GET /api/v1/fitbit/activities/:userId
 * Get recent activities
 */
router.get('/activities/:userId', ensureValidToken, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || 'today';

    const activitiesData = await makeFitbitApiRequest(
      req.fitbitToken.accessToken,
      `/user/-/activities/date/${targetDate}.json`
    );

    res.json(activitiesData);
  } catch (error) {
    console.error('Activities fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch activities data' });
  }
});

/**
 * GET /api/v1/fitbit/sleep/:userId
 * Get sleep data
 */
router.get('/sleep/:userId', ensureValidToken, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || 'today';

    const sleepData = await makeFitbitApiRequest(
      req.fitbitToken.accessToken,
      `/user/-/sleep/date/${targetDate}.json`
    );

    res.json(sleepData);
  } catch (error) {
    console.error('Sleep fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch sleep data' });
  }
});

/**
 * GET /api/v1/fitbit/heartrate/:userId
 * Get heart rate data
 */
router.get('/heartrate/:userId', ensureValidToken, async (req, res) => {
  try {
    const { date, period } = req.query;
    const targetDate = date || 'today';
    const timePeriod = period || '1d';

    const heartRateData = await makeFitbitApiRequest(
      req.fitbitToken.accessToken,
      `/user/-/activities/heart/date/${targetDate}/${timePeriod}.json`
    );

    res.json(heartRateData);
  } catch (error) {
    console.error('Heart rate fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch heart rate data' });
  }
});

/**
 * GET /api/v1/fitbit/steps/:userId
 * Get steps data
 */
router.get('/steps/:userId', ensureValidToken, async (req, res) => {
  try {
    const { date, period } = req.query;
    const targetDate = date || 'today';
    const timePeriod = period || '1d';

    const stepsData = await makeFitbitApiRequest(
      req.fitbitToken.accessToken,
      `/user/-/activities/steps/date/${targetDate}/${timePeriod}.json`
    );

    res.json(stepsData);
  } catch (error) {
    console.error('Steps fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch steps data' });
  }
});

/**
 * GET /api/v1/fitbit/weight/:userId
 * Get weight data
 */
router.get('/weight/:userId', ensureValidToken, async (req, res) => {
  try {
    const { date, period } = req.query;
    const targetDate = date || 'today';
    const timePeriod = period || '1w';

    const weightData = await makeFitbitApiRequest(
      req.fitbitToken.accessToken,
      `/user/-/body/log/weight/date/${targetDate}/${timePeriod}.json`
    );

    res.json(weightData);
  } catch (error) {
    console.error('Weight fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch weight data' });
  }
});

/**
 * GET /api/v1/fitbit/summary/:userId
 * Get daily activity summary
 */
router.get('/summary/:userId', ensureValidToken, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || 'today';

    // Fetch multiple endpoints for comprehensive summary
    const [activities, heartRate, heartRateIntraday, sleep] = await Promise.allSettled([
      makeFitbitApiRequest(req.fitbitToken.accessToken, `/user/-/activities/date/${targetDate}.json`),
      makeFitbitApiRequest(req.fitbitToken.accessToken, `/user/-/activities/heart/date/${targetDate}/1d.json`),
      makeFitbitApiRequest(req.fitbitToken.accessToken, `/user/-/activities/heart/date/${targetDate}/1d/1min.json`),
      makeFitbitApiRequest(req.fitbitToken.accessToken, `/user/-/sleep/date/${targetDate}.json`)
    ]);

    const summary = {
      date: targetDate,
      activities: activities.status === 'fulfilled' ? activities.value : null,
      heartRate: heartRate.status === 'fulfilled' ? heartRate.value : null,
      heartRateIntraday: heartRateIntraday.status === 'fulfilled' ? heartRateIntraday.value['activities-heart-intraday'] : null,
      sleep: sleep.status === 'fulfilled' ? sleep.value : null,
      errors: []
    };

    if (activities.status === 'rejected') summary.errors.push('activities');
    if (heartRate.status === 'rejected') summary.errors.push('heartRate');
    if (heartRateIntraday.status === 'rejected') summary.errors.push('heartRateIntraday');
    if (sleep.status === 'rejected') summary.errors.push('sleep');

    res.json(summary);
  } catch (error) {
    console.error('Summary fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch summary data' });
  }
});

export default router;
