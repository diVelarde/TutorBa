const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tutor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be a whole number between 1 and 5'
        }
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Comment must be at least 10 characters long'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure one review per session per student
reviewSchema.index({ session_id: 1, student_id: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
reviewSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create index for efficient tutor rating queries
reviewSchema.index({ tutor_id: 1, rating: -1 });

// Virtual for calculating time since review
reviewSchema.virtual('reviewAge').get(function() {
    return Date.now() - this.createdAt;
});

// Static method to calculate average rating for a tutor and store it in TutorRating
reviewSchema.statics.calculateAverageRating = async function(tutorId) {
    const result = await this.aggregate([
        { $match: { tutor_id: mongoose.Types.ObjectId(tutorId) } },
        { $group: {
            _id: '$tutor_id',
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 }
        }}
    ]);

    const TutorRating = require('./TutorRating');

    if (result.length > 0) {
        const { averageRating, reviewCount } = result[0];
        await TutorRating.findOneAndUpdate(
            { tutor_id: tutorId },
            { averageRating: Number(averageRating.toFixed(2)), reviewCount },
            { upsert: true, new: true }
        );
    } else {
        // No reviews -> reset or remove entry
        await TutorRating.findOneAndUpdate(
            { tutor_id: tutorId },
            { averageRating: 0, reviewCount: 0 },
            { upsert: true, new: true }
        );
    }
};

// Post hooks to recalculate averages after changes
reviewSchema.post('save', function() {
    // this.constructor is the model
    this.constructor.calculateAverageRating(this.tutor_id).catch(err => console.error('Error calculating avg rating after save:', err));
});

// For findOneAndDelete / findOneAndRemove
reviewSchema.post('findOneAndDelete', function(doc) {
    if (doc) {
        // model is available via this.model
        this.model.calculateAverageRating(doc.tutor_id).catch(err => console.error('Error calculating avg rating after delete:', err));
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;