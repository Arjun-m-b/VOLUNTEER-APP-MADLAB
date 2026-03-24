import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function Input({ label, error, required, style, ...props }) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError, props.multiline && styles.multiline]}
        placeholderTextColor={colors.gray400}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 6 },
  required: { color: colors.amber600 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.gray900,
  },
  inputError: { borderColor: colors.red500 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: colors.red600, marginTop: 4 },
});
