import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert, TextInput, Text, FlatList, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../hooks/useTheme.ts';
import { User, AvailableDriver, BookingStatus, Vehicle, Driver, ServiceLevel } from '../../types/types.ts';
import { VEHICLES } from '../../constants.tsx';
import { useI18n } from '../../hooks/useI18n.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import {
    setPickup, setDropoff, setAiPrompt, setSelectedVehicleId, setSchedule, selectOffer, resetBooking,
    fetchRideFromAI, searchForDrivers, confirmRideBooking, goToDriverList
} from '../../store/slices/bookingSlice.ts';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ChatModal from '../ChatModal.tsx';
import Icon from '../common/Icon.tsx';
import useVoiceRecognition from '../../hooks/useVoiceRecognition.ts';
import { SafeAreaView } from 'react-native-safe-area-context';
import RatingScreen from '../RatingScreen.tsx';

type BookingTab = 'ai' | 'manual';
type ChatTarget = { id: string; name: string, chatId: string };

const UserHome: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { t } = useI18n();
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.auth);
    const user = account as User;

    const {
        status, pickup, dropoff, aiPrompt, selectedVehicleId, schedule, serviceLevel, availableDrivers, selectedOffer, confirmedDriver, searchStatus, error: bookingError
    } = useAppSelector(state => state.booking);
    
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);
    const [isRatingVisible, setRatingVisible] = useState(false); // For rating modal

    const { isListening, recognizedText, startRecognition, stopRecognition, error: voiceError } = useVoiceRecognition();

    useEffect(() => {
        if(recognizedText) {
            dispatch(setAiPrompt(recognizedText));
        }
    }, [recognizedText]);

    useEffect(() => {
        if(voiceError) {
            Alert.alert("Voice Error", voiceError);
        }
    }, [voiceError]);

    const openChat = (driver: AvailableDriver) => {
        setChatTarget({ id: driver.id, name: driver.name, chatId: driver.chatId });
        setIsChatOpen(true);
    };
    
    // This is a mock function to simulate trip completion
    useEffect(() => {
      if (status === BookingStatus.TRIP_IN_PROGRESS) {
        setTimeout(() => {
          // In a real app, this would be triggered by a backend event
          setRatingVisible(true); 
        }, 5000); // Show rating screen after 5s
      }
    }, [status]);


    const renderPanelContent = () => {
        switch (status) {
            case BookingStatus.INPUT: return <InputPanel />;
            case BookingStatus.SEARCHING: return <SearchingPanel />;
            case BookingStatus.SHOWING_DRIVERS: return <DriversPanel onChat={openChat} />;
            case BookingStatus.CONFIRMING_BOOKING: return <ConfirmingBookingPanel />;
            case BookingStatus.DRIVER_CONFIRMED:
            case BookingStatus.EN_ROUTE_PICKUP:
            case BookingStatus.TRIP_IN_PROGRESS: return <ConfirmedPanel onChat={openChat} />;
            case BookingStatus.ERROR: return <ErrorPanel />;
            default: return <WelcomeText>Welcome to Loadify!</WelcomeText>;
        }
    }

    if (!user) {
        return <Container><ActivityIndicator size="large" color={theme.colors.primary} /></Container>;
    }

    return (
        <Container>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 28.6139,
                    longitude: 77.2090,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }}
            >
             {confirmedDriver && (
                <Marker
                    coordinate={{ latitude: 28.63, longitude: 77.22 }} // Mock driver location
                    title={confirmedDriver.name}
                >
                    <Icon name="truck" type="material" size={32} color={theme.colors.primary} />
                </Marker>
            )}
            </MapView>
            
            <Header>
                <AppName>{t('loadify')}</AppName>
                <ProfileButton onPress={() => navigation.navigate('UserProfile')}>
                    <Icon name="user" size={24} color={theme.colors.text} />
                </ProfileButton>
            </Header>

            <PanelContainer>
                {renderPanelContent()}
            </PanelContainer>
            
             {isChatOpen && chatTarget && (
                <ChatModal 
                    isVisible={isChatOpen} 
                    onClose={() => setIsChatOpen(false)}
                    chatId={chatTarget.chatId}
                    currentUserId={user.id}
                    otherUserName={chatTarget.name}
                />
            )}
            {isRatingVisible && confirmedDriver && (
              <RatingScreen
                driver={confirmedDriver as unknown as Driver}
                onRate={(rating, review) => {
                  console.log('Rated:', {rating, review});
                  setRatingVisible(false);
                  dispatch(resetBooking());
                }}
              />
            )}
        </Container>
    );
};

