import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.tsx';

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return { theme: context.theme, themeMode: context.themeMode, setThemeMode: context.setThemeMode };
};
