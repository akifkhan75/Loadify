import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../../hooks/useI18n.ts';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BookingTab = 'upcoming' | 'current' | 'past';

const DriverBookings: React.FC = () => {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');

    const tabLabels: Record<BookingTab, string> = {
        upcoming: t('upcoming'),
        current: t('current'),
        past: t('past'),
    };

    return (
        <Container edges={['top', 'bottom']}>
             <Header>
                <HeaderText>{t('my_bookings')}</HeaderText>
            </Header>
            <TabContainer>
                {(Object.keys(tabLabels) as BookingTab[]).map(tab => (
                     <TabButton 
                        key={tab}
                        onPress={() => setActiveTab(tab)} 
                        isActive={activeTab === tab}
                    >
                        <TabText isActive={activeTab === tab}>{tabLabels[tab]}</TabText>
                    </TabButton>
                ))}
            </TabContainer>

            <Content>
                 <EmptyText>{t('no_bookings', tabLabels[activeTab].toLowerCase())}</EmptyText>
                 <EmptySubText>{t('bookings_appear_here', tabLabels[activeTab].toLowerCase())}</EmptySubText>
            </Content>
        </Container>
    );
};

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
const TabContainer = styled(View)`
    flex-direction: row;
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.m}px;
    padding: 4px;
    margin: 0 16px 24px;
`;
const TabButton = styled(TouchableOpacity)<{isActive: boolean}>`
    flex: 1;
    padding: 12px;
    border-radius: ${props => props.theme.borderRadius.s}px;
    background-color: ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
`;
const TabText = styled(Text)<{isActive: boolean}>`
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: ${props => props.isActive ? props.theme.colors.card : props.theme.colors.textSecondary};
`;
const Content = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 16px;
`;
const EmptyText = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
`;
const EmptySubText = styled(Text)`
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    margin-top: 8px;
    text-align: center;
`;

export default DriverBookings;
