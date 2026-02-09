import React, { useState, useEffect } from 'react';
import { FitbitDataService } from '../services/oauthService';

const FitbitData = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('today');

  useEffect(() => {
    if (userId) {
      fetchFitbitData();
    }
  }, [userId, selectedDate]);

  const fetchFitbitData = async () => {
    try {
      setLoading(true);
      setError(null);

      const summary = await FitbitDataService.getDailySummary(userId, selectedDate);
      setData(summary);
    } catch (err) {
      if (err.message === 'RECONNECT_REQUIRED') {
        setError('Your Fitbit connection has expired. Please reconnect your account.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (dateString === 'today') return 'Today';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-bg)] border border-[var(--border)] rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-[var(--text-color)]">Loading Fitbit data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-bg)] rounded-lg border border-[var(--border)] shadow-md p-6">
        <div className="text-red-600 text-center">
          <p className="font-medium">Error loading Fitbit data</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchFitbitData}
            className="mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--color-surface)] rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg shadow-md p-6">
        <p className="text-[var(--muted-text)] text-center">No Fitbit data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-[var(--color-bg)] border border-[var(--border)] rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">Fitbit Data</h3>
        <div className="flex items-center space-x-4">
          <label htmlFor="date" className="text-sm font-medium text-[var(--text-color)]">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate === 'today' ? new Date().toISOString().split('T')[0] : selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--color-surface)] text-[var(--text-color)]"
          />
          <button
            onClick={() => setSelectedDate('today')}
            className="px-3 py-1 bg-[var(--primary)] text-[var(--color-surface)] text-sm rounded hover:bg-[var(--secondary)] transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Activities Summary */}
      {data.activities && (
        <div className="bg-[var(--color-bg)] rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-[var(--text-color)] mb-4">
            Activities - {formatDate(data.date)}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-surface)] border border-[var(--border)] p-4 rounded-lg">
              <p className="text-sm font-medium text-[var(--primary)]">Steps</p>
              <p className="text-2xl font-bold text-[var(--text-color)]">
                {data.activities.summary?.steps?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--border)] p-4 rounded-lg">
              <p className="text-sm font-medium text-[var(--secondary)]">Calories Burned</p>
              <p className="text-2xl font-bold text-[var(--text-color)]">
                {data.activities.summary?.caloriesOut?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--border)] p-4 rounded-lg">
              <p className="text-sm font-medium text-[var(--tertiary)]">Distance (km)</p>
              <p className="text-2xl font-bold text-[var(--text-color)]">
                {data.activities.summary?.distances?.[0]?.distance?.toFixed(2) || '0'}
              </p>
            </div>
          </div>
          
          {data.activities.summary?.activeMinutes && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-surface)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--secondary)]">Lightly Active</p>
                <p className="text-xl font-bold text-[var(--text-color)]">
                  {data.activities.summary.lightlyActiveMinutes} min
                </p>
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--tertiary)]">Fairly Active</p>
                <p className="text-xl font-bold text-[var(--text-color)]">
                  {data.activities.summary.fairlyActiveMinutes} min
                </p>
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--primary)]">Very Active</p>
                <p className="text-xl font-bold text-[var(--text-color)]">
                  {data.activities.summary.veryActiveMinutes} min
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Heart Rate */}
      {data.heartRate && data.heartRate['activities-heart']?.[0] && (
        <div className="bg-[var(--color-surface)] rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-[var(--text-color)] mb-4">Heart Rate</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
              <p className="text-sm font-medium text-[var(--primary)]">Resting Heart Rate</p>
              <p className="text-2xl font-bold text-[var(--text-color)]">
                {data.heartRate['activities-heart'][0].value?.restingHeartRate || 'N/A'} bpm
              </p>
            </div>
            {data.heartRate['activities-heart'][0].value?.heartRateZones && (
              <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--secondary)]">Heart Rate Zones</p>
                <div className="space-y-1 mt-2 text-[var(--text-color)]">
                  {data.heartRate['activities-heart'][0].value.heartRateZones.map((zone, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{zone.name}:</span> {zone.minutes} min
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sleep */}
      {data.sleep && data.sleep.summary && (
        <div className="bg-[var(--color-surface)] rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-[var(--text-color)] mb-4">Sleep</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
              <p className="text-sm font-medium text-[var(--primary)]">Total Sleep</p>
              <p className="text-2xl font-bold text-[var(--text-color)]">
                {Math.floor((data.sleep.summary.totalMinutesAsleep || 0) / 60)}h {(data.sleep.summary.totalMinutesAsleep || 0) % 60}m
              </p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
              <p className="text-sm font-medium text-[var(--secondary)]">Time in Bed</p>
              <p className="text-2xl font-bold text-[var(--text-color)]">
                {Math.floor((data.sleep.summary.totalTimeInBed || 0) / 60)}h {(data.sleep.summary.totalTimeInBed || 0) % 60}m
              </p>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
              <p className="text-sm font-medium text-[var(--tertiary)]">Sleep Efficiency</p>
              <p className="text-2xl font-bold text-[var(--text-color)]">
                {data.sleep.summary.efficiency || 'N/A'}%
              </p>
            </div>
          </div>

          {data.sleep.summary.stages && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--primary)]">Deep Sleep</p>
                <p className="text-lg font-bold text-[var(--text-color)]">
                  {Math.floor((data.sleep.summary.stages.deep || 0) / 60)}h {(data.sleep.summary.stages.deep || 0) % 60}m
                </p>
              </div>
              <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--secondary)]">Light Sleep</p>
                <p className="text-lg font-bold text-[var(--text-color)]">
                  {Math.floor((data.sleep.summary.stages.light || 0) / 60)}h {(data.sleep.summary.stages.light || 0) % 60}m
                </p>
              </div>
              <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--tertiary)]">REM Sleep</p>
                <p className="text-lg font-bold text-[var(--text-color)]">
                  {Math.floor((data.sleep.summary.stages.rem || 0) / 60)}h {(data.sleep.summary.stages.rem || 0) % 60}m
                </p>
              </div>
              <div className="bg-[var(--color-bg)] border border-[var(--border)] p-4 rounded-lg">
                <p className="text-sm font-medium text-[var(--text-color)]">Awake</p>
                <p className="text-lg font-bold text-[var(--muted-text)]">
                  {Math.floor((data.sleep.summary.stages.wake || 0) / 60)}h {(data.sleep.summary.stages.wake || 0) % 60}m
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Summary */}
      {data.errors && data.errors.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-[var(--text-color)] font-medium">Some data could not be loaded:</p>
          <ul className="text-[var(--muted-text)] text-sm mt-2 list-disc list-inside">
            {data.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FitbitData;
