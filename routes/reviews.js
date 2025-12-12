const express = require('express');
const router = express.Router();
const Review = require('./models/Review');
const Session = require('./models/Session');

const validators = require('../middlewares/validators');
const reviewChecks = require('../middlewares/reviewChecks');

// Submit a new review
router.post('/',
    validators.requireBodyFields(['student_id','tutor_id','session_id','rating','comment']),
    validators.validateBodyObjectIds(['student_id','tutor_id','session_id']),
    reviewChecks.ensureSessionCompletedAndNoReview,
    async (req, res) => {
    try {
        const { student_id, tutor_id, session_id, rating, comment } = req.body;

        // Create and save the review
        const review = new Review({
            student_id,
            tutor_id,
            session_id,
            rating,
            comment
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating review', 
            error: error.message 
        });
    }
});

// Get all reviews for a specific tutor
router.get('/tutor/:tutorId', async (req, res) => {
    try {
        const reviews = await Review.find({ tutor_id: req.params.tutorId })
            .populate('student_id', 'name') // Only get student's name
            .populate('session_id', 'date')
            .sort({ createdAt: -1 }); // Most recent first

        // Calculate average rating
        const averageRating = reviews.reduce((acc, review) => 
            acc + review.rating, 0) / (reviews.length || 1);

        res.json({
            reviews,
            totalReviews: reviews.length,
            averageRating: parseFloat(averageRating.toFixed(1))
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching reviews', 
            error: error.message 
        });
    }
});

// Get a specific review by ID
router.get('/:reviewId', async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId)
            .populate('student_id', 'name')
            .populate('tutor_id', 'name')
            .populate('session_id');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json(review);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching review', 
            error: error.message 
        });
    }
});

// Get all reviews by a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const reviews = await Review.find({ student_id: req.params.studentId })
            .populate('tutor_id', 'name')
            .populate('session_id', 'date')
            .sort({ createdAt: -1 });

        res.json({
            reviews,
            totalReviews: reviews.length
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching student reviews', 
            error: error.message 
        });
    }
});

module.exports = router;