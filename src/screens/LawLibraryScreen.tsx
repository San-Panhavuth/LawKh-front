import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getLawCategories } from '../services/ragClient';
import { colors } from '../theme/colors';
import { LawCategoryResponse } from '../types/api';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LawLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const [categories, setCategories] = useState<LawCategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    getLawCategories()
      .then((items) => {
        if (!mounted) return;
        setCategories(items);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Unable to load law categories.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Law Library</Text>
        <Text style={styles.subtitle}>Browse legal categories and documents</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('LawDocumentList', { categoryId: item.id, categoryName: item.name })}
          >
            <Text style={styles.icon}>{item.icon ?? '📄'}</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.badge}>{item.documentCount} docs</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{isLoading ? 'Loading law categories...' : error || 'No law categories found.'}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 14, gap: 4 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  subtitle: { color: colors.textMuted },
  content: { padding: 16, gap: 12 },
  row: { gap: 12 },
  card: {
    flex: 1,
    minHeight: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    justifyContent: 'space-between',
  },
  icon: { fontSize: 26 },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  description: { color: colors.textMuted, fontSize: 12 },
  badge: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
});
