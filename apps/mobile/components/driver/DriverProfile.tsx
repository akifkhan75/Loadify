import React, { useState } from 'react';
import { View, ScrollView as RNScrollView, Text, TouchableOpacity, Image, Switch } from 'react-native';
import { Driver, DriverTier } from '../../types/types.ts';
import { useI18n } from '../../hooks/useI18n.ts';
import { useTheme } from '../../hooks/useTheme.ts';
import { useAppSelector, useAppDispatch } from '../../store/hooks.ts';
import { logout } from '../../store/slices/authSlice.ts';
import { VEHICLES } from '../../constants.tsx';
import { EditProfileScreen, ChangePasswordScreen, ManageAddressesScreen, LegalScreen } from '../profile/EditScreens.tsx';
import { EditVehicleScreen, EditWorkSettingsScreen } from './EditDriverScreens.tsx';
import LanguageSwitcher from '../common/LanguageSwitcher.tsx';
import Icon from '../common/Icon.tsx';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProfileView = 'main' | 'editProfile' | 'changePassword' | 'manageAddress' | 'editVehicle' | 'editWork' | 'legal';
type LegalPage = { titleKey: string; contentKey: string };

const ProfileLink: React.FC<{
    iconName: string;
    iconType?: 'feather' | 'material' | 'ionicons' | 'ant';
    label: string;
    color: string;
    onClick?: () => void;
    children?: React.ReactNode;
}> = ({ iconName, iconType, label, color, onClick, children }) => (
    <ProfileLinkButton onPress={onClick}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name={iconName} type={iconType} size={22} color={color} style={{marginRight: 16}} />
            <ProfileLinkText>{label}</ProfileLinkText>
        </View>
        <View>
            {children ? children : <Icon name="chevron-right" size={22} color={color} />}
        </View>
    </ProfileLinkButton>
);

const DriverProfile: React.FC = () => {
    const { t } = useI18n();
    const { theme, themeMode, setThemeMode } = useTheme();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const driver = account as Driver;

    const [view, setView] = useState<ProfileView>('main');
    const [legalPage, setLegalPage] = useState<LegalPage | null>(null);

    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };
    
    const handleShowLegal = (titleKey: string, contentKey: string) => {
        setLegalPage({ titleKey, contentKey });
        setView('legal');
    };

    const getTierColor = (tier: DriverTier) => {
        switch (tier) {
            case 'platinum': return { bg: '#0891B2', text: '#FFF' }; // cyan-600
            case 'gold': return { bg: '#F59E0B', text: '#FFF' }; // amber-500
            case 'silver': return { bg: '#94A3B8', text: '#1E293B' }; // slate-400, slate-800
            case 'bronze': return { bg: '#B45309', text: '#FFF' }; // amber-700
            default: return { bg: theme.colors.border, text: theme.colors.text };
        }
    };
    
    if (!driver) return null;

    const vehicleForSize = VEHICLES.find(v => v.id === driver.profile.vehicleProfile.sizeId);

    if (view === 'editProfile') return <EditProfileScreen onBack={() => setView('main')} />;
    if (view === 'changePassword') return <ChangePasswordScreen onBack={() => setView('main')} />;
    if (view === 'manageAddress') return <ManageAddressesScreen onBack={() => setView('main')} />;
    if (view === 'editVehicle') return <EditVehicleScreen onBack={() => setView('main')} />;
    if (view === 'editWork') return <EditWorkSettingsScreen onBack={() => setView('main')} />;
    if (view === 'legal' && legalPage) return <LegalScreen titleKey={legalPage.titleKey} contentKey={legalPage.contentKey} onBack={() => setView('main')} />;

    const tierColors = getTierColor(driver.tier);

    return (
        <Container edges={['top', 'bottom']}>
             <Header>
                <HeaderText>{t('profile')}</HeaderText>
            </Header>
            <ScrollContainer>
                <ProfileCard>
                    <Avatar source={{uri: driver.photoUrl}} />
                    <View style={{flex: 1}}>
                        <UserName>{driver.name}</UserName>
                        <TierBadge style={{ backgroundColor: tierColors.bg }}>
                            <Icon name="shield-check" size={14} color={tierColors.text} style={{marginRight: 4}} />
                            <TierText style={{ color: tierColors.text }}>{t(driver.tier)}</TierText>
                        </TierBadge>
                    </View>
                </ProfileCard>

                <Section>
                    <SectionTitle>{t('account_settings')}</SectionTitle>
                    <ProfileLink iconName="edit-3" label={t('edit_profile')} color={theme.colors.textSecondary} onClick={() => setView('editProfile')}/>
                    <ProfileLink iconName="key" label={t('change_password')} color={theme.colors.textSecondary} onClick={() => setView('changePassword')}/>
                    <ProfileLink iconName="map-pin" label={t('manage_address')} color={theme.colors.textSecondary} onClick={() => setView('manageAddress')}/>
                </Section>
                
                <Section>
                    <SectionHeader>
                        <SectionTitle>{t('vehicle_details')}</SectionTitle>
                        <EditButton onPress={() => setView('editVehicle')}><EditText>{t('edit')}</EditText></EditButton>
                    </SectionHeader>
                    {vehicleForSize && (
                        <VehicleCard>
                           <Icon name={vehicleForSize.icon.name} type={vehicleForSize.icon.type} size={32} color={theme.colors.textSecondary} />
                           <VehicleInfo>
                             <VehicleName>{t(vehicleForSize.nameKey)}</VehicleName>
                             <VehicleDetail>{driver.profile.vehicleProfile.make} {driver.profile.vehicleProfile.model}</VehicleDetail>
                           </VehicleInfo>
                        </VehicleCard>
                    )}
                </Section>

                <Section>
                    <SectionHeader>
                        <SectionTitle>{t('work_settings')}</SectionTitle>
                        <EditButton onPress={() => setView('editWork')}><EditText>{t('edit')}</EditText></EditButton>
                    </SectionHeader>
                     <InfoPill>
                        <Icon name="clock" size={20} color={theme.colors.textSecondary} style={{marginRight: 8}} />
                        <InfoPillText>{t('working_hours')}: {driver.profile.workingHours}</InfoPillText>
                    </InfoPill>
                    <InfoPill>
                        <Icon name="users" size={20} color={theme.colors.textSecondary} style={{marginRight: 8}} />
                        <InfoPillText>
                            {t('loading_team')}: {driver.profile.loadingTeam.hasTeam ? t('team_info', driver.profile.loadingTeam.teamSize) : t('no')}
                        </InfoPillText>
                    </InfoPill>
                </Section>

                <Section>
                    <SectionTitle>{t('app_settings')}</SectionTitle>
                    <ProfileLink iconName="globe" label={t('language')} color={theme.colors.textSecondary}>
                        <LanguageSwitcher />
                    </ProfileLink>
                     <ProfileLink iconName={themeMode === 'dark' ? 'moon' : 'sun'} label={t('theme')} color={theme.colors.textSecondary}>
                        <Switch
                            value={themeMode === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                            thumbColor={theme.colors.card}
                        />
                    </ProfileLink>
                </Section>
                
                 <Section>
                    <LogoutButton onPress={() => dispatch(logout())}>
                        <LogoutButtonText>{t('logout')}</LogoutButtonText>
                    </LogoutButton>
                </Section>
            </ScrollContainer>
        </Container>
    );
};


