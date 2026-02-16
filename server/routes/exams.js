const express = require('express');
const router = express.Router();
const { Exam } = require('../models');

// Get all exams
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.findAll();
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get exam by ID
router.get('/:id', async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Exam (Admin)
router.post('/', async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Active Status
router.put('/:id/toggle', async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        exam.is_active = !exam.is_active;
        await exam.save();
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Exam
router.put('/:id', async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        await exam.update(req.body);
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Exam
router.delete('/:id', async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        await exam.destroy();
        res.json({ message: 'Exam deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
