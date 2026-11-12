import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HabitatMap from '../components/HabitatMap';

export default function MapPage() {
  useEffect(() => {
    document.title = 'Географический атлас — Капибаропедия';
  }, []);

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Breadcrumb & Header */}
      <div className="pb-4 border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--text-muted)] mb-2">
          <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-[var(--accent-green)] font-medium">Географический атлас</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-display font-medium tracking-tight text-[var(--text-primary)]">
              Ареалы обитания и биомы
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
              Карта ключевых пойменных экосистем Южной Америки: Пантанал, Льянос, Амазония и дельта Параны.
            </p>
          </div>
          <Link
            to="/"
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>На главную</span>
          </Link>
        </div>
      </div>

      {/* Habitat Map Component */}
      <HabitatMap hideHeader={true} />

    </div>
  );
}
