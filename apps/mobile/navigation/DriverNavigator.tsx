import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DriverDashboard from '../components/driver/DriverDashboard.tsx';
import DriverProfile from '../components/driver/DriverProfile.tsx';
import DriverBookings from '../components/driver/DriverBookings.tsx';
import DriverEarnings from '../components/driver/DriverEarnings.tsx';
import Icon from '../components/common/Icon.tsx';
import { useI18n } from '../hooks/useI18n.ts';
import { useTheme } from '../hooks/useTheme.ts';

const Tab = createBottomTabNavigator();

const DriverNavigator: React.FC = () => {
    const { t } = useI18n();
    const { theme } = useTheme();

    const navItems = [
        { name: 'Dashboard', labelKey: 'dashboard', icon: 'home', component: DriverDashboard },
        { name: 'Bookings', labelKey: 'my_bookings', icon: 'calendar', component: DriverBookings },
        { name: 'Earnings', labelKey: 'earnings', icon: 'dollar-sign', component: DriverEarnings },
        { name: 'Profile', labelKey: 'profile', icon: 'user', component: DriverProfile },
    ];

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: { 
                  backgroundColor: theme.colors.card,
                  borderTopColor: theme.colors.border,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            {navItems.map(item => (
                <Tab.Screen
                    key={item.name}
                    name={item.name}
                    component={item.component}
                    options={{
                        tabBarLabel: t(item.labelKey),
                        tabBarIcon: ({ color, size }) => (
                            <Icon name={item.icon} size={size} color={color} />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
};

export default DriverNavigator;
