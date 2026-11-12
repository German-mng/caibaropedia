import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import NewArticleModal from '../components/NewArticleModal';
import { formatImagePath } from '../services/storage';

export default function ArticlesPage({
  articles,
  onAddArticle,
  favorites,
  onToggleFavorite,
  likes,
  onToggleLike
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('filter') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Каталог очерков — Капибаропедия';
  }, []);

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setActiveCategory(filterParam);
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', label: 'Все материалы' },
    { id: 'biology', label: 'Биология и анатомия' },
    { id: 'behavior', label: 'Ареал и поведение' },
    { id: 'care', label: 'Содержание' },
    { id: 'culture', label: 'Поп-культура' },
    { id: 'favorites', label: `Закладки (${favorites.length})` },
  ];

  const filteredArticles = articles
    .filter((art) => {
      if (activeCategory === 'favorites') {
        if (!favorites.includes(art.id)) return false;
      } else if (activeCategory !== 'all') {
        const isCulture = (activeCategory === 'culture') && (art.category === 'Поп-культура' || art.category === 'Культура' || art.categorySlug === 'culture');
        if (!isCulture && art.categorySlug !== activeCategory) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = art.title?.toLowerCase().includes(q);
        const matchExcerpt = art.excerpt?.toLowerCase().includes(q);
        return matchTitle || matchExcerpt;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    if (id === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', id);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--text-muted)]">
            <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-[var(--accent-green)] font-medium">Каталог очерков</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-medium tracking-tight text-[var(--text-primary)]">
            Академическая библиотека
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
            Коллекция научных очерков, полевых заметок и биологических исследований капибары (*Hydrochoerus hydrochaeris*).
          </p>
        </div>

        {/* Action Button: Add Article */}
        <div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-lg btn-primary text-xs font-medium flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить очерк</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="space-y-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1 min-w-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors border shrink-0 ${
                    isActive
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hover)]'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls (Keep side-by-side on all screens) */}
          <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
            {/* Search Input */}
            <div className="relative w-44 sm:w-56 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Поиск по очеркам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="date" className="bg-[var(--bg-card)] text-[var(--text-primary)]">По дате</option>
                <option value="views" className="bg-[var(--bg-card)] text-[var(--text-primary)]">По просмотрам</option>
                <option value="likes" className="bg-[var(--bg-card)] text-[var(--text-primary)]">По оценкам</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((art) => {
          const isFav = favorites.includes(art.id);
          const isLiked = likes.includes(art.id);

          return (
            <div
              key={art.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-hover)] transition-colors group shadow-[var(--shadow-soft)]"
            >
              <div className="space-y-3.5">
                {/* Image Cover */}
                {art.image && (
                  <div className="rounded-xl overflow-hidden aspect-[16/10] bg-[var(--bg-surface)]">
                    <img
                      src={formatImagePath(art.image)}
                      alt={art.title}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95 filter brightness-[0.98]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/hero.jpg';
                      }}
                    />
                  </div>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)]">
                  <span className="px-2 py-0.5 rounded bg-[var(--accent-green-subtle)] text-[var(--accent-green)] font-medium text-[11px]">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]">{art.date}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors leading-snug line-clamp-2">
                  <Link to={`/articles/${art.id}`}>
                    {art.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed min-h-[2rem]">
                  {art.excerpt || 'Научный очерк полевых наблюдений и этологии капибары.'}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3.5 mt-3 border-t border-[var(--border-hairline)] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono-code text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{art.views || 0}</span>
                  </span>
                  <button
                    onClick={() => onToggleLike(art.id)}
                    className={`flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer ${
                      isLiked ? 'text-rose-500 font-medium' : ''
                    }`}
                    title="Оценить"
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{art.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => onToggleFavorite(art.id)}
                    className={`hover:text-[var(--accent-green)] transition-colors cursor-pointer ${
                      isFav ? 'text-[var(--accent-green)]' : ''
                    }`}
                    title="В закладки"
                  >
                    <Bookmark className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <Link
                  to={`/articles/${art.id}`}
                  className="flex items-center gap-1 text-[var(--accent-green)] font-mono-code text-[11px] font-medium"
                >
                  <span>Читать</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Article Modal */}
      <NewArticleModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddArticle={onAddArticle}
      />

    </div>
  );
}
