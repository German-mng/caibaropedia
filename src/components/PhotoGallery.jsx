import React, { useState } from 'react';
import { Maximize2, X, MapPin } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/initialData';
import { formatImagePath } from '../services/storage';

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Все кадры' },
    { id: 'nature', label: 'В дикой природе' },
    { id: 'symbiosis', label: 'Симбиоз' },
    { id: 'onsen', label: 'Японский онсэн' },
  ];

  const filteredPhotos = GALLERY_PHOTOS.filter((photo) => {
    if (activeCategory === 'all') return true;
    return photo.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-16 sm:py-24 border-b border-[var(--border-hairline)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div className="space-y-1">
            <span className="text-xs font-mono-code text-[var(--accent-green)]">
              Глава 5 · Экспедиционный архив
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[var(--text-primary)]">
              Фотохроника естественной среды
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                  activeCategory === cat.id
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hover)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-hover)] overflow-hidden group cursor-pointer shadow-[var(--shadow-soft)] transition-colors"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface)]">
                <img
                  src={formatImagePath(photo.url)}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95 filter brightness-[0.98]"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/hero.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Hover Inspect Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                  <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-medium flex items-center gap-1.5 shadow-sm border border-[var(--border-hairline)]">
                    <Maximize2 className="w-4 h-4" />
                    <span>Увеличить</span>
                  </div>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-xs">
                  <span className="font-medium truncate max-w-[200px]">{photo.title}</span>
                  <span className="font-mono-code text-[11px] text-[var(--accent-green)] flex items-center gap-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{photo.region}</span>
                  </span>
                </div>
              </div>

              {/* Quiet caption */}
              <div className="p-3.5 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {photo.description}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-[var(--shadow-soft)]"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
              aria-label="Закрыть полноэкранный просмотр"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-black">
              <img
                src={formatImagePath(selectedPhoto.url)}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/hero.jpg';
                }}
              />
            </div>

            <div className="p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <h4 className="text-base font-medium text-[var(--text-primary)]">{selectedPhoto.title}</h4>
                <span className="font-mono-code text-[11px] text-[var(--accent-green)]">{selectedPhoto.region}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
