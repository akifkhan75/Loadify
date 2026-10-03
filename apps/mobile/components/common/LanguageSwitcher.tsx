import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useI18n } from '../../hooks/useI18n.ts';
import styled from 'styled-components/native';
import { useTheme } from '../../hooks/useTheme.ts';

const SwitcherButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.m}px;
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  align-items: center;
  justify-content: center;
`;

const SwitcherText = styled(Text)`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useI18n();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'العربية' },
        { code: 'ur', name: 'اردو' },
    ];
    
    const currentIndex = languages.findIndex(l => l.code === language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLang = languages[nextIndex];

    return (
        <SwitcherButton onPress={() => setLanguage(nextLang.code as any)}>
            <SwitcherText>{languages[currentIndex].name}</SwitcherText>
        </SwitcherButton>
    );
};

export default LanguageSwitcher;
