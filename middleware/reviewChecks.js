const Session = require('../models/session');
const Review = require('../models/review');

// Middleware to ensure the session exists and is completed and no existing review
async function ensureSessionCompletedAndNoReview(req, res, next) {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ message: 'session_id is required' });
        }

        const session = await Session.findById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status !== 'completed') {
            return res.status(400).json({ message: 'Reviews can only be submitted for completed sessions' });
        }

        const existing = await Review.findOne({ session_id });
        if (existing) {
            return res.status(409).json({ message: 'A review already exists for this session' });
        }

        // attach session for downstream if needed
        req.sessionRecord = session;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating review', error: error.message });
    }
}

module.exports = { ensureSessionCompletedAndNoReview };
