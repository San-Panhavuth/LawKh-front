import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { resetPassword } from '../services/authClient';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation }: Props) {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!password.trim() || password !== confirmPassword) return;
    setIsSubmitting(true);
    setError('');

    try {
      await resetPassword({ token: token.trim() || undefined, password });
      navigation.replace('Login');
    } catch {
      setError('Unable to reset password. Check your reset token and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          value={token}
          onChangeText={setToken}
          placeholder="Reset token or code"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="New password"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm password"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable style={[styles.primaryButton, isSubmitting && styles.disabled]} onPress={submit} disabled={isSubmitting}>
          <Text style={styles.primaryText}>{isSubmitting ? 'Resetting...' : 'Reset Password'}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.replace('Login')}>
          <Text style={styles.linkAccent}>Back to sign in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700', marginBottom: 6 },
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
  },
  disabled: { opacity: 0.55 },
  primaryText: { color: colors.textPrimary, fontWeight: '700' },
  errorText: { color: colors.danger, fontSize: 13 },
  linkAccent: { color: colors.accent, fontWeight: '700' },
});
