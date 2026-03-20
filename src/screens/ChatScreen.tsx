import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CitationModal from '../components/CitationModal';
import { promptSuggestions, savedChats } from '../data/mockData';
import { colors } from '../theme/colors';
import { Message } from '../types/models';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type ChatDetailRoute = RouteProp<RootStackParamList, 'ChatDetail'>;

export default function ChatScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const chatId = (route as ChatDetailRoute).params?.chatId;
  const canGoBack = navigation.canGoBack();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const existing = savedChats.find((chat) => chat.id === chatId);
    setMessages(existing?.messages ?? []);
  }, [chatId]);

  const title = useMemo(() => {
    if (!chatId) return 'New Chat';
    return savedChats.find((chat) => chat.id === chatId)?.title ?? 'New Chat';
  }, [chatId]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      type: 'user',
      content: inputValue.trim(),
    };

    const aiMessage: Message = {
      id: String(Date.now() + 1),
      type: 'ai',
      content:
        'Based on your question, key legal analysis includes the governing statute, jurisdiction-specific precedents, burden of proof, and practical compliance steps. I can also provide a structured memo if you want.',
      citations: [
        { title: 'Contract Law 2024', fullCitation: 'UCC § 2-302 (Unconscionability)' },
        { title: 'Business Law Act 2023', fullCitation: 'Restatement (Second) of Contracts § 208' },
      ],
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInputValue('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            {canGoBack ? (
              <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
                <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
              </Pressable>
            ) : null}
            <View style={styles.brandRow}>
            <Ionicons name="scale" size={22} color={colors.accent} />
            <Text style={styles.brand}>LawKH</Text>
            </View>
          </View>
          <Text style={styles.chatTitle}>{title}</Text>
        </View>

        {messages.length === 0 ? (
          <ScrollView contentContainerStyle={styles.emptyState}>
            <Text style={styles.emptyTitle}>How can I assist with your legal research?</Text>
            {promptSuggestions.map((prompt) => (
              <Pressable key={prompt} style={styles.promptCard} onPress={() => setInputValue(prompt)}>
                <Text style={styles.promptText}>{prompt}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.historyShortcut} onPress={() => navigation.navigate('MainTabs')}>
              <Text style={styles.historyShortcutText}>View history from the History tab</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messages}
            renderItem={({ item }) => (
              <View style={[styles.row, item.type === 'user' ? styles.rowUser : styles.rowAi]}>
                <View style={[styles.bubble, item.type === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
                  <Text style={styles.bubbleText}>{item.content}</Text>
                  {item.citations?.length ? (
                    <View style={styles.citationWrap}>
                      {item.citations.map((citation, index) => (
                        <Pressable
                          key={`${item.id}-${citation.title}`}
                          style={styles.citationPill}
                          onPress={() => setSelectedCitation(citation.fullCitation)}
                        >
                          <Text style={styles.citationPillText}>[{index + 1}] {citation.title}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            )}
          />
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Ask a legal question..."
            placeholderTextColor={colors.textMuted}
          />
          <Pressable onPress={handleSend} style={[styles.sendButton, !inputValue.trim() && styles.sendDisabled]}>
            <Ionicons name="send" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {selectedCitation ? <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} /> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  chatTitle: { color: colors.textMuted, fontSize: 13 },
  emptyState: { padding: 16, gap: 10 },
  emptyTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginVertical: 16 },
  promptCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
  },
  promptText: { color: colors.textPrimary, fontSize: 14 },
  historyShortcut: { marginTop: 6 },
  historyShortcutText: { color: colors.accent, fontWeight: '600' },
  messages: { padding: 14, gap: 12 },
  row: { flexDirection: 'row' },
  rowUser: { justifyContent: 'flex-end' },
  rowAi: { justifyContent: 'flex-start' },
  bubble: { borderRadius: 16, padding: 12, maxWidth: '86%' },
  bubbleUser: { backgroundColor: colors.accent },
  bubbleAi: { backgroundColor: colors.elevated },
  bubbleText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
  citationWrap: { marginTop: 10, gap: 6 },
  citationPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30,111,217,0.18)',
  },
  citationPillText: { color: colors.textPrimary, fontSize: 12 },
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    padding: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.45 },
});
