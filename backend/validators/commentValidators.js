const { body } = require('express-validator');

const commentValidator = [
  body('text').trim().notEmpty().withMessage('Comment text is required'),
  body('ideaId').notEmpty().withMessage('Idea ID is required'),
];

module.exports = { commentValidator };
