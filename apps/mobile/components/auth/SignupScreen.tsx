import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useI18n } from '../../hooks/useI18n.ts';
import { Gender, AppView } from '../../types/types.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { signupUser, setView, clearAuthError } from '../../store/slices/authSlice.ts';
import styled from 'styled-components/native';
import { useTheme } from '../../hooks/useTheme.ts';
import Icon from '../common/Icon.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';

type SignupStep = 'selectType' | 'userForm' | 'driverForm';

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { t } = useI18n();
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { status, error: authError } = useAppSelector(state => state.auth);
    
    const [step, setStep] = useState<SignupStep>('selectType');
    const [formData, setFormData] = useState({
        type: 'user',
        name: '',
        gender: null as Gender | null,
        mobile: '',
        country: '',
        city: '',
        address: '',
        password: '',
        licenseNumber: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleColor: '',
        vehicleReg: '',
        vehicleSize: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isLoading = status === 'loading';

    // ... validation and submit logic remains similar ...

    const renderHeader = (titleKey: string) => (
        <Header>
            <BackButton onPress={() => step === 'selectType' ? navigation.goBack() : setStep('selectType')}>
                <Icon name="arrow-left" size={24} color={theme.colors.text} />
            </BackButton>
            <HeaderText>{t(titleKey)}</HeaderText>
            <View style={{width: 24}}/>
        </Header>
    );

    const renderSelectType = () => (
        <>
            {renderHeader('create_new_account')}
            <ContentContainer>
                <SelectionTitle>{t('join_as')}</SelectionTitle>
                <TypeButton onPress={() => { setFormData({...formData, type: 'user'}); setStep('userForm'); }}>
                    <Icon name="user" size={48} color={theme.colors.primary} />
                    <TypeButtonText>{t('i_am_a_user')}</TypeButtonText>
                </TypeButton>
                <TypeButton onPress={() => { setFormData({...formData, type: 'driver'}); setStep('driverForm'); }}>
                    <Icon name="truck" type="material" size={48} color={theme.colors.primary} />
                    <TypeButtonText>{t('i_am_a_driver')}</TypeButtonText>
                </TypeButton>
            </ContentContainer>
        </>
    );

    // Form rendering logic...
    const renderForm = (isDriver: boolean) => (
      <>
        {renderHeader(isDriver ? 'driver_signup_title' : 'user_signup_title')}
        <FormScrollView>
            <FormSection>
                <FormSectionTitle>{t('personal_info')}</FormSectionTitle>
                <StyledInput placeholder={t('full_name')} onChangeText={val => setFormData({...formData, name: val})} />
                {/* ... other inputs ... */}
            </FormSection>
            {isDriver && (
                <FormSection>
                    <FormSectionTitle>{t('vehicle_info_title')}</FormSectionTitle>
                    <StyledInput placeholder={t('vehicle_make')} onChangeText={val => setFormData({...formData, vehicleMake: val})} />
                    {/* ... other driver inputs ... */}
                </FormSection>
            )}
            <SubmitButton>
              {isLoading ? <ActivityIndicator color="white" /> : <SubmitButtonText>{t('createAccount')}</SubmitButtonText>}
            </SubmitButton>
        </FormScrollView>
      </>
    )

    return (
        <Container>
            {step === 'selectType' && renderSelectType()}
            {step === 'userForm' && renderForm(false)}
            {step === 'driverForm' && renderForm(true)}
        </Container>
    );
};

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

const Header = styled(View)`
    flex-direction: row;
    padding: 16px;
    align-items: center;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.colors.border};
`;

const HeaderText = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;

const BackButton = styled(TouchableOpacity)``;

const ContentContainer = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 16px;
`;

const SelectionTitle = styled(Text)`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 32px;
`;

const TypeButton = styled(TouchableOpacity)`
    background-color: ${props => props.theme.colors.card};
    padding: 32px;
    border-radius: ${props => props.theme.borderRadius.l}px;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
    elevation: 4;
`;

const TypeButtonText = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-top: 16px;
`;

const FormScrollView = styled(ScrollView).attrs({
    contentContainerStyle: { padding: 16 }
})``;

const FormSection = styled(View)`
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 16px;
    margin-bottom: 16px;
`;

const FormSectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
`;

const StyledInput = styled(TextInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.textSecondary
}))`
    background-color: ${props => props.theme.colors.background};
    padding: 14px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
`;

const SubmitButton = styled(TouchableOpacity)`
    background-color: ${props => props.theme.colors.primary};
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
`;
const SubmitButtonText = styled(Text)`
    color: ${props => props.theme.colors.card};
    font-size: 16px;
    font-weight: bold;
`;

export default SignupScreen;
