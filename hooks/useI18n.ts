import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext.tsx';

export const useI18n = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within a LanguageProvider');
    }
    return context;
};