// Styled Components
const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;
const Header = styled(View)`
    padding: 16px;
    align-items: center;
`;
const HeaderText = styled(Text)`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const ScrollContainer = styled(RNScrollView)``;
const ProfileCard = styled(View)`
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.theme.colors.card};
    padding: 24px 16px;
    margin: 0 16px 16px;
    border-radius: ${props => props.theme.borderRadius.l}px;
`;
const Avatar = styled(Image)`
    width: 64px;
    height: 64px;
    border-radius: 32px;
    margin-right: 16px;
`;
const UserName = styled(Text)`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const TierBadge = styled(View)`
    flex-direction: row;
    align-items: center;
    padding: 4px 8px;
    border-radius: ${props => props.theme.borderRadius.full}px;
    margin-top: 8px;
    align-self: flex-start;
`;
const TierText = styled(Text)`
    font-size: 12px;
    font-weight: bold;
`;
const Section = styled(View)`
    margin: 0 16px 16px;
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 8px;
`;
const SectionHeader = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 8px 8px 12px;
`;
const SectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const EditButton = styled(TouchableOpacity)``;
const EditText = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.brand};
`;
const ProfileLinkButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px;
`;
const ProfileLinkText = styled(Text)`
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
`;
const VehicleCard = styled(View)`
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.m}px;
    padding: 16px;
    margin: 0 8px;
`;
const VehicleInfo = styled(View)`
    margin-left: 16px;
`;
const VehicleName = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const VehicleDetail = styled(Text)`
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
`;
const InfoPill = styled(View)`
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.m}px;
    padding: 12px;
    margin: 4px 8px;
`;
const InfoPillText = styled(Text)`
    font-size: 14px;
    color: ${props => props.theme.colors.text};
`;
const LogoutButton = styled(TouchableOpacity)`
    background-color: ${props => props.theme.colors.notification}30;
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
`;
const LogoutButtonText = styled(Text)`
    color: ${props => props.theme.colors.notification};
    font-size: 16px;
    font-weight: bold;
`;

export default DriverProfile;
