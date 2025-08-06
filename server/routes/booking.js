import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import { db } from '../db.js';

const router = express.Router();

// POST /api/booking/ai-parse
router.post('/ai-parse', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required.' });
    }
    
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return res.status(500).json({ message: "Server configuration error: Missing API Key." });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const schema = {
            type: Type.OBJECT,
            properties: {
                pickup: {
                    type: Type.STRING,
                    description: "The starting point or pickup location for the ride. Should be a specific place or address."
                },
                dropoff: {
                    type: Type.STRING,
                    description: "The destination or dropoff location for the ride. Should be a specific place or address."
                },
                vehicleType: {
                    type: Type.STRING,
                    description: "The type of vehicle requested. Must be one of 'mini-truck', 'pickup', or 'large-truck'. If not specified or ambiguous, return 'Unknown'.",
                    enum: ['mini-truck', 'pickup', 'large-truck', 'Unknown']
                }
            },
            required: ["pickup", "dropoff", "vehicleType"]
        };

        const model = 'gemini-2.5-flash';
        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: schema,
        };
        const contents = `Parse the following user request to identify the pickup and dropoff locations, and the required vehicle type. Be specific with locations. User request: "${prompt}"`;
        
        const response = await ai.models.generateContent({
            model,
            contents,
            config: generationConfig,
        });

        const resultText = response.text.trim();
        const rideInfo = JSON.parse(resultText);
        
        res.json(rideInfo);

    } catch (error) {
        console.error('Gemini API call failed:', error);
        res.status(500).json({ message: 'Failed to parse ride request with AI.' });
    }
});


// POST /api/booking/find-drivers
router.post('/find-drivers', (req, res) => {
    const { vehicleId } = req.body;
    
    // Filter available, approved drivers who have the requested vehicle size
    const availableDrivers = Object.values(db.drivers).filter(d => {
        const isApproved = Object.values(d.profile.documents).every(doc => doc.status === 'doc_approved');
        return isApproved && d.profile.vehicleProfile.sizeId === vehicleId;
    });

    if (availableDrivers.length === 0) {
        return res.json([]);
    }

    // Create some mock offers
    const offers = availableDrivers.map(d => ({
        id: d.id,
        name: d.name,
        photoUrl: d.photoUrl,
        rating: d.rating,
        vehicleName: `${d.profile.vehicleProfile.make} ${d.profile.vehicleProfile.model}`,
        licensePlate: d.profile.vehicleProfile.registrationNumber,
        distanceAway: parseFloat((Math.random() * 5 + 1).toFixed(1)),
        eta: Math.floor(Math.random() * 10 + 5),
        fare: Math.floor(Math.random() * 500 + 300),
        chatId: `user1-${d.id}`, // Mock chat ID
        loadingTeam: d.profile.loadingTeam,
        // 50% chance of a counter-offer on time
        offer: Math.random() > 0.5 ? {
            newDateTime: new Date(Date.now() + 15 * 60000).toISOString().slice(0, 16)
        } : undefined
    }));

    // Simulate network delay
    setTimeout(() => {
        res.json(offers);
    }, 1500);
});

// POST /api/booking/confirm
router.post('/confirm', (req, res) => {
    const { offer } = req.body;
    
    const driver = db.findAccountById(offer.id);
    if (!driver) {
        return res.status(404).json({ message: 'Driver not found.' });
    }

    const confirmedRide = {
        bookingId: `bk_${Date.now()}`,
        driver: {
            ...offer,
            mobile: driver.mobile, // Add mobile number for contact
        }
    };
    
    // Simulate network delay
    setTimeout(() => {
         res.json(confirmedRide);
    }, 1000);
});

export default router;
