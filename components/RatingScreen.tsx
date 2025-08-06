import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { Driver } from '../types/types.ts';
import Icon from './common/Icon.tsx';
import { useI18n } from '../hooks/useI18n.ts';
import { useTheme } from '../hooks/useTheme.ts';

interface RatingScreenProps {
    driver: Driver;
    onRate: (rating: number, review: string) => void;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ driver, onRate }) => {
    const { t } = useI18n();
    const { theme } = useTheme();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    return (
        <Modal transparent={true} animationType="slide" visible={true}>
            <Overlay>
                <Container>
                    <Handle />
                    <Avatar source={{ uri: driver.photoUrl }} />
                    <Title>{t('rate_your_trip')}</Title>
                    <Subtitle>{t('how_was_experience', driver.name)}</Subtitle>

                    <StarsContainer>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Icon
                                    name="star"
                                    size={40}
                                    color={rating >= star ? theme.colors.brand : theme.colors.border}
                                />
                            </TouchableOpacity>
                        ))}
                    </StarsContainer>

                    <ReviewInput
                        value={review}
                        onChangeText={setReview}
                        placeholder={t('leave_review_optional')}
                        multiline
                    />
                     <SubmitButton
                        onPress={() => onRate(rating, review)}
                        disabled={rating === 0}
                    >
                        <SubmitButtonText>{t('submit_feedback')}</SubmitButtonText>
                    </SubmitButton>
                </Container>
            </Overlay>
        </Modal>
    );
};

const Overlay = styled(View)`
    flex: 1;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled(View)`
    background-color: ${props => props.theme.colors.card};
    border-top-left-radius: ${props => props.theme.borderRadius.xl}px;
    border-top-right-radius: ${props => props.theme.borderRadius.xl}px;
    padding: ${props => props.theme.spacing.m}px;
    padding-bottom: ${props => props.theme.spacing.l}px;
    align-items: center;
`;

const Handle = styled(View)`
    width: 48px;
    height: 6px;
    background-color: ${props => props.theme.colors.border};
    border-radius: 3px;
    margin-bottom: ${props => props.theme.spacing.m}px;
`;

const Avatar = styled(Image)`
    width: 80px;
    height: 80px;
    border-radius: 40px;
    border-width: 3px;
    border-color: ${props => props.theme.colors.background};
    margin-bottom: ${props => props.theme.spacing.m}px;
`;

const Title = styled(Text)`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
`;

const Subtitle = styled(Text)`
    font-size: 16px;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: ${props => props.theme.spacing.l}px;
    text-align: center;
`;

const StarsContainer = styled(View)`
    flex-direction: row;
    justify-content: center;
    margin-bottom: ${props => props.theme.spacing.l}px;
`;

const ReviewInput = styled(TextInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.textSecondary
}))`
    background-color: ${props => props.theme.colors.background};
    width: 100%;
    min-height: 80px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    padding: ${props => props.theme.spacing.m}px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.l}px;
    text-align-vertical: top;
`;

const SubmitButton = styled(TouchableOpacity)`
    background-color: ${props => props.disabled ? props.theme.colors.border : props.theme.colors.primary};
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
    width: 100%;
`;

const SubmitButtonText = styled(Text)`
    color: ${props => props.theme.colors.background};
    font-size: 16px;
    font-weight: bold;
`;

export default RatingScreen;
