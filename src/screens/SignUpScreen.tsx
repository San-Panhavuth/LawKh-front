import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { signUp } from '../services/authClient';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setIsSubmitting(true);
    setError('');

    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      navigation.replace('MainTabs');
    } catch {
      setError('Unable to create account. Check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your account</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Pressable style={[styles.primaryButton, isSubmitting && styles.disabled]} onPress={submit} disabled={isSubmitting}>
            <Text style={styles.primaryText}>{isSubmitting ? 'Creating...' : 'Create Account'}</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.linkAccent}>Back to login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 18 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '700', textAlign: 'center' },
  form: { gap: 10 },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: 14,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  disabled: { opacity: 0.55 },
  primaryText: { color: colors.textPrimary, fontWeight: '700' },
  errorText: { color: colors.danger, fontSize: 13 },
  linkAccent: { color: colors.accent, textAlign: 'center', fontWeight: '700' },
});
