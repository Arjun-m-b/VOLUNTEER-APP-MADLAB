import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getPersonByCaseId } from '../lib/api';
import { colors } from '../theme/colors';

function SectionCard({ title, icon, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color={colors.gray500} style={{ marginRight: 8 }} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

export default function CaseFileScreen() {
  const route = useRoute();
  const { caseId } = route.params;
  const [person, setPerson] = useState(null);
  const [caseFile, setCaseFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const data = await getPersonByCaseId(caseId);
          setPerson(data.person);
          setCaseFile(data.caseFile);
        } catch (e) {
        } finally {
          setLoading(false);
        }
      }
      load();
    }, [caseId])
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.emerald600} /></View>;
  if (!person) return <View style={styles.center}><Text>Case Not Found</Text></View>;

  const fullName = `${person.firstName} ${person.lastName}`;
  const dob = person.dateOfBirth ? new Date(person.dateOfBirth).toISOString().split('T')[0] : 'Unknown';
  const triageBrief = caseFile?.triageBrief;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.idTxt}>ID: {person.caseId}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}><Text style={styles.badgeTxt}>{person.currentStatus}</Text></View>
          <View style={[styles.badge, { backgroundColor: colors.gray100 }]}><Text style={[styles.badgeTxt, { color: colors.gray700 }]}>{person.caseType}</Text></View>
        </View>
      </View>

      {triageBrief?.summary && (
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={18} color={colors.indigo600} />
            <Text style={styles.aiTitle}>AI Triage Summary</Text>
          </View>
          <Text style={styles.aiText}>{triageBrief.summary}</Text>
        </View>
      )}

      <SectionCard title="Demographics" icon="person">
        <View style={styles.gridRow}><Text style={styles.lbl}>Age/DOB:</Text><Text style={styles.val}>{dob}</Text></View>
        <View style={styles.gridRow}><Text style={styles.lbl}>Gender:</Text><Text style={styles.val}>{person.gender}</Text></View>
        <View style={styles.gridRow}><Text style={styles.lbl}>Nationality:</Text><Text style={styles.val}>{person.nationality || 'Unknown'}</Text></View>
        <View style={styles.gridRow}><Text style={styles.lbl}>Language:</Text><Text style={styles.val}>{person.languages?.join(', ') || 'Unknown'}</Text></View>
      </SectionCard>

      <SectionCard title="Protection Flags" icon="shield-half">
        {Object.entries({
          'Medical Emergency': person.flags?.medicalEmergency,
          'Unaccompanied Minor': person.flags?.unaccompaniedMinor,
          'Trafficking Indicator': person.flags?.traffickingIndicator,
          'Asylum Claim': person.flags?.asylumClaim,
          'Family Separated': person.flags?.familySeparated,
        }).map(([label, val]) => (
          <View key={label} style={styles.flagRow}>
            <Text style={styles.flagLbl}>{label}</Text>
            <View style={[styles.flagValBox, val ? styles.flagValTrue : styles.flagValFalse]}>
              <Text style={[styles.flagValTxt, val ? styles.flagValTxtTrue : styles.flagValTxtFalse]}>{val ? 'YES' : 'No'}</Text>
            </View>
          </View>
        ))}
      </SectionCard>

      {(person.asylumNarrative || person.translatedNarrative) && (
        <SectionCard title="Narrative History" icon="document-text">
          <Text style={styles.narrativeLbl}>Original Audio Text</Text>
          <Text style={styles.narrativeVal}>{person.asylumNarrative || 'No text recorded'}</Text>
          
          <Text style={[styles.narrativeLbl, { marginTop: 16 }]}>English Translation</Text>
          <Text style={styles.narrativeVal}>{person.translatedNarrative || 'No translation available'}</Text>
        </SectionCard>
      )}

      {caseFile?.notes?.length > 0 && (
        <SectionCard title="Case Notes" icon="list">
          {caseFile.notes.map((note, i) => (
            <View key={i} style={styles.noteBox}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteAuth}>{note.author?.name || 'System'}</Text>
                <Text style={styles.noteTime}>{new Date(note.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.noteTxt}>{note.content}</Text>
            </View>
          ))}
        </SectionCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: 16, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBox: { backgroundColor: colors.white, padding: 20, borderRadius: 16, elevation: 1 },
  name: { fontSize: 24, fontWeight: '700', color: colors.gray900 },
  idTxt: { fontSize: 13, color: colors.gray500, marginTop: 4 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 12 },
  badge: { backgroundColor: colors.emerald100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeTxt: { fontSize: 11, fontWeight: '700', color: colors.emerald800 },
  aiBox: { backgroundColor: colors.indigo50, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.indigo100 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiTitle: { fontSize: 15, fontWeight: '700', color: colors.indigo900 },
  aiText: { fontSize: 14, color: colors.indigo900, lineHeight: 22 },
  card: { backgroundColor: colors.white, borderRadius: 16, elevation: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.gray50, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.gray800 },
  cardBody: { padding: 16 },
  gridRow: { flexDirection: 'row', marginBottom: 8 },
  lbl: { width: 100, fontSize: 13, color: colors.gray500, fontWeight: '500' },
  val: { flex: 1, fontSize: 14, color: colors.gray900, fontWeight: '500' },
  flagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.gray50 },
  flagLbl: { fontSize: 14, color: colors.gray700 },
  flagValBox: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  flagValTrue: { backgroundColor: colors.red100 },
  flagValFalse: { backgroundColor: colors.gray100 },
  flagValTxt: { fontSize: 11, fontWeight: '700' },
  flagValTxtTrue: { color: colors.red800 },
  flagValTxtFalse: { color: colors.gray500 },
  narrativeLbl: { fontSize: 12, fontWeight: '700', color: colors.gray500, textTransform: 'uppercase', marginBottom: 4 },
  narrativeVal: { fontSize: 14, color: colors.gray800, lineHeight: 22, backgroundColor: colors.gray50, padding: 12, borderRadius: 8 },
  noteBox: { backgroundColor: colors.gray50, padding: 12, borderRadius: 8, marginBottom: 12 },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  noteAuth: { fontSize: 13, fontWeight: '600', color: colors.gray900 },
  noteTime: { fontSize: 11, color: colors.gray500 },
  noteTxt: { fontSize: 14, color: colors.gray700, lineHeight: 20 },
});
