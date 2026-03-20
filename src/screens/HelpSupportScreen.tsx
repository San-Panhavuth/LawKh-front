import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

export default function HelpSupportScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Help & Support</Text>

        <Pressable style={styles.card} onPress={() => Linking.openURL('mailto:support@lawkh.app')}>
          <Text style={styles.cardTitle}>Email Support</Text>
          <Text style={styles.cardText}>support@lawkh.app</Text>
        </Pressable>

        <Pressable style={styles.card}>
          <Text style={styles.cardTitle}>Live Chat</Text>
          <Text style={styles.cardText}>Available weekdays, 9:00 - 18:00</Text>
        </Pressable>

        <Pressable style={styles.card}>
          <Text style={styles.cardTitle}>FAQ</Text>
          <Text style={styles.cardText}>Read common questions and answers</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16, gap: 10 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  backText: { color: colors.textPrimary, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    gap: 4,
  },
  cardTitle: { color: colors.textPrimary, fontWeight: '700' },
  cardText: { color: colors.textMuted },
});
