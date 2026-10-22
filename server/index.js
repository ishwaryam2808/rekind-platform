import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, saveDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'rekind_super_secure_jwt_secret_2026';

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Auth Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token. Please sign in again.' });
  }
}

// Optional Auth (for endpoints that can return customized data if logged in)
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Ignore invalid token in optional auth
    }
  }
  next();
}

// Helper to generate IDs
function genId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, location, password, confirmPassword, avatar } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const db = getDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = {
    id: genId('usr'),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    phone: phone ? phone.trim() : '',
    location: location ? location.trim() : 'Local Community Member',
    avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=e6ddd2,c2a68c,9a634b`,
    bio: 'Proud to be part of the REKIND community. Looking to share unused resources and make things go further.',
    badges: ['Community Pioneer', 'Verified Member'],
    trustScore: 100,
    itemsSharedCount: 0,
    itemsReceivedCount: 0,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

  // Do not expose passwordHash
  const { passwordHash: _, ...userSafe } = newUser;
  res.status(201).json({ token, user: userSafe, message: 'Account created successfully!' });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const matches = bcrypt.compareSync(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash: _, ...userSafe } = user;
  res.json({ token, user: userSafe });
});

// Current User (Me)
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { passwordHash: _, ...userSafe } = user;
  res.json({ user: userSafe });
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const { name, phone, location, bio, avatar } = req.body;
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const user = db.users[userIndex];
  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (location) user.location = location.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatar) user.avatar = avatar;

  // Also update ownerName / ownerAvatar on active items for consistency
  db.items.forEach(item => {
    if (item.ownerId === req.user.id) {
      if (name) item.ownerName = name.trim();
      if (avatar) item.ownerAvatar = avatar;
      if (location) item.ownerLocation = location.trim();
    }
  });

  saveDb(db);
  const { passwordHash: _, ...userSafe } = user;
  res.json({ user: userSafe, message: 'Profile updated successfully.' });
});

// Change Password
app.put('/api/auth/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  if (confirmNewPassword && newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New passwords do not match.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const matches = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!matches) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(newPassword, salt);
  saveDb(db);

  res.json({ message: 'Password changed successfully.' });
});

// -------------------------------------------------------------
// ITEMS & MARKETPLACE ROUTES
// -------------------------------------------------------------

// List Items with Filters & Search
app.get('/api/items', optionalAuth, (req, res) => {
  const db = getDb();
  let items = [...db.items];

  const { search, category, type, condition, location, status, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

  // Filter by status (default to available + reserved, unless explicitly queried)
  if (status && status !== 'all') {
    items = items.filter(i => i.status === status);
  } else if (!status) {
    // Show available and reserved on general marketplace
    items = items.filter(i => i.status === 'available' || i.status === 'reserved');
  }

  // Filter by category
  if (category && category !== 'All' && category !== 'all') {
    items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by sharing method
  if (type && type !== 'All' && type !== 'all') {
    items = items.filter(i => i.type.toLowerCase() === type.toLowerCase());
  }

  // Filter by condition
  if (condition && condition !== 'All' && condition !== 'all') {
    items = items.filter(i => i.condition.toLowerCase() === condition.toLowerCase());
  }

  // Filter by location
  if (location && location !== 'All' && location !== 'all') {
    items = items.filter(i => i.location.toLowerCase().includes(location.toLowerCase()));
  }

  // Filter by price range
  if (minPrice !== undefined && minPrice !== '') {
    items = items.filter(i => Number(i.price) >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    items = items.filter(i => Number(i.price) <= Number(maxPrice));
  }

  // Search keyword in title, description, and tags
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.tags && i.tags.some(t => t.toLowerCase().includes(q))) ||
      i.category.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'price_asc') {
    items.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price_desc') {
    items.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === 'views') {
    items.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    // default: newest
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = items.length;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedItems = items.slice(startIndex, startIndex + limitNum);

  // Check user favorites if logged in
  let userFavorites = [];
  if (req.user) {
    userFavorites = db.favorites.filter(f => f.userId === req.user.id).map(f => f.itemId);
  }

  const itemsWithFav = paginatedItems.map(item => ({
    ...item,
    isFavorite: userFavorites.includes(item.id)
  }));

  res.json({
    items: itemsWithFav,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    hasMore: startIndex + limitNum < total
  });
});

// Single Item Detail
app.get('/api/items/:id', optionalAuth, (req, res) => {
  const db = getDb();
  const item = db.items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  // Increment views
  item.views = (item.views || 0) + 1;
  saveDb(db);

  // Fetch full owner profile
  const owner = db.users.find(u => u.id === item.ownerId);
  const ownerSafe = owner ? {
    id: owner.id,
    name: owner.name,
    avatar: owner.avatar,
    location: owner.location,
    bio: owner.bio,
    badges: owner.badges,
    trustScore: owner.trustScore,
    itemsSharedCount: owner.itemsSharedCount,
    itemsReceivedCount: owner.itemsReceivedCount,
    memberSince: owner.createdAt
  } : null;

  // Check if saved as favorite
  const isFavorite = req.user ? db.favorites.some(f => f.userId === req.user.id && f.itemId === item.id) : false;

  // Check if current user has an active pending or accepted request for this item
  let userRequest = null;
  if (req.user) {
    userRequest = db.itemRequests.find(r => r.itemId === item.id && r.requesterId === req.user.id && (r.status === 'pending' || r.status === 'accepted'));
  }

  // Related items in the same category
  const relatedItems = db.items
    .filter(i => i.category === item.category && i.id !== item.id && i.status === 'available')
    .slice(0, 4);

  res.json({
    item: {
      ...item,
      isFavorite,
      userRequest
    },
    owner: ownerSafe,
    relatedItems
  });
});

// Post a new Item
app.post('/api/items', authMiddleware, (req, res) => {
  const {
    title,
    category,
    description,
    condition,
    type,
    price,
    lendingDuration,
    exchangePreferences,
    quantity,
    location,
    images,
    tags,
    safetyNotes
  } = req.body;

  if (!title || !category || !description || !condition || !type) {
    return res.status(400).json({ error: 'Title, category, description, condition, and sharing type are required.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const isFree = type === 'donate' || type === 'lend' || type === 'exchange';
  const numericPrice = type === 'sell' ? (Number(price) || 0) : 0;

  const validImages = Array.isArray(images) && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  ];

  const newItem = {
    id: genId('item'),
    title: title.trim(),
    category,
    description: description.trim(),
    condition,
    type,
    price: numericPrice,
    isFree,
    lendingDuration: lendingDuration ? lendingDuration.trim() : '',
    exchangePreferences: exchangePreferences ? exchangePreferences.trim() : '',
    quantity: Number(quantity) || 1,
    location: location ? location.trim() : user.location,
    images: validImages,
    ownerId: user.id,
    ownerName: user.name,
    ownerAvatar: user.avatar,
    ownerTrustScore: user.trustScore,
    ownerLocation: user.location,
    status: 'available',
    views: 1,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    safetyNotes: safetyNotes ? safetyNotes.trim() : 'Please inspect item during daytime in a comfortable public space.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.items.unshift(newItem);
  saveDb(db);

  res.status(201).json({ item: newItem, message: 'Your listing is live!' });
});

// Update Item
app.put('/api/items/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const itemIndex = db.items.findIndex(i => i.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const item = db.items[itemIndex];
  if (item.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own listings.' });
  }

  const fields = ['title', 'category', 'description', 'condition', 'type', 'price', 'lendingDuration', 'exchangePreferences', 'quantity', 'location', 'images', 'status', 'safetyNotes', 'tags'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      item[f] = req.body[f];
    }
  });

  if (item.type !== 'sell') {
    item.price = 0;
    item.isFree = true;
  }

  item.updatedAt = new Date().toISOString();
  saveDb(db);

  res.json({ item, message: 'Item listing updated.' });
});

// Delete Item
app.delete('/api/items/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const itemIndex = db.items.findIndex(i => i.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  if (db.items[itemIndex].ownerId !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own listings.' });
  }

  db.items.splice(itemIndex, 1);
  saveDb(db);

  res.json({ message: 'Item listing deleted.' });
});

// Toggle Favorite
app.post('/api/items/:id/favorite', authMiddleware, (req, res) => {
  const db = getDb();
  const itemId = req.params.id;
  const userId = req.user.id;

  const existingIndex = db.favorites.findIndex(f => f.userId === userId && f.itemId === itemId);
  let isFavorite = false;
  if (existingIndex > -1) {
    db.favorites.splice(existingIndex, 1);
    isFavorite = false;
  } else {
    db.favorites.push({ userId, itemId });
    isFavorite = true;
  }

  saveDb(db);
  res.json({ isFavorite, message: isFavorite ? 'Saved to favorites' : 'Removed from favorites' });
});

// Get User Favorites
app.get('/api/favorites', authMiddleware, (req, res) => {
  const db = getDb();
  const userFavIds = db.favorites.filter(f => f.userId === req.user.id).map(f => f.itemId);
  const favItems = db.items.filter(i => userFavIds.includes(i.id)).map(i => ({ ...i, isFavorite: true }));
  res.json({ items: favItems });
});

// -------------------------------------------------------------
// REQUESTS & WORKFLOW ROUTES
// -------------------------------------------------------------

// Create Item Request
app.post('/api/requests', authMiddleware, (req, res) => {
  const { itemId, message, meetupPreference, requestType, proposedExchange, borrowDuration } = req.body;
  if (!itemId) {
    return res.status(400).json({ error: 'Item ID is required.' });
  }

  const db = getDb();
  const item = db.items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  // Prevent users from requesting their own listings
  if (item.ownerId === req.user.id) {
    return res.status(400).json({ error: 'You cannot request your own item listing.' });
  }

  // Prevent duplicate active requests
  const existingActive = db.itemRequests.find(r =>
    r.itemId === itemId &&
    r.requesterId === req.user.id &&
    (r.status === 'pending' || r.status === 'accepted')
  );
  if (existingActive) {
    return res.status(400).json({ error: 'You already have an active request for this item.' });
  }

  const requester = db.users.find(u => u.id === req.user.id);

  const newRequest = {
    id: genId('req'),
    itemId: item.id,
    itemTitle: item.title,
    itemImage: item.images[0] || '',
    itemType: item.type,
    requesterId: req.user.id,
    requesterName: requester.name,
    requesterAvatar: requester.avatar,
    ownerId: item.ownerId,
    requestType: requestType || item.type,
    proposedExchange: proposedExchange || '',
    borrowDuration: borrowDuration || '',
    message: message ? message.trim() : `Hi ${item.ownerName}, I would love to request this item!`,
    status: 'pending',
    meetupPreference: meetupPreference || 'Public community spot',
    createdAt: new Date().toISOString()
  };

  db.itemRequests.unshift(newRequest);

  // Notify Owner
  db.notifications.unshift({
    id: genId('notif'),
    userId: item.ownerId,
    title: 'New Item Request',
    message: `${requester.name} has requested "${item.title}".`,
    type: 'request_received',
    link: '/my-activity',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  // Automatically start or find conversation
  let conv = db.conversations.find(c =>
    c.participants.includes(req.user.id) &&
    c.participants.includes(item.ownerId) &&
    c.itemId === item.id
  );

  if (!conv) {
    const owner = db.users.find(u => u.id === item.ownerId);
    conv = {
      id: genId('conv'),
      participants: [req.user.id, item.ownerId],
      participantDetails: {
        [req.user.id]: { name: requester.name, avatar: requester.avatar, location: requester.location },
        [item.ownerId]: { name: owner.name, avatar: owner.avatar, location: owner.location }
      },
      itemId: item.id,
      itemTitle: item.title,
      lastMessage: newRequest.message,
      lastMessageAt: new Date().toISOString(),
      unreadCount: { [req.user.id]: 0, [item.ownerId]: 1 },
      messages: [
        {
          id: genId('msg'),
          senderId: req.user.id,
          senderName: requester.name,
          text: newRequest.message,
          createdAt: new Date().toISOString(),
          isRead: false
        }
      ]
    };
    db.conversations.unshift(conv);
  }

  saveDb(db);

  res.status(201).json({ request: newRequest, message: 'Request submitted successfully!' });
});

// Get User's Activity (Listings, Sent Requests, Received Requests, Completed)
app.get('/api/activity', authMiddleware, (req, res) => {
  const db = getDb();
  const userId = req.user.id;

  const myListings = db.items.filter(i => i.ownerId === userId);
  const sentRequests = db.itemRequests.filter(r => r.requesterId === userId);
  const receivedRequests = db.itemRequests.filter(r => r.ownerId === userId);
  const myTransfers = db.transfers.filter(t => t.fromUserId === userId || t.toUserId === userId);

  res.json({
    myListings,
    sentRequests,
    receivedRequests,
    myTransfers
  });
});

// Update Request Status (Accept, Decline, Complete)
app.patch('/api/requests/:id', authMiddleware, (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'declined', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid request status.' });
  }

  const db = getDb();
  const request = db.itemRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found.' });
  }

  const isOwner = request.ownerId === req.user.id;
  const isRequester = request.requesterId === req.user.id;

  if (!isOwner && !isRequester) {
    return res.status(403).json({ error: 'Unauthorized to update this request.' });
  }

  // Only owner can accept or decline
  if ((status === 'accepted' || status === 'declined') && !isOwner) {
    return res.status(403).json({ error: 'Only the item owner can accept or decline a request.' });
  }

  request.status = status;

  const item = db.items.find(i => i.id === request.itemId);

  if (status === 'accepted') {
    if (item) {
      item.status = 'reserved';
    }
    // Notify requester
    db.notifications.unshift({
      id: genId('notif'),
      userId: request.requesterId,
      title: 'Request Accepted!',
      message: `Your request for "${request.itemTitle}" was accepted. Connect to arrange pickup.`,
      type: 'request_accepted',
      link: '/messages',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  } else if (status === 'declined') {
    if (item && item.status === 'reserved') {
      item.status = 'available';
    }
    // Notify requester
    db.notifications.unshift({
      id: genId('notif'),
      userId: request.requesterId,
      title: 'Request Update',
      message: `Your request for "${request.itemTitle}" was declined. Keep exploring other community items!`,
      type: 'request_declined',
      link: '/marketplace',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  } else if (status === 'completed') {
    // Both owner or requester can confirm transfer completion
    if (item) {
      item.status = 'completed';
    }

    // Estimate realistic weight & replacement value based on category
    const categoryWeights = {
      'Books and Education': 1.2,
      'Electronics': 2.5,
      'Clothing and Accessories': 0.8,
      'Furniture and Home': 14.0,
      'Kitchen Essentials': 3.2,
      'Sports and Fitness': 2.8,
      'Toys and Games': 1.5,
      'Stationery': 0.5,
      'Other Reusable Items': 2.0
    };

    const categoryValues = {
      'Books and Education': 75,
      'Electronics': 120,
      'Clothing and Accessories': 45,
      'Furniture and Home': 130,
      'Kitchen Essentials': 55,
      'Sports and Fitness': 60,
      'Toys and Games': 35,
      'Stationery': 20,
      'Other Reusable Items': 40
    };

    const cat = item ? item.category : 'Other Reusable Items';
    const weightKg = categoryWeights[cat] || 2.0;
    const valueSaved = (item && item.price > 0) ? (item.price * 1.5) : (categoryValues[cat] || 50);

    // Record verified transfer in ledger!
    const transferRecord = {
      id: genId('tx'),
      itemId: request.itemId,
      itemTitle: request.itemTitle,
      category: cat,
      sharingType: request.itemType || 'donate',
      fromUserId: request.ownerId,
      toUserId: request.requesterId,
      weightKgEstimated: weightKg,
      valueSavedEstimated: valueSaved,
      completedAt: new Date().toISOString()
    };
    db.transfers.unshift(transferRecord);

    // Increment user impact counters
    const owner = db.users.find(u => u.id === request.ownerId);
    const requester = db.users.find(u => u.id === request.requesterId);
    if (owner) owner.itemsSharedCount = (owner.itemsSharedCount || 0) + 1;
    if (requester) requester.itemsReceivedCount = (requester.itemsReceivedCount || 0) + 1;

    // Notify both
    const otherUserId = isOwner ? request.requesterId : request.ownerId;
    db.notifications.unshift({
      id: genId('notif'),
      userId: otherUserId,
      title: 'Item Handover Complete! 🌟',
      message: `The transfer of "${request.itemTitle}" has been verified. Thank you for giving things a second life!`,
      type: 'transfer_completed',
      link: '/impact',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  saveDb(db);
  res.json({ request, message: `Request marked as ${status}.` });
});

// -------------------------------------------------------------
// COMMUNITY NEEDS ROUTES
// -------------------------------------------------------------

// List Community Needs
app.get('/api/community-needs', (req, res) => {
  const db = getDb();
  let needs = [...db.communityNeeds];

  const { search, category, urgency, status } = req.query;

  if (status && status !== 'all') {
    needs = needs.filter(n => n.status === status);
  } else if (!status) {
    needs = needs.filter(n => n.status === 'open');
  }

  if (category && category !== 'All' && category !== 'all') {
    needs = needs.filter(n => n.category.toLowerCase() === category.toLowerCase());
  }

  if (urgency && urgency !== 'All' && urgency !== 'all') {
    needs = needs.filter(n => n.urgency.toLowerCase() === urgency.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    needs = needs.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.location.toLowerCase().includes(q)
    );
  }

  // Sort: Critical first, then High, then Newest
  const urgencyWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  needs.sort((a, b) => {
    const uDiff = (urgencyWeight[b.urgency] || 1) - (urgencyWeight[a.urgency] || 1);
    if (uDiff !== 0) return uDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json({ needs });
});

// Post a Community Need
app.post('/api/community-needs', authMiddleware, (req, res) => {
  const { title, description, category, quantity, location, urgency } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const newNeed = {
    id: genId('need'),
    title: title.trim(),
    description: description.trim(),
    category,
    quantity: Number(quantity) || 1,
    location: location ? location.trim() : user.location,
    urgency: urgency || 'Medium',
    requesterId: user.id,
    requesterName: user.name,
    requesterAvatar: user.avatar,
    status: 'open',
    offersCount: 0,
    createdAt: new Date().toISOString()
  };

  db.communityNeeds.unshift(newNeed);
  saveDb(db);

  res.status(201).json({ need: newNeed, message: 'Community request published!' });
});

// Offer an Item in Response to a Need
app.post('/api/community-needs/:id/offer', authMiddleware, (req, res) => {
  const { message, linkedItemId } = req.body;
  const db = getDb();
  const need = db.communityNeeds.find(n => n.id === req.params.id);
  if (!need) {
    return res.status(404).json({ error: 'Need request not found.' });
  }

  if (need.requesterId === req.user.id) {
    return res.status(400).json({ error: 'You cannot offer an item to your own request.' });
  }

  const offerer = db.users.find(u => u.id === req.user.id);

  const newOffer = {
    id: genId('off'),
    needId: need.id,
    offererId: offerer.id,
    offererName: offerer.name,
    offererAvatar: offerer.avatar,
    linkedItemId: linkedItemId || null,
    message: message ? message.trim() : `Hello ${need.requesterName}, I have something that can help you with this!`,
    createdAt: new Date().toISOString()
  };

  db.communityNeedOffers.unshift(newOffer);
  need.offersCount = (need.offersCount || 0) + 1;

  // Notify Need Requester
  db.notifications.unshift({
    id: genId('notif'),
    userId: need.requesterId,
    title: 'New Offer for Your Need',
    message: `${offerer.name} offered to help with "${need.title}".`,
    type: 'need_offer',
    link: '/messages',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  // Start conversation between offerer and requester
  let conv = db.conversations.find(c =>
    c.participants.includes(req.user.id) &&
    c.participants.includes(need.requesterId)
  );

  const offerText = `[Community Need: "${need.title}"]\n${newOffer.message}`;

  if (conv) {
    conv.messages.push({
      id: genId('msg'),
      senderId: req.user.id,
      senderName: offerer.name,
      text: offerText,
      createdAt: new Date().toISOString(),
      isRead: false
    });
    conv.lastMessage = offerText;
    conv.lastMessageAt = new Date().toISOString();
    conv.unreadCount[need.requesterId] = (conv.unreadCount[need.requesterId] || 0) + 1;
  } else {
    conv = {
      id: genId('conv'),
      participants: [req.user.id, need.requesterId],
      participantDetails: {
        [req.user.id]: { name: offerer.name, avatar: offerer.avatar, location: offerer.location },
        [need.requesterId]: { name: need.requesterName, avatar: need.requesterAvatar, location: need.location }
      },
      itemId: linkedItemId || null,
      itemTitle: need.title,
      lastMessage: offerText,
      lastMessageAt: new Date().toISOString(),
      unreadCount: { [req.user.id]: 0, [need.requesterId]: 1 },
      messages: [
        {
          id: genId('msg'),
          senderId: req.user.id,
          senderName: offerer.name,
          text: offerText,
          createdAt: new Date().toISOString(),
          isRead: false
        }
      ]
    };
    db.conversations.unshift(conv);
  }

  saveDb(db);

  res.status(201).json({ offer: newOffer, message: 'Your offer was sent to the requester!' });
});

// -------------------------------------------------------------
// CONVERSATIONS & MESSAGES ROUTES
// -------------------------------------------------------------

// List Conversations
app.get('/api/conversations', authMiddleware, (req, res) => {
  const db = getDb();
  const userId = req.user.id;

  const userConversations = db.conversations
    .filter(c => c.participants.includes(userId))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  res.json({ conversations: userConversations });
});

// Get Single Conversation
app.get('/api/conversations/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const userId = req.user.id;
  const conv = db.conversations.find(c => c.id === req.params.id && c.participants.includes(userId));
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }

  // Mark unread messages as read for this user
  if (conv.unreadCount && conv.unreadCount[userId] > 0) {
    conv.unreadCount[userId] = 0;
  }
  conv.messages.forEach(m => {
    if (m.senderId !== userId) m.isRead = true;
  });

  saveDb(db);
  res.json({ conversation: conv });
});

// Send Message in Conversation
app.post('/api/conversations/:id/messages', authMiddleware, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const db = getDb();
  const userId = req.user.id;
  const conv = db.conversations.find(c => c.id === req.params.id && c.participants.includes(userId));
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }

  const sender = db.users.find(u => u.id === userId);
  const recipientId = conv.participants.find(p => p !== userId);

  const newMsg = {
    id: genId('msg'),
    senderId: userId,
    senderName: sender.name,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    isRead: false
  };

  conv.messages.push(newMsg);
  conv.lastMessage = newMsg.text;
  conv.lastMessageAt = newMsg.createdAt;
  conv.unreadCount[recipientId] = (conv.unreadCount[recipientId] || 0) + 1;

  // Notification for recipient
  db.notifications.unshift({
    id: genId('notif'),
    userId: recipientId,
    title: `New message from ${sender.name}`,
    message: newMsg.text.length > 60 ? `${newMsg.text.slice(0, 57)}...` : newMsg.text,
    type: 'message_received',
    link: '/messages',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
  res.status(201).json({ message: newMsg, conversation: conv });
});

// Start new conversation or find existing
app.post('/api/conversations/start', authMiddleware, (req, res) => {
  const { recipientId, itemId, initialMessage } = req.body;
  if (!recipientId) {
    return res.status(400).json({ error: 'Recipient ID is required.' });
  }

  if (recipientId === req.user.id) {
    return res.status(400).json({ error: 'You cannot message yourself.' });
  }

  const db = getDb();
  const sender = db.users.find(u => u.id === req.user.id);
  const recipient = db.users.find(u => u.id === recipientId);
  if (!recipient) {
    return res.status(404).json({ error: 'Recipient user not found.' });
  }

  const item = itemId ? db.items.find(i => i.id === itemId) : null;

  let conv = db.conversations.find(c =>
    c.participants.includes(req.user.id) &&
    c.participants.includes(recipientId) &&
    (!itemId || c.itemId === itemId)
  );

  if (!conv) {
    const firstText = initialMessage || `Hi ${recipient.name}, I'm reaching out regarding your listing on REKIND!`;
    conv = {
      id: genId('conv'),
      participants: [req.user.id, recipientId],
      participantDetails: {
        [req.user.id]: { name: sender.name, avatar: sender.avatar, location: sender.location },
        [recipientId]: { name: recipient.name, avatar: recipient.avatar, location: recipient.location }
      },
      itemId: item ? item.id : null,
      itemTitle: item ? item.title : '',
      lastMessage: firstText,
      lastMessageAt: new Date().toISOString(),
      unreadCount: { [req.user.id]: 0, [recipientId]: 1 },
      messages: [
        {
          id: genId('msg'),
          senderId: req.user.id,
          senderName: sender.name,
          text: firstText,
          createdAt: new Date().toISOString(),
          isRead: false
        }
      ]
    };
    db.conversations.unshift(conv);
    saveDb(db);
  }

  res.json({ conversation: conv });
});

