import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read data from data.json
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data.json:', err);
  }
  return null;
}

// Helper to save data to data.json
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing data.json:', err);
    return false;
  }
}

// Initialize seed data if file is missing
async function initializeDataIfMissing() {
  if (!fs.existsSync(DATA_FILE)) {
    try {
      const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.js');
      const fileUrl = 'file:///' + initialDataPath.replace(/\\/g, '/') + '?t=' + Date.now();
      const { INITIAL_ARTICLES, INITIAL_COMMENTS } = await import(fileUrl);
      const initial = {
        articles: INITIAL_ARTICLES || [],
        comments: INITIAL_COMMENTS || {}
      };
      writeData(initial);
      console.log('Initialized server/data.json with seed data.');
    } catch (err) {
      console.error('Failed to load seed data from initialData.js, creating fallback:', err);
      writeData({ articles: [], comments: {} });
    }
  }
}

// Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'express-rest-api',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. KPI Stats
app.get('/api/stats', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const totalArticles = data.articles.length;
  let totalComments = 0;
  Object.values(data.comments || {}).forEach(arr => {
    if (Array.isArray(arr)) totalComments += arr.length;
  });
  const totalViews = data.articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalLikes = data.articles.reduce((acc, a) => acc + (a.likes || 0), 0);

  res.json({
    totalArticles,
    totalComments,
    totalViews,
    totalLikes
  });
});

// 3. Articles CRUD
app.get('/api/articles', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  res.json(data.articles);
});

app.get('/api/articles/:id', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const article = data.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  
  res.json(article);
});

// Dedicated view increment endpoint
app.post('/api/articles/:id/view', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const article = data.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  article.views = (article.views || 0) + 1;
  writeData(data);

  res.json({ views: article.views });
});

app.post('/api/articles', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const body = req.body;
  if (!body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newArticle = {
    id: body.id || 'art-' + Date.now(),
    slug: (body.title || 'article').toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-'),
    title: body.title,
    category: body.category || 'Биология и анатомия',
    categorySlug: body.categorySlug || 'biology',
    readTime: body.readTime || '5 мин',
    views: body.views !== undefined ? body.views : 0,
    likes: body.likes !== undefined ? body.likes : 0,
    date: body.date || new Date().toISOString().split('T')[0],
    image: body.image || '/images/hero.jpg',
    excerpt: body.excerpt || '',
    content: body.content || ''
  };

  data.articles.unshift(newArticle);
  writeData(data);
  res.status(201).json(newArticle);
});

app.put('/api/articles/:id', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const index = data.articles.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const existing = data.articles[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id // protect id from being changed
  };

  data.articles[index] = updated;
  writeData(data);
  res.json(updated);
});

app.delete('/api/articles/:id', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const id = req.params.id;
  const initialLen = data.articles.length;
  data.articles = data.articles.filter(a => a.id !== id);

  if (data.articles.length === initialLen) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Remove corresponding comments
  if (data.comments && data.comments[id]) {
    delete data.comments[id];
  }

  writeData(data);
  res.json({ success: true, deletedId: id });
});

// Like toggle
app.post('/api/articles/:id/like', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const article = data.articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const increment = req.body.increment !== undefined ? req.body.increment : true;
  if (increment) {
    article.likes = (article.likes || 0) + 1;
  } else {
    article.likes = Math.max(0, (article.likes || 0) - 1);
  }

  writeData(data);
  res.json({ likes: article.likes });
});

// 4. Comments CRUD
app.get('/api/comments', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  res.json(data.comments || {});
});

app.get('/api/comments/:articleId', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const comments = (data.comments && data.comments[req.params.articleId]) || [];
  res.json(comments);
});

app.post('/api/comments/:articleId', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const articleId = req.params.articleId;
  const body = req.body;

  if (!body.text || !body.text.trim()) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  if (!data.comments) data.comments = {};
  if (!data.comments[articleId]) data.comments[articleId] = [];

  const newComment = {
    id: body.id || 'c-' + Date.now(),
    author: body.author || 'Читатель монографии',
    role: body.role || 'Исследователь',
    avatar: body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    date: new Date().toISOString().split('T')[0],
    text: body.text.trim()
  };

  data.comments[articleId].unshift(newComment);
  writeData(data);
  res.status(201).json(data.comments[articleId]);
});

app.delete('/api/comments/:articleId/:commentId', (req, res) => {
  const data = readData() || { articles: [], comments: {} };
  const { articleId, commentId } = req.params;

  if (!data.comments || !data.comments[articleId]) {
    return res.status(404).json({ error: 'Comments not found for this article' });
  }

  const initialLen = data.comments[articleId].length;
  data.comments[articleId] = data.comments[articleId].filter(c => c.id !== commentId);

  if (data.comments[articleId].length === initialLen) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  writeData(data);
  res.json(data.comments[articleId]);
});

// 5. Reset to seed data
app.post('/api/reset', async (req, res) => {
  try {
    const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.js');
    const fileUrl = 'file:///' + initialDataPath.replace(/\\/g, '/') + '?t=' + Date.now();
    const { INITIAL_ARTICLES, INITIAL_COMMENTS } = await import(fileUrl);
    const initial = {
      articles: JSON.parse(JSON.stringify(INITIAL_ARTICLES)),
      comments: JSON.parse(JSON.stringify(INITIAL_COMMENTS))
    };
    writeData(initial);
    res.json({ success: true, message: 'Database reset to initial seed data' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Start server
await initializeDataIfMissing();

app.listen(PORT, () => {
  console.log(`Kapibaropedia REST API server running on http://localhost:${PORT}`);
  console.log(`Database storage: ${DATA_FILE}`);
});
