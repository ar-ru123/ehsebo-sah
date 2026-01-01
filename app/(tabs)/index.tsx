import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CurrencyInput } from '@/components/currency-input';
import { ProgressBar } from '@/components/progress-bar';
import { ExchangeRateSelector } from '@/components/exchange-rate-selector';
import { RemainingDisplay } from '@/components/remaining-display';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useExchangeRate } from '@/hooks/use-exchange-rate';
import { useBudgetRecords } from '@/hooks/use-budget-records';
import { useGoogleSheets } from '@/hooks/use-google-sheets';
import {
  BudgetFormData,
  calculateRemaining,
  calculateTotalExpenses,
} from '@/types/budget';
import { formatCurrency } from '@/constants/exchange-rates';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { translate, toggleLanguage, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { rate, mode, setRate, setMode } = useExchangeRate();
  const { saveRecord } = useBudgetRecords();
  const { saveToGoogleSheets } = useGoogleSheets();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const [formData, setFormData] = useState<BudgetFormData>({
    totalBudget: 0,
    medicalExpenses: 0,
    salaries: 0,
    carRental: 0,
    otherExpenses: 0,
  });

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [recordName, setRecordName] = useState('');
  const [saving, setSaving] = useState(false);

  const remaining = calculateRemaining(formData);
  const totalExpenses = calculateTotalExpenses(formData);

  const handleSave = () => {
    if (!isAuthenticated) {
      Alert.alert(translate('error'), 'Please login first');
      return;
    }

    if (formData.totalBudget === 0) {
      Alert.alert(translate('error'), translate('invalidAmount'));
      return;
    }

    setSaveModalVisible(true);
  };

  const confirmSave = async () => {
    if (!recordName.trim()) {
      Alert.alert(translate('error'), translate('recordNameRequired'));
      return;
    }

    setSaving(true);
    try {
      const record = {
        id: Date.now().toString(),
        name: recordName,
        totalBudget: formData.totalBudget,
        medicalExpenses: formData.medicalExpenses,
        salaries: formData.salaries,
        carRental: formData.carRental,
        otherExpenses: formData.otherExpenses,
        remaining: remaining,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: String(user?.id || 'unknown'),
      };

      await saveRecord(record);
      
      // Also save to Google Sheets
      await saveToGoogleSheets(record);
      
      Alert.alert(translate('appName'), translate('recordSaved'));

      // Reset form
      setFormData({
        totalBudget: 0,
        medicalExpenses: 0,
        salaries: 0,
        carRental: 0,
        otherExpenses: 0,
      });
      setRecordName('');
      setSaveModalVisible(false);
    } catch (error) {
      console.error('Error saving record:', error);
      Alert.alert(translate('error'), translate('errorSaving'));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Delay navigation to ensure Root Layout is mounted
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Auto-fetch exchange rate when mode is automatic
  useEffect(() => {
    if (mode === 'automatic') {
      // Rate is automatically fetched by useExchangeRate hook
    }
  }, [mode]);

  if (!isAuthenticated) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
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
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {translate('mainTitle')}
          </ThemedText>
          <Pressable
            style={[styles.languageButton, { backgroundColor: tintColor }]}
            onPress={toggleLanguage}
          >
            <ThemedText style={styles.languageButtonText}>
              {language === 'ar' ? 'EN' : 'ع'}
            </ThemedText>
          </Pressable>
        </ThemedView>

        {/* Total Budget */}
        <ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <CurrencyInput
            label={translate('totalBudget')}
            value={formData.totalBudget}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, totalBudget: value }))
            }
            supportedCurrencies={['USD']}
          />
        </ThemedView>

        {/* Exchange Rate Selector */}
        <ExchangeRateSelector
          rate={rate}
          mode={mode}
          onRateChange={setRate}
          onModeChange={setMode}
        />

        {/* Expenses */}
        <ThemedView style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {translate('medicalExpenses')}
          </ThemedText>
          <CurrencyInput
            label={translate('medicalExpenses')}
            value={formData.medicalExpenses}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, medicalExpenses: value }))
            }
          />

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {translate('salaries')}
          </ThemedText>
          <CurrencyInput
            label={translate('salaries')}
            value={formData.salaries}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, salaries: value }))
            }
          />

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {translate('carRental')}
          </ThemedText>
          <CurrencyInput
            label={translate('carRental')}
            value={formData.carRental}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, carRental: value }))
            }
          />

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {translate('otherExpenses')}
          </ThemedText>
          <CurrencyInput
            label={translate('otherExpenses')}
            value={formData.otherExpenses}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, otherExpenses: value }))
            }
          />
        </ThemedView>

        {/* Progress Bar */}
        {formData.totalBudget > 0 && (
          <ProgressBar
            total={formData.totalBudget}
            spent={totalExpenses}
            spentLabel={translate('spent')}
            ofLabel={translate('of')}
          />
        )}

        {/* Remaining Display */}
        {formData.totalBudget > 0 && (
          <RemainingDisplay remaining={remaining} total={formData.totalBudget} />
        )}

        {/* Save Button */}
        <Pressable
          style={[styles.saveButton, { backgroundColor: tintColor }]}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveButtonText}>{translate('save')}</ThemedText>
        </Pressable>
      </ScrollView>

      {/* Save Modal */}
      <Modal
        visible={saveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {translate('saveRecord')}
            </ThemedText>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor, borderColor, color: textColor },
              ]}
              value={recordName}
              onChangeText={setRecordName}
              placeholder={translate('recordNamePlaceholder')}
              placeholderTextColor={textSecondary}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: borderColor }]}
                onPress={() => setSaveModalVisible(false)}
                disabled={saving}
              >
                <ThemedText>{translate('cancel')}</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: tintColor }]}
                onPress={confirmSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={{ color: '#fff' }}>{translate('confirm')}</ThemedText>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    flex: 1,
  },
  languageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  saveButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
