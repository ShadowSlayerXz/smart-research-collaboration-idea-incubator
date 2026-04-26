const Idea = require('../models/Idea');
const { validationResult } = require('express-validator');

const getIdeas = async (req, res) => {
  const { keyword, category, status, page = 1, limit = 9 } = req.query;
  const query = {};
  if (keyword) query.$or = [
    { title: { $regex: keyword, $options: 'i' } },
    { description: { $regex: keyword, $options: 'i' } },
    { tags: { $regex: keyword, $options: 'i' } },
  ];
  if (category) query.category = category;
  if (status) query.status = status;

  const total = await Idea.countDocuments(query);
  const ideas = await Idea.find(query)
    .populate('author', 'name email department avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ ideas, total, page: Number(page), pages: Math.ceil(total / limit) });
};

const getIdeaById = async (req, res) => {
  const idea = await Idea.findById(req.params.id)
    .populate('author', 'name email department avatar')
    .populate('collaborators', 'name email department avatar')
    .populate('interestedUsers', 'name email department avatar');
  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  res.json(idea);
};

const createIdea = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, category, tags, status } = req.body;
  const idea = await Idea.create({
    title, description, category,
    tags: tags || [],
    status: status || 'open',
    author: req.user._id,
  });
  res.status(201).json(idea);
};

const updateIdea = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  if (idea.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  const { title, description, category, tags, status } = req.body;
  idea.title = title ?? idea.title;
  idea.description = description ?? idea.description;
  idea.category = category ?? idea.category;
  idea.tags = tags ?? idea.tags;
  idea.status = status ?? idea.status;

  const updated = await idea.save();
  res.json(updated);
};

const deleteIdea = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  if (idea.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  await idea.deleteOne();
  res.json({ message: 'Idea removed' });
};

const expressInterest = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });

  const alreadyInterested = idea.interestedUsers.includes(req.user._id);
  if (alreadyInterested) {
    idea.interestedUsers = idea.interestedUsers.filter(
      (uid) => uid.toString() !== req.user._id.toString()
    );
  } else {
    idea.interestedUsers.push(req.user._id);
  }
  await idea.save();
  res.json({ interestedUsers: idea.interestedUsers });
};

const requestCollaborate = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });

  const alreadyCollaborating = idea.collaborators.includes(req.user._id);
  if (alreadyCollaborating) {
    idea.collaborators = idea.collaborators.filter(
      (uid) => uid.toString() !== req.user._id.toString()
    );
  } else {
    idea.collaborators.push(req.user._id);
  }
  await idea.save();
  res.json({ collaborators: idea.collaborators });
};

module.exports = { getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea, expressInterest, requestCollaborate };
