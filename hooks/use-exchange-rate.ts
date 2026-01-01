import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const EXCHANGE_RATE_STORAGE_KEY = 'exchange_rate';
const EXCHANGE_RATE_MODE_STORAGE_KEY = 'exchange_rate_mode';
const DEFAULT_RATE = 100;

export type ExchangeRateMode = 'manual' | 'automatic';

/**
 * Hook for managing exchange rate between USD and RUB
 */
export function useExchangeRate() {
  const [rate, setRateState] = useState(DEFAULT_RATE);
  const [mode, setModeState] = useState<ExchangeRateMode>('automatic');
  const [loading, setLoading] = useState(true);

  // Load saved exchange rate and mode
  useEffect(() => {
    loadExchangeRate();
  }, []);

  const loadExchangeRate = async () => {
    try {
      const [savedRate, savedMode] = await Promise.all([
        AsyncStorage.getItem(EXCHANGE_RATE_STORAGE_KEY),
        AsyncStorage.getItem(EXCHANGE_RATE_MODE_STORAGE_KEY),
      ]);

      if (savedRate) {
        setRateState(parseFloat(savedRate));
      }
      if (savedMode === 'manual' || savedMode === 'automatic') {
        setModeState(savedMode);
      }
    } catch (error) {
      console.error('Error loading exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const setRate = async (newRate: number) => {
    try {
      if (newRate <= 0) {
        throw new Error('Exchange rate must be greater than 0');
      }
      await AsyncStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, newRate.toString());
      setRateState(newRate);
    } catch (error) {
      console.error('Error saving exchange rate:', error);
      throw error;
    }
  };

  const setMode = async (newMode: ExchangeRateMode) => {
    try {
      await AsyncStorage.setItem(EXCHANGE_RATE_MODE_STORAGE_KEY, newMode);
      setModeState(newMode);
    } catch (error) {
      console.error('Error saving exchange rate mode:', error);
      throw error;
    }
  };

  const fetchAutomaticRate = async (): Promise<number> => {
    try {
      // Fetch from exchangerate-api.com
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      const data = await response.json();
      const rubRate = data.rates.RUB;

      // Save the fetched rate
      await setRate(rubRate);
      return rubRate;
    } catch (error) {
      console.error('Error fetching automatic exchange rate:', error);
      return rate; // Fallback to current rate
    }
  };

  // Auto-fetch rate when mode changes to automatic
  useEffect(() => {
    if (mode === 'automatic') {
      fetchAutomaticRate();
    }
  }, [mode]);

  return {
    rate,
    mode,
    setRate,
    setMode,
    loading,
    fetchAutomaticRate,
  };
}
