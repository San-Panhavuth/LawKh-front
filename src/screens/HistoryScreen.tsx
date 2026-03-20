import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { historyItems } from '../data/mockData';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const filtered = historyItems.filter((item) => {
      const value = `${item.title} ${item.preview}`.toLowerCase();
      return value.includes(query.toLowerCase());
    });

    return ['This Week', 'This Month', 'Earlier']
      .map((group) => ({ title: group, data: filtered.filter((item) => item.group === group) }))
      .filter((section) => section.data.length);
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat History</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search history"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderSectionHeader={({ section }) => <Text style={styles.section}>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
            <Text style={styles.preview}>{item.preview}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No history found for this query.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, gap: 10 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  searchRow: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.textPrimary },
  content: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  section: { color: colors.textMuted, marginTop: 12, marginBottom: 6, fontWeight: '700' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', flex: 1 },
  preview: { color: colors.textMuted, marginTop: 6 },
  date: { color: colors.accent, marginTop: 8, fontSize: 12, fontWeight: '600' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
});
