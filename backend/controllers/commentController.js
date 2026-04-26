const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

const getComments = async (req, res) => {
  const { ideaId } = req.query;
  const comments = await Comment.find({ idea: ideaId })
    .populate('author', 'name avatar department')
    .sort({ createdAt: 1 });
  res.json(comments);
};

const createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { text, ideaId } = req.body;
  const comment = await Comment.create({ text, idea: ideaId, author: req.user._id });
  const populated = await comment.populate('author', 'name avatar department');
  res.status(201).json(populated);
};

const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
};

module.exports = { getComments, createComment, deleteComment };
