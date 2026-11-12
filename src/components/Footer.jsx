import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';

export default function Footer({ onResetDemoData }) {
  const handleReset = () => {
    if (window.confirm("Восстановить исходные очерки и очистить локальную историю?")) {
      if (onResetDemoData) {
        onResetDemoData();
      }
    }
  };

  return (
    <footer className="mt-16 border-t border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        
        {/* Colophon & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Colophon */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
              <Link to="/" className="font-medium text-sm text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors">
                Капибаропедия
              </Link>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md">
              Информационно-образовательная монография о биологии, конвергентной морфологии 
              и этологии крупнейшего грызуна планеты (Hydrochoerus hydrochaeris).
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono-code text-[var(--text-muted)]">
              <span>Caviidae</span>
              <span>·</span>
              <span>Hydrochoerinae</span>
              <span>·</span>
              <span>Пантанал & Амазония</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-xs font-mono-code text-[var(--text-muted)]">
              Разделы
            </div>
            <div className="flex flex-col space-y-1.5 text-xs">
              <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Главная страница</Link>
              <Link to="/articles" className="hover:text-[var(--text-primary)] transition-colors">Каталог очерков</Link>
              <Link to="/map" className="hover:text-[var(--text-primary)] transition-colors">Карта ареалов</Link>
              <Link to="/quiz" className="hover:text-[var(--text-primary)] transition-colors">Этологический тест</Link>
              <Link to="/admin" className="hover:text-[var(--text-primary)] transition-colors">Управление архивом</Link>
            </div>
          </div>

          {/* Reset & Utility */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-xs font-mono-code text-[var(--text-muted)]">
              Архив
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Все данные сохраняются локально. При необходимости вы можете вернуть демонстрационный набор статей.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Восстановить архив</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border-hairline)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono-code text-[var(--text-muted)]">
          <span>Капибаропедия · Открытый образовательный ресурс</span>
          <span>Hydrochoerus hydrochaeris</span>
        </div>

      </div>
    </footer>
  );
}
