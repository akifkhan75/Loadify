import React, { useState, useEffect, useRef } from 'react';
import { Modal, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatMessage } from '../types/types.ts';
import { getChatHistory, sendMessage } from '../services/api.ts';
import { useI18n } from '../hooks/useI18n.ts';
import Icon from './common/Icon.tsx';
import styled from 'styled-components/native';
import { useTheme } from '../hooks/useTheme.ts';

interface ChatModalProps {
    isVisible: boolean;
    onClose: () => void;
    chatId: string;
    currentUserId: string;
    otherUserName: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isVisible, onClose, chatId, currentUserId, otherUserName }) => {
    const { t } = useI18n();
    const { theme } = useTheme();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const fetchMessages = async () => {
        try {
            const history = await getChatHistory(chatId);
            setMessages(history);
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (isVisible) {
            setIsLoading(true);
            fetchMessages();
        }
    }, [isVisible, chatId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const sentMessage = await sendMessage(chatId, currentUserId, newMessage.trim());
            setMessages(prev => [sentMessage, ...prev]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Could not send message.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <Container>
                    <Header>
                        <HeaderTitle>{t('chat_with', otherUserName)}</HeaderTitle>
                        <CloseButton onPress={onClose}>
                            <Icon name="x" size={24} color={theme.colors.text} />
                        </CloseButton>
                    </Header>

                    <MessageList
                        ref={flatListRef}
                        data={messages}
                        inverted
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            const isSentByMe = item.senderId === currentUserId;
                            return (
                                <MessageRow isSentByMe={isSentByMe}>
                                    <MessageBubble isSentByMe={isSentByMe}>
                                        <MessageText isSentByMe={isSentByMe}>{item.text}</MessageText>
                                    </MessageBubble>
                                </MessageRow>
                            );
                        }}
                        ListEmptyComponent={() => (
                             <EmptyContainer>
                                {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : <EmptyText>{t('no_messages_yet')}</EmptyText>}
                            </EmptyContainer>
                        )}
                    />

                    <Footer>
                        <StyledInput
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder={t('type_message')}
                            editable={!isSending}
                            multiline
                        />
                        <SendButton onPress={handleSendMessage} disabled={isSending}>
                            {isSending ? <ActivityIndicator size="small" color={theme.colors.card} /> : <Icon name="send" size={20} color={theme.colors.card} />}
                        </SendButton>
                    </Footer>
                </Container>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// Styled Components
const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;
const Header = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.colors.border};
`;
const HeaderTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const CloseButton = styled(TouchableOpacity)``;
const MessageList = styled(FlatList<ChatMessage>)`
    flex: 1;
    padding: 0 16px;
`;
const MessageRow = styled(View)<{ isSentByMe: boolean }>`
    flex-direction: row;
    justify-content: ${props => props.isSentByMe ? 'flex-end' : 'flex-start'};
    margin-vertical: 8px;
`;
const MessageBubble = styled(View)<{ isSentByMe: boolean }>`
    background-color: ${props => props.isSentByMe ? props.theme.colors.primary : props.theme.colors.card};
    padding: 12px;
    border-radius: ${props => props.theme.borderRadius.l}px;
    max-width: 75%;
    ${props => props.isSentByMe ? 'border-bottom-right-radius: 4px;' : 'border-bottom-left-radius: 4px;'}
`;
const MessageText = styled(Text)<{ isSentByMe: boolean }>`
    color: ${props => props.isSentByMe ? props.theme.colors.card : props.theme.colors.text};
    font-size: 16px;
`;
const Footer = styled(View)`
    flex-direction: row;
    align-items: center;
    padding: 8px;
    border-top-width: 1px;
    border-top-color: ${props => props.theme.colors.border};
`;
const StyledInput = styled(TextInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.textSecondary
}))`
    flex: 1;
    background-color: ${props => props.theme.colors.card};
    padding: 12px;
    border-radius: ${props => props.theme.borderRadius.full}px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    margin-right: 8px;
`;
const SendButton = styled(TouchableOpacity)`
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background-color: ${props => props.theme.colors.primary};
    justify-content: center;
    align-items: center;
`;
const EmptyContainer = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
    transform: scaleY(-1); /* To work with inverted FlatList */
`;
const EmptyText = styled(Text)`
    color: ${props => props.theme.colors.textSecondary};
    font-size: 16px;
`;

export default ChatModal;
