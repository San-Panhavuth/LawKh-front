import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsConditions'>;

export default function TermsConditionsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Terms & Conditions</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Last Updated: March 20, 2026</Text>
        <Text style={styles.section}>1. Introduction</Text>
        <Text style={styles.body}>LawKH provides legal research assistance. Usage is subject to lawful and ethical conduct.</Text>
        <Text style={styles.section}>2. Use of Service</Text>
        <Text style={styles.body}>You are responsible for validating generated outputs and ensuring jurisdiction-appropriate review.</Text>
        <Text style={styles.section}>3. Legal Disclaimer</Text>
        <Text style={styles.body}>The service does not replace legal counsel and should not be treated as legal advice.</Text>
        <Text style={styles.section}>4. Privacy</Text>
        <Text style={styles.body}>Your data is handled according to applicable privacy policies and security practices.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, gap: 8 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { color: colors.textPrimary, fontWeight: '600' },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  updated: { color: colors.textMuted, marginBottom: 6 },
  section: { color: colors.accent, fontSize: 16, fontWeight: '700' },
  body: { color: colors.textPrimary, lineHeight: 22 },
});
