import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { citationDetails } from '../data/mockData';
import { colors } from '../theme/colors';

interface CitationModalProps {
  citation: string;
  onClose: () => void;
}

export default function CitationModal({ citation, onClose }: CitationModalProps) {
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
          <Text style={styles.citation}>{citation}</Text>
          <Text style={styles.body}>{citationDetails[citation] ?? 'No detailed citation entry found.'}</Text>
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
    minHeight: 260,
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
  citation: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
  },
});
