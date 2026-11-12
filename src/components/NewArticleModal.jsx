import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Feather } from 'lucide-react';
import { formatImagePath } from '../services/storage';

export default function NewArticleModal({ isOpen, onClose, onAddArticle }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Биология и анатомия');
  const [readTime, setReadTime] = useState('5 мин');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    onAddArticle({
      title: title.trim(),
      category,
      readTime: readTime.trim() || '5 мин',
      image: formatImagePath(image.trim()),
      excerpt: excerpt.trim(),
      content: content.trim() || `<p class="lead">${excerpt.trim()}</p>`
    });

    setTitle('');
    setExcerpt('');
    setContent('');
    setImage('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.15 }}
          className="relative max-w-xl w-full bg-[var(--bg-card)] rounded-2xl border border-[var(--border-hairline)] shadow-[var(--shadow-soft)] p-6 space-y-5 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium text-[var(--text-primary)] flex items-center gap-2">
                <Feather className="w-4 h-4 text-[var(--accent-green)]" />
                <span>Добавить научный очерк</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono-code">
                Запись сохранится в локальный архив монографии
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
              aria-label="Закрыть окно"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-[var(--text-primary)]">
                Заголовок статьи *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Акустическая коммуникация капибар в сезон паводков"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-[var(--text-primary)]">
                  Категория
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] cursor-pointer"
                >
                  <option value="Биология и анатомия">Биология и анатомия</option>
                  <option value="Ареал и поведение">Ареал и поведение</option>
                  <option value="Содержание">Содержание</option>
                  <option value="Поп-культура">Поп-культура</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--text-primary)]">
                  Время чтения
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 мин"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[var(--text-primary)]">
                Краткий тезис (Excerpt) *
              </label>
              <textarea
                required
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="2–3 предложения о сути наблюдения..."
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-[var(--text-primary)]">
                Текст очерка (HTML)
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<p class='lead'>Введение...</p><h3>Подраздел</h3><p>Текст исследования...</p>"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)] font-mono-code text-[11px] resize-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[var(--border-hairline)]">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg btn-primary font-medium text-xs cursor-pointer"
              >
                Опубликовать очерк
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
