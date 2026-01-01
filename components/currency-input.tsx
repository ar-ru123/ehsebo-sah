import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { CURRENCIES, convertUsdToRub, convertRubToUsd } from '@/constants/exchange-rates';

type Currency = 'USD' | 'RUB';

interface CurrencyInputProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  supportedCurrencies?: Currency[];
  disabled?: boolean;
}

export function CurrencyInput({
  label,
  value,
  onValueChange,
  supportedCurrencies = ['USD', 'RUB'],
  disabled = false,
}: CurrencyInputProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(supportedCurrencies[0]);
  const [inputValue, setInputValue] = useState('');

  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');

  // Convert stored USD value to display currency
  const getDisplayValue = () => {
    if (value === 0) return '';
    if (selectedCurrency === 'USD') {
      return value.toFixed(2);
    } else {
      return convertUsdToRub(value).toFixed(2);
    }
  };

  const handleTextChange = (text: string) => {
    // Allow only numbers and decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    
    setInputValue(formatted);

    // Convert to USD and update parent
    const numValue = parseFloat(formatted) || 0;
    if (selectedCurrency === 'USD') {
      onValueChange(numValue);
    } else {
      onValueChange(convertRubToUsd(numValue));
    }
  };

  const handleCurrencyToggle = () => {
    if (supportedCurrencies.length === 1) return;
    
    const currentIndex = supportedCurrencies.indexOf(selectedCurrency);
    const nextIndex = (currentIndex + 1) % supportedCurrencies.length;
    setSelectedCurrency(supportedCurrencies[nextIndex]);
    
    // Update input value to reflect new currency
    if (value > 0) {
      if (supportedCurrencies[nextIndex] === 'USD') {
        setInputValue(value.toFixed(2));
      } else {
        setInputValue(convertUsdToRub(value).toFixed(2));
      }
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.label, { color: textSecondary }]}>{label}</ThemedText>
      <View style={[styles.inputContainer, { backgroundColor, borderColor }]}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={inputValue || getDisplayValue()}
          onChangeText={handleTextChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={textSecondary}
          editable={!disabled}
        />
        {supportedCurrencies.length > 1 ? (
          <Pressable
            style={[styles.currencyButton, { backgroundColor: tintColor }]}
            onPress={handleCurrencyToggle}
            disabled={disabled}
          >
            <ThemedText style={styles.currencyText}>
              {CURRENCIES[selectedCurrency].symbol}
            </ThemedText>
          </Pressable>
        ) : (
          <View style={[styles.currencyButton, { backgroundColor: tintColor }]}>
            <ThemedText style={styles.currencyText}>
              {CURRENCIES[selectedCurrency].symbol}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  currencyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
