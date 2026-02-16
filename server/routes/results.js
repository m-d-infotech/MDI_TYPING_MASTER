const express = require('express');
const router = express.Router();
const { Result, User, Exam, Certificate } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Save Result
router.post('/', async (req, res) => {
    try {
        // expect user_id, wpm, accuracy, etc.
        const result = await Result.create(req.body);
        
        // Check for certificate eligibility if it's an exam
        if (result.mode === 'exam' && result.exam_id) {
            const exam = await Exam.findByPk(result.exam_id);
            if (exam && result.wpm >= exam.min_wpm && result.accuracy >= exam.min_accuracy) {
                // Determine if certificate already exists for this exam? maybe allow multiples.
                // Generate a certificate record
                const certCode = 'CERT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
                await Certificate.create({
                    user_id: result.user_id,
                    exam_id: result.exam_id,
                    wpm_recorded: result.wpm,
                    accuracy_recorded: result.accuracy,
                    certificate_code: certCode
                });
            }
        }

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Results by User
router.get('/user/:userId', async (req, res) => {
    try {
        const results = await Result.findAll({ 
            where: { user_id: req.params.userId },
            include: [Exam],
            order: [['createdAt', 'DESC']]
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Certificates
router.get('/certificates/:userId', async (req, res) => {
    try {
        const certs = await Certificate.findAll({
            where: { user_id: req.params.userId },
            include: [Exam]
        });
        res.json(certs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all results (Admin)
router.get('/', async (req, res) => {
    try {
        const results = await Result.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: Exam, attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Calculate Stats (Admin/User)
router.get('/stats', async (req, res) => {
    // Placeholder for more advanced stats
    res.json({ message: "Stats endpoint" });
});

// Download/Generate Certificate PDF
router.get('/certificate/:id/download', async (req, res) => {
    try {
        const cert = await Certificate.findByPk(req.params.id, {
            include: [User, Exam]
        });
        if (!cert) return res.status(404).json({ message: 'Certificate not found' });

        const doc = new PDFDocument({ layout: 'landscape' });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificate_${cert.certificate_code}.pdf`);

        doc.pipe(res);

        // Design the certificate
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f0f0');
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#333').lineWidth(5);
        
        doc.fontSize(40).fillColor('#333').text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text('This is to certify that', { align: 'center' });
        doc.moveDown();
        doc.fontSize(30).fillColor('#2563eb').text(cert.User.username.toUpperCase(), { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).fillColor('#333').text(`has successfully passed the typing exam: ${cert.Exam ? cert.Exam.title : 'Typing Test'}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(15).text(`WPM: ${cert.wpm_recorded}  |  Accuracy: ${cert.accuracy_recorded}%`, { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(12).text(`Date: ${cert.issue_date.toDateString()}`, { align: 'center' });
        doc.fontSize(10).text(`Certificate ID: ${cert.certificate_code}`, 50, 550);

        doc.end();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Leaderboard (Top 50 Users - Best Exam Score)
router.get('/leaderboard/top', async (req, res) => {
    try {
        // Fetch valid results (Exam or Practice), ordered by best performance
        const allResults = await Result.findAll({
            // where: { mode: 'exam' }, // Removed to include practice
            order: [
                ['wpm', 'DESC'],
                ['accuracy', 'DESC'],
                ['createdAt', 'DESC']
            ],
            include: [{
                model: User,
                attributes: ['username']
            }, {
                model: Exam,
                attributes: ['title']
            }, {
                model: Lesson,
                attributes: ['title']
            }]
        });

        // Filter for unique users (taking their top score since list is already sorted)
        const uniqueEntries = [];
        const seenUsers = new Set();

        for (const result of allResults) {
            if (!seenUsers.has(result.user_id)) {
                seenUsers.add(result.user_id);
                uniqueEntries.push(result);
            }
            if (uniqueEntries.length >= 50) break;
        }

        res.json(uniqueEntries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
