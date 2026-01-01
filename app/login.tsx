import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getLoginUrl } from '@/constants/oauth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/hooks/use-language';

export default function LoginScreen() {
  const { translate, toggleLanguage, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const handleLogin = async () => {
    try {
      console.log('[Auth] Login button clicked');
      setIsLoggingIn(true);
      const loginUrl = getLoginUrl();
      console.log('[Auth] Generated login URL:', loginUrl);

      // On web, use direct redirect in same tab
      // On mobile, use WebBrowser to open OAuth in a separate context
      if (Platform.OS === 'web') {
        console.log('[Auth] Web platform: redirecting to OAuth in same tab...');
        window.location.href = loginUrl;
        return;
      }

      // Mobile: Open OAuth URL in browser
      console.log('[Auth] Opening OAuth URL in browser...');
      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        undefined,
        {
          preferEphemeralSession: false,
          showInRecents: true,
        }
      );

      console.log('[Auth] WebBrowser result:', result);
      if (result.type === 'cancel') {
        console.log('[Auth] OAuth cancelled by user');
      } else if (result.type === 'dismiss') {
        console.log('[Auth] OAuth dismissed');
      } else if (result.type === 'success' && result.url) {
        console.log('[Auth] OAuth session successful, navigating to callback:', result.url);
        try {
          let url: URL;
          if (result.url.startsWith('exp://') || result.url.startsWith('exps://')) {
            const urlStr = result.url.replace(/^exp(s)?:\/\//, 'http://');
            url = new URL(urlStr);
          } else {
            url = new URL(result.url);
          }

          const code = url.searchParams.get('code');
          const state = url.searchParams.get('state');
          const error = url.searchParams.get('error');

          console.log('[Auth] Extracted params from callback URL:', {
            code: code?.substring(0, 20) + '...',
            state: state?.substring(0, 20) + '...',
            error,
          });

          if (error) {
            console.error('[Auth] OAuth error in callback:', error);
            return;
          }

          if (code && state) {
            console.log('[Auth] Navigating to callback route with params...');
            router.push({
              pathname: '/oauth/callback' as any,
              params: { code, state },
            });
          } else {
            console.error('[Auth] Missing code or state in callback URL');
          }
        } catch (err) {
          console.error('[Auth] Failed to parse callback URL:', err, result.url);
          const codeMatch = result.url.match(/[?&]code=([^&]+)/);
          const stateMatch = result.url.match(/[?&]state=([^&]+)/);

          if (codeMatch && stateMatch) {
            const code = decodeURIComponent(codeMatch[1]);
            const state = decodeURIComponent(stateMatch[1]);
            console.log('[Auth] Fallback: extracted params via regex, navigating...');
            router.push({
              pathname: '/oauth/callback' as any,
              params: { code, state },
            });
          } else {
            console.error('[Auth] Could not extract code/state from URL');
          }
        }
      }
    } catch (error) {
      console.error('[Auth] Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 40,
          },
        ]}
      >
        {/* Language Toggle */}
        <Pressable
          style={[styles.languageButton, { backgroundColor: tintColor }]}
          onPress={toggleLanguage}
        >
          <ThemedText style={styles.languageButtonText}>
            {language === 'ar' ? 'EN' : 'ع'}
          </ThemedText>
        </Pressable>

        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        {/* App Title */}
        <ThemedText type="title" style={styles.title}>
          {translate('appName')}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          {translate('welcome')}
        </ThemedText>

        {/* Google Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={isLoggingIn}
          style={[styles.loginButton, { backgroundColor: '#FFFFFF' }]}
        >
          {isLoggingIn ? (
            <ActivityIndicator color={tintColor} />
          ) : (
            <View style={styles.loginButtonContent}>
              <Image
                source={{
                  uri: 'https://developers.google.com/identity/images/g-logo.png',
                }}
                style={styles.googleIcon}
                contentFit="contain"
              />
              <ThemedText
                style={[styles.loginButtonText, { color: '#000000' }]}
              >
                {translate('loginWithGoogle')}
              </ThemedText>
            </View>
          )}
        </Pressable>

        {/* Info Text */}
        <ThemedText style={[styles.infoText, { color: textSecondary }]}>
          {language === 'ar'
            ? 'سجل الدخول لبدء إدارة ميزانيتك'
            : 'Login to start managing your budget'}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  languageButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  logoContainer: {
    width: 160,
    height: 160,
    marginBottom: 32,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 48,
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    maxWidth: 320,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
});
