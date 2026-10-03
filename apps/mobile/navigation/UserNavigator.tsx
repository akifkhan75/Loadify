import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserHome from '../components/user/UserHome.tsx';
import UserProfile from '../components/user/UserProfile.tsx';

const Stack = createNativeStackNavigator();

const UserNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="UserHome" component={UserHome} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
    );
};

export default UserNavigator;
