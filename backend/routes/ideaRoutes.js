const express = require('express');
const router = express.Router();
const {
  getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea,
  expressInterest, requestCollaborate,
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');
const { ideaValidator } = require('../validators/ideaValidators');

router.get('/', getIdeas);
router.post('/', protect, ideaValidator, createIdea);
router.get('/:id', getIdeaById);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);
router.post('/:id/interest', protect, expressInterest);
router.post('/:id/collaborate', protect, requestCollaborate);

module.exports = router;
