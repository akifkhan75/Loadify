import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useI18n } from '../../hooks/useI18n.ts';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DriverEarnings: React.FC = () => {
    const { t } = useI18n();

    return (
        <Container edges={['top', 'bottom']}>
             <Header>
                <HeaderText>{t('earnings')}</HeaderText>
            </Header>
            <Content>
                <Card>
                    <CardLabel>{t('this_week_earnings')}</CardLabel>
                    <Amount>₹7,850</Amount>
                </Card>

                <Card>
                    <SectionTitle>{t('recent_transactions')}</SectionTitle>
                    <EmptyContainer>
                        <EmptyText>{t('tx_history_unavailable')}</EmptyText>
                        <EmptySubText>{t('completed_rides_logged_here')}</EmptySubText>
                    </EmptyContainer>
                </Card>
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
const Content = styled(ScrollView)`
    padding: 0 16px;
`;
const Card = styled(View)`
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 24px;
    margin-bottom: 16px;
`;
const CardLabel = styled(Text)`
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};
    text-align: center;
`;
const Amount = styled(Text)`
    font-size: 40px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin-top: 8px;
`;
const SectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const EmptyContainer = styled(View)`
    padding: 48px 0;
    align-items: center;
`;
const EmptyText = styled(Text)`
    font-size: 16px;
    color: ${props => props.theme.colors.textSecondary};
`;
const EmptySubText = styled(Text)`
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.7;
    margin-top: 4px;
`;

export default DriverEarnings;
