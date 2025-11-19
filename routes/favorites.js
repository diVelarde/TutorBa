const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');

// Add a tutor to student's favorites
router.post('/', async (req, res) => {
    try {
        const { student_id, tutor_id } = req.body;
        if (!student_id || !tutor_id) {
            return res.status(400).json({ message: 'student_id and tutor_id are required' });
        }

        // Prevent duplicate favorites
        const existing = await Favorite.findOne({ student_id, tutor_id });
        if (existing) {
            return res.status(409).json({ message: 'Tutor already in favorites' });
        }

        const favorite = new Favorite({ student_id, tutor_id });
        await favorite.save();

        res.status(201).json(favorite);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate favorite' });
        }
        res.status(500).json({ message: 'Error adding favorite', error: error.message });
    }
});

// Remove a favorite by IDs (body) or by favorite id param
router.delete('/', async (req, res) => {
    try {
        const { student_id, tutor_id } = req.body;
        if (!student_id || !tutor_id) {
            return res.status(400).json({ message: 'student_id and tutor_id are required' });
        }

        const removed = await Favorite.findOneAndDelete({ student_id, tutor_id });
        if (!removed) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.json({ message: 'Favorite removed', favorite: removed });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error: error.message });
    }
});

// Alternative: delete by favorite id
router.delete('/:favoriteId', async (req, res) => {
    try {
        const removed = await Favorite.findByIdAndDelete(req.params.favoriteId);
        if (!removed) return res.status(404).json({ message: 'Favorite not found' });
        res.json({ message: 'Favorite removed', favorite: removed });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error: error.message });
    }
});

// Get all favorites for a student (return tutor info populated)
router.get('/student/:studentId', async (req, res) => {
    try {
        const favorites = await Favorite.find({ student_id: req.params.studentId })
            .populate('tutor_id', 'name email')
            .sort({ createdAt: -1 });

        const tutors = favorites.map(f => ({
            favorite_id: f._id,
            tutor: f.tutor_id,
            savedAt: f.createdAt
        }));

        res.json({ total: tutors.length, tutors });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error: error.message });
    }
});

// Get a specific favorite
router.get('/:favoriteId', async (req, res) => {
    try {
        const fav = await Favorite.findById(req.params.favoriteId)
            .populate('student_id', 'name')
            .populate('tutor_id', 'name email');
        if (!fav) return res.status(404).json({ message: 'Favorite not found' });
        res.json(fav);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorite', error: error.message });
    }
});

module.exports = router;