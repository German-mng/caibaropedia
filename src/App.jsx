import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CapsuleNav from './components/CapsuleNav';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import HomePage from './pages/HomePage';
import { StorageService } from './services/storage';

// Code-splitting via React.lazy for optimized chunk size
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-[var(--border-hairline)] border-t-[var(--accent-green)] animate-spin" />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial data and sync with server
  const reloadData = () => {
    setArticles(StorageService.getArticles());
    setFavorites(StorageService.getFavorites());
    setLikes(StorageService.getLikes());
  };

  useEffect(() => {
    const currentTheme = StorageService.getTheme();
    setTheme(currentTheme);
    StorageService.setTheme(currentTheme);

    reloadData();

    // Background sync with Express backend if active
    StorageService.syncWithServer().then((synced) => {
      if (synced) {
        reloadData();
      }
    });
  }, []);

  // Global hotkeys (⌘K, Ctrl+K, '/') for Spotlight Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !isSearchOpen) {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    StorageService.setTheme(newTheme);
    showToast(newTheme === 'dark' ? 'Включена тёмная тема' : 'Включена светлая тема');
  };

  const handleToggleFavorite = (id) => {
    const { favorites: newFavs, isFav } = StorageService.toggleFavorite(id);
    setFavorites(newFavs);
    showToast(isFav ? 'Очерк добавлен в персональные закладки' : 'Очерк удален из закладок');
  };

  const handleIncrementViews = (id) => {
    const updatedArticles = StorageService.incrementViews(id);
    setArticles([...updatedArticles]);
    return updatedArticles.find(a => a.id === id);
  };

  const handleToggleLike = (id) => {
    const { likes: newLikes, articles: updatedArticles } = StorageService.toggleLike(id);
    setLikes([...newLikes]);
    setArticles([...updatedArticles]);
  };

  const handleAddArticle = (newArticleData) => {
    const { newArticle, updated } = StorageService.addArticle(newArticleData);
    setArticles(updated);
    showToast('Научный очерк успешно добавлен в монографию');
    navigate(`/articles/${newArticle.id}`);
  };

  const handleResetDemoData = () => {
    const reset = StorageService.resetAllData();
    setArticles(reset.articles);
    setFavorites(reset.favorites);
    setLikes(reset.likes);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Архив монографии восстановлен к исходным научным данным');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] antialiased transition-colors duration-500 relative overflow-x-hidden">
      
      {/* Floating Dynamic Capsule Navigation with URL routes */}
      <CapsuleNav
        theme={theme}
        toggleTheme={handleToggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Layout with React Router */}
      <main className="flex-1 w-full relative z-10">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Main Landing / Multi-chapter view */}
            <Route
              path="/"
              element={
                <HomePage
                  articles={articles}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  likes={likes}
                  onToggleLike={handleToggleLike}
                />
              }
            />

            {/* Full Articles Catalog */}
            <Route
              path="/articles"
              element={
                <ArticlesPage
                  articles={articles}
                  onAddArticle={handleAddArticle}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  likes={likes}
                  onToggleLike={handleToggleLike}
                />
              }
            />

            {/* Single Article Reader Mode */}
            <Route
              path="/articles/:id"
              element={
                <ArticlePage
                  articles={articles}
                  onIncrementViews={handleIncrementViews}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  likes={likes}
                  onToggleLike={handleToggleLike}
                />
              }
            />

            {/* Dedicated GIS Biomes Map */}
            <Route path="/map" element={<MapPage />} />

            {/* Dedicated Ethology Totem Quiz */}
            <Route path="/quiz" element={<QuizPage />} />

            {/* Control Panel (CMS / Admin) */}
            <Route path="/admin" element={<AdminPage onShowToast={showToast} />} />

            {/* Dedicated 404 Not Found Page */}
            <Route path="*" element={<NotFoundPage onOpenSearch={() => setIsSearchOpen(true)} />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer & Status */}
      <Footer onResetDemoData={handleResetDemoData} />

      {/* Spotlight Search Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onSelectArticle={(id) => {
          setIsSearchOpen(false);
          navigate(`/articles/${id}`);
        }}
        onSelectMapRegion={(regionId) => {
          setIsSearchOpen(false);
          navigate(regionId ? `/map?region=${regionId}` : '/map');
        }}
        onCopyFact={(factText) => {
          showToast('Полевая заметка скопирована в буфер обмена');
        }}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-hairline)] text-xs font-mono-code shadow-[var(--shadow-soft)] flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
