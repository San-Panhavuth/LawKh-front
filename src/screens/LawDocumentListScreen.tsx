import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { documentsByCategory } from '../data/mockData';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LawDocumentList'>;

export default function LawDocumentListScreen({ navigation, route }: Props) {
  const { categoryId, categoryName } = route.params;
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const docs = documentsByCategory[categoryId] ?? [];
    return docs.filter((doc) => `${doc.title} ${doc.subtitle}`.toLowerCase().includes(query.toLowerCase()));
  }, [categoryId, query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{categoryName}</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search documents"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('LawDocumentViewer', { categoryId, documentId: item.id })}
          >
            <Text style={styles.docTitle}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.meta}>{item.year} • {item.pages} pages • {item.size}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, gap: 10 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { color: colors.textPrimary, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  searchRow: {
    marginHorizontal: 16,
    marginBottom: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, color: colors.textPrimary },
  content: { paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    marginBottom: 10,
  },
  docTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 16 },
  subtitle: { color: colors.textMuted, marginTop: 6 },
  meta: { color: colors.accent, marginTop: 8, fontSize: 12, fontWeight: '600' },
});
