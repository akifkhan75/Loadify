import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Driver, DocumentStatus } from '../../types/types.ts';
import { useI18n } from '../../hooks/useI18n.ts';
import { useTheme } from '../../hooks/useTheme.ts';
import styled from 'styled-components/native';
import Icon from '../common/Icon.tsx';

interface WaitingForApprovalProps {
    driver: Driver;
    onLogout: () => void;
}

const DocumentStatusPill: React.FC<{ status: DocumentStatus }> = ({ status }) => {
    const { t } = useI18n();
    const { theme } = useTheme();

    const statusMap = {
        [DocumentStatus.APPROVED]: { text: t('doc_approved'), color: theme.colors.success, bgColor: `${theme.colors.success}20`, icon: 'check-circle' },
        [DocumentStatus.PENDING]: { text: t('doc_pending'), color: '#F59E0B', bgColor: '#F59E0B20', icon: 'clock' },
        [DocumentStatus.REJECTED]: { text: t('doc_rejected'), color: theme.colors.notification, bgColor: `${theme.colors.notification}20`, icon: 'x-circle' },
        [DocumentStatus.NOT_UPLOADED]: { text: t('doc_not_uploaded'), color: theme.colors.textSecondary, bgColor: theme.colors.border, icon: 'alert-circle' },
    };

    const currentStatus = statusMap[status];

    return (
        <PillContainer style={{ backgroundColor: currentStatus.bgColor }}>
            <Icon name={currentStatus.icon} size={14} color={currentStatus.color} />
            <PillText style={{ color: currentStatus.color }}>{currentStatus.text}</PillText>
        </PillContainer>
    );
};

const WaitingForApproval: React.FC<WaitingForApprovalProps> = ({ driver, onLogout }) => {
    const { t } = useI18n();

    const documents = Object.entries(driver.profile.documents);

    return (
        <Container>
            <Card>
                <Title>{t('awaiting_approval')}</Title>
                <Description>{t('approval_desc')}</Description>

                <StatusBox>
                    <StatusBoxTitle>{t('document_status')}</StatusBoxTitle>
                    {documents.map(([key, doc]) => (
                        <StatusRow key={key}>
                            <DocumentName>{t(doc.nameKey)}</DocumentName>
                            <DocumentStatusPill status={doc.status} />
                        </StatusRow>
                    ))}
                </StatusBox>

                <LogoutButton onPress={onLogout}>
                    <LogoutButtonText>{t('logout')}</LogoutButtonText>
                </LogoutButton>
            </Card>
        </Container>
    );
};

const Container = styled(View)`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.background};
    padding: 16px;
`;
const Card = styled(View)`
    width: 100%;
    max-width: 400px;
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.xl}px;
    padding: 24px;
    align-items: center;
`;
const Title = styled(Text)`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
`;
const Description = styled(Text)`
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    text-align: center;
    margin-bottom: 24px;
`;
const StatusBox = styled(View)`
    width: 100%;
    background-color: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.l}px;
    padding: 16px;
    margin-bottom: 24px;
`;
const StatusBoxTitle = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
`;
const StatusRow = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;
const DocumentName = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
`;
const PillContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    padding: 6px 10px;
    border-radius: ${props => props.theme.borderRadius.full}px;
`;
const PillText = styled(Text)`
    font-size: 12px;
    font-weight: bold;
    margin-left: 6px;
`;
const LogoutButton = styled(TouchableOpacity)`
    width: 100%;
    background-color: ${props => props.theme.colors.notification};
    padding: 16px;
    border-radius: ${props => props.theme.borderRadius.m}px;
    align-items: center;
`;
const LogoutButtonText = styled(Text)`
    color: ${props => props.theme.colors.card};
    font-size: 16px;
    font-weight: bold;
`;

export default WaitingForApproval;
