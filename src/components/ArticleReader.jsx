import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { 
  ArrowLeft, 
  Bookmark, 
  Heart, 
  Share2, 
  Clock, 
  Eye, 
  MessageSquare, 
  Send, 
  Type, 
  Edit3, 
  Trash2, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { StorageService, formatImagePath } from '../services/storage';
import EditArticleModal from './EditArticleModal';

function formatViews(n) {
  const num = Math.abs(n || 0);
  const mod10 = num % 10;
  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'просмотров';
  if (mod10 === 1) return 'просмотр';
  if (mod10 >= 2 && mod10 <= 4) return 'просмотра';
  return 'просмотров';
}

function formatLikes(n) {
  const num = Math.abs(n || 0);
  const mod10 = num % 10;
  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'оценок';
  if (mod10 === 1) return 'оценка';
  if (mod10 >= 2 && mod10 <= 4) return 'оценки';
  return 'оценок';
}

export default function ArticleReader({
  articleId: propArticleId,
  articles: propArticles,
  onIncrementViews,
  onBack,
  onSelectRelated,
  favorites: propFavorites,
  onToggleFavorite: propToggleFavorite,
  likes: propLikes,
  onToggleLike: propToggleLike
}) {
  const navigate = useNavigate();
  const routeParams = useParams();
  const activeArticleId = propArticleId || routeParams.id;

  const [article, setArticle] = useState(() => {
    if (propArticles && propArticles.length > 0) {
      return propArticles.find((a) => a.id === activeArticleId) || null;
    }
    return StorageService.getArticleById(activeArticleId);
  });
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [fontSizeOffset, setFontSizeOffset] = useState(0); // -1, 0, 1
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(propFavorites || StorageService.getFavorites());
  const [likes, setLikes] = useState(propLikes || StorageService.getLikes());

  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (propFavorites !== undefined) {
      setFavorites(propFavorites);
    }
  }, [propFavorites]);

  useEffect(() => {
    if (propLikes !== undefined) {
      setLikes(propLikes);
    }
  }, [propLikes]);

  // Synchronize article with propArticles when parent state updates
  useEffect(() => {
    if (propArticles && propArticles.length > 0 && activeArticleId) {
      const found = propArticles.find((a) => a.id === activeArticleId);
      if (found) {
        setArticle(found);
      }
    }
  }, [propArticles, activeArticleId]);

  // Load article and increment views when navigating to an article
  useEffect(() => {
    if (activeArticleId) {
      let updatedArt = null;
      if (onIncrementViews) {
        updatedArt = onIncrementViews(activeArticleId);
      } else {
        const updatedList = StorageService.incrementViews(activeArticleId);
        updatedArt = updatedList.find((a) => a.id === activeArticleId);
      }

      if (updatedArt) {
        setArticle(updatedArt);
        document.title = `${updatedArt.title} — Капибаропедия`;
      } else {
        const fallback =
          (propArticles && propArticles.find((a) => a.id === activeArticleId)) ||
          StorageService.getArticleById(activeArticleId);
        if (fallback) {
          setArticle(fallback);
          document.title = `${fallback.title} — Капибаропедия`;
        }
      }

      setComments(StorageService.getCommentsForArticle(activeArticleId));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeArticleId]);

  if (!article) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-medium">Очерк не найден</h2>
        <Link 
          to="/articles" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-green)] text-black text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться в каталог</span>
        </Link>
      </div>
    );
  }

  const isFav = article ? (propFavorites || favorites).includes(article.id) : false;
  const isLiked = article ? (propLikes || likes).includes(article.id) : false;
  const allArticles = propArticles && propArticles.length > 0 ? propArticles : StorageService.getArticles();
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 2);

  const handleToggleFavorite = () => {
    if (!article) return;
    if (propToggleFavorite) {
      propToggleFavorite(article.id);
    } else {
      const { favorites: newFavs } = StorageService.toggleFavorite(article.id);
      setFavorites(newFavs);
    }
  };

  const handleToggleLike = () => {
    if (!article) return;
    if (propToggleLike) {
      propToggleLike(article.id);
    } else {
      const { likes: newLikes, articles: updated } = StorageService.toggleLike(article.id);
      setLikes(newLikes);
      const updatedArticle = updated.find(a => a.id === article.id);
      if (updatedArticle) setArticle(updatedArticle);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const updated = StorageService.addComment(article.id, {
      text: newCommentText.trim(),
      author: newCommentAuthor.trim() || 'Читатель монографии',
      role: 'Исследователь',
    });

    setComments([...updated]);
    setNewCommentText('');
    setNewCommentAuthor('');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Удалить эту заметку?")) {
      const updated = StorageService.deleteComment(article.id, commentId);
      setComments([...updated]);
    }
  };

  const handleSaveEditedArticle = (updatedFields) => {
    const { updatedArticle } = StorageService.updateArticle(article.id, updatedFields);
    if (updatedArticle) {
      setArticle(updatedArticle);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/articles');
    }
  };

  const handleRelatedClick = (relId) => {
    if (onSelectRelated) {
      onSelectRelated(relId);
    } else {
      navigate(`/articles/${relId}`);
    }
  };

  return (
    <div className="relative pb-20 space-y-10 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Top Fixed Reading Progress Indicator (No glowing shadow) */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--accent-green)] origin-left z-50"
      />

      {/* Reader Navigation & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-24 sm:pt-28 pb-4 border-b border-[var(--border-hairline)]">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-label="Вернуться к оглавлению"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>К оглавлению</span>
        </button>

        {/* Reader Controls: Edit, Print, Font Size, Audio, Bookmark, Share */}
        <div className="flex items-center gap-1.5">
          {/* Edit Article */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Редактировать очерк"
            aria-label="Редактировать очерк"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Редактировать</span>
          </button>

          {/* Print Article */}
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Распечатать очерк"
            aria-label="Распечатать очерк"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Font Size Toggle */}
          <button
            onClick={() => setFontSizeOffset((prev) => (prev >= 1 ? -1 : prev + 1))}
            className="p-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Размер шрифта"
            aria-label="Изменить размер шрифта"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-lg border border-[var(--border-hairline)] transition-colors cursor-pointer ${
              isFav
                ? 'bg-[var(--accent-green)] text-black border-[var(--accent-green)]'
                : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title={isFav ? "Удалить из закладок" : "Сохранить в закладки"}
            aria-label={isFav ? "Удалить из закладок" : "Сохранить в закладки"}
          >
            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-black' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer relative"
            title="Поделиться очерком"
            aria-label="Поделиться очерком"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[var(--accent-green)] text-black text-[10px] font-mono-code font-medium whitespace-nowrap shadow-sm">
                Ссылка скопирована
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Article Header */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono-code text-[var(--text-muted)]">
          <span className="px-2 py-0.5 rounded bg-[var(--accent-green-subtle)] text-[var(--accent-green)] font-medium">
            {article.category}
          </span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{article.views || 0} {formatViews(article.views || 0)}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-display font-medium tracking-tight text-[var(--text-primary)] leading-tight">
          {article.title}
        </h1>

        <p className="text-base font-editorial-serif italic text-[var(--text-secondary)] leading-relaxed">
          «{article.excerpt}»
        </p>

      </div>

      {/* Featured Cover Image */}
      {article.image && (
        <div className="rounded-2xl overflow-hidden border border-[var(--border-hairline)] aspect-[16/9] bg-[var(--bg-surface)]">
          <img
            src={formatImagePath(article.image)}
            alt={article.title}
            className="w-full h-full object-cover filter brightness-[0.98]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/hero.jpg';
            }}
          />
        </div>
      )}

      {/* Main Prose Content with DOMPurify XSS Sanitization */}
      <div
        className={`max-w-2xl mx-auto prose-capy ${
          fontSizeOffset === 1 ? 'text-lg' : fontSizeOffset === -1 ? 'text-sm' : 'text-base'
        }`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }}
      />

      {/* Interactive Like Banner */}
      <div className="max-w-2xl mx-auto pt-6 border-t border-[var(--border-hairline)] flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-xs font-mono-code text-[var(--text-muted)]">
            Оценка читателя
          </div>
          <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
            Было ли исследование информативным?
          </div>
        </div>

        <button
          onClick={handleToggleLike}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors border ${
            isLiked
              ? 'bg-rose-500 text-white border-rose-500'
              : 'border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{article.likes || 0} {formatLikes(article.likes || 0)}</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[var(--accent-green)]" />
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              Научные комментарии ({comments.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono-code text-[var(--text-muted)]">
            Модерируемый раздел
          </span>
        </div>

        {/* New Comment Input */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <input
            type="text"
            placeholder="Ваше имя или специализация"
            value={newCommentAuthor}
            onChange={(e) => setNewCommentAuthor(e.target.value)}
            className="w-full sm:w-72 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
          />
          <textarea
            rows={3}
            placeholder="Оставьте замечание или дополнение к очерку..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)] resize-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg btn-primary text-xs font-medium flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Опубликовать заметку</span>
          </button>
        </form>

        {/* Existing Comments */}
        <div className="space-y-3 pt-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)]">{comment.author}</span>
                  <span className="opacity-60">({comment.role || 'Читатель'})</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span>{comment.date}</span>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 rounded text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Удалить отзыв"
                    aria-label="Удалить отзыв"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {comment.text}
              </p>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="py-6 text-center rounded-xl bg-[var(--bg-card)] border border-dashed border-[var(--border-hairline)] space-y-1">
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Пока нет комментариев к данному очерку.
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Вы можете оставить первый исследовательский отзыв в форме выше.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Related Reading */}
      {relatedArticles.length > 0 && (
        <div className="max-w-2xl mx-auto pt-10 border-t border-[var(--border-hairline)] space-y-4">
          <div className="text-xs font-mono-code text-[var(--accent-green)]">
            Связанные исследования
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-hover)] cursor-pointer space-y-2 transition-colors"
                onClick={() => handleRelatedClick(rel.id)}
              >
                <div className="text-[11px] font-mono-code text-[var(--accent-green)]">
                  {rel.category} · {rel.readTime}
                </div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {rel.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      <EditArticleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        article={article}
        onSave={handleSaveEditedArticle}
      />

    </div>
  );
}
