import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { useI18n } from '../../hooks/useI18n.ts';
import { Driver, VehicleProfile, LoadingTeam } from '../../types/types.ts';
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

// --- Edit Vehicle Screen ---
export const EditVehicleScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useI18n();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const driver = account as Driver;
    
    const [vehicle, setVehicle] = useState<VehicleProfile>(driver.profile.vehicleProfile);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (field: keyof VehicleProfile, value: string) => {
        setVehicle({ ...vehicle, [field]: value });
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const updates = { profile: { ...driver.profile, vehicleProfile: vehicle } };
            await dispatch(updateAccountDetails({ accountId: driver.id, updates })).unwrap();
            setMessage(t('vehicle_details_updated'));
            setTimeout(() => onBack(), 1000);
        } catch (error) {
            setMessage(t('update_failed'));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SubPageWrapper title={t('vehicle_details')} onBack={onBack}>
            <Card>
                <InputGroup>
                    <InputLabel>{t('make')}</InputLabel>
                    <StyledInput value={vehicle.make} onChangeText={(val) => handleChange('make', val)} />
                </InputGroup>
                 <InputGroup>
                    <InputLabel>{t('model')}</InputLabel>
                    <StyledInput value={vehicle.model} onChangeText={(val) => handleChange('model', val)} />
                </InputGroup>
                <InputGroup>
                    <InputLabel>{t('registration_number')}</InputLabel>
                    <StyledInput value={vehicle.registrationNumber} onChangeText={(val) => handleChange('registrationNumber', val)} />
                </InputGroup>
                <InputGroup>
                    <InputLabel>{t('color')}</InputLabel>
                    <StyledInput value={vehicle.color} onChangeText={(val) => handleChange('color', val)} />
                </InputGroup>
            </Card>
            <SubmitButton onPress={handleSave} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white"/> : <SubmitButtonText>{t('save_changes')}</SubmitButtonText>}
            </SubmitButton>
            {message && <MessageText error={message.includes('failed')}>{message}</MessageText>}
        </SubPageWrapper>
    );
};

// --- Edit Work Settings Screen ---
export const EditWorkSettingsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useI18n();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const driver = account as Driver;

    const [workingHours, setWorkingHours] = useState(driver.profile.workingHours);
    const [loadingTeam, setLoadingTeam] = useState<LoadingTeam>(driver.profile.loadingTeam);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const teamSize = loadingTeam.hasTeam ? loadingTeam.teamSize : 0;
            const updates = {
                profile: { ...driver.profile, workingHours, loadingTeam: {...loadingTeam, teamSize} }
            };
            await dispatch(updateAccountDetails({ accountId: driver.id, updates })).unwrap();
            setMessage(t('work_settings_updated'));
            setTimeout(() => onBack(), 1000);
        } catch (error) {
            setMessage(t('update_failed'));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <SubPageWrapper title={t('work_settings')} onBack={onBack}>
            <Card>
                 <InputGroup>
                    <InputLabel>{t('working_hours')}</InputLabel>
                    <StyledInput value={workingHours} onChangeText={setWorkingHours} />
                </InputGroup>
                <SwitchGroup>
                    <InputLabel>{t('has_loading_team')}</InputLabel>
                    <Switch
                        value={loadingTeam.hasTeam}
                        onValueChange={(val) => setLoadingTeam({...loadingTeam, hasTeam: val})}
                    />
                </SwitchGroup>
                {loadingTeam.hasTeam && (
                    <InputGroup>
                        <InputLabel>{t('team_size')}</InputLabel>
                        <StyledInput 
                            value={String(loadingTeam.teamSize)} 
                            onChangeText={(val) => setLoadingTeam({...loadingTeam, teamSize: parseInt(val, 10) || 1})}
                            keyboardType="number-pad"
                        />
                    </InputGroup>
                )}
            </Card>
            <SubmitButton onPress={handleSave} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white"/> : <SubmitButtonText>{t('save_changes')}</SubmitButtonText>}
            </SubmitButton>
            {message && <MessageText error={message.includes('failed')}>{message}</MessageText>}
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
const SwitchGroup = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
}))`
    background-color: ${props => props.theme.colors.background};
    padding: 14px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
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
