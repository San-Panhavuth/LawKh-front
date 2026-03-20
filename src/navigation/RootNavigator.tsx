import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { colors } from '../theme/colors';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import AccountScreen from '../screens/AccountScreen';
import ChatScreen from '../screens/ChatScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import HistoryScreen from '../screens/HistoryScreen';
import LawDocumentListScreen from '../screens/LawDocumentListScreen';
import LawDocumentViewerScreen from '../screens/LawDocumentViewerScreen';
import LawLibraryScreen from '../screens/LawLibraryScreen';
import LoginScreen from '../screens/LoginScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 80 : 68,
          paddingBottom: Platform.OS === 'ios' ? 16 : 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 13,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Chat: 'chatbubble-ellipses-outline',
            History: 'time-outline',
            LawLibrary: 'book-outline',
            Account: 'person-outline',
          };

          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="LawLibrary" component={LawLibraryScreen} options={{ title: 'Laws' }} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ChatDetail" component={ChatScreen} />
      <Stack.Screen name="LawDocumentList" component={LawDocumentListScreen} />
      <Stack.Screen name="LawDocumentViewer" component={LawDocumentViewerScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}
