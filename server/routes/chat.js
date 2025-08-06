import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/chat/:chatId
router.get('/:chatId', (req, res) => {
    const { chatId } = req.params;
    const history = db.getChat(chatId);
    res.json(history);
});

// POST /api/chat/:chatId/message
router.post('/:chatId/message', (req, res) => {
    const { chatId } = req.params;
    const { senderId, text } = req.body;

    if (!senderId || !text) {
        return res.status(400).json({ message: 'Sender ID and text are required.' });
    }
    
    const newMessage = db.addMessageToChat(chatId, senderId, text);
    res.status(201).json(newMessage);
});

export default router;
