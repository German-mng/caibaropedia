import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, Thermometer, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { MAP_REGIONS } from '../data/initialData';

export default function HabitatMap({ initialRegionId, hideHeader = false }) {
  const [searchParams] = useSearchParams();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const queryRegion = searchParams.get('region');
  const [activeRegionId, setActiveRegionId] = useState(initialRegionId || queryRegion || 'pantanal');

  const activeRegion = MAP_REGIONS.find((r) => r.id === activeRegionId) || MAP_REGIONS[0];

  useEffect(() => {
    if (queryRegion && queryRegion !== activeRegionId) {
      const target = MAP_REGIONS.find(r => r.id === queryRegion);
      if (target) {
        setActiveRegionId(target.id);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(target.coords, target.zoom, { duration: 1.0 });
        }
      }
    }
  }, [queryRegion]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initial = MAP_REGIONS.find(r => r.id === activeRegionId) || MAP_REGIONS[0];
      const map = L.map(mapContainerRef.current, {
        center: initial ? initial.coords : [-15.0, -60.0],
        zoom: initial ? initial.zoom : 4,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      // Маркеры регионов на карте
      MAP_REGIONS.forEach((region) => {
        const customIcon = L.divIcon({
          className: 'custom-capy-pin',
          html: `
            <div style="
              width: 14px; 
              height: 14px; 
              background: #4f825e; 
              border: 2px solid #ffffff; 
              border-radius: 50%; 
              box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              cursor: pointer;
            "></div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker(region.coords, { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setActiveRegionId(region.id);
          map.flyTo(region.coords, region.zoom, { duration: 1.0 });
        });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSelectRegion = (region) => {
    setActiveRegionId(region.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(region.coords, region.zoom, { duration: 1.0 });
    }
  };

  return (
    <section id="atlas" className={hideHeader ? "space-y-6" : "py-16 sm:py-24 border-b border-[var(--border-hairline)]"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
            <div className="space-y-1">
              <span className="text-xs font-mono-code text-[var(--accent-green)]">
                Глава 3 · География и биотопы
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[var(--text-primary)]">
                Ареалы обитания в Южной Америке
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              Интерактивная карта ключевых пойменных экосистем: от заболоченных саванн Пантанала до дельты Параны.
            </p>
          </div>
        )}

        {/* Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left: Map Canvas (Span 8) */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-card)] min-h-[400px] sm:min-h-[480px] relative">
            <div ref={mapContainerRef} className="w-full h-full min-h-[400px] sm:min-h-[480px] z-0 [mask-image:radial-gradient(ellipse_at_center,black_86%,transparent_100%)]" />
            
            {/* Quick region selector overlay */}
            <div className="absolute top-3 inset-x-3 z-10 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {MAP_REGIONS.map((r) => {
                const isActive = r.id === activeRegionId;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRegion(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                      isActive
                        ? 'btn-primary border-transparent'
                        : 'bg-[var(--bg-card)]/85 backdrop-blur-sm text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-card)]'
                    }`}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Region Bio Card (Span 4) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-[var(--accent-green)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{activeRegion.country}</span>
                </span>
                <span className="text-[var(--text-muted)]">{activeRegion.biotope}</span>
              </div>

              <h3 className="text-xl font-medium text-[var(--text-primary)]">
                {activeRegion.name}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {activeRegion.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[var(--border-hairline)] text-xs">
              <div className="flex items-center justify-between font-mono-code">
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Климат / Вода</span>
                </span>
                <span className="text-[var(--text-primary)]">{activeRegion.climate}</span>
              </div>

              <div className="flex items-center justify-between font-mono-code">
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Плотность</span>
                </span>
                <span className="text-[var(--text-primary)]">{activeRegion.density}</span>
              </div>

              {activeRegion.metrics?.floodCycle && (
                <div className="flex items-center justify-between font-mono-code">
                  <span className="text-[var(--text-muted)]">Паводок:</span>
                  <span className="text-[var(--accent-green)]">{activeRegion.metrics.floodCycle}</span>
                </div>
              )}

              {activeRegion.flora && (
                <div className="p-3 rounded-lg bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)] leading-relaxed mt-2 space-y-1">
                  <span className="font-mono-code text-[11px] text-[var(--text-muted)] block">Кормовой биотоп</span>
                  <p>{activeRegion.flora}</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
