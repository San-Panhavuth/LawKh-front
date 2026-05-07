import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { deleteChat, getChatHistory } from '../services/ragClient';
import { colors } from '../theme/colors';
import { ChatSummaryResponse } from '../types/api';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ChatSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    getChatHistory()
      .then((chats) => {
        if (!mounted) return;
        setItems(chats);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Unable to load chat history. Sign in and try again.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const sections = useMemo(() => {
    const getGroup = (updatedAt: string) => {
      const updated = new Date(updatedAt);
      if (Number.isNaN(updated.getTime())) return 'Earlier';
      const ageMs = Date.now() - updated.getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      if (ageDays <= 7) return 'This Week';
      if (ageDays <= 31) return 'This Month';
      return 'Earlier';
    };

    const filtered = items.filter((item) => {
      const value = `${item.title} ${item.preview}`.toLowerCase();
      return value.includes(query.toLowerCase());
    });

    return ['This Week', 'This Month', 'Earlier']
      .map((group) => ({ title: group, data: filtered.filter((item) => getGroup(item.updatedAt) === group) }))
      .filter((section) => section.data.length);
  }, [items, query]);

  const handleDelete = async (chatId: string) => {
    if (deletingId) return;
    setDeletingId(chatId);
    setError('');

    try {
      await deleteChat(chatId);
      setItems((prev) => prev.filter((item) => item.id !== chatId));
    } catch {
      setError('Unable to delete chat history. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

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
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.deleteButton}
                  disabled={deletingId === item.id}
                  hitSlop={8}
                  onPress={(event) => {
                    event.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={17} color={colors.danger} />
                </Pressable>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </View>
            <Text style={styles.preview}>{item.preview}</Text>
            <Text style={styles.date}>{deletingId === item.id ? 'Deleting...' : new Date(item.updatedAt).toLocaleDateString()}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{isLoading ? 'Loading history...' : error || 'No history found for this query.'}</Text>}
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
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: { color: colors.textMuted, marginTop: 6 },
  date: { color: colors.accent, marginTop: 8, fontSize: 12, fontWeight: '600' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
});
