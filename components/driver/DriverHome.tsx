import React, { useMemo } from 'react';
import { Driver, DocumentStatus } from '../../types/types.ts';
import { useAppSelector, useAppDispatch } from '../../store/hooks.ts';
import { logout } from '../../store/slices/authSlice.ts';
import WaitingForApproval from './WaitingForApproval.tsx';
import DriverNavigator from '../../navigation/DriverNavigator.tsx'; // Import the new navigator

const DriverHome: React.FC = () => {
    const { account } = useAppSelector(state => state.auth);
    const driver = account as Driver;
    const dispatch = useAppDispatch();
    
    const isApproved = useMemo(() => {
        if (!driver || !driver.profile.documents) return false;
        return Object.values(driver.profile.documents).every(doc => doc.status === DocumentStatus.APPROVED);
    }, [driver]);

    const handleLogout = () => {
        dispatch(logout());
    };

    if (!driver) {
        return null; // Or a loading indicator
    }

    if (!isApproved) {
        return <WaitingForApproval driver={driver} onLogout={handleLogout} />;
    }

    // The DriverNavigator now handles all the views and the bottom bar.
    return <DriverNavigator />;
};

export default DriverHome;
