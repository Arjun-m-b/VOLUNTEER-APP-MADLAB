import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { translateText } from '../lib/api';
import { colors } from '../theme/colors';

// Map to ISO codes for MyMemory translation API
const translationCodeMap = {
  'English': 'en',
  'Spanish': 'es',
  'Arabic': 'ar',
  'French': 'fr',
  'Swahili': 'sw',
  'Ukrainian': 'uk',
  'Russian': 'ru',
  'Hindi': 'hi',
  'Pashto': 'ps',
  'Dari': 'fa',
  'Farsi': 'fa',
  'Other': 'Autodetect'
};

export default function AudioRecorder({ preferredLanguage, onTranscriptionUpdate, onTranslationUpdate, initialValue = '', initialTranslation = '' }) {
  const [originalText, setOriginalText] = useState(initialValue);
  const [translatedText, setTranslatedText] = useState(initialTranslation);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!originalText.trim() || preferredLanguage === 'English') return;
    setIsTranslating(true);
    setError(null);
    try {
      const sourceLang = translationCodeMap[preferredLanguage] || 'Autodetect';
      const data = await translateText(originalText, sourceLang, 'en');
      if (!data.success) throw new Error(data.message || 'Translation failed');
      setTranslatedText(data.translatedText);
      if (onTranslationUpdate) onTranslationUpdate(data.translatedText);
    } catch (err) {
      setError('Failed to translate. Check backend connection.');
    } finally {
      setIsTranslating(false);
    }
  };

  const showTranslation = preferredLanguage !== 'English' && (originalText || translatedText);

  return (
    <View style={styles.container}>
      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={16} color={colors.red600} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Original Text Panel */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name="mic" size={16} color={colors.gray400} />
            <Text style={styles.panelHeaderText}>Original Audio ({preferredLanguage})</Text>
          </View>
        </View>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder={`Speak in ${preferredLanguage} or type manually...`}
          placeholderTextColor={colors.gray400}
          value={originalText}
          onChangeText={(val) => {
            setOriginalText(val);
            if (onTranscriptionUpdate) onTranscriptionUpdate(val);
          }}
          textAlignVertical="top"
        />
        <Text style={styles.micNote}>* Voice recording not available on mobile — type manually</Text>
      </View>

      {/* Translation Panel */}
      {showTranslation && (
        <View style={styles.translatePanel}>
          <View style={styles.translatePanelHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="language" size={16} color={colors.indigo600} />
              <Text style={styles.translateHeaderText}>English Translation</Text>
            </View>
            <TouchableOpacity
              style={[styles.translateButton, (isTranslating || !originalText.trim()) && styles.translateButtonDisabled]}
              onPress={handleTranslate}
              disabled={isTranslating || !originalText.trim()}
              activeOpacity={0.7}
            >
              {isTranslating ? (
                <View style={styles.translateBtnContent}>
                  <ActivityIndicator size="small" color={colors.indigo700} />
                  <Text style={styles.translateBtnText}>Translating...</Text>
                </View>
              ) : (
                <View style={styles.translateBtnContent}>
                  <Ionicons name="refresh" size={12} color={colors.indigo700} />
                  <Text style={styles.translateBtnText}>{translatedText ? 'Re-translate' : 'Translate'}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.translateBody}>
            {isTranslating ? (
              <View style={styles.translatingPlaceholder}>
                <ActivityIndicator size="large" color={colors.indigo400} />
                <Text style={styles.translatingText}>Translating via MyMemory API...</Text>
              </View>
            ) : translatedText ? (
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={5}
                placeholder="English translation will appear here..."
                placeholderTextColor={colors.gray400}
                value={translatedText}
                onChangeText={(val) => {
                  setTranslatedText(val);
                  if (onTranslationUpdate) onTranslationUpdate(val);
                }}
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.emptyTranslation}>
                Translation will appear here after you press Translate.
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },

  // Error
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.red50, padding: 12, borderRadius: 8,
    borderWidth: 1, borderColor: colors.red100,
  },
  errorText: { color: colors.red600, fontSize: 13, flex: 1 },

  // Original panel
  panel: {
    borderWidth: 2, borderColor: colors.gray200, borderRadius: 12,
    backgroundColor: colors.white, overflow: 'hidden',
  },
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.gray50, borderBottomWidth: 1, borderBottomColor: colors.gray200,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  panelHeaderText: { fontSize: 14, fontWeight: '600', color: colors.gray700 },
  textArea: {
    minHeight: 140, padding: 16, fontSize: 16, color: colors.gray900,
    lineHeight: 24,
  },
  micNote: {
    fontSize: 11, color: colors.gray400, textAlign: 'center',
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.gray100,
  },

  // Translate panel
  translatePanel: {
    borderWidth: 1, borderColor: colors.indigo100, borderRadius: 12,
    backgroundColor: '#eef2ff50', overflow: 'hidden',
  },
  translatePanelHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#eef2ff', borderBottomWidth: 1, borderBottomColor: colors.indigo100,
  },
  translateHeaderText: { fontSize: 14, fontWeight: '600', color: colors.indigo900 },
  translateButton: {
    borderWidth: 1, borderColor: colors.indigo200, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.white,
  },
  translateButtonDisabled: { opacity: 0.5 },
  translateBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  translateBtnText: { fontSize: 12, fontWeight: '600', color: colors.indigo700 },
  translateBody: { backgroundColor: colors.white, minHeight: 100 },
  translatingPlaceholder: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 24, gap: 8,
  },
  translatingText: { fontSize: 13, fontWeight: '500', color: colors.indigo400 },
  emptyTranslation: {
    color: colors.indigo300, fontStyle: 'italic', textAlign: 'center',
    paddingVertical: 24, fontSize: 14,
  },
});
