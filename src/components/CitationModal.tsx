import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { Citation } from '../types/models';

interface CitationModalProps {
  citation: Citation;
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
  onOpenSource: () => void;
}

export default function CitationModal({ citation, isLoading, error, onClose, onOpenSource }: CitationModalProps) {
  const pageLabel = citation.page ?? citation.pageStart;
  const canOpenSource = Boolean(citation.documentId || citation.pdfUrl || citation.fileUrl || citation.downloadUrl || citation.sourceUrl);

  return (
    <Modal transparent animationType="slide" visible={Boolean(citation)} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Citation Detail</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          <Text style={styles.sourceTitle}>{citation.title}</Text>
          <Text style={styles.citation}>{citation.fullCitation}</Text>

          {pageLabel ? <Text style={styles.meta}>Page {pageLabel}</Text> : null}
          {citation.locationLabel ? <Text style={styles.meta}>{citation.locationLabel}</Text> : null}
          {citation.sectionTitle ? <Text style={styles.meta}>{citation.sectionTitle}</Text> : null}

          {isLoading ? <Text style={styles.body}>Loading source details...</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.body}>{citation.excerpt || 'No excerpt returned for this citation yet.'}</Text>

          <Pressable style={[styles.sourceButton, !canOpenSource && styles.disabled]} disabled={!canOpenSource} onPress={onOpenSource}>
            <Ionicons name="document-text-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.sourceButtonText}>Open Source</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
    minHeight: 320,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  sourceTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  citation: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  body: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  sourceButton: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  sourceButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.45,
  },
});
