import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Pressable,
  View,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

interface OnboardingStep {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to Ehsebo Sah',
    titleAr: 'أهلاً بك في احسبه صح',
    description: 'Manage your budget easily with support for multiple currencies',
    descriptionAr: 'أدر ميزانيتك بسهولة مع دعم عملات متعددة',
    icon: '💰',
  },
  {
    id: 2,
    title: 'Set Your Budget',
    titleAr: 'حدد ميزانيتك',
    description: 'Enter your total budget in USD and track your expenses',
    descriptionAr: 'أدخل إجمالي ميزانيتك بالدولار وتابع نفقاتك',
    icon: '📊',
  },
  {
    id: 3,
    title: 'Track Expenses',
    titleAr: 'تابع النفقات',
    description: 'Categorize your expenses: Medical, Salaries, Car Rental, and Others',
    descriptionAr: 'صنف نفقاتك: العلاج، المرتبات، إيجار السيارة، وغيرها',
    icon: '📝',
  },
  {
    id: 4,
    title: 'Save & Sync',
    titleAr: 'احفظ ومزامق',
    description: 'Save your records locally and sync with Google Sheets automatically',
    descriptionAr: 'احفظ سجلاتك محلياً ومزامقها مع Google Sheets تلقائياً',
    icon: '☁️',
  },
  {
    id: 5,
    title: 'View Analytics',
    titleAr: 'اعرض التحليلات',
    description: 'Get insights with charts and statistics about your spending',
    descriptionAr: 'احصل على رؤى مع رسوم بيانية وإحصائيات عن إنفاقك',
    icon: '📈',
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = Dimensions.get('window');

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const currentOnboarding = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        {/* Step Indicator */}
        <View style={styles.indicatorContainer}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index <= currentStep ? tintColor : borderColor,
                },
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.icon}>
            {currentOnboarding.icon}
          </ThemedText>

          <ThemedText type="title" style={styles.title}>
            {currentOnboarding.titleAr}
          </ThemedText>

          <ThemedText
            style={[styles.description, { color: textSecondary }]}
          >
            {currentOnboarding.descriptionAr}
          </ThemedText>
        </View>

        {/* Navigation */}
        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.skipButton, { borderColor }]}
            onPress={handleSkip}
          >
            <ThemedText style={{ color: textSecondary }}>
              {isLastStep ? 'ابدأ الآن' : 'تخطي'}
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.nextButton, { backgroundColor: tintColor }]}
            onPress={handleNext}
          >
            <ThemedText style={styles.nextButtonText}>
              {isLastStep ? 'ابدأ' : 'التالي'}
            </ThemedText>
          </Pressable>
        </View>

        {/* Step Counter */}
        <ThemedText style={[styles.stepCounter, { color: textSecondary }]}>
          {currentStep + 1} من {ONBOARDING_STEPS.length}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'space-between',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepCounter: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export { ONBOARDING_COMPLETE_KEY };
