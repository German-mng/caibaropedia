/**
 * Капибаропедия — Autonomous Storage & REST API Synchronization Service
 * Supports dual-mode persistence:
 * 1. Web Storage API (localStorage) for 100% offline autonomy.
 * 2. Express Backend REST API (/api) for real-time persistence across devices.
 */

import { INITIAL_ARTICLES, INITIAL_COMMENTS } from '../data/initialData';

const KEYS = {
  ARTICLES: 'capy_articles_v6',
  COMMENTS: 'capy_comments_v6',
  LIKES: 'capy_likes_v6',
  FAVORITES: 'capy_favorites_v6',
  THEME: 'capy_theme',
  ROLE: 'capy_role_v1'
};

// Clean up legacy keys with mock data
try {
  ['capy_articles_v5', 'capy_comments_v5', 'capy_likes_v5', 'capy_favorites_v5'].forEach(k => {
    localStorage.removeItem(k);
  });
} catch {}

export const StorageService = {
  // --- THEME ---
  getTheme() {
    try {
      const stored = localStorage.getItem(KEYS.THEME);
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch (e) {
      console.warn(e);
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // --- USER ROLE (admin / user / guest) ---
  getRole() {
    try {
      return localStorage.getItem(KEYS.ROLE) || 'admin';
    } catch {
      return 'admin';
    }
  },

  setRole(role) {
    try {
      localStorage.setItem(KEYS.ROLE, role);
    } catch (e) {
      console.warn(e);
    }
  },

  // --- ARTICLES & RESEARCH NOTES (FULL CRUD) ---
  getArticles() {
    try {
      const stored = localStorage.getItem(KEYS.ARTICLES);
      if (stored) {
        const articles = JSON.parse(stored);
        if (Array.isArray(articles) && articles.length > 0) {
          // Self-healing: if an article is in current user's likes, its likes count must be at least 1
          const userLikes = this.getLikes();
          let mutated = false;
          articles.forEach(art => {
            if (userLikes.includes(art.id) && (!art.likes || art.likes < 1)) {
              art.likes = 1;
              mutated = true;
            }
          });
          if (mutated) {
            this.saveArticles(articles);
          }
          return articles;
        }
      }
    } catch (e) {
      console.warn("Error reading articles from storage:", e);
    }
    this.saveArticles(INITIAL_ARTICLES);
    return INITIAL_ARTICLES;
  },

  saveArticles(articles) {
    try {
      localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error(e);
    }
  },

  // CREATE
  addArticle(articleData) {
    const articles = this.getArticles();
    const newArticle = {
      id: articleData.id || 'art-' + Date.now(),
      slug: (articleData.title || 'article').toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-'),
      title: articleData.title,
      category: articleData.category || 'Биология и анатомия',
      categorySlug: getCategorySlug(articleData.category),
      readTime: articleData.readTime || '5 мин',
      views: 0,
      likes: 0,
      date: articleData.date || new Date().toISOString().split('T')[0],
      image: formatImagePath(articleData.image),
      excerpt: articleData.excerpt || '',
      content: articleData.content || ''
    };
    const updated = [newArticle, ...articles];
    this.saveArticles(updated);

    // Sync with backend if reachable
    fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle)
    }).catch(() => {});

    return { newArticle, updated };
  },

  // READ SINGLE
  getArticleById(id) {
    const articles = this.getArticles();
    return articles.find(a => a.id === id) || null;
  },

  // UPDATE (EDIT)
  updateArticle(id, updatedFields) {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return { updatedArticle: null, updated: articles };

    const existing = articles[index];
    const category = updatedFields.category || existing.category;
    const updatedArticle = {
      ...existing,
      ...updatedFields,
      id: existing.id,
      category,
      categorySlug: getCategorySlug(category)
    };

    articles[index] = updatedArticle;
    this.saveArticles(articles);

    // Sync with backend if reachable
    fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedArticle)
    }).catch(() => {});

    return { updatedArticle, updated: articles };
  },

  // DELETE
  deleteArticle(id) {
    const articles = this.getArticles();
    const updated = articles.filter(a => a.id !== id);
    this.saveArticles(updated);

    // Also remove comments associated with this article
    const allComments = this.getAllComments();
    if (allComments[id]) {
      delete allComments[id];
      this.saveAllComments(allComments);
    }

    // Sync with backend if reachable
    fetch(`/api/articles/${id}`, {
      method: 'DELETE'
    }).catch(() => {});

    return updated;
  },

  incrementViews(id) {
    const articles = this.getArticles();
    const target = articles.find(a => a.id === id);
    if (target) {
      target.views = (target.views || 0) + 1;
      this.saveArticles(articles);

      fetch(`/api/articles/${id}/view`, { method: 'POST' }).catch(() => {
        fetch(`/api/articles/${id}`).catch(() => {});
      });
    }
    return articles;
  },

  // --- LIKES ---
  getLikes() {
    try {
      const stored = localStorage.getItem(KEYS.LIKES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleLike(articleId) {
    let likes = this.getLikes();
    const articles = this.getArticles();
    const target = articles.find(a => a.id === articleId);
    let isLiked = false;

    if (likes.includes(articleId)) {
      likes = likes.filter(id => id !== articleId);
      if (target) {
        target.likes = Math.max(0, (target.likes || 1) - 1);
      }
      isLiked = false;
    } else {
      likes.push(articleId);
      if (target) {
        target.likes = (target.likes || 0) + 1;
      }
      isLiked = true;
    }

    try {
      localStorage.setItem(KEYS.LIKES, JSON.stringify(likes));
    } catch (e) {
      console.error(e);
    }
    this.saveArticles(articles);

    fetch(`/api/articles/${articleId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment: isLiked })
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && typeof data.likes === 'number') {
          const fresh = this.getArticles();
          const t = fresh.find(a => a.id === articleId);
          if (t && t.likes !== data.likes) {
            t.likes = data.likes;
            this.saveArticles(fresh);
          }
        }
      })
      .catch(() => {});

    return { likes, isLiked, articles };
  },

  // --- BOOKMARKS / FAVORITES ---
  getFavorites() {
    try {
      const stored = localStorage.getItem(KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(articleId) {
    let favs = this.getFavorites();
    let isFav = false;
    if (favs.includes(articleId)) {
      favs = favs.filter(id => id !== articleId);
      isFav = false;
    } else {
      favs.push(articleId);
      isFav = true;
    }
    try {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
    } catch (e) {
      console.error(e);
    }
    return { favorites: favs, isFav };
  },

  // --- COMMENTS (FULL CRUD & MODERATION) ---
  getAllComments() {
    try {
      const stored = localStorage.getItem(KEYS.COMMENTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    this.saveAllComments(INITIAL_COMMENTS);
    return INITIAL_COMMENTS;
  },

  saveAllComments(comments) {
    try {
      localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    } catch (e) {
      console.error(e);
    }
  },

  getCommentsForArticle(articleId) {
    const all = this.getAllComments();
    return all[articleId] || [];
  },

  addComment(articleId, commentData) {
    const all = this.getAllComments();
    if (!all[articleId]) all[articleId] = [];
    const newComment = {
      id: commentData.id || 'c-' + Date.now(),
      author: commentData.author || 'Исследователь',
      role: commentData.role || 'Читатель монографии',
      avatar: commentData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      date: new Date().toISOString().split('T')[0],
      text: commentData.text
    };
    all[articleId] = [newComment, ...all[articleId]];
    this.saveAllComments(all);

    // Sync with backend if reachable
    fetch(`/api/comments/${articleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment)
    }).catch(() => {});

    return all[articleId];
  },

  deleteComment(articleId, commentId) {
    const all = this.getAllComments();
    if (all[articleId]) {
      all[articleId] = all[articleId].filter(c => c.id !== commentId);
      this.saveAllComments(all);

      // Sync with backend if reachable
      fetch(`/api/comments/${articleId}/${commentId}`, {
        method: 'DELETE'
      }).catch(() => {});
    }
    return all[articleId] || [];
  },

  // --- KPI STATS CALCULATION ---
  getStats() {
    const articles = this.getArticles();
    const allComments = this.getAllComments();
    let totalComments = 0;
    Object.values(allComments).forEach(list => {
      if (Array.isArray(list)) totalComments += list.length;
    });
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);

    return {
      totalArticles: articles.length,
      totalComments,
      totalViews,
      totalLikes
    };
  },

  // --- SYNCHRONIZATION WITH BACKEND REST API ---
  async syncWithServer() {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const serverArticles = await res.json();
        if (Array.isArray(serverArticles) && serverArticles.length > 0) {
          const localArticles = this.getArticles();
          const userLikes = this.getLikes();

          // Intelligent merge preserving highest views/likes and user likes
          const merged = serverArticles.map(sArt => {
            const local = localArticles.find(l => l.id === sArt.id);
            let views = Math.max(sArt.views || 0, local?.views || 0);
            let likes = Math.max(sArt.likes || 0, local?.likes || 0);

            if (userLikes.includes(sArt.id) && likes < 1) {
              likes = 1;
              fetch(`/api/articles/${sArt.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ increment: true })
              }).catch(() => {});
            }

            return {
              ...sArt,
              views,
              likes
            };
          });

          // Include local articles that may not have synced to server yet
          localArticles.forEach(lArt => {
            if (!merged.some(m => m.id === lArt.id)) {
              merged.push(lArt);
              fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lArt)
              }).catch(() => {});
            }
          });

          this.saveArticles(merged);
        }
      }
      const cRes = await fetch('/api/comments');
      if (cRes.ok) {
        const serverComments = await cRes.json();
        if (serverComments && typeof serverComments === 'object') {
          this.saveAllComments(serverComments);
        }
      }
      return true;
    } catch {
      // Backend not running, gracefully using LocalStorage
      return false;
    }
  },

  // --- RESET ALL DATA ---
  resetAllData() {
    localStorage.removeItem(KEYS.ARTICLES);
    localStorage.removeItem(KEYS.COMMENTS);
    localStorage.removeItem(KEYS.LIKES);
    localStorage.removeItem(KEYS.FAVORITES);

    fetch('/api/reset', { method: 'POST' }).catch(() => {});

    return {
      articles: INITIAL_ARTICLES,
      comments: INITIAL_COMMENTS,
      likes: [],
      favorites: []
    };
  }
};

export function getCategorySlug(category) {
  switch (category) {
    case 'Биология и анатомия': return 'biology';
    case 'Ареал и поведение': return 'behavior';
    case 'Содержание': return 'care';
    case 'Поп-культура':
    case 'Культура':
      return 'culture';
    default: return 'general';
  }
}

export function formatImagePath(src) {
  if (!src) return '/images/hero.jpg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }
  return src.startsWith('/') ? src : `/${src}`;
}
