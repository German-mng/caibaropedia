import React, { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Heart, 
  Eye, 
  Clock, 
  ArrowUpRight, 
  Search
} from 'lucide-react';
import { formatImagePath } from '../services/storage';

export default function EncyclopediaExplorer({
  articles = [],
  onSelectArticle,
  favorites = [],
  onToggleFavorite,
  likes = [],
  onToggleLike
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Все очерки' },
    { id: 'biology', label: 'Биология и анатомия' },
    { id: 'behavior', label: 'Ареал и поведение' },
    { id: 'care', label: 'Содержание' },
    { id: 'culture', label: 'Поп-культура' },
    { id: 'favorites', label: `Избранное (${favorites.length})` },
  ];

  const filteredArticles = articles.filter((art) => {
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
  });

  return (
    <section id="journal" className="py-16 sm:py-24 border-b border-[var(--border-hairline)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div className="space-y-1">
            <span className="text-xs font-mono-code text-[var(--accent-green)]">
              Глава 2 · Исследовательский атлас
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[var(--text-primary)]">
              Энциклопедия капибары
            </h2>
          </div>

          {/* Quick inline search input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Поиск по очеркам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)] transition-colors"
            />
          </div>
        </div>

        {/* Clean Segmented Control Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hover)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Article Cards Grid */}
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-[var(--border-hairline)] space-y-2">
            <BookOpen className="w-6 h-6 text-[var(--text-muted)] mx-auto" strokeWidth={1.5} />
            <p className="text-xs text-[var(--text-secondary)]">В этой категории пока нет очерков</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => {
              const isFav = favorites.includes(article.id);
              const isLiked = likes.includes(article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-hover)] transition-colors flex flex-col justify-between group cursor-pointer overflow-hidden shadow-[var(--shadow-soft)]"
                >
                  {/* Card Image Cover */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-surface)]">
                    <img
                      src={formatImagePath(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95 filter brightness-[0.98]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/hero.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[11px] font-mono-code text-white">
                        {article.category}
                      </span>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(article.id);
                        }}
                        className={`p-1.5 rounded-lg backdrop-blur-sm border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-[var(--accent-green)] text-black border-[var(--accent-green)]'
                            : 'bg-black/50 text-white/80 border-white/10 hover:bg-black/70'
                        }`}
                        title={isFav ? "Удалить из закладок" : "Сохранить в закладки"}
                        aria-label={isFav ? "Удалить из закладок" : "Сохранить в закладки"}
                      >
                        <Bookmark className={`w-4 h-4 ${isFav ? 'fill-black' : ''}`} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Read Time & Views Overlay */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-2.5 text-[11px] font-mono-code text-white/90">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
                        <span>{article.readTime}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[var(--text-muted)]" strokeWidth={1.5} />
                        <span>{article.views || 0}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed min-h-[2rem]">
                        {article.excerpt || 'Научный очерк полевых наблюдений и этологии капибары.'}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs">
                      {/* Like button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(article.id);
                        }}
                        className={`flex items-center gap-1 font-mono-code text-[11px] transition-colors cursor-pointer ${
                          isLiked ? 'text-rose-500' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} strokeWidth={1.5} />
                        <span>{article.likes || 0}</span>
                      </button>

                      <div className="flex items-center gap-1 text-[var(--accent-green)] font-mono-code text-[11px] font-medium">
                        <span>Читать очерк</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
