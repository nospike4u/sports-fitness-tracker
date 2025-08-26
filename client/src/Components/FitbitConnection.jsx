import React, { useState, useEffect } from 'react';
import { OAuthService } from '../services/oauthService';

const FitbitConnection = ({ userId }) => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnectionStatus();
  }, [userId]);

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await OAuthService.checkFitbitStatus(userId);
      setConnectionStatus(status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectFitbit = async () => {
    try {
      setError(null);
      const scopes = [
        'activity',
        'heartrate',
        'sleep',
        'profile',
        'nutrition',
        'weight'
      ];
      
      const authData = await OAuthService.initializeFitbitAuth(userId, scopes);
      
      // Redirect to Fitbit authorization
      window.location.href = authData.authUrl;
    } catch (err) {
      setError(err.message);
    }
  };

  const disconnectFitbit = async () => {
    try {
      setError(null);
      await OAuthService.disconnectFitbit(userId);
      setConnectionStatus({ connected: false });
    } catch (err) {
      setError(err.message);
    }
  };

  const refreshTokens = async () => {
    try {
      setError(null);
      await OAuthService.refreshTokens(userId);
      await checkConnectionStatus();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Checking Fitbit connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Fitbit Connection</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          connectionStatus?.connected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {connectionStatus?.connected ? 'Connected' : 'Not Connected'}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {connectionStatus?.connected ? (
        <div>
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Fitbit User ID:</strong> {connectionStatus.fitbitUserId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Scopes:</strong> {connectionStatus.scopes?.join(', ')}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Token Expires:</strong> {new Date(connectionStatus.expiresAt).toLocaleString()}
            </p>
            {connectionStatus.expiresSoon && (
              <p className="text-sm text-yellow-600 font-medium">
                ⚠️ Token expires soon
              </p>
            )}
            {connectionStatus.isExpired && (
              <p className="text-sm text-red-600 font-medium">
                ❌ Token has expired
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={refreshTokens}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Tokens
            </button>
            <button
              onClick={disconnectFitbit}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Connect your Fitbit account to sync your health and fitness data.
          </p>
          <button
            onClick={connectFitbit}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Connect Fitbit
          </button>
        </div>
      )}
    </div>
  );
};

export default FitbitConnection;
