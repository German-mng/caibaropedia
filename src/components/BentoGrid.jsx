import React, { useState } from 'react';
import { 
  Radio, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Compass,
  FileText
} from 'lucide-react';
import { INITIAL_FACTS, VOCALIZATIONS } from '../data/initialData';

export default function BentoGrid({ onSelectArticle }) {
  // Field Notes Ticker
  const [factIndex, setFactIndex] = useState(0);
  const [copiedFact, setCopiedFact] = useState(false);
  const currentFact = INITIAL_FACTS[factIndex] || INITIAL_FACTS[0];

  const handleNextFact = () => {
    setFactIndex((prev) => (prev + 1) % INITIAL_FACTS.length);
  };

  const handlePrevFact = () => {
    setFactIndex((prev) => (prev - 1 + INITIAL_FACTS.length) % INITIAL_FACTS.length);
  };

  const handleCopyFact = () => {
    navigator.clipboard.writeText(`${currentFact.tag}: ${currentFact.text}`);
    setCopiedFact(true);
    setTimeout(() => setCopiedFact(false), 2000);
  };

  return (
    <section className="py-16 sm:py-20 border-b border-[var(--border-hairline)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div className="space-y-1">
            <span className="text-xs font-mono-code text-[var(--accent-green)]">
              Полевой журнал
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[var(--text-primary)]">
              Экосистема и наблюдения
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            Сводка гидрологических циклов, биоакустика вокальных сигналов и подтверждённые полевые факты.
          </p>
        </div>

        {/* 3 Balanced Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Card 1: Hydrology & Habitat (Span 7) */}
          <div className="md:col-span-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)]">
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                  <span>Гидрологический ритм</span>
                </span>
                <span className="text-[var(--accent-green)] font-medium">Бассейн Пантанала</span>
              </div>

              <h3 className="text-lg font-medium text-[var(--text-primary)]">
                Сезонный цикл пойменных саванн
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                В период дождей до 80% равнины покрывается водой, рассредоточивая популяции по мелководьям. 
                В сухой период капибары концентрируются вокруг остаточных лагун группами до 50 особей, 
                деля узкую прибрежную полосу с кайманами и цаплями без прямых территориальных конфликтов.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-hairline)] text-xs">
              <div className="p-3 rounded-lg bg-[var(--bg-surface)] space-y-1">
                <div className="font-mono-code text-[11px] text-[var(--text-muted)]">Ноябрь — Апрель</div>
                <div className="font-medium text-[var(--text-primary)]">Сезон паводков (Cheia)</div>
                <div className="text-[11px] text-[var(--text-secondary)]">Миграция по поймам, изобилие водной растительности</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-surface)] space-y-1">
                <div className="font-mono-code text-[11px] text-[var(--text-muted)]">Май — Октябрь</div>
                <div className="font-medium text-[var(--text-primary)]">Сухой сезон (Seca)</div>
                <div className="text-[11px] text-[var(--text-secondary)]">Консолидация гаремов у постоянных водоемов</div>
              </div>
            </div>
          </div>

          {/* Card 2: Bioacoustic Communication Repertoire (Span 5) */}
          <div className="md:col-span-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)]">
                <span className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                  <span>Биоакустика</span>
                </span>
                <span className="text-[var(--accent-green)] font-medium">Этология общения</span>
              </div>

              <h3 className="text-lg font-medium text-[var(--text-primary)]">
                Вокальный репертуар
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Акустическая система сигналов для ориентации стаи в условиях высокой травы и мутных пойменных вод.
              </p>
            </div>

            {/* Vocal Signals List */}
            <div className="space-y-2">
              {VOCALIZATIONS.map((voc) => (
                <div
                  key={voc.id}
                  className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--text-primary)]">
                      {voc.name}
                    </span>
                    <span className="font-mono-code text-[11px] text-[var(--accent-green)]">
                      {voc.frequency} Гц
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {voc.context}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] font-mono-code text-[var(--text-muted)] border-t border-[var(--border-hairline)] flex items-center justify-between">
              <span>Этологический атлас</span>
              <span>4 базовых регистра</span>
            </div>
          </div>

          {/* Card 3: Field Notes Ticker (Full Span 12) */}
          <div className="md:col-span-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-green)]">
                <FileText className="w-4 h-4" strokeWidth={1.5} />
                <span>Заметка #{factIndex + 1} из {INITIAL_FACTS.length} · {currentFact.tag}</span>
              </div>
              <p className="text-sm sm:text-base font-editorial-serif italic text-[var(--text-primary)] leading-relaxed">
                «{currentFact.text}»
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={handleCopyFact}
                className="px-3 py-2 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
                title="Скопировать заметку"
              >
                {copiedFact ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
                    <span className="text-emerald-500 font-medium">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                    <span>Скопировать</span>
                  </>
                )}
              </button>

              <div className="flex items-center border border-[var(--border-hairline)] rounded-lg overflow-hidden">
                <button
                  onClick={handlePrevFact}
                  className="p-1.5 hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Предыдущая"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={handleNextFact}
                  className="p-1.5 hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border-l border-[var(--border-hairline)]"
                  title="Следующая"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
