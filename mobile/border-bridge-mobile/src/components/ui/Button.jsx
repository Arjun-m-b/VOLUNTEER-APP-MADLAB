import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function Button({ title, onPress, loading, disabled, style, variant = 'primary' }) {
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.primary,
        (loading || disabled) && styles.disabled,
        style
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.emerald600 : colors.white} />
      ) : (
        <Text style={[styles.text, isOutline ? styles.textOutline : styles.textPrimary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: { backgroundColor: colors.emerald600 },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.gray300 },
  disabled: { opacity: 0.6 },
  text: { fontSize: 16, fontWeight: '600' },
  textPrimary: { color: colors.white },
  textOutline: { color: colors.gray700 },
});
