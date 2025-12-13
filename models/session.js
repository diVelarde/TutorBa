import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const sessionSchema = new Schema({
    tutor_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student_id: {
        type: Schema.Types.ObjectId,
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
    statusHistory: {
        type: [
            {
                status: { type: String, enum: ['pending','confirmed','cancelled','completed'], required: true },
                changedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
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

// Update updatedAt timestamp before saving
sessionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Prevent OverwriteModelError
const Session = models.Session || model('Session', sessionSchema);

export default Session;
