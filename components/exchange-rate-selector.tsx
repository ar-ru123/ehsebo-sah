import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Modal } from 'react-native';
import { ThemedText } from './themed-text';

interface ExchangeRateSelectorProps {
  rate: number;
  mode: 'manual' | 'automatic';
  onRateChange: (rate: number) => void;
  onModeChange: (mode: 'manual' | 'automatic') => void;
  isLoading?: boolean;
}

export function ExchangeRateSelector({
  rate,
  mode,
  onRateChange,
  onModeChange,
  isLoading = false,
}: ExchangeRateSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempRate, setTempRate] = useState(rate.toString());

  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const handleSaveRate = () => {
    const newRate = parseFloat(tempRate);
    if (newRate > 0) {
      onRateChange(newRate);
      setModalVisible(false);
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor, borderColor }]}>
        <View style={styles.header}>
          <ThemedText style={[styles.label, { color: textSecondary }]}>
            سعر الصرف (USD → RUB)
          </ThemedText>
          <ThemedText style={[styles.rate, { color: tintColor }]}>
            1 USD = {rate.toFixed(2)} RUB
          </ThemedText>
        </View>

        <View style={styles.modeSelector}>
          <Pressable
            style={[
              styles.modeButton,
              mode === 'automatic' && { backgroundColor: tintColor },
              { borderColor },
            ]}
            onPress={() => onModeChange('automatic')}
            disabled={isLoading}
          >
            <ThemedText
              style={[
                styles.modeButtonText,
                mode === 'automatic' && { color: '#fff' },
              ]}
            >
              تلقائي
            </ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.modeButton,
              mode === 'manual' && { backgroundColor: tintColor },
              { borderColor },
            ]}
            onPress={() => onModeChange('manual')}
            disabled={isLoading}
          >
            <ThemedText
              style={[
                styles.modeButtonText,
                mode === 'manual' && { color: '#fff' },
              ]}
            >
              يدوي
            </ThemedText>
          </Pressable>
        </View>

        {mode === 'manual' && (
          <Pressable
            style={[styles.editButton, { backgroundColor: tintColor }]}
            onPress={() => {
              setTempRate(rate.toString());
              setModalVisible(true);
            }}
          >
            <ThemedText style={styles.editButtonText}>تعديل السعر</ThemedText>
          </Pressable>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <ThemedText style={styles.modalTitle}>تعديل سعر الصرف</ThemedText>

            <View style={[styles.inputContainer, { borderColor }]}>
              <ThemedText style={[styles.inputLabel, { color: textSecondary }]}>
                1 USD =
              </ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={tempRate}
                onChangeText={setTempRate}
                keyboardType="decimal-pad"
                placeholder="100"
              />
              <ThemedText style={[styles.inputLabel, { color: textSecondary }]}>
                RUB
              </ThemedText>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: borderColor }]}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText>إلغاء</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: tintColor }]}
                onPress={handleSaveRate}
              >
                <ThemedText style={{ color: '#fff' }}>حفظ</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  rate: {
    fontSize: 16,
    fontWeight: '700',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    maxWidth: 350,
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 56,
  },
  inputLabel: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