// Panel Components
const InputPanel: React.FC = () => {
    const {t} = useI18n();
    const dispatch = useAppAppDispatch();
    const { pickup, dropoff, aiPrompt, selectedVehicleId } = useAppSelector(state => state.booking);
    const { account } = useAppSelector(state => state.auth);
    const { isListening, startRecognition } = useVoiceRecognition();

    const handleSearch = () => {
        if(!pickup || !dropoff) {
            Alert.alert(t('error'), "Please enter both pickup and dropoff locations.");
            return;
        }
        if(!selectedVehicleId) {
             Alert.alert(t('error'), "Please select a vehicle type.");
            return;
        }
        if (!account) {
            Alert.alert(t('error'), "User not found.");
            return;
        }
        dispatch(searchForDrivers({ vehicleId: selectedVehicleId, schedule: {type: 'now'}, serviceLevel: ServiceLevel.MOVE_ONLY, userId: account.id }));
    };

    return (
        <View>
            <PanelTitle>{t('find_a_driver')}</PanelTitle>
            <View>
                <LocationInput value={pickup} onChangeText={text => dispatch(setPickup(text))} placeholder={t('pickup_location')} />
                <LocationInput value={dropoff} onChangeText={text => dispatch(setDropoff(text))} placeholder={t('dropoff_location')} />
            </View>
            <PanelSubTitle>{t('select_vehicle')}</PanelSubTitle>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
                {VEHICLES.map((vehicle) => {
                    const isSelected = selectedVehicleId === vehicle.id;
                    return (
                        <VehicleCard key={vehicle.id} onPress={() => dispatch(setSelectedVehicleId(vehicle.id))} isSelected={isSelected}>
                            <VehicleImage source={{uri: vehicle.imageUrl}} />
                            <VehicleName isSelected={isSelected}>{t(vehicle.nameKey)}</VehicleName>
                        </VehicleCard>
                    )
                })}
            </ScrollView>
            <PrimaryButton onPress={handleSearch} disabled={!selectedVehicleId}>
                <PrimaryButtonText>{t('find_a_driver')}</PrimaryButtonText>
            </PrimaryButton>
        </View>
    );
}

const SearchingPanel: React.FC = () => {
    const {t} = useI18n();
    const { theme } = useTheme();
    return (
        <CenteredPanel>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <PanelTitle style={{marginTop: 16}}>{t('finding_your_ride')}</PanelTitle>
            <PanelSubtitle>{t('searching_for_drivers')}</PanelSubtitle>
        </CenteredPanel>
    );
};

