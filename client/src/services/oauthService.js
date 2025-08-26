import axios from 'axios';
import config from '../config/env.js';

const API_BASE_URL = config.API_BASE_URL;

export class OAuthService {
  /**
   * Initialize Fitbit OAuth flow
   */
  static async initializeFitbitAuth(userId, scopes = []) {
    try {
      const response = await axios.post(`${API_BASE_URL}/oauth/fitbit/auth`, {
        userId,
        scopes
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to initialize OAuth');
    }
  }

  /**
   * Check OAuth connection status
   */
  static async checkFitbitStatus(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/oauth/fitbit/status/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to check OAuth status');
    }
  }

  /**
   * Disconnect Fitbit account
   */
  static async disconnectFitbit(userId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/oauth/fitbit/disconnect/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to disconnect Fitbit');
    }
  }

  /**
   * Manually refresh tokens
   */
  static async refreshTokens(userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/oauth/fitbit/refresh/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to refresh tokens');
    }
  }
}

export class FitbitDataService {
  /**
   * Get user profile
   */
  static async getProfile(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/fitbit/profile/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.reconnectRequired) {
        throw new Error('RECONNECT_REQUIRED');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  /**
   * Get activities data
   */
  static async getActivities(userId, date = 'today') {
    try {
      const response = await axios.get(`${API_BASE_URL}/fitbit/activities/${userId}`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.reconnectRequired) {
        throw new Error('RECONNECT_REQUIRED');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch activities');
    }
  }

  /**
   * Get sleep data
   */
  static async getSleep(userId, date = 'today') {
    try {
      const response = await axios.get(`${API_BASE_URL}/fitbit/sleep/${userId}`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.reconnectRequired) {
        throw new Error('RECONNECT_REQUIRED');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch sleep data');
    }
  }

  /**
   * Get heart rate data
   */
  static async getHeartRate(userId, date = 'today', period = '1d') {
    try {
      const response = await axios.get(`${API_BASE_URL}/fitbit/heartrate/${userId}`, {
        params: { date, period }
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.reconnectRequired) {
        throw new Error('RECONNECT_REQUIRED');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch heart rate data');
    }
  }

  /**
   * Get steps data
   */
  static async getSteps(userId, date = 'today', period = '1d') {
    try {
      const response = await axios.get(`${API_BASE_URL}/fitbit/steps/${userId}`, {
        params: { date, period }
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.reconnectRequired) {
        throw new Error('RECONNECT_REQUIRED');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch steps data');
    }
  }

  /**
   * Get comprehensive daily summary
   */
  static async getDailySummary(userId, date = 'today') {
    try {
      const response = await axios.get(`${API_BASE_URL}/fitbit/summary/${userId}`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.reconnectRequired) {
        throw new Error('RECONNECT_REQUIRED');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch daily summary');
    }
  }
}
