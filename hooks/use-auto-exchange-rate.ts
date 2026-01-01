import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_RATE_FETCH_KEY = 'last_rate_fetch_date';
const CACHED_RATE_KEY = 'cached_exchange_rate';

/**
 * Hook for fetching automatic exchange rate daily
 */
export function useAutoExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we already fetched today
      const lastFetchDate = await AsyncStorage.getItem(LAST_RATE_FETCH_KEY);
      const today = new Date().toISOString().split('T')[0];

      if (lastFetchDate === today) {
        // Use cached rate from today
        const cachedRate = await AsyncStorage.getItem(CACHED_RATE_KEY);
        if (cachedRate) {
          setRate(parseFloat(cachedRate));
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      // Using exchangerate-api.com free tier (limited requests)
      // Alternative: use fixer.io, openexchangerates.org, or other APIs
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      const data = await response.json();
      const rubRate = data.rates.RUB;

      // Cache the rate
      await AsyncStorage.setItem(CACHED_RATE_KEY, rubRate.toString());
      await AsyncStorage.setItem(LAST_RATE_FETCH_KEY, today);

      setRate(rubRate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching exchange rate:', err);

      // Fallback to cached rate if available
      try {
        const cachedRate = await AsyncStorage.getItem(CACHED_RATE_KEY);
        if (cachedRate) {
          setRate(parseFloat(cachedRate));
        }
      } catch (cacheErr) {
        console.error('Error reading cached rate:', cacheErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshRate = async () => {
    // Force refresh by clearing the date
    await AsyncStorage.removeItem(LAST_RATE_FETCH_KEY);
    await fetchExchangeRate();
  };

  return {
    rate,
    loading,
    error,
    refreshRate,
  };
}
