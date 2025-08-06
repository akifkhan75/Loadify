import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import AppNavigator from './navigation/AppNavigator.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <ThemeProvider>
                        <LanguageProvider>
                            <AppNavigator />
                        </LanguageProvider>
                    </ThemeProvider>
                </Provider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;
