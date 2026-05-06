import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createElement, useEffect, useState } from 'react';
import { Linking, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { buildApiUrl } from '../config/api';
import { getLawDocument } from '../services/ragClient';
import { colors } from '../theme/colors';
import { LawDocumentResponse } from '../types/api';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LawDocumentViewer'>;

export default function LawDocumentViewerScreen({ route, navigation }: Props) {
  const { documentId } = route.params;
  const [doc, setDoc] = useState<LawDocumentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    getLawDocument(documentId)
      .then((item) => {
        if (!mounted) return;
        setDoc(item);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Unable to load document.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [documentId]);

  if (!doc) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.title}>{isLoading ? 'Loading document...' : error || 'Document not found'}</Text>
          <Pressable style={styles.action} onPress={() => navigation.goBack()}>
            <Text style={styles.actionText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const pdfUrl = doc.pdfUrl ?? doc.fileUrl ?? doc.downloadUrl ?? buildApiUrl(`/law/documents/${encodeURIComponent(documentId)}/download`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.meta}>{[doc.year, doc.pages ? `${doc.pages} pages` : undefined, doc.size].filter(Boolean).join(' • ')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.actions}>
          <Pressable style={styles.actionPill} disabled={!pdfUrl} onPress={() => pdfUrl && Linking.openURL(pdfUrl)}>
            <Text style={styles.actionText}>Download</Text>
          </Pressable>
          <Pressable style={styles.actionPill}><Text style={styles.actionText}>Share</Text></Pressable>
          <Pressable style={styles.actionPill}><Text style={styles.actionText}>Bookmark</Text></Pressable>
        </View>
        {pdfUrl && Platform.OS === 'web' ? (
          <View style={styles.pdfFrame}>
            {Platform.OS === 'web'
              ? // React Native Web can render DOM nodes through createElement for simple embeds.
                // The native app falls back to the text body unless a native PDF viewer is added.
                (createElement('iframe', {
                  src: pdfUrl,
                  title: doc.title,
                  style: {
                    width: '100%',
                    height: '100%',
                    border: '0',
                    backgroundColor: colors.surface,
                  },
                }) as any)
              : null}
          </View>
        ) : null}
        <Text style={styles.body}>{pdfUrl ? 'Text preview / OCR content\n\n' : ''}{doc.content}</Text>
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
  pdfFrame: {
    height: 720,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
});
