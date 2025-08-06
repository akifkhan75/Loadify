import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// PUT /api/accounts/:accountId
router.put('/:accountId', (req, res) => {
    const { accountId } = req.params;
    const updates = req.body;

    const currentAccount = db.findAccountById(accountId);
    if (!currentAccount) {
        return res.status(404).json({ message: 'Account not found.' });
    }

    // If this is a password update, verify current password before proceeding
    if (updates.password && updates.currentPassword) {
        if (currentAccount.password !== updates.currentPassword) {
            return res.status(403).json({ message: 'Incorrect current password.' });
        }
        // The currentPassword field is only for verification, don't store it.
        delete updates.currentPassword;
    } else if (updates.password && !updates.currentPassword) {
        // Prevent password changes without sending the current password
        return res.status(400).json({ message: 'Current password is required to set a new password.' });
    }


    const updatedAccount = db.updateAccount(accountId, updates);
    
    if (updatedAccount) {
        const { password, ...accountData } = updatedAccount;
        return res.json(accountData);
    } else {
        return res.status(500).json({ message: 'Failed to update account.' });
    }
});

export default router;
