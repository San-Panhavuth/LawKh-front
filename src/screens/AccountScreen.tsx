import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import EditProfileModal from '../components/EditProfileModal';
import { getAuthMe, getMe } from '../services/authClient';
import { clearAccessToken, getAccessToken } from '../services/tokenStore';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const navigation = useNavigation<Nav>();
  const [userName, setUserName] = useState('Admin User');
  const [email, setEmail] = useState('user@lawkh.com');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const token = await getAccessToken();
      if (!token) return;

      try {
        const user = await getMe().catch(() => getAuthMe());
        if (!mounted) return;
        setUserName(user.name);
        setEmail(user.email);
      } catch {
        // Keep local defaults if profile loading fails.
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    await clearAccessToken();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.split(' ').map((part) => part[0]).join('')}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <Pressable onPress={() => setEditing(true)}>
            <Ionicons name="create-outline" size={20} color={colors.accent} />
          </Pressable>
        </View>

        <Pressable style={styles.row} onPress={() => navigation.navigate('PrivacySecurity')}>
          <Text style={styles.rowText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
        <Pressable style={styles.row} onPress={() => navigation.navigate('TermsConditions')}>
          <Text style={styles.rowText}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
        <Pressable style={styles.row} onPress={() => navigation.navigate('HelpSupport')}>
          <Text style={styles.rowText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>

      <EditProfileModal visible={editing} userName={userName} onClose={() => setEditing(false)} onSave={setUserName} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16, gap: 10 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontWeight: '700' },
  profileInfo: { flex: 1 },
  name: { color: colors.textPrimary, fontWeight: '700' },
  email: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  row: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: { color: colors.textPrimary, fontWeight: '600' },
  logout: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 13,
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontWeight: '700' },
});
