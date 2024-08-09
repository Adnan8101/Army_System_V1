const express = require('express');
const { Quotation } = require('../models/Order');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Create a new quotation
router.post('/', upload.single('quotationFile'), async (req, res) => {
    try {
        const quotationData = {
            orderId: req.body.orderId,
            wmName: req.body.wmName,
            email: req.body.email,
            summary: req.body.summary,
            filePath: req.file.path,
            status: 'Under Review'
        };
        const quotation = new Quotation(quotationData);
        await quotation.save();
        res.status(201).json(quotation);
    } catch (error) {
        res.status(400).json({ message: 'Error creating quotation', error });
    }
});

// Get all quotations
router.get('/', async (req, res) => {
    try {
        const quotations = await Quotation.find().populate('orderId');
        res.json(quotations);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching quotations', error });
    }
});

// Get specific quotation
router.get('/:id', async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id).populate('orderId');
        if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
        res.json(quotation);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching quotation', error });
    }
});


router.put('/update/:id', async (req, res) => {
    try {
        const quotation = await Quotation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
        res.json(quotation);
    } catch (error) {
        res.status(400).json({ message: 'Error updating quotation status', error });
    }
});

module.exports = router;
