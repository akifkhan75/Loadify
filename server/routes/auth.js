import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    // Safely extract and trim inputs to prevent issues with whitespace.
    const mobile = (req.body.mobile || '').trim();
    const password = (req.body.password || '').trim();

    if (!mobile || !password) {
        return res.status(400).json({ message: 'Mobile and password are required.' });
    }

    const account = db.findAccountByMobile(mobile);

    // Perform a more robust check:
    // 1. The account must be found.
    // 2. The account object must have a password property.
    // 3. The provided password must match the stored password.
    if (!account || typeof account.password === 'undefined' || account.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Don't send password back to client
    const { password: _, ...accountData } = account;
    res.json(accountData);
});

// POST /api/auth/signup
router.post('/signup', (req, res) => {
    const details = req.body;

    if (!details.type || !details.mobile || !details.password || !details.name) {
        return res.status(400).json({ message: 'Missing required signup details.'});
    }

    if (db.findAccountByMobile(details.mobile)) {
        return res.status(409).json({ message: 'An account with this mobile number already exists.' });
    }
    
    let newAccount;
    if (details.type === 'user') {
        newAccount = db.createUser(details);
    } else if (details.type === 'driver') {
        newAccount = db.createDriver(details);
    } else {
        return res.status(400).json({ message: 'Invalid account type specified.' });
    }
    
    const { password: _, ...accountData } = newAccount;
    res.status(201).json(accountData);
});


export default router;