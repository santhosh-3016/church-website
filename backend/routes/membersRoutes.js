const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');

// Get all members
router.get('/', membersController.getAllMembers);

// Add new member
router.post('/', membersController.addMember);

// Update member
router.put('/:id', membersController.updateMember);

// Delete member
router.delete('/:id', membersController.deleteMember);

module.exports = router;
