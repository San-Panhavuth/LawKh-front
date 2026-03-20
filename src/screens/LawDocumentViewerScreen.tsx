import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { documentsByCategory } from '../data/mockData';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LawDocumentViewer'>;

export default function LawDocumentViewerScreen({ route, navigation }: Props) {
  const { categoryId, documentId } = route.params;
  const doc = (documentsByCategory[categoryId] ?? []).find((item) => item.id === documentId);

  if (!doc) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.title}>Document not found</Text>
          <Pressable style={styles.action} onPress={() => navigation.goBack()}>
            <Text style={styles.actionText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.meta}>{doc.year} • {doc.pages} pages • {doc.size}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.actions}>
          <Pressable style={styles.actionPill}><Text style={styles.actionText}>Download</Text></Pressable>
          <Pressable style={styles.actionPill}><Text style={styles.actionText}>Share</Text></Pressable>
          <Pressable style={styles.actionPill}><Text style={styles.actionText}>Bookmark</Text></Pressable>
        </View>
        <Text style={styles.body}>{doc.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  header: { padding: 16, gap: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  backText: { color: colors.textPrimary, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 13 },
  content: { padding: 16, gap: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  actionPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  action: {
    borderRadius: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actionText: { color: colors.textPrimary, fontWeight: '600' },
  body: {
    color: colors.textPrimary,
    lineHeight: 22,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    backgroundColor: colors.surface,
  },
});
