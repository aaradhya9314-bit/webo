import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address,
  wishlist: user.wishlist
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ user: sanitizeUser(user), token: generateToken(user._id) });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({ user: sanitizeUser(user), token: generateToken(user._id) });
    return;
  }

  res.status(401);
  throw new Error('Invalid email or password');
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name ?? user.name;
  user.address = req.body.address ?? user.address;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();
  res.json({ user: sanitizeUser(updated), token: generateToken(updated._id) });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const exists = user.wishlist.some((id) => id.toString() === productId);

  user.wishlist = exists
    ? user.wishlist.filter((id) => id.toString() !== productId)
    : [...user.wishlist, productId];

  await user.save();
  res.json({ wishlist: user.wishlist });
});

