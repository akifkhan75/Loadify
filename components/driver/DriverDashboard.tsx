import React, { useState, useEffect } from 'react';
import { View, Switch, ActivityIndicator, FlatList, Text, TouchableOpacity } from 'react-native';
import { Driver, RideRequest } from '../../types/types.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { fetchDashboard, respondToRequest, toggleOnlineStatus } from '../../store/slices/driverSlice.ts';
import ChatModal from '../ChatModal.tsx';
import { useI18n } from '../../hooks/useI18n.ts';
import styled from 'styled-components/native';
import { useTheme } from '../../hooks/useTheme.ts';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../common/Icon.tsx';

type ChatTarget = { id: string; name: string, chatId: string };

const RideRequestCard = ({ request, onChat }: { request: RideRequest; onChat: (chatTarget: ChatTarget) => void; }) => {
    // This would be a styled component similar to the web version, but with RN components
    const { t } = useI18n();
    return (
        <CardContainer>
             <CardHeader>
                <FareText>₹{request.fare}</FareText>
                <VehicleText>{request.vehicle}</VehicleText>
             </CardHeader>
             <LocationInfo>
                <LocationRow>
                    <LocationLabel>{t('from')}:</LocationLabel>
                    <LocationText>{request.from}</LocationText>
                </LocationRow>
                <LocationRow>
                    <LocationLabel>{t('to')}:</LocationLabel>
                    <LocationText>{request.to}</LocationText>
                </LocationRow>
             </LocationInfo>
             <CardActions>
                <ActionButton color="reject" onPress={() => {}}>
                    <ActionButtonText color="reject">{t('reject')}</ActionButtonText>
                </ActionButton>
                 <ActionButton color="accept" onPress={() => {}}>
                    <ActionButtonText color="accept">{t('accept')}</ActionButtonText>
                </ActionButton>
             </CardActions>
        </CardContainer>
    )
};

const DriverDashboard: React.FC = () => {
    const { t } = useI18n();
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const driver = account as Driver;
    const { isOnline, requests, status } = useAppSelector(state => state.driver);
    const isLoading = status === 'loading';

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);

    useEffect(() => {
        if (driver?.id) {
            dispatch(fetchDashboard(driver.id));
        }
    }, [driver?.id, dispatch]);
    
    if (!driver) return null;

    return (
        <Container edges={['top', 'bottom']}>
            <Header>
                <View>
                    <WelcomeText>{t('welcome_back', driver.name.split(' ')[0])}</WelcomeText>
                    <StatusText isOnline={isOnline}>{isOnline ? t('you_are_online') : t('you_are_offline')}</StatusText>
                </View>
                <Switch
                    value={isOnline}
                    onValueChange={() => { dispatch(toggleOnlineStatus()); }}
                    trackColor={{ false: "#767577", true: theme.colors.primary }}
                    thumbColor={"#f4f3f4"}
                />
            </Header>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <RideRequestCard request={item} onChat={()=>{}} />}
                ListHeaderComponent={<ListHeaderText>{t('incoming_requests')}</ListHeaderText>}
                ListEmptyComponent={
                    <EmptyContainer>
                        {isLoading ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        ) : (
                            <EmptyText>{isOnline ? t('no_new_requests') : t('go_online_to_receive_requests')}</EmptyText>
                        )}
                    </EmptyContainer>
                }
                contentContainerStyle={{paddingHorizontal: 16}}
            />
            {isChatOpen && chatTarget && (
                <ChatModal 
                    isVisible={isChatOpen} 
                    onClose={() => setIsChatOpen(false)}
                    chatId={chatTarget.chatId}
                    currentUserId={driver.id}
                    otherUserName={chatTarget.name}
                />
            )}
        </Container>
    );
};

// Styled components
const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;
const Header = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    margin-bottom: 16px;
`;
const WelcomeText = styled(Text)`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const StatusText = styled(Text)<{isOnline: boolean}>`
    font-size: 14px;
    color: ${props => props.isOnline ? props.theme.colors.success : props.theme.colors.textSecondary};
`;
const ListHeaderText = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
`;
const EmptyContainer = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 64px;
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
`;
const EmptyText = styled(Text)`
    font-size: 16px;
    color: ${props => props.theme.colors.textSecondary};
    text-align: center;
`;
const CardContainer = styled(View)`
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 16px;
    margin-bottom: 16px;
    elevation: 3;
`;
const CardHeader = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;
const FareText = styled(Text)`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const VehicleText = styled(Text)`
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
`;
const LocationInfo = styled(View)`
    border-top-width: 1px;
    border-top-color: ${props => props.theme.colors.border};
    padding-top: 12px;
`;
const LocationRow = styled(View)`
    flex-direction: row;
`;
const LocationLabel = styled(Text)`
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
    width: 50px;
`;
const LocationText = styled(Text)`
    flex: 1;
    color: ${props => props.theme.colors.text};
`;
const CardActions = styled(View)`
    flex-direction: row;
    margin-top: 16px;
    justify-content: space-between;
`;
const ActionButton = styled(TouchableOpacity)<{color: 'accept' | 'reject'}>`
    flex: 1;
    padding: 12px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    background-color: ${props => props.color === 'accept' ? props.theme.colors.primary : props.theme.colors.background};
    margin: 0 4px;
    align-items: center;
`;
const ActionButtonText = styled(Text)<{color: 'accept' | 'reject'}>`
    font-weight: bold;
    color: ${props => props.color === 'accept' ? props.theme.colors.card : props.theme.colors.text};
`;


export default DriverDashboard;
