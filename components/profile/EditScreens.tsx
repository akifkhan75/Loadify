import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useI18n } from '../../hooks/useI18n.ts';
import { User, Driver } from '../../types/types.ts';
import { useAppSelector, useAppDispatch } from '../../store/hooks.ts';
import { updateAccountDetails } from '../../store/slices/authSlice.ts';
import Icon from '../common/Icon.tsx';
import styled from 'styled-components/native';
import { useTheme } from '../../hooks/useTheme.ts';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubPageWrapper: React.FC<{ title: string; onBack: () => void; children: React.ReactNode; }> = ({ title, onBack, children }) => {
    const { theme } = useTheme();
    return (
        <Container>
            <Header>
                <BackButton onPress={onBack}>
                    <Icon name="arrow-left" size={24} color={theme.colors.text} />
                </BackButton>
                <HeaderText>{title}</HeaderText>
                <View style={{width: 24}}/>
            </Header>
            <ScrollView contentContainerStyle={{padding: 16}}>
                {children}
            </ScrollView>
        </Container>
    );
};

// --- Edit Profile Screen ---
interface EditProfileProps { onBack: () => void; }
export const EditProfileScreen: React.FC<EditProfileProps> = ({ onBack }) => {
    const { t } = useI18n();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const [name, setName] = useState(account?.name || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        if (!account) return;
        setIsLoading(true);
        setMessage('');
        try {
            await dispatch(updateAccountDetails({ accountId: account.id, updates: { name } })).unwrap();
            setMessage(t('update_successful'));
            setTimeout(() => onBack(), 1000);
        } catch (error) {
            setMessage(t('update_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SubPageWrapper title={t('edit_profile')} onBack={onBack}>
            <Card>
                <InputGroup>
                    <InputLabel>{t('full_name')}</InputLabel>
                    <StyledInput value={name} onChangeText={setName} />
                </InputGroup>
                <InputGroup>
                    <InputLabel>{t('mobile_number_read_only')}</InputLabel>
                    <StyledInput value={account?.mobile} editable={false} />
                </InputGroup>
            </Card>
            <SubmitButton onPress={handleSave} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white"/> : <SubmitButtonText>{t('save_changes')}</SubmitButtonText>}
            </SubmitButton>
            {message && <MessageText error={message.includes('failed')}>{message}</MessageText>}
        </SubPageWrapper>
    );
};

// --- Change Password Screen ---
interface ChangePasswordProps { onBack: () => void; }
export const ChangePasswordScreen: React.FC<ChangePasswordProps> = ({ onBack }) => {
    const { t } = useI18n();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdate = async () => {
        if (!account) return;
        setError('');
        setSuccess('');
        if (newPassword !== confirmPassword) {
            setError(t('passwords_do_not_match')); return;
        }
        if (newPassword.length < 6) {
             setError(t('error_password_length')); return;
        }
        setIsLoading(true);
        try {
            await dispatch(updateAccountDetails({ accountId: account.id, updates: { password: newPassword, currentPassword } })).unwrap();
            setSuccess(t('password_updated'));
            setTimeout(() => onBack(), 1500);
        } catch (e: any) {
            setError(e || t('update_failed'));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SubPageWrapper title={t('change_password')} onBack={onBack}>
            <Card>
                <InputGroup>
                    <InputLabel>{t('current_password')}</InputLabel>
                    <StyledInput value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
                </InputGroup>
                <InputGroup>
                    <InputLabel>{t('new_password')}</InputLabel>
                    <StyledInput value={newPassword} onChangeText={setNewPassword} secureTextEntry />
                </InputGroup>
                <InputGroup>
                    <InputLabel>{t('confirm_new_password')}</InputLabel>
                    <StyledInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                </InputGroup>
            </Card>
            <SubmitButton onPress={handleUpdate} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white"/> : <SubmitButtonText>{t('update_password')}</SubmitButtonText>}
            </SubmitButton>
            {error && <MessageText error>{error}</MessageText>}
            {success && <MessageText>{success}</MessageText>}
        </SubPageWrapper>
    );
};

// --- Manage Addresses Screen ---
interface ManageAddressesProps { onBack: () => void; }
export const ManageAddressesScreen: React.FC<ManageAddressesProps> = ({ onBack }) => {
    const { t } = useI18n();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const [addresses, setAddresses] = useState(account?.type === 'user' ? (account as User).addresses : (account as Driver)?.profile.addresses || { home: '', work: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        if (!account) return;
        setIsLoading(true);
        setMessage('');
        try {
            const updates = account.type === 'user' ? { addresses } : { profile: { ...(account as Driver).profile, addresses } };
            await dispatch(updateAccountDetails({ accountId: account.id, updates })).unwrap();
            setMessage(t('address_updated'));
            setTimeout(() => onBack(), 1000);
        } catch (error) {
            setMessage(t('update_failed'));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SubPageWrapper title={t('manage_address')} onBack={onBack}>
            <Card>
                <InputGroup>
                    <InputLabel>{t('home_address')}</InputLabel>
                    <StyledInput value={addresses.home || ''} onChangeText={(val) => setAddresses({...addresses, home: val})} />
                </InputGroup>
                <InputGroup>
                    <InputLabel>{t('work_address')}</InputLabel>
                    <StyledInput value={addresses.work || ''} onChangeText={(val) => setAddresses({...addresses, work: val})} />
                </InputGroup>
            </Card>
            <SubmitButton onPress={handleSave} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white"/> : <SubmitButtonText>{t('save_changes')}</SubmitButtonText>}
            </SubmitButton>
            {message && <MessageText error={message.includes('failed')}>{message}</MessageText>}
        </SubPageWrapper>
    );
};


// --- Legal Screen ---
interface LegalScreenProps { titleKey: string; contentKey: string; onBack: () => void; }
export const LegalScreen: React.FC<LegalScreenProps> = ({ titleKey, contentKey, onBack }) => {
    const { t } = useI18n();
    return (
        <SubPageWrapper title={t(titleKey)} onBack={onBack}>
            <Card>
                <LegalText>{t(contentKey)}</LegalText>
            </Card>
        </SubPageWrapper>
    );
};

// --- Styled Components ---
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
const BackButton = styled(TouchableOpacity)``;
const HeaderText = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const Card = styled(View)`
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 16px;
`;
const InputGroup = styled(View)`
    margin-bottom: 16px;
`;
const InputLabel = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 8px;
`;
const StyledInput = styled(TextInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.textSecondary,
    editable: props.editable ?? true,
}))`
    background-color: ${props => props.theme.colors.background};
    padding: 14px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    font-size: 16px;
    color: ${props => props.editable ? props.theme.colors.text : props.theme.colors.textSecondary};
`;
const SubmitButton = styled(TouchableOpacity)`
    background-color: ${props => props.disabled ? props.theme.colors.border : props.theme.colors.primary};
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    margin-top: 24px;
`;
const SubmitButtonText = styled(Text)`
    color: ${props => props.theme.colors.card};
    font-size: 16px;
    font-weight: bold;
`;
const MessageText = styled(Text)<{error?: boolean}>`
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.error ? props.theme.colors.notification : props.theme.colors.success};
`;
const LegalText = styled(Text)`
    font-size: 16px;
    line-height: 24px;
    color: ${props => props.theme.colors.textSecondary};
`;
