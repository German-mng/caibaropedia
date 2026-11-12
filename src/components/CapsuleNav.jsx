import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Search, 
  Bookmark, 
  Menu,
  X,
  BookOpen,
  MapPin,
  HelpCircle,
  Home,
  ShieldCheck
} from 'lucide-react';

export default function CapsuleNav({
  theme,
  toggleTheme,
  onOpenSearch,
  favoritesCount = 0
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // Auto-hide when scrolling down past 60px; reveal immediately on scroll up
    if (latest > previous && latest > 60) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navItems = [
    { path: '/', label: 'Главная', icon: Home },
    { path: '/articles', label: 'Каталог очерков', icon: BookOpen },
    { path: '/map', label: 'Ареалы', icon: MapPin },
    { path: '/quiz', label: 'Этология', icon: HelpCircle },
    { path: '/admin', label: 'Управление', icon: ShieldCheck },
  ];

  const handleNavClick = (path) => {
    setMobileExpanded(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -80, opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-3.5 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
      >
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-hairline)] shadow-[var(--shadow-soft)] max-w-fit mx-auto">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-[var(--bg-surface)] transition-colors text-xs font-medium text-[var(--text-primary)] cursor-pointer shrink-0"
            aria-label="Капибаропедия — на главную"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
            <span className="font-medium tracking-tight">Капибаропедия</span>
          </button>

          {/* Hairline Divider */}
          <div className="hidden md:block w-px h-3.5 bg-[var(--border-hairline)] shrink-0" />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-0.5 shrink-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/articles' && location.pathname.startsWith('/articles/'));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Hairline Divider */}
          <div className="hidden md:block w-px h-3.5 bg-[var(--border-hairline)] shrink-0" />

          {/* Actions & Utilities */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Поиск (⌘K / /)"
              aria-label="Поиск по монографии"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline font-mono-code text-[11px] text-[var(--text-muted)]">⌘K</span>
            </button>

            {/* Bookmarks */}
            {favoritesCount > 0 && (
              <button
                onClick={() => navigate('/articles?filter=favorites')}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent-green-subtle)] text-[var(--accent-green)] text-xs font-mono-code cursor-pointer"
                title="Закладки"
                aria-label="Перейти в сохраненные закладки"
              >
                <Bookmark className="w-3 h-3 fill-current" strokeWidth={1.5} />
                <span>{favoritesCount}</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Сменить тему"
              aria-label={theme === 'dark' ? "Включить светлую тему" : "Включить тёмную тему"}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5" strokeWidth={1.5} />
              ) : (
                <Moon className="w-3.5 h-3.5" strokeWidth={1.5} />
              )}
            </button>

            {/* Mobile menu hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="p-1.5 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] cursor-pointer"
                aria-label={mobileExpanded ? "Закрыть меню" : "Открыть меню навигации"}
              >
                {mobileExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 inset-x-4 z-40 max-w-sm mx-auto p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-[var(--shadow-soft)] md:hidden space-y-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="w-full px-3 py-2 rounded-lg hover:bg-[var(--bg-surface)] text-left text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
