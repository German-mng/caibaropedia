import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Search, Home, BookOpen } from 'lucide-react';

export default function NotFoundPage({ onOpenSearch }) {
  useEffect(() => {
    document.title = 'Страница не найдена — Капибаропедия';
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
      
      {/* Taxonomic Eyebrow */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-mono-code text-[var(--accent-green)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
        <span>Ошибка 404 · Раздел не найден</span>
      </div>

      {/* Headline & Description */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-[var(--text-primary)]">
          Материал вне ареала
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
          Запрашиваемый очерк или страница не найдены в архиве монографии. Возможно, ссылка устарела или содержит неточный адрес.
        </p>
      </div>

      {/* Action Navigation */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="h-10 px-4 btn-primary text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" strokeWidth={1.5} />
          <span>На главную</span>
        </Link>

        <Link
          to="/articles"
          className="h-10 px-4 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
          <span>Каталог очерков</span>
        </Link>

        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="h-10 px-4 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-[var(--accent-green)]" strokeWidth={1.5} />
            <span>Поиск по архиву</span>
          </button>
        )}
      </div>

      {/* Subtle Colophon Meta */}
      <div className="pt-8 border-t border-[var(--border-hairline)] text-[11px] font-mono-code text-[var(--text-muted)]">
        <span>Капибаропедия · Hydrochoerus hydrochaeris</span>
      </div>

    </div>
  );
}
