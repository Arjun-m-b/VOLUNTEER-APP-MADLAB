import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function Checkbox({ checked, onChange, label, description }) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={() => onChange(!checked)}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color={colors.white} />}
      </View>
      {(label || description) && (
        <View style={styles.textContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 6 },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10,
    backgroundColor: colors.white,
  },
  boxChecked: {
    backgroundColor: colors.emerald600,
    borderColor: colors.emerald600,
  },
  textContainer: { flex: 1 },
  label: { fontSize: 15, color: colors.gray900 },
  description: { fontSize: 13, color: colors.gray500, marginTop: 2 },
});