const DriversPanel: React.FC<{onChat: (target: ChatTarget) => void}> = ({onChat}) => {
    const {t} = useI18n();
    const dispatch = useAppDispatch();
    const { availableDrivers } = useAppSelector(state => state.booking);
    
    const renderDriver = ({item}: {item: AvailableDriver}) => (
        <DriverCard>
            <DriverInfo>
                <Avatar source={{uri: item.photoUrl}} />
                <View>
                    <DriverName>{item.name}</DriverName>
                    <Text><Icon name="star" size={14} color="#FFD700"/> {item.rating}</Text>
                </View>
            </DriverInfo>
            <FareInfo>
                <FareText>₹{item.fare}</FareText>
                <EtaText>{t('mins_away', item.eta)}</EtaText>
            </FareInfo>
             <CardActions>
                <ActionButton onPress={() => onChat({id: item.id, name: item.name, chatId: item.chatId})}>
                    <ActionButtonText>{t('chat')}</ActionButtonText>
                </ActionButton>
                <ActionButton primary onPress={() => dispatch(selectOffer(item))}>
                    <ActionButtonText primary>{t('accept')}</ActionButtonText>
                </ActionButton>
            </CardActions>
        </DriverCard>
    )

    return (
        <View style={{height: 350}}>
            <PanelTitle>{t('choose_your_ride')}</PanelTitle>
            <FlatList
                data={availableDrivers}
                renderItem={renderDriver}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const ConfirmingBookingPanel: React.FC = () => {
    const {t} = useI18n();
    const dispatch = useAppDispatch();
    const { selectedOffer } = useAppSelector(state => state.booking);
    const vehicle = VEHICLES.find(v => v.id === selectedOffer?.vehicleName) || VEHICLES[0];

    if(!selectedOffer) return null;

    return (
        <View>
            <PanelTitle>{t('ride_details')}</PanelTitle>
            <Image source={{uri: vehicle.imageUrl}} style={{width: '100%', height: 120, resizeMode: 'contain'}} />
            <VehicleName large>{selectedOffer.vehicleName}</VehicleName>
            
            <DriverCard confirmation>
                <DriverInfo>
                    <Avatar source={{uri: selectedOffer.photoUrl}} />
                    <View>
                        <DriverName>{selectedOffer.name}</DriverName>
                        <Text><Icon name="star" size={14} color="#FFD700"/> {selectedOffer.rating}</Text>
                    </View>
                </DriverInfo>
                <EtaText>{t('mins_away', selectedOffer.eta)}</EtaText>
            </DriverCard>
            
            <PrimaryButton onPress={() => dispatch(confirmRideBooking(selectedOffer))}>
                <PrimaryButtonText>{t('confirm_and_book')} (₹{selectedOffer.fare})</PrimaryButtonText>
            </PrimaryButton>
             <SecondaryButton onPress={() => dispatch(selectOffer(null))}>
                <SecondaryButtonText>{t('back_to_offers')}</SecondaryButtonText>
            </SecondaryButton>
        </View>
    );
}

const ConfirmedPanel: React.FC<{onChat: (target: ChatTarget) => void}> = ({onChat}) => {
    const {t} = useI18n();
    const dispatch = useAppDispatch();
    const { confirmedDriver, status } = useAppSelector(state => state.booking);
    
    if(!confirmedDriver) return null;
    
    const getStatusInfo = () => {
        switch (status) {
            case BookingStatus.DRIVER_CONFIRMED: return { title: t('driver_assigned'), message: t('driver_on_the_way', confirmedDriver?.name) };
            case BookingStatus.EN_ROUTE_PICKUP: return { title: t('driver_en_route'), message: t('approaching_pickup') };
            case BookingStatus.TRIP_IN_PROGRESS: return { title: t('trip_in_progress'), message: t('items_on_the_way') };
            default: return { title: '', message: '' };
        }
    };
    const { title, message } = getStatusInfo();

    return(
        <CenteredPanel>
            <Avatar large source={{uri: confirmedDriver.photoUrl}} />
            <PanelTitle>{title}</PanelTitle>
            <PanelSubtitle>{message}</PanelSubtitle>
            <DriverName>{confirmedDriver.name}</DriverName>
            <Text>{confirmedDriver.vehicleName} - {confirmedDriver.licensePlate}</Text>
            <CardActions>
                 <ActionButton onPress={() => onChat({id: confirmedDriver.id, name: confirmedDriver.name, chatId: confirmedDriver.chatId})}>
                    <Icon name="message-square" size={20} color="#333" style={{marginRight: 8}}/>
                    <ActionButtonText>{t('chat')}</ActionButtonText>
                </ActionButton>
                <ActionButton>
                    <Icon name="phone" size={20} color="#333" style={{marginRight: 8}}/>
                    <ActionButtonText>{t('call')}</ActionButtonText>
                </ActionButton>
            </CardActions>
        </CenteredPanel>
    )
}

const ErrorPanel: React.FC = () => {
    const {t} = useI18n();
    const dispatch = useAppDispatch();
    const { error } = useAppSelector(state => state.booking);

    return (
        <CenteredPanel>
            <Icon name="alert-triangle" size={48} color="red" />
            <PanelTitle>{t('search_failed')}</PanelTitle>
            <PanelSubtitle>{error || t('search_failed_desc')}</PanelSubtitle>
            <PrimaryButton onPress={() => dispatch(resetBooking())}>
                <PrimaryButtonText>{t('start_over')}</PrimaryButtonText>
            </PrimaryButton>
        </CenteredPanel>
    );
};


// Styles
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled(View)`
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  padding: 0 ${props => props.theme.spacing.m}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AppName = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
`;

const ProfileButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(255,255,255,0.8);
  justify-content: center;
  align-items: center;
  elevation: 4;
`;

const PanelContainer = styled(View)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.colors.card};
    border-top-left-radius: ${props => props.theme.borderRadius.xl}px;
    border-top-right-radius: ${props => props.theme.borderRadius.xl}px;
    padding: ${props => props.theme.spacing.m}px;
    padding-bottom: ${props => props.theme.spacing.l}px;
    elevation: 10;
`;

const PanelTitle = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin-bottom: ${props => props.theme.spacing.m}px;
`;
const PanelSubTitle = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.s}px;
    margin-top: ${props => props.theme.spacing.m}px;
`;
const PanelSubtitle = styled(Text)`
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    text-align: center;
    margin-bottom: ${props => props.theme.spacing.m}px;
`;
const LocationInput = styled(TextInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.textSecondary
}))`
    background-color: ${props => props.theme.colors.background};
    padding: 14px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.s}px;
`;
const PrimaryButton = styled(TouchableOpacity)`
    background-color: ${props => props.theme.colors.primary};
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
    margin-top: ${props => props.theme.spacing.m}px;
`;
const PrimaryButtonText = styled(Text)`
    color: ${props => props.theme.colors.background};
    font-size: 16px;
    font-weight: bold;
`;
const SecondaryButton = styled(PrimaryButton)`
    background-color: ${props => props.theme.colors.background};
`;
const SecondaryButtonText = styled(PrimaryButtonText)`
    color: ${props => props.theme.colors.text};
`;
const WelcomeText = styled(Text)`
    color: ${props => props.theme.colors.text};
    font-size: 16px;
    text-align: center;
`;
const CenteredPanel = styled(View)`
    align-items: center;
    justify-content: center;
    padding: ${props => props.theme.spacing.m}px;
`;
const VehicleCard = styled.TouchableOpacity<{isSelected: boolean}>`
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: ${props => props.theme.spacing.s}px;
    align-items: center;
    margin-right: ${props => props.theme.spacing.s}px;
    border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
    background-color: ${props => props.isSelected ? props.theme.colors.background : props.theme.colors.card};
`;
const VehicleImage = styled(Image)`
    width: 100px;
    height: 60px;
    resize-mode: contain;
`;
const VehicleName = styled.Text<{isSelected?: boolean; large?: boolean}>`
    color: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.text};
    font-weight: bold;
    margin-top: ${props => props.theme.spacing.xs}px;
    font-size: ${props => props.large ? 20 : 14}px;
`;
const DriverCard = styled(View)<{confirmation?: boolean}>`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme.spacing.m}px;
    background-color: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.l}px;
    margin-bottom: ${props => props.theme.spacing.s}px;
    ${props => props.confirmation && `margin-vertical: ${props.theme.spacing.m}px;`}
`;
const DriverInfo = styled(View)`
    flex-direction: row;
    align-items: center;
`;
const Avatar = styled(Image)<{large?: boolean}>`
    width: ${props => props.large ? 80 : 48}px;
    height: ${props => props.large ? 80 : 48}px;
    border-radius: ${props => props.large ? 40 : 24}px;
    margin-right: ${props => props.theme.spacing.m}px;
`;
const DriverName = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const FareInfo = styled(View)`
    align-items: flex-end;
`;
const FareText = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;
const EtaText = styled(Text)`
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
`;
const CardActions = styled(View)`
    flex-direction: row;
    margin-top: ${props => props.theme.spacing.m}px;
`;
const ActionButton = styled(TouchableOpacity)<{primary?: boolean}>`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.m}px;
    margin: 0 4px;
`;
const ActionButtonText = styled(Text)<{primary?: boolean}>`
    font-weight: bold;
    color: ${props => props.primary ? props.theme.colors.background : props.theme.colors.text};
`;


export default UserHome;
