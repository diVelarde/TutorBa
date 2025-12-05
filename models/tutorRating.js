const mongoose = require('mongoose');

const tutorRatingSchema = new mongoose.Schema({
    tutor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

tutorRatingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const TutorRating = mongoose.model('TutorRating', tutorRatingSchema);

module.exports = TutorRating;
