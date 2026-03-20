import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    if (!email.trim() || !password.trim()) return;
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.brandWrap}>
          <View style={styles.brandRow}>
            <Ionicons name="scale" size={38} color={colors.accent} />
            <Text style={styles.brand}>LawKH</Text>
          </View>
          <Text style={styles.tagline}>Intelligent Legal Research Assistant</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@lawfirm.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkMuted}>Forgot password?</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={submit}>
            <Text style={styles.primaryText}>Sign In</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkAccent}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 24 },
  brandWrap: { alignItems: 'center', gap: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: { color: colors.textPrimary, fontSize: 40, fontWeight: '700' },
  tagline: { color: colors.textMuted, fontSize: 13 },
  form: { gap: 10 },
  label: { color: colors.textPrimary, fontSize: 14 },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: 14,
  },
  linkMuted: { color: colors.textMuted, textAlign: 'right', marginBottom: 8 },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryText: { color: colors.textPrimary, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerText: { color: colors.textMuted },
  linkAccent: { color: colors.accent, fontWeight: '700' },
});
