import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './use-auth';

const SESSION_KEY = 'user_session';
const SESSION_EXPIRY_KEY = 'session_expiry';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Hook for persisting user session
 * Automatically saves and restores user session to avoid re-login
 */
export function useSessionPersistence() {
  const { user, isAuthenticated, loading } = useAuth();
  const [sessionRestored, setSessionRestored] = useState(false);

  // Save session when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      saveSession();
    }
  }, [isAuthenticated, user, loading]);

  const saveSession = async () => {
    try {
      const sessionData = {
        user: user,
        timestamp: new Date().getTime(),
        expiresAt: new Date().getTime() + SESSION_DURATION,
      };

      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      await AsyncStorage.setItem(
        SESSION_EXPIRY_KEY,
        sessionData.expiresAt.toString()
      );

      console.log('[Session] Session saved successfully');
    } catch (error) {
      console.error('[Session] Error saving session:', error);
    }
  };

  const restoreSession = async (): Promise<boolean> => {
    try {
      const sessionData = await AsyncStorage.getItem(SESSION_KEY);
      const expiryTime = await AsyncStorage.getItem(SESSION_EXPIRY_KEY);

      if (!sessionData || !expiryTime) {
        console.log('[Session] No saved session found');
        return false;
      }

      const now = new Date().getTime();
      const expiry = parseInt(expiryTime, 10);

      if (now > expiry) {
        console.log('[Session] Session expired');
        await clearSession();
        return false;
      }

      console.log('[Session] Session restored successfully');
      return true;
    } catch (error) {
      console.error('[Session] Error restoring session:', error);
      return false;
    }
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      await AsyncStorage.removeItem(SESSION_EXPIRY_KEY);
      console.log('[Session] Session cleared');
    } catch (error) {
      console.error('[Session] Error clearing session:', error);
    }
  };

  const refreshSession = async () => {
    if (isAuthenticated && user) {
      await saveSession();
      console.log('[Session] Session refreshed');
    }
  };

  return {
    sessionRestored,
    setSessionRestored,
    restoreSession,
    clearSession,
    refreshSession,
    saveSession,
  };
}
