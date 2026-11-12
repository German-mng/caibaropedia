import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, MapPin, CornerDownLeft, FileText } from 'lucide-react';
import { MAP_REGIONS, INITIAL_FACTS } from '../data/initialData';

export default function SearchModal({
  isOpen,
  onClose,
  articles = [],
  onSelectArticle,
  onSelectMapRegion,
  onCopyFact
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const cleanQuery = query.trim().toLowerCase();

  // Search through articles
  const matchedArticles = cleanQuery
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.excerpt?.toLowerCase().includes(cleanQuery) ||
          a.category?.toLowerCase().includes(cleanQuery)
      )
    : articles.slice(0, 3);

  // Search through biomes
  const matchedRegions = cleanQuery
    ? MAP_REGIONS.filter(
        (r) =>
          r.name.toLowerCase().includes(cleanQuery) ||
          r.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search through facts
  const matchedFacts = cleanQuery
    ? INITIAL_FACTS.filter(
        (f) =>
          f.text.toLowerCase().includes(cleanQuery) ||
          f.tag.toLowerCase().includes(cleanQuery)
      )
    : [];

  const allResults = [
    ...matchedArticles.map((a) => ({ type: 'article', data: a })),
    ...matchedRegions.map((r) => ({ type: 'region', data: r })),
    ...matchedFacts.map((f) => ({ type: 'fact', data: f })),
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, allResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allResults.length) % Math.max(1, allResults.length));
      } else if (e.key === 'Enter' && allResults.length > 0) {
        e.preventDefault();
        const selected = allResults[selectedIndex];
        if (selected) {
          handleExecuteResult(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allResults]);

  const handleExecuteResult = (item) => {
    if (item.type === 'article') {
      onSelectArticle(item.data.id);
    } else if (item.type === 'region') {
      onSelectMapRegion(item.data.id);
    } else if (item.type === 'fact') {
      navigator.clipboard.writeText(`${item.data.tag}: ${item.data.text}`);
      if (onCopyFact) onCopyFact(item.data.text);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-28 px-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-[var(--shadow-soft)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-[var(--border-hairline)]">
              <Search className="w-4 h-4 text-[var(--accent-green)] mr-3 shrink-0" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Поиск по очеркам, биотопам, фактам..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                aria-label="Закрыть поиск"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Container */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
              {allResults.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--text-muted)] font-mono-code">
                  Ничего не найдено по запросу «{query}»
                </div>
              ) : (
                allResults.map((item, idx) => {
                  const isSelected = selectedIndex === idx;

                  if (item.type === 'article') {
                    return (
                      <div
                        key={'art-' + item.data.id}
                        onClick={() => handleExecuteResult(item)}
                        className={`p-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors border ${
                          isSelected
                            ? 'bg-[var(--accent-green-subtle)] text-[var(--text-primary)] border-[var(--accent-green)]'
                            : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--accent-green)] shrink-0">
                            <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-medium truncate text-[var(--text-primary)]">
                              {item.data.title}
                            </div>
                            <div className="text-[11px] font-mono-code text-[var(--text-muted)]">
                              {item.data.category} · {item.data.readTime}
                            </div>
                          </div>
                        </div>

                        <CornerDownLeft className="w-3.5 h-3.5 opacity-40 shrink-0" />
                      </div>
                    );
                  }

                  if (item.type === 'region') {
                    return (
                      <div
                        key={'reg-' + item.data.id}
                        onClick={() => handleExecuteResult(item)}
                        className={`p-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors border ${
                          isSelected
                            ? 'bg-[var(--accent-green-subtle)] text-[var(--text-primary)] border-[var(--accent-green)]'
                            : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-emerald-500 shrink-0">
                            <MapPin className="w-4 h-4" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-medium truncate text-[var(--text-primary)]">
                              {item.data.name}
                            </div>
                            <div className="text-[11px] font-mono-code text-[var(--text-muted)]">
                              Биотоп · {item.data.badge}
                            </div>
                          </div>
                        </div>

                        <CornerDownLeft className="w-3.5 h-3.5 opacity-40 shrink-0" />
                      </div>
                    );
                  }

                  if (item.type === 'fact') {
                    return (
                      <div
                        key={'fact-' + item.data.id}
                        onClick={() => handleExecuteResult(item)}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                          isSelected
                            ? 'bg-[var(--accent-green-subtle)] text-[var(--text-primary)] border-[var(--accent-green)]'
                            : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono-code text-[var(--accent-green)]">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3 h-3" strokeWidth={1.5} />
                            <span>{item.data.tag}</span>
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">Нажмите, чтобы скопировать</span>
                        </div>
                        <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                          {item.data.text}
                        </p>
                      </div>
                    );
                  }

                  return null;
                })
              )}
            </div>

            {/* Modal Keyboard Shortcuts Footer */}
            <div className="px-4 py-2.5 border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] flex items-center justify-between text-[11px] font-mono-code text-[var(--text-muted)]">
              <div className="flex items-center gap-4">
                <span>↑↓ Навигация</span>
                <span>↵ Выбрать</span>
                <span>ESC Закрыть</span>
              </div>
              <span>Поиск</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
