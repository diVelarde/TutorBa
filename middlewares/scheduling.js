const TutorAvailability = require('../models/tutorAvailability');
const Session = require('../models/session');

const SESSION_DURATION_MINUTES = 60;

function parseTimeToMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return NaN;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return NaN;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
    return h * 60 + m;
}

async function isTutorAvailable(tutorId, dateStr, timeStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return false;
    const day = date.getDay();
    const slotTime = parseTimeToMinutes(timeStr);
    if (Number.isNaN(slotTime)) return false;
    const slotEnd = slotTime + SESSION_DURATION_MINUTES;

    const availability = await TutorAvailability.findOne({ tutor_id: tutorId }).lean();
    if (!availability || !availability.slots || availability.slots.length === 0) return false;

    for (const s of availability.slots) {
        if (s.day !== day) continue;
        const startMin = parseTimeToMinutes(s.start);
        const endMin = parseTimeToMinutes(s.end);
        if (Number.isNaN(startMin) || Number.isNaN(endMin)) continue;
        if (slotTime >= startMin && slotEnd <= endMin) return true;
    }
    return false;
}

async function hasOverlapConflict({ tutorId, studentId, dateStr, timeStr, excludeSessionId = null }) {
    const startMin = parseTimeToMinutes(timeStr);
    if (Number.isNaN(startMin)) return { conflict: true, reason: 'invalid_time' };
    const endMin = startMin + SESSION_DURATION_MINUTES;

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

module.exports = {
    parseTimeToMinutes,
    isTutorAvailable,
    hasOverlapConflict,
    SESSION_DURATION_MINUTES
};