import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function Select({ label, selectedValue, onValueChange, items, error, required, style }) {
  const [visible, setVisible] = useState(false);

  const selectedItem = items.find(i => i.value === selectedValue);
  const displayLabel = selectedItem?.label || 'Select...';
  const hasValue = selectedValue !== '' && selectedValue != null;

  const handleSelect = (value) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.trigger, error && styles.triggerError]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !hasValue && styles.placeholder]} numberOfLines={1}>
          {displayLabel}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.gray400} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{typeof label === 'string' ? label : 'Select'}</Text>
                <TouchableOpacity onPress={() => setVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color={colors.gray500} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={items.filter(i => i.value !== '')}
                keyExtractor={(item) => item.value}
                style={styles.list}
                renderItem={({ item }) => {
                  const isSelected = item.value === selectedValue;
                  return (
                    <TouchableOpacity
                      style={[styles.option, isSelected && styles.optionSelected]}
                      onPress={() => handleSelect(item.value)}
                      activeOpacity={0.6}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {item.label}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={20} color={colors.emerald600} />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 6 },
  required: { color: colors.amber600 },

  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    backgroundColor: colors.white,
    height: 48,
    paddingHorizontal: 12,
  },
  triggerError: { borderColor: colors.red500 },
  triggerText: { fontSize: 15, color: colors.gray900, flex: 1 },
  placeholder: { color: colors.gray400 },
  errorText: { fontSize: 12, color: colors.red600, marginTop: 4 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '60%',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.gray900 },
  list: { paddingBottom: 20 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray100,
  },
  optionSelected: { backgroundColor: colors.emerald50 },
  optionText: { fontSize: 16, color: colors.gray800 },
  optionTextSelected: { fontWeight: '600', color: colors.emerald700 },
});
