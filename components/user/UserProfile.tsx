import React, { useState } from 'react';
import { ScrollView, Switch, View, Text, TouchableOpacity } from 'react-native';
import { User } from '../../types/types.ts';
import { useI18n } from '../../hooks/useI18n.ts';
import { useTheme } from '../../hooks/useTheme.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { logout } from '../../store/slices/authSlice.ts';
import LanguageSwitcher from '../common/LanguageSwitcher.tsx';
import Icon from '../common/Icon.tsx';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ... Edit/Legal screens would be separate components navigated to

const ProfileLink: React.FC<{
    iconName: string;
    label: string;
    color: string;
    onClick?: () => void;
    children?: React.ReactNode;
}> = ({ iconName, label, color, onClick, children }) => (
    <ProfileLinkButton onPress={onClick}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name={iconName} size={22} color={color} style={{marginRight: 16}} />
            <ProfileLinkText>{label}</ProfileLinkText>
        </View>
        <View>
            {children ? children : <Icon name="chevron-right" size={22} color={color} />}
        </View>
    </ProfileLinkButton>
);

const UserProfile: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { t } = useI18n();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const user = account as User;
    const { theme, themeMode, setThemeMode } = useTheme();

    if (!user) return null;

    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };
    
    return (
        <Container edges={['top', 'bottom']}>
             <Header>
                <BackButton onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={theme.colors.text} />
                </BackButton>
                <HeaderText>{t('my_profile')}</HeaderText>
                <View style={{width: 24}}/>
            </Header>

            <ScrollView>
                 <ProfileCard>
                    <ProfileIconContainer>
                        <Icon name="user" size={40} color={theme.colors.textSecondary} />
                    </ProfileIconContainer>
                    <View>
                        <UserName>{user.name}</UserName>
                        <UserMobile>{user.mobile}</UserMobile>
                    </View>
                </ProfileCard>
                
                {/* Sections */}
                <Section>
                    <SectionTitle>{t('account_settings')}</SectionTitle>
                    <ProfileLink iconName="edit-3" label={t('edit_profile')} color={theme.colors.textSecondary} onClick={() => {}}/>
                    <ProfileLink iconName="key" label={t('change_password')} color={theme.colors.textSecondary} onClick={() => {}}/>
                    <ProfileLink iconName="map-pin" label={t('manage_address')} color={theme.colors.textSecondary} onClick={() => {}}/>
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
                            thumbColor={"#f4f3f4"}
                        />
                    </ProfileLink>
                </Section>
                
                <Section>
                    <LogoutButton onPress={() => dispatch(logout())}>
                        <LogoutButtonText>{t('logout')}</LogoutButtonText>
                    </LogoutButton>
                </Section>
            </ScrollView>
        </Container>
    );
};


const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;
const Header = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
`;
const HeaderText = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const BackButton = styled(TouchableOpacity)``;
const ProfileCard = styled(View)`
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.theme.colors.card};
    padding: 24px 16px;
    margin: 16px;
    border-radius: ${props => props.theme.borderRadius.l}px;
`;
const ProfileIconContainer = styled(View)`
    width: 64px;
    height: 64px;
    border-radius: 32px;
    background-color: ${props => props.theme.colors.background};
    justify-content: center;
    align-items: center;
    margin-right: 16px;
`;
const UserName = styled(Text)`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const UserMobile = styled(Text)`
    font-size: 16px;
    color: ${props => props.theme.colors.textSecondary};
`;
const Section = styled(View)`
    margin: 0 16px 16px;
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 8px;
`;
const SectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin: 8px 8px 12px;
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
const LogoutButton = styled(TouchableOpacity)`
    background-color: ${props => props.theme.colors.notification}30; /* 30 is hex for opacity */
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
`;
const LogoutButtonText = styled(Text)`
    color: ${props => props.theme.colors.notification};
    font-size: 16px;
    font-weight: bold;
`;

export default UserProfile;
