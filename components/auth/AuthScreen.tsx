import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { useI18n } from '../../hooks/useI18n.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { loginUser, clearAuthError } from '../../store/slices/authSlice.ts';
import Icon from '../common/Icon.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { t } = useI18n();
    const dispatch = useAppDispatch();
    const { status, error: authError } = useAppSelector((state) => state.auth);

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const isLoading = status === 'loading';

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);
    
    useEffect(() => {
        if (authError) {
            setLocalError(t('invalidCredentials'));
        }
    }, [authError, t]);

    const handleSubmit = () => {
        setLocalError('');
        if (!/^\d{10}$/.test(mobile)) {
            setLocalError(t('error_invalid_mobile'));
            return;
        }
        if (password.length < 6) {
            setLocalError(t('error_password_length'));
            return;
        }
        dispatch(loginUser({ mobile, password }));
    };

    return (
        <Container edges={['bottom']}>
            <Content>
                <Title>{t('loadify')}</Title>
                <Subtitle>{t('logisticsPartner')}</Subtitle>

                <Card>
                    <CardTitle>{t('login_to_account')}</CardTitle>
                    
                    <SocialButton onPress={() => {}}>
                        <Icon name="google" type="ant" size={20} color="#DB4437"/>
                        <SocialButtonText>{t('continue_with_google')}</SocialButtonText>
                    </SocialButton>
                     <SocialButton onPress={() => {}}>
                        <Icon name="facebook" size={20} color="#1877F2"/>
                        <SocialButtonText>{t('continue_with_facebook')}</SocialButtonText>
                    </SocialButton>

                    <DividerContainer>
                        <DividerLine />
                        <DividerText>{t('or_login_with')}</DividerText>
                        <DividerLine />
                    </DividerContainer>

                    <InputLabel>{t('mobileNumber')}</InputLabel>
                    <StyledInput
                        value={mobile}
                        onChangeText={setMobile}
                        placeholder={t('mobilePlaceholder')}
                        keyboardType="phone-pad"
                        editable={!isLoading}
                    />
                    <InputLabel>{t('password')}</InputLabel>
                    <StyledInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder={t('passwordPlaceholder')}
                        secureTextEntry
                        editable={!isLoading}
                    />

                    {localError ? <ErrorText>{localError}</ErrorText> : null}

                    <LoginButton onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="white"/> : <LoginButtonText>{t('login')}</LoginButtonText>}
                    </LoginButton>
                </Card>

                <SignupText>
                    {t('noAccount')}{' '}
                    <SignupLink onPress={() => navigation.navigate('Signup')}>
                        <SignupLinkText>{t('signup_now')}</SignupLinkText>
                    </SignupLink>
                </SignupText>
            </Content>
        </Container>
    );
};

// Styled Components
const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
    justify-content: center;
`;

const Content = styled(ScrollView).attrs({
    contentContainerStyle: {
        padding: 16,
        justifyContent: 'center',
        flexGrow: 1,
    }
})``;

const Title = styled(Text)`
    font-size: 32px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    text-align: center;
`;

const Subtitle = styled(Text)`
    font-size: 16px;
    color: ${props => props.theme.colors.textSecondary};
    text-align: center;
    margin-bottom: 24px;
`;

const Card = styled(View)`
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 24px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    elevation: 5;
`;

const CardTitle = styled(Text)`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin-bottom: 24px;
`;

const SocialButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.background};
    padding: 14px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    margin-bottom: 8px;
`;

const SocialButtonText = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-left: 12px;
`;

const DividerContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    margin: 24px 0;
`;

const DividerLine = styled(View)`
    flex: 1;
    height: 1px;
    background-color: ${props => props.theme.colors.border};
`;

const DividerText = styled(Text)`
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    margin: 0 16px;
`;

const InputLabel = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 8px;
`;

const StyledInput = styled(TextInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.textSecondary,
}))`
    background-color: ${props => props.theme.colors.background};
    padding: 14px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
`;

const ErrorText = styled(Text)`
    color: ${props => props.theme.colors.notification};
    text-align: center;
    margin-bottom: 12px;
`;

const LoginButton = styled(TouchableOpacity)`
    background-color: ${props => props.theme.colors.primary};
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
    justify-content: center;
    min-height: 52px;
`;

const LoginButtonText = styled(Text)`
    color: ${props => props.theme.colors.card};
    font-size: 16px;
    font-weight: bold;
`;

const SignupText = styled(Text)`
    margin-top: 24px;
    text-align: center;
    color: ${props => props.theme.colors.textSecondary};
`;

const SignupLink = styled(TouchableOpacity)``;

const SignupLinkText = styled(Text)`
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
`;

export default AuthScreen;
