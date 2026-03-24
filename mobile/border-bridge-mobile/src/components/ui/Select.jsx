import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../theme/colors';

// Fallback simple native select using Picker
export default function Select({ label, selectedValue, onValueChange, items, error, required, style }) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.pickerContainer, error && styles.pickerError]}>
        <Picker
          mode="dropdown"
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 6 },
  required: { color: colors.amber600 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    backgroundColor: colors.white,
    overflow: 'hidden',
    height: 48,
    justifyContent: 'center',
  },
  pickerError: { borderColor: colors.red500 },
  picker: { width: '100%', height: '100%', ...(Platform.OS === 'android' ? { marginLeft: -8 } : {}) },
  errorText: { fontSize: 12, color: colors.red600, marginTop: 4 },
});