// -------------------------------------------------------------
// NOTIFICATIONS ROUTES
// -------------------------------------------------------------

app.get('/api/notifications', authMiddleware, (req, res) => {
  const db = getDb();
  const userNotifs = db.notifications.filter(n => n.userId === req.user.id);
  const unreadCount = userNotifs.filter(n => !n.isRead).length;
  res.json({ notifications: userNotifs, unreadCount });
});

app.patch('/api/notifications/:id/read', authMiddleware, (req, res) => {
  const db = getDb();
  const notif = db.notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
  if (notif) {
    notif.isRead = true;
    saveDb(db);
  }
  res.json({ message: 'Marked as read' });
});

app.patch('/api/notifications/read-all', authMiddleware, (req, res) => {
  const db = getDb();
  db.notifications.forEach(n => {
    if (n.userId === req.user.id) n.isRead = true;
  });
  saveDb(db);
  res.json({ message: 'All notifications marked as read' });
});

// -------------------------------------------------------------
// VERIFIED IMPACT DASHBOARD
// -------------------------------------------------------------

app.get('/api/impact', (req, res) => {
  const db = getDb();
  const transfers = db.transfers || [];

  // Calculate strict verified statistics based ONLY on actual completed transfers
  const totalTransfers = transfers.length;
  const wasteDivertedKg = transfers.reduce((acc, t) => acc + (t.weightKgEstimated || 0), 0);
  const economicValueSaved = transfers.reduce((acc, t) => acc + (t.valueSavedEstimated || 0), 0);
  const co2DivertedKg = parseFloat((wasteDivertedKg * 2.15).toFixed(1)); // 2.15 kg CO2e saved per kg reused goods

  // Collect distinct users who gave or received in the ledger
  const uniqueUsers = new Set();
  transfers.forEach(t => {
    if (t.fromUserId) uniqueUsers.add(t.fromUserId);
    if (t.toUserId) uniqueUsers.add(t.toUserId);
  });
  const uniqueParticipants = uniqueUsers.size;

  // Breakdown by category
  const categoryStats = {};
  transfers.forEach(t => {
    const cat = t.category || 'Other Reusable Items';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { count: 0, weightKg: 0, valueSaved: 0 };
    }
    categoryStats[cat].count += 1;
    categoryStats[cat].weightKg += (t.weightKgEstimated || 0);
    categoryStats[cat].valueSaved += (t.valueSavedEstimated || 0);
  });

  // Breakdown by sharing type
  const typeCounts = { donate: 0, lend: 0, exchange: 0, sell: 0 };
  transfers.forEach(t => {
    const type = (t.sharingType || 'donate').toLowerCase();
    if (typeCounts[type] !== undefined) {
      typeCounts[type] += 1;
    } else {
      typeCounts.donate += 1;
    }
  });

  // Recent verified transfers ledger
  const auditLedger = transfers.slice(0, 10).map(t => {
    const from = db.users.find(u => u.id === t.fromUserId);
    const to = db.users.find(u => u.id === t.toUserId);
    return {
      id: t.id,
      itemTitle: t.itemTitle,
      category: t.category,
      sharingType: t.sharingType,
      fromUserName: from ? from.name : 'Community Member',
      toUserName: to ? to.name : 'Community Member',
      weightKg: t.weightKgEstimated,
      valueSaved: t.valueSavedEstimated,
      completedAt: t.completedAt
    };
  });

  res.json({
    metrics: {
      totalTransfers,
      wasteDivertedKg: parseFloat(wasteDivertedKg.toFixed(1)),
      economicValueSaved: Math.round(economicValueSaved),
      co2DivertedKg,
      uniqueParticipants,
      activeListings: db.items.filter(i => i.status === 'available').length,
      activeNeeds: db.communityNeeds.filter(n => n.status === 'open').length
    },
    categoryStats,
    typeCounts,
    auditLedger
  });
});

