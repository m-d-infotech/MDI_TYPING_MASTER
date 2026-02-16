const express = require('express');
const router = express.Router();
const { Lesson } = require('../models');

// Get all lessons
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.findAll();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get lesson by ID
router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Lesson (Admin)
router.post('/', async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);
        res.status(201).json(lesson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Lesson
router.put('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        await lesson.update(req.body);
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Lesson
router.delete('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        await lesson.destroy();
        res.json({ message: 'Lesson deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
