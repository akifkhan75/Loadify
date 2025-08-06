import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/driver/dashboard/:driverId
router.get('/dashboard/:driverId', (req, res) => {
    const { driverId } = req.params;
    const driver = db.findAccountById(driverId);

    if (!driver) {
        return res.status(404).json({ message: 'Driver not found.' });
    }
    
    // Simulate online status and fetching requests
    const dashboardData = {
        isOnline: true, // Mock status
        requests: db.getRideRequestsForDriver(driverId)
    };
    
    // Simulate network delay
    setTimeout(() => {
        res.json(dashboardData);
    }, 500);
});

// POST /api/driver/requests/:requestId/respond
router.post('/requests/:requestId/respond', (req, res) => {
    const requestId = parseInt(req.params.requestId, 10);
    const { response, newTime } = req.body;

    // In a real app, you'd update the ride request status, notify the user, etc.
    // Here, we'll just remove it from the pending list.
    console.log(`Driver responded to request ${requestId} with: ${response}`);
    if (response === 'offer_sent') {
        console.log(`New proposed time: ${newTime}`);
    }
    
    db.removeRideRequest(requestId);
    
    res.json({ success: true });
});


export default router;
