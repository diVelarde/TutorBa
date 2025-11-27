const mongoose = require('mongoose');

// Availability slots describe when a tutor can accept sessions.
// Each slot is a day-of-week (0=Sunday .. 6=Saturday) with start/end times in HH:MM (24h) format.
const availabilitySlotSchema = new mongoose.Schema({
    day: { type: Number, min: 0, max: 6, required: true },
    start: { type: String, required: true }, // '09:00'
    end: { type: String, required: true }    // '17:00'
});

const tutorAvailabilitySchema = new mongoose.Schema({
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    slots: { type: [availabilitySlotSchema], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

tutorAvailabilitySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const TutorAvailability = mongoose.model('TutorAvailability', tutorAvailabilitySchema);

module.exports = TutorAvailability;
