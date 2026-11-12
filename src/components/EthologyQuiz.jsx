import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Share2, Check } from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_RESULTS } from '../data/initialData';

export default function EthologyQuiz({ hideHeader = false }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleNextQuestion = () => {
    if (selectedOptionIndex === null) return;

    const chosenOption = currentQuestion.options[selectedOptionIndex];
    const newAnswers = [...answers, chosenOption];
    setAnswers(newAnswers);
    setSelectedOptionIndex(null);

    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateVerdict(newAnswers);
    }
  };

  const calculateVerdict = (completedAnswers) => {
    const scores = { zen: 0, diplomat: 0, hedonist: 0, tactician: 0 };
    completedAnswers.forEach((ans) => {
      if (scores[ans.archetype] !== undefined) {
        scores[ans.archetype] += ans.score;
      }
    });

    let bestArchetype = 'zen';
    let maxScore = -1;
    Object.entries(scores).forEach(([key, val]) => {
      if (val > maxScore) {
        maxScore = val;
      }
    });

    const finalResult = QUIZ_RESULTS[bestArchetype] || QUIZ_RESULTS.zen;
    setResult(finalResult);
    setIsFinished(true);

    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#8ec59f', '#4f825e', '#3d6349', '#efe9de']
      });
    } catch {}
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setAnswers([]);
    setIsFinished(false);
    setResult(null);
    setCopied(false);
  };

  const handleShareResult = () => {
    if (!result) return;
    const shareText = `Мой природный этологический архетип на Капибаропедии: ${result.title} — ${result.tagline}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quiz" className={hideHeader ? "space-y-6" : "py-16 sm:py-24 border-b border-[var(--border-hairline)]"}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        {!hideHeader && (
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono-code text-[var(--accent-green)]">
              Глава 4 · Этологический тест
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[var(--text-primary)]">
              Поведенческий архетип капибары
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Ответьте на 4 вопроса о стресс-факторах, коммуникации и взаимодействии в группе, 
              чтобы определить ваш поведенческий эквивалент в структуре стада.
            </p>
          </div>
        )}

        {/* Quiz Stepper */}
        {!isFinished ? (
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] p-6 sm:p-8 space-y-6 shadow-[var(--shadow-soft)]">
            
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)]">
                <span>Вопрос {currentQuestionIndex + 1} из {QUIZ_QUESTIONS.length}</span>
                <span>{progressPercent}% пройдено</span>
              </div>
              <div className="w-full h-1 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent-green)] transition-[width] duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Title */}
            <h3 className="text-lg sm:text-xl font-medium text-[var(--text-primary)] leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl text-left text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between gap-3 border ${
                      isSelected
                        ? 'bg-[var(--accent-green-subtle)] text-[var(--text-primary)] border-[var(--accent-green)]'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="leading-relaxed">{opt.text}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[var(--accent-green)] border-[var(--accent-green)] text-black' : 'border-[var(--border-hover)]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="pt-4 border-t border-[var(--border-hairline)] flex items-center justify-between">
              <span className="text-[11px] font-mono-code text-[var(--text-muted)]">
                Выберите наиболее близкий паттерн
              </span>

              <button
                onClick={handleNextQuestion}
                disabled={selectedOptionIndex === null}
                className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                  selectedOptionIndex !== null
                    ? 'btn-primary'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed'
                }`}
              >
                <span>{currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? 'Завершить' : 'Далее'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ) : (
          /* Result Summary */
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] p-6 sm:p-8 space-y-6 shadow-[var(--shadow-soft)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-[var(--accent-green)]">
                  Результат этологической оценки
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-green-subtle)] text-[var(--accent-green)] text-[11px] font-mono-code">
                  {result.badge}
                </span>
              </div>
              <h3 className="text-2xl font-display font-medium text-[var(--text-primary)]">
                {result.title}
              </h3>
              <p className="text-sm font-editorial-serif italic text-[var(--text-secondary)]">
                «{result.tagline}»
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-hairline)]">
              {result.description}
            </p>

            {result.quote && (
              <blockquote className="p-3.5 rounded-xl bg-[var(--bg-surface)] border-l-2 border-[var(--accent-green)] font-editorial-serif italic text-sm text-[var(--text-primary)]">
                {result.quote}
              </blockquote>
            )}

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] space-y-1">
              <span className="font-mono-code text-[11px] text-[var(--text-muted)]">Биологическая аналогия:</span>
              <p className="leading-relaxed">{result.ecology}</p>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-[var(--border-hairline)] flex items-center justify-between">
              <button
                onClick={handleRestart}
                className="px-3 py-2 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                <span>Пройти заново</span>
              </button>

              <button
                onClick={handleShareResult}
                className="px-4 py-2 rounded-lg btn-primary text-xs font-medium flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" strokeWidth={1.5} />
                <span>{copied ? 'Скопировано' : 'Поделиться результатом'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
