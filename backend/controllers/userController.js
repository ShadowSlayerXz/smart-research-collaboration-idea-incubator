const User = require('../models/User');
const Idea = require('../models/Idea');

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  const ideas = await Idea.find({ author: user._id }).sort({ createdAt: -1 });
  res.json({ user, ideas });
};

const updateUserProfile = async (req, res) => {
  if (req.params.id !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, bio, department, avatar } = req.body;
  user.name = name ?? user.name;
  user.bio = bio ?? user.bio;
  user.department = department ?? user.department;
  user.avatar = avatar ?? user.avatar;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    bio: updated.bio,
    department: updated.department,
    avatar: updated.avatar,
  });
};

module.exports = { getUserProfile, updateUserProfile };
