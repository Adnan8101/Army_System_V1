const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');

router.get('/pending-registrations', officerController.getPendingRegistrations);
router.post('/approve-user', officerController.approveUser);
router.post('/reject-user', officerController.rejectUser);

module.exports = router;
