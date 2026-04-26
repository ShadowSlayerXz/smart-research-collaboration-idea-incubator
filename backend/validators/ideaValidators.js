const { body } = require('express-validator');

const ideaValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .isIn(['Tech', 'Business', 'Social', 'Science', 'Art', 'Other'])
    .withMessage('Invalid category'),
];

module.exports = { ideaValidator };
