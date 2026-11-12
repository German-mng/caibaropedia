import React from 'react';
import { Compass, BookOpen } from 'lucide-react';

export default function Hero({ onStartReading, onExploreAnatomy }) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 border-b border-[var(--border-hairline)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Taxonomic Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-green)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
              <span>Hydrochoerus hydrochaeris</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-display font-medium tracking-tight text-[var(--text-primary)] leading-[1.05]">
                Капибара
              </h1>
              <p className="text-lg sm:text-xl font-editorial-serif italic text-[var(--text-secondary)] leading-relaxed">
                Крупнейший грызун планеты и биология полуводного биотопа
              </p>
            </div>

            {/* Lead Narrative */}
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Полевая монография, посвящённая конвергентной эволюции полуводных млекопитающих. 
              Перископический череп, специализированный пищеварительный тракт, вечнорастущие резцы 
              и сложная этологическая структура семейных групп в бассейне рек Южной Америки.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartReading}
                className="h-10 px-4 sm:h-11 sm:px-5 btn-primary text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" strokeWidth={1.5} />
                <span>Читать монографию</span>
              </button>

              <button
                onClick={onExploreAnatomy}
                className="h-10 px-4 sm:h-11 sm:px-5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                <span>Анатомический атлас</span>
              </button>
            </div>

            {/* Key Telemetry Stats */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[var(--border-hairline)] max-w-lg">
              <div className="space-y-1">
                <div className="text-2xl font-mono-code font-medium text-[var(--text-primary)]">65 кг</div>
                <div className="text-xs text-[var(--text-muted)]">Предельная масса</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-mono-code font-medium text-[var(--accent-green)]">5 мин</div>
                <div className="text-xs text-[var(--text-muted)]">Апноэ при нырянии</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-mono-code font-medium text-[var(--text-primary)]">35 кГц</div>
                <div className="text-xs text-[var(--text-muted)]">Верхний порог слуха</div>
              </div>
            </div>

          </div>

          {/* Right: Photographic Moment */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--border-hairline)] overflow-hidden bg-[var(--bg-card)] shadow-[var(--shadow-soft)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src="/images/hero.jpg"
                  alt="Капибара на отмели реки Куяба в бассейне Пантанала"
                  className="w-full h-full object-cover filter brightness-[0.98]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Quiet Caption */}
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-[var(--bg-card)]/90 backdrop-blur-sm border border-[var(--border-hairline)] text-[var(--text-primary)] space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>Река Куяба, закат</span>
                    <span className="font-mono-code text-[11px] text-[var(--accent-green)]">Пантанал</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-editorial-serif italic">
                    Перископическое положение черепа над уровнем спокойной речной глади.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
