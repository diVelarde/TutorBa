const express = require('express');
const router = express.Router();
const Session = require('../models/session');

// Create a new tutoring session
router.post('/', async (req, res) => {
    try {
        const { tutor_id, student_id, date, time, location } = req.body;

        // Check for scheduling conflicts for tutor
        const tutorConflict = await Session.findOne({
            tutor_id,
            date,
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (tutorConflict) {
            return res.status(400).json({
                message: 'Tutor already has a session scheduled at this time'
            });
        }

        // Check for scheduling conflicts for student
        const studentConflict = await Session.findOne({
            student_id,
            date,
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (studentConflict) {
            return res.status(400).json({
                message: 'You already have a session scheduled at this time'
            });
        }

        const session = new Session({
            tutor_id,
            student_id,
            date,
            time,
            location,
            status: 'pending'
        });

        await session.save();

        // Emit realtime event
        const io = req.app && req.app.get && req.app.get('io');
        if (io) {
            io.emit('sessionCreated', session);
        }

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating session',
            error: error.message
        });
    }
});

// Get all sessions for a tutor
router.get('/tutor/:tutorId', async (req, res) => {
    try {
        const { status } = req.query;
        const query = { tutor_id: req.params.tutorId };
        
        if (status) {
            query.status = status;
        }

        const sessions = await Session.find(query)
            .populate('student_id', 'name email')
            .sort({ date: 1, time: 1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching tutor sessions',
            error: error.message
        });
    }
});

// Get all sessions for a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const { status } = req.query;
        const query = { student_id: req.params.studentId };
        
        if (status) {
            query.status = status;
        }

        const sessions = await Session.find(query)
            .populate('tutor_id', 'name email')
            .sort({ date: 1, time: 1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching student sessions',
            error: error.message
        });
    }
});

// Get a specific session
router.get('/:sessionId', async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId)
            .populate('tutor_id', 'name email')
            .populate('student_id', 'name email');

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching session',
            error: error.message
        });
    }
});

// Update session status (confirm, cancel, complete)
router.patch('/:sessionId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['confirmed', 'cancelled', 'completed'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be confirmed, cancelled, or completed'
            });
        }

        const session = await Session.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Validate status transitions
        if (session.status === 'cancelled' || session.status === 'completed') {
            return res.status(400).json({
                message: `Cannot update status: session is already ${session.status}`
            });
        }

        if (status === 'completed' && session.status !== 'confirmed') {
            return res.status(400).json({
                message: 'Only confirmed sessions can be marked as completed'
            });
        }

        session.status = status;
        await session.save();

        // Emit realtime update
        const io = req.app && req.app.get && req.app.get('io');
        if (io) {
            io.emit('sessionUpdated', session);
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating session status',
            error: error.message
        });
    }
});

// Update session details (only if status is pending)
router.put('/:sessionId', async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status !== 'pending') {
            return res.status(400).json({
                message: 'Only pending sessions can be updated'
            });
        }

        const { date, time, location } = req.body;

        // Check for scheduling conflicts if date or time is being changed
        if (date || time) {
            const conflictQuery = {
                _id: { $ne: session._id },
                tutor_id: session.tutor_id,
                date: date || session.date,
                time: time || session.time,
                status: { $in: ['pending', 'confirmed'] }
            };

            const conflict = await Session.findOne(conflictQuery);
            if (conflict) {
                return res.status(400).json({
                    message: 'Scheduling conflict detected'
                });
            }
        }

        Object.assign(session, req.body);
        await session.save();

        // Emit realtime update for changed session
        const io = req.app && req.app.get && req.app.get('io');
        if (io) {
            io.emit('sessionUpdated', session);
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating session',
            error: error.message
        });
    }
});

// Get sessions for a user (either tutor or student) with optional role and status filters
// Example: GET /api/sessions/user/USER_ID?role=tutor&status=confirmed
router.get('/user/:userId', async (req, res) => {
    try {
        const { role, status } = req.query;
        const userId = req.params.userId;
        const query = {};

        if (role === 'tutor') {
            query.tutor_id = userId;
        } else if (role === 'student') {
            query.student_id = userId;
        } else {
            // no role specified -> return sessions where user is tutor or student
            query.$or = [
                { tutor_id: userId },
                { student_id: userId }
            ];
        }

        if (status) query.status = status;

        const sessions = await Session.find(query)
            .populate('tutor_id', 'name email')
            .populate('student_id', 'name email')
            .sort({ date: 1, time: 1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user sessions',
            error: error.message
        });
    }
});

module.exports = router;