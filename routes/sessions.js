const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const TutorAvailability = require('../models/tutorAvailability');

// Assumption: each session is 60 minutes long. Change SESSION_DURATION_MINUTES if your sessions have different length.
const SESSION_DURATION_MINUTES = 60;

function parseTimeToMinutes(timeStr) {
    // expects 'HH:MM'
    if (!timeStr || typeof timeStr !== 'string') return NaN;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return NaN;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
    return h * 60 + m;
}

async function isTutorAvailable(tutorId, dateStr, timeStr) {
    // dateStr can be a Date or date-string; determine day of week
    const date = new Date(dateStr);
    if (isNaN(date)) return false;
    const day = date.getDay(); // 0-6
    const slotTime = parseTimeToMinutes(timeStr);
    if (Number.isNaN(slotTime)) return false;
    const slotEnd = slotTime + SESSION_DURATION_MINUTES;

    const availability = await TutorAvailability.findOne({ tutor_id: tutorId }).lean();
    if (!availability || !availability.slots || availability.slots.length === 0) return false;

    // Find a slot on that day that fully contains the session [slotTime, slotEnd)
    for (const s of availability.slots) {
        if (s.day !== day) continue;
        const startMin = parseTimeToMinutes(s.start);
        const endMin = parseTimeToMinutes(s.end);
        if (Number.isNaN(startMin) || Number.isNaN(endMin)) continue;
        // ensure session fits completely inside availability slot
        if (slotTime >= startMin && slotEnd <= endMin) return true;
    }
    return false;
}

async function hasOverlapConflict({ tutorId, studentId, dateStr, timeStr, excludeSessionId = null }) {
    const startMin = parseTimeToMinutes(timeStr);
    if (Number.isNaN(startMin)) return { conflict: true, reason: 'invalid_time' };
    const endMin = startMin + SESSION_DURATION_MINUTES;

    // find existing sessions for tutor and student on same date with pending/confirmed
    const dateObj = new Date(dateStr);
    const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const nextDay = new Date(dateOnly);
    nextDay.setDate(nextDay.getDate() + 1);

    const query = {
        date: { $gte: dateOnly, $lt: nextDay },
        status: { $in: ['pending', 'confirmed'] }
    };
    if (excludeSessionId) query._id = { $ne: excludeSessionId };

    const sessions = await Session.find(query).lean();

    for (const s of sessions) {
        // check tutor conflict
        if (String(s.tutor_id) === String(tutorId)) {
            const otherStart = parseTimeToMinutes(s.time);
            if (Number.isNaN(otherStart)) continue;
            const otherEnd = otherStart + SESSION_DURATION_MINUTES;
            // overlap if start < otherEnd && otherStart < end
            if (startMin < otherEnd && otherStart < endMin) {
                return { conflict: true, reason: 'tutor_conflict', session: s };
            }
        }
        // check student conflict
        if (String(s.student_id) === String(studentId)) {
            const otherStart = parseTimeToMinutes(s.time);
            if (Number.isNaN(otherStart)) continue;
            const otherEnd = otherStart + SESSION_DURATION_MINUTES;
            if (startMin < otherEnd && otherStart < endMin) {
                return { conflict: true, reason: 'student_conflict', session: s };
            }
        }
    }
    return { conflict: false };
}

// Create a new tutoring session
router.post('/', async (req, res) => {
    try {
        const { tutor_id, student_id, date, time, location } = req.body;

        // Validate input
        if (!tutor_id || !student_id || !date || !time) {
            return res.status(400).json({ message: 'tutor_id, student_id, date and time are required' });
        }

        // Check tutor availability
        const available = await isTutorAvailable(tutor_id, date, time);
        if (!available) {
            return res.status(400).json({
                message: 'Tutor is not available at this time'
            });
        }

        // Check for overlapping scheduling conflicts (tutor or student)
        const conflictCheck = await hasOverlapConflict({ tutorId: tutor_id, studentId: student_id, dateStr: date, timeStr: time });
        if (conflictCheck.conflict) {
            if (conflictCheck.reason === 'invalid_time') {
                return res.status(400).json({ message: 'Invalid time format' });
            }
            if (conflictCheck.reason === 'tutor_conflict') {
                return res.status(400).json({ message: 'Tutor already has a session that overlaps this time' });
            }
            if (conflictCheck.reason === 'student_conflict') {
                return res.status(400).json({ message: 'Student already has a session that overlaps this time' });
            }
        }

        const session = new Session({
            tutor_id,
            student_id,
            date,
            time,
            location,
            status: 'pending',
            statusHistory: [
                {
                    status: 'pending',
                    changedBy: student_id || null,
                    changedAt: new Date(),
                    note: 'Created'
                }
            ]
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

        const changedBy = req.body.changedBy || null; // optional user id who changed status
        const note = req.body.note || undefined;

        session.status = status;
        session.statusHistory = session.statusHistory || [];
        session.statusHistory.push({ status, changedBy, changedAt: new Date(), note });

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
            const newDate = date || session.date;
            const newTime = time || session.time;

            // Check tutor availability for new slot
            const available = await isTutorAvailable(session.tutor_id, newDate, newTime);
            if (!available) {
                return res.status(400).json({ message: 'Tutor is not available at the requested time' });
            }

            // Check overlapping conflicts excluding this session
            const conflictCheck = await hasOverlapConflict({ tutorId: session.tutor_id, studentId: session.student_id, dateStr: newDate, timeStr: newTime, excludeSessionId: session._id });
            if (conflictCheck.conflict) {
                if (conflictCheck.reason === 'invalid_time') {
                    return res.status(400).json({ message: 'Invalid time format' });
                }
                if (conflictCheck.reason === 'tutor_conflict') {
                    return res.status(400).json({ message: 'Tutor already has a session that overlaps this time' });
                }
                if (conflictCheck.reason === 'student_conflict') {
                    return res.status(400).json({ message: 'Student already has a session that overlaps this time' });
                }
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