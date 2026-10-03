import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks.ts';
import { selectAuth } from '../store/slices/authSlice.ts';
import AuthNavigator from './AuthNavigator.tsx';
import UserNavigator from './UserNavigator.tsx';
import DriverNavigator from './DriverNavigator.tsx';
import { AppView } from '../types/types.ts';
import { useTheme } from '../hooks/useTheme.ts';
import { StatusBar } from 'react-native';

const AppNavigator: React.FC = () => {
    const { view } = useAppSelector(selectAuth);
    const { theme, themeMode } = useTheme();
    
    // Create a theme object that conforms to the React Navigation theme structure.
    const navigationTheme = {
        dark: themeMode === 'dark',
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.notification,
        },
        fonts: {
          regular: { fontFamily: theme.fontFamily.body || 'System', fontWeight: '400' },
          medium: { fontFamily: theme.fontFamily.body || 'System', fontWeight: '500' },
          light: { fontFamily: theme.fontFamily.body || 'System', fontWeight: '300' },
          thin: { fontFamily: theme.fontFamily.body || 'System', fontWeight: '100' },
        },
      };
      

    const renderNavigator = () => {
        switch (view) {
            case AppView.USER_HOME:
            case AppView.USER_PROFILE:
                return <UserNavigator />;
            case AppView.DRIVER_HOME:
                return <DriverNavigator />;
            case AppView.AUTH:
            case AppView.SIGNUP:
            default:
                return <AuthNavigator />;
        }
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
            {renderNavigator()}
        </NavigationContainer>
    );
};

export default AppNavigator;
