const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const Message = require('../models/message');

// upload destination
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'messages');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        // keep original name prefixed with timestamp to avoid collisions
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Ensure upload dir exists is handled by the server startup (or create manually)

// Send a message with optional attachments (multipart/form-data)
// fields: sender_id, receiver_id, content (optional)
// files: attachments (array)
router.post('/', upload.array('attachments', 6), async (req, res) => {
    try {
        const { sender_id, receiver_id, content } = req.body;
        if (!sender_id || !receiver_id) {
            return res.status(400).json({ message: 'sender_id and receiver_id are required' });
        }

        const files = (req.files || []).map(f => ({
            filename: f.filename,
            originalname: f.originalname,
            path: path.join('uploads', 'messages', f.filename),
            url: `/uploads/messages/${f.filename}`,
            mimetype: f.mimetype,
            size: f.size
        }));

        const message = new Message({
            sender_id,
            receiver_id,
            content: content || '',
            attachments: files
        });

        await message.save();

        // emit via socket if available
        const io = req.app && req.app.get && req.app.get('io');
        if (io) {
            // emit to both participants; we can emit a generic event
            io.emit('messageCreated', message);
        }

        res.status(201).json(message);
    } catch (err) {
        console.error('Error creating message:', err);
        res.status(500).json({ message: 'Error creating message', error: err.message });
    }
});

// Get conversation between two users (pagination)
// GET /api/messages/conversation/:userA/:userB?limit=50&skip=0
router.get('/conversation/:userA/:userB', async (req, res) => {
    try {
        const { userA, userB } = req.params;
        const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
        const skip = parseInt(req.query.skip || '0', 10);

        const query = {
            $or: [
                { sender_id: userA, receiver_id: userB },
                { sender_id: userB, receiver_id: userA }
            ]
        };

        const messages = await Message.find(query)
            .sort({ timestamp: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.json(messages);
    } catch (err) {
        console.error('Error fetching conversation:', err);
        res.status(500).json({ message: 'Error fetching conversation', error: err.message });
    }
});

// Mark message as read
router.patch('/:messageId/read', async (req, res) => {
    try {
        const msg = await Message.findById(req.params.messageId);
        if (!msg) return res.status(404).json({ message: 'Message not found' });
        msg.read = true;
        await msg.save();
        res.json(msg);
    } catch (err) {
        res.status(500).json({ message: 'Error marking message read', error: err.message });
    }
});

module.exports = router;
