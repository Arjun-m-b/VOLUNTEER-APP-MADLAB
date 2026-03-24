import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Button from '../components/ui/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
// Deriving a viewer URL: assuming backend is like http://ip:5000/api
// Actual QR should probably point to a deployed frontend if possible.
// For now, mirroring web behavior.
const APP_URL = process.env.EXPO_PUBLIC_WEB_URL || API_BASE.replace('/api', '').replace('5000', '5173');

export default function SubmittedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const person = route.params?.person;
  const caseFile = route.params?.caseFile;

  if (!person) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={64} color={colors.amber500} />
        <Text style={styles.title}>No Submission Data</Text>
        <Button title="Go to Dashboard" onPress={() => navigation.navigate('MainTabs')} style={styles.btn} />
      </View>
    );
  }

  const caseId = person.caseId;
  const fullName = `${person.firstName} ${person.lastName}`;
  const caseUrl = `${APP_URL}/case/${caseId}`;

  const priorityLevel = caseFile?.triageBrief?.priorityLevel;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="checkmark-circle" size={64} color={colors.emerald500} style={styles.icon} />
        <Text style={styles.title}>Form Submitted!</Text>
        <Text style={styles.subtitle}>{fullName}'s intake has been saved.</Text>

        {caseFile?.triageBrief?.summary && (
          <View style={styles.aiBox}>
            <Text style={styles.aiTitle}>AI Triage Summary</Text>
            <Text style={styles.aiText}>{caseFile.triageBrief.summary}</Text>
            {priorityLevel && (
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>Priority: {priorityLevel}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.qrBox}>
          <Text style={styles.qrTitle}>Case File Access</Text>
          <View style={styles.qrWrapper}>
            <QRCode value={caseUrl} size={150} />
          </View>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>ID: {caseId}</Text>
          </View>
        </View>

        <View style={styles.navRow}>
          <Button 
            title="Open File" 
            variant="outline" 
            onPress={() => navigation.navigate('CaseFile', { caseId })} 
            style={{ flex: 1, marginRight: 8 }} 
          />
          <Button 
            title="Home" 
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })} 
            style={{ flex: 1, marginLeft: 8 }} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50, justifyContent: 'center', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
  card: { backgroundColor: colors.white, padding: 24, borderRadius: 20, elevation: 4, alignItems: 'center' },
  icon: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: colors.gray900, marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.gray500, textAlign: 'center', marginBottom: 20 },
  btn: { width: 200 },
  aiBox: { backgroundColor: colors.indigo50, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.indigo100, marginBottom: 20, width: '100%' },
  aiTitle: { fontSize: 13, fontWeight: '700', color: colors.indigo900, marginBottom: 4 },
  aiText: { fontSize: 13, color: colors.indigo800 },
  priorityBadge: { alignSelf: 'flex-start', backgroundColor: colors.red100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 8 },
  priorityText: { fontSize: 11, fontWeight: '700', color: colors.red800 },
  qrBox: { alignItems: 'center', backgroundColor: colors.gray50, width: '100%', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.gray200, marginBottom: 24 },
  qrTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  qrWrapper: { padding: 16, backgroundColor: colors.white, borderRadius: 16, elevation: 1 },
  idBadge: { backgroundColor: colors.gray200, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginTop: 16 },
  idText: { fontSize: 16, fontWeight: '600', letterSpacing: 1 },
  navRow: { flexDirection: 'row', width: '100%' },
});
