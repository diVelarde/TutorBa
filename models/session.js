const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    tutor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    // Track status changes over time
    statusHistory: {
        type: [
            {
                status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], required: true },
                changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
                changedAt: { type: Date, default: Date.now },
                note: { type: String }
            }
        ],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
sessionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;