// -------------------------------------------------------------
// AI-ASSISTED LISTING ENDPOINT
// -------------------------------------------------------------

app.post('/api/ai/suggest', (req, res) => {
  const { titleHint, rawDescription, imageKeywords } = req.body;

  const hint = (titleHint || rawDescription || imageKeywords || '').toLowerCase();

  // Smart heuristic & rule engine for realistic reuse suggestions
  let suggestedCategory = 'Other Reusable Items';
  let suggestedTitle = titleHint ? titleHint.trim() : 'Useful Reusable Item';
  let suggestedDescription = 'Clean, functional, and ready for a second life with someone in the local community.';
  let suggestedCondition = 'Gently Used';
  let suggestedTags = ['reuse', 'community', 'sustainable'];
  let suggestedSharingMethod = 'donate';
  let suggestedPrice = 0;

  if (hint.includes('calculat') || hint.includes('ti-') || hint.includes('casio')) {
    suggestedCategory = 'Electronics';
    suggestedTitle = 'Texas Instruments Scientific / Graphing Calculator';
    suggestedDescription = 'Fully tested screen and keys. Holds battery charge and comes with slide cover. Great for engineering, calculus, or statistics coursework.';
    suggestedCondition = 'Good';
    suggestedTags = ['calculator', 'stem', 'math', 'campus', 'electronics'];
    suggestedSharingMethod = 'lend';
  } else if (hint.includes('book') || hint.includes('textbook') || hint.includes('calculus') || hint.includes('physics') || hint.includes('chemistry') || hint.includes('edition')) {
    suggestedCategory = 'Books and Education';
    suggestedTitle = titleHint ? `${titleHint} (Clean Copy)` : 'Academic Course Textbook';
    suggestedDescription = 'Clean pages with minimal margin notes. Binding is solid. Passing it on to help a fellow student save on book costs this semester.';
    suggestedCondition = 'Gently Used';
    suggestedTags = ['textbook', 'study', 'education', 'reading', 'course'];
    suggestedSharingMethod = 'donate';
  } else if (hint.includes('lamp') || hint.includes('light') || hint.includes('desk lamp')) {
    suggestedCategory = 'Electronics';
    suggestedTitle = 'Adjustable LED Desk Task Lamp';
    suggestedDescription = 'Energy-efficient LED study lamp with multiple brightness and temperature modes. Steady base, no flickering, perfect for quiet work spaces.';
    suggestedCondition = 'Like New';
    suggestedTags = ['lamp', 'desk', 'lighting', 'study', 'dorm'];
    suggestedSharingMethod = 'donate';
  } else if (hint.includes('table') || hint.includes('desk') || hint.includes('chair') || hint.includes('shelf')) {
    suggestedCategory = 'Furniture and Home';
    suggestedTitle = titleHint ? titleHint : 'Solid Wood Study Desk / Small Table';
    suggestedDescription = 'Sturdy build with minimal cosmetic surface wear. Fits nicely into a dorm room, studio apartment, or compact home workspace.';
    suggestedCondition = 'Good';
    suggestedTags = ['furniture', 'wood', 'desk', 'home', 'compact'];
    suggestedSharingMethod = 'donate';
  } else if (hint.includes('pot') || hint.includes('cooker') || hint.includes('pan') || hint.includes('kettle') || hint.includes('blender')) {
    suggestedCategory = 'Kitchen Essentials';
    suggestedTitle = titleHint ? titleHint : 'Electric Multi-Cooker / Kitchen Essential';
    suggestedDescription = 'Thoroughly sanitized and tested. All functions operate smoothly. Great for easy healthy dorm cooking or small household meal prep.';
    suggestedCondition = 'Gently Used';
    suggestedTags = ['kitchen', 'cooking', 'appliance', 'dorm', 'mealprep'];
    suggestedSharingMethod = 'sell';
    suggestedPrice = 20;
  } else if (hint.includes('jacket') || hint.includes('coat') || hint.includes('hoodie') || hint.includes('sweater')) {
    suggestedCategory = 'Clothing and Accessories';
    suggestedTitle = titleHint ? titleHint : 'Warm Weatherproof Outerwear Jacket';
    suggestedDescription = 'Clean, freshly laundered, with working zippers and tight seams. Breathable and comfortable for daily commuting or outdoor walks.';
    suggestedCondition = 'Like New';
    suggestedTags = ['clothing', 'outerwear', 'jacket', 'warm', 'unisex'];
    suggestedSharingMethod = 'exchange';
  } else if (hint.includes('toy') || hint.includes('lego') || hint.includes('puzzle') || hint.includes('game')) {
    suggestedCategory = 'Toys and Games';
    suggestedTitle = titleHint ? titleHint : 'Educational Wooden Toy / Puzzle Set';
    suggestedDescription = 'All pieces counted and packed cleanly. Inspires creative problem solving and hands-on play. Looking to pass on to an appreciative child or family.';
    suggestedCondition = 'Like New';
    suggestedTags = ['toys', 'kids', 'learning', 'puzzle', 'family'];
    suggestedSharingMethod = 'exchange';
  }

  // Find similar items currently on platform to display helpful matches
  const db = getDb();
  const similarItems = db.items
    .filter(i => i.category === suggestedCategory && i.status === 'available')
    .slice(0, 3)
    .map(i => ({ id: i.id, title: i.title, type: i.type, price: i.price }));

  res.json({
    suggestion: {
      title: suggestedTitle,
      category: suggestedCategory,
      description: suggestedDescription,
      condition: suggestedCondition,
      tags: suggestedTags,
      recommendedSharingMethod: suggestedSharingMethod,
      suggestedPrice,
      similarItems
    }
  });
});

// -------------------------------------------------------------
// SERVE PRODUCTION CLIENT & SPA FALLBACK
// -------------------------------------------------------------
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  // If the request is for an API route, pass through or 404
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('REKIND API running. Run "npm run build" in client to serve frontend.');
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[REKIND] Full-stack platform active on http://localhost:${PORT}`);
});

