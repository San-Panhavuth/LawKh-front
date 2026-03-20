import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacySecurity'>;

export default function PrivacySecurityScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Privacy & Security</Text>

        <View style={styles.card}>
          <Text style={styles.section}>Password & Authentication</Text>
          <Text style={styles.item}>Change Password</Text>
          <Text style={styles.item}>Two-Factor Authentication: Off</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Data Privacy</Text>
          <Text style={styles.item}>Data Sharing Settings</Text>
          <Text style={styles.item}>Privacy Controls</Text>
          <Text style={styles.item}>Download My Data</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16, gap: 12 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { color: colors.textPrimary, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    gap: 8,
  },
  section: { color: colors.accent, fontWeight: '700', marginBottom: 2 },
  item: { color: colors.textPrimary },
});
