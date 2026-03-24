import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getPersons } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const priorityWeights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
const priorityStyle = {
  CRITICAL: { bg: colors.red50, text: colors.red700, border: colors.red200 },
  HIGH:     { bg: colors.red50, text: colors.red700, border: colors.red200 },
  MEDIUM:   { bg: colors.amber50, text: colors.amber700, border: colors.amber200 },
  LOW:      { bg: colors.emerald50, text: colors.emerald700, border: colors.emerald200 },
};

function statusToLabel(s) {
  return { REGISTERED: 'New', IN_REVIEW: 'In Progress', REFERRED: 'Referred', TRANSFERRED: 'Transferred', CLOSED: 'Closed' }[s] || s;
}

function CaseCard({ caseData, onPress }) {
  const { caseId, firstName, lastName, nationality, currentStatus, createdAt, triagePriority } = caseData;
  const priority = triagePriority || 'MEDIUM';
  const ps = priorityStyle[priority] || priorityStyle.MEDIUM;
  const isUrgent = priority === 'CRITICAL' || priority === 'HIGH';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardMainSection}>
        <View style={styles.cardTop}>
          <View style={styles.cardMain}>
            <Text style={styles.cardName}>{firstName} {lastName}</Text>
            <Text style={styles.cardId}>{caseId}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: ps.bg, borderColor: ps.border }]}>
            <Text style={[styles.priorityText, { color: ps.text }]}>{priority} Priority</Text>
          </View>
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={colors.gray400} />
            <Text style={styles.metaText} numberOfLines={1}>{nationality || 'Unknown'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.gray400} />
            <Text style={styles.metaText}>{new Date(createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statusRow}>
          {isUrgent ? <Ionicons name="alert-circle" size={14} color={colors.red500} /> : <View style={[styles.dot, { backgroundColor: priority === 'MEDIUM' ? colors.amber500 : colors.emerald500 }]} />}
          <Text style={styles.statusText}>{statusToLabel(currentStatus)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.gray400} />
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function load(silent = false) {
    if (!silent) setLoading(true);
    setError('');
    try {
      const data = await getPersons();
      setPersons(data.persons || []);
    } catch (err) {
      setError(err.message || 'Failed to load cases');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(useCallback(() => { load(); }, []));

  const sortedCases = [...persons].sort((a, b) => {
    const wA = priorityWeights[a.triagePriority] || 2;
    const wB = priorityWeights[b.triagePriority] || 2;
    if (wB !== wA) return wB - wA;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={async () => { await logout(); }} style={{ marginRight: 16 }}>
          <Ionicons name="log-out-outline" size={24} color={colors.gray600} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.emerald600} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <View>
          <Text style={styles.welcomeText}>Active Cases</Text>
          <Text style={styles.roleText}>Manage and review incoming files.</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countLabel}>Total Active:</Text>
          <View style={styles.countNumBox}>
            <Text style={styles.countNumText}>{persons.length}</Text>
          </View>
        </View>
      </View>
      {error ? (
        <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
      ) : null}
      <FlatList
        data={sortedCases}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} />}
        renderItem={({ item }) => <CaseCard caseData={item} onPress={() => navigation.navigate('CaseFile', { caseId: item.caseId })} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: colors.gray50 },
  welcomeText: { fontSize: 24, fontWeight: '800', color: colors.gray900 },
  roleText: { fontSize: 14, color: colors.gray500, marginTop: 4 },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.gray200, elevation: 1 },
  countLabel: { fontSize: 14, fontWeight: '500', color: colors.gray600 },
  countNumBox: { backgroundColor: colors.emerald50, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  countNumText: { fontSize: 14, fontWeight: '700', color: colors.emerald600 },
  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 16 },
  card: { backgroundColor: colors.white, borderRadius: 12, elevation: 1, borderWidth: 1, borderColor: colors.gray200, overflow: 'hidden' },
  cardMainSection: { padding: 16, gap: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardMain: { flex: 1, marginRight: 8 },
  cardName: { fontSize: 16, fontWeight: '700', color: colors.gray900 },
  cardId: { fontSize: 13, fontWeight: '500', color: colors.gray500, marginTop: 2 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  metaText: { fontSize: 13, color: colors.gray600 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: colors.gray100, backgroundColor: 'rgba(249, 250, 251, 0.8)', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: '500', color: colors.gray700 },
  errorBox: { margin: 16, padding: 12, backgroundColor: colors.red50, borderRadius: 8 },
  errorText: { color: colors.red700, fontSize: 13 },
});
