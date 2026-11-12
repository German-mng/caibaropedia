import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Heart, 
  MessageSquare, 
  FileText, 
  RotateCcw, 
  Download, 
  AlertTriangle, 
  Search,
  Server
} from 'lucide-react';
import { StorageService } from '../services/storage';
import EditArticleModal from './EditArticleModal';
import NewArticleModal from './NewArticleModal';

export default function AdminPanel({ onShowToast }) {
  const [role, setRole] = useState(StorageService.getRole());
  const [articles, setArticles] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [stats, setStats] = useState({ totalArticles: 0, totalComments: 0, totalViews: 0, totalLikes: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState(null);
  const [deleteConfirmComment, setDeleteConfirmComment] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  const loadData = () => {
    const arts = StorageService.getArticles();
    const comms = StorageService.getAllComments();
    const st = StorageService.getStats();
    setArticles([...arts]);
    setCommentsMap({ ...comms });
    setStats(st);
  };

  useEffect(() => {
    loadData();

    // Check backend server status
    fetch('/api/health')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.status === 'ok') setServerOnline(true);
      })
      .catch(() => setServerOnline(false));
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    StorageService.setRole(newRole);
    if (onShowToast) {
      onShowToast(`Права переключены: ${newRole === 'admin' ? 'Администратор' : newRole === 'moderator' ? 'Модератор' : 'Читатель'}`);
    }
  };

  const handleAddArticle = (newArticleData) => {
    const { newArticle } = StorageService.addArticle(newArticleData);
    loadData();
    if (onShowToast) onShowToast(`Очерк «${newArticle.title}» добавлен`);
  };

  const handleSaveEditedArticle = (updatedFields) => {
    StorageService.updateArticle(updatedFields.id, updatedFields);
    loadData();
    if (onShowToast) onShowToast(`Изменения в очерке сохранены`);
  };

  const executeDeleteArticle = () => {
    if (!deleteConfirmArticle) return;
    StorageService.deleteArticle(deleteConfirmArticle.id);
    loadData();
    if (onShowToast) onShowToast(`Очерк «${deleteConfirmArticle.title}» удален`);
    setDeleteConfirmArticle(null);
  };

  const executeDeleteComment = () => {
    if (!deleteConfirmComment) return;
    StorageService.deleteComment(deleteConfirmComment.articleId, deleteConfirmComment.commentId);
    loadData();
    if (onShowToast) onShowToast(`Комментарий удален`);
    setDeleteConfirmComment(null);
  };

  const handleResetData = () => {
    if (window.confirm("Восстановить исходную базу данных монографии и сбросить изменения?")) {
      StorageService.resetAllData();
      loadData();
      if (onShowToast) onShowToast(`База данных восстановлена к начальным значениям`);
    }
  };

  const handleExportJSON = () => {
    const exportObject = {
      timestamp: new Date().toISOString(),
      articles: StorageService.getArticles(),
      comments: StorageService.getAllComments(),
      stats: StorageService.getStats()
    };
    const jsonStr = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kapibaropedia-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast(`Экспорт данных успешно скачан`);
  };

  // Flatten comments for moderation table
  const allCommentsList = [];
  Object.entries(commentsMap).forEach(([artId, cList]) => {
    const article = articles.find(a => a.id === artId);
    if (Array.isArray(cList)) {
      cList.forEach(c => {
        allCommentsList.push({
          ...c,
          articleId: artId,
          articleTitle: article ? article.title : artId
        });
      });
    }
  });

  const filteredArticles = articles.filter(a => {
    if (selectedCategory !== 'all') {
      const matchCategory = a.category === selectedCategory || 
        (selectedCategory === 'Поп-культура' && (a.category === 'Культура' || a.categorySlug === 'culture'));
      if (!matchCategory) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title?.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q);
    }
    return true;
  });

  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator' || role === 'admin';

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Breadcrumb & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--text-muted)]">
            <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Капибаропедия</Link>
            <span>/</span>
            <span className="text-[var(--accent-green)] font-medium">Панель управления</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[var(--text-primary)]">
            Управление монографией
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Жизненный цикл публикаций, модерация заметок и резервное копирование
          </p>
        </div>

        {/* Role & Storage Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Storage Mode Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-mono-code">
            <Server className={`w-3.5 h-3.5 ${serverOnline ? 'text-emerald-500' : 'text-amber-500'}`} />
            <span>{serverOnline ? 'REST API (Node)' : 'Web Storage'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-green)]" />
            <span className="text-[var(--text-muted)] text-[11px]">Роль:</span>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="admin" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Администратор (CRUD)</option>
              <option value="moderator" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Модератор</option>
              <option value="guest" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Читатель</option>
            </select>
          </div>

          {/* Create Article Button */}
          {isAdmin && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg btn-primary text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Создать очерк</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Warning if not Admin */}
      {!isAdmin && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Сессия запущена в режиме «{role === 'moderator' ? 'Модератор' : 'Читатель'}». 
              Создание и удаление публикаций ограничено.
            </span>
          </div>
          <button
            onClick={() => handleRoleChange('admin')}
            className="px-2.5 py-1 bg-amber-500 text-black font-medium rounded-md text-xs hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
          >
            Переключить на Admin
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono-code">
            <span>Материалы</span>
            <FileText className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
          </div>
          <div className="text-xl sm:text-2xl font-mono-code font-medium text-[var(--text-primary)]">
            {stats.totalArticles}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">Публикаций в базе</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono-code">
            <span>Рецензии</span>
            <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
          </div>
          <div className="text-xl sm:text-2xl font-mono-code font-medium text-[var(--text-primary)]">
            {stats.totalComments}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">Опубликованных заметок</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono-code">
            <span>Просмотры</span>
            <Eye className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
          </div>
          <div className="text-xl sm:text-2xl font-mono-code font-medium text-[var(--text-primary)]">
            {stats.totalViews}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">Суммарно по очеркам</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-1">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono-code">
            <span>Оценки</span>
            <Heart className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
          </div>
          <div className="text-xl sm:text-2xl font-mono-code font-medium text-[var(--text-primary)]">
            {stats.totalLikes}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">Отметок читателей</div>
        </div>
      </div>

      {/* ARTICLES MANAGEMENT SECTION */}
      <div className="space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border-hairline)]">
          <div className="space-y-0.5">
            <h2 className="text-base font-medium text-[var(--text-primary)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
              <span>Реестр очерков</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono-code">
              Управление публикациями: создание, редактирование, удаление
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Поиск по очеркам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[var(--bg-card)]">Все категории</option>
              <option value="Биология и анатомия" className="bg-[var(--bg-card)]">Биология и анатомия</option>
              <option value="Ареал и поведение" className="bg-[var(--bg-card)]">Ареал и поведение</option>
              <option value="Содержание" className="bg-[var(--bg-card)]">Содержание</option>
              <option value="Поп-культура" className="bg-[var(--bg-card)]">Поп-культура</option>
            </select>
          </div>
        </div>

        {/* Articles Table */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[11px] font-mono-code text-[var(--text-muted)]">
                  <th className="py-3 px-4 font-normal">ID</th>
                  <th className="py-3 px-4 font-normal">Название очерка</th>
                  <th className="py-3 px-4 font-normal">Категория</th>
                  <th className="py-3 px-4 font-normal">Дата</th>
                  <th className="py-3 px-4 font-normal text-center">Просмотры</th>
                  <th className="py-3 px-4 font-normal text-center">Оценки</th>
                  <th className="py-3 px-4 font-normal text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)] font-mono-code">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="py-3 px-4 text-[var(--text-muted)]">{art.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-[var(--text-primary)] max-w-xs sm:max-w-md truncate">
                      {art.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[var(--accent-green-subtle)] text-[var(--accent-green)] text-[10px] whitespace-nowrap">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-muted)] whitespace-nowrap">{art.date}</td>
                    <td className="py-3 px-4 text-center text-[var(--text-secondary)]">{art.views || 0}</td>
                    <td className="py-3 px-4 text-center text-[var(--text-secondary)]">{art.likes || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View in Reader */}
                        <Link
                          to={`/articles/${art.id}`}
                          className="p-1 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                          title="Открыть очерк"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit Article */}
                        {isModerator && (
                          <button
                            onClick={() => setEditingArticle(art)}
                            className="p-1 rounded-md hover:bg-[var(--accent-green-subtle)] text-[var(--accent-green)] transition-colors cursor-pointer"
                            title="Редактировать очерк"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Article */}
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteConfirmArticle(art)}
                            className="p-1 rounded-md hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"
                            title="Удалить очерк"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredArticles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[var(--text-muted)] font-mono-code">
                      Публикации не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* COMMENTS MODERATION SECTION */}
      <div className="space-y-3 pt-6 border-t border-[var(--border-hairline)]">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border-hairline)]">
          <div className="space-y-0.5">
            <h2 className="text-base font-medium text-[var(--text-primary)] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
              <span>Модерация комментариев</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono-code">
              Удаление некорректных заметок и поддержание академического тона
            </p>
          </div>
          <div className="text-xs font-mono-code text-[var(--text-muted)]">
            Всего: {allCommentsList.length}
          </div>
        </div>

        {/* Comments Table */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[11px] font-mono-code text-[var(--text-muted)]">
                  <th className="py-3 px-4 font-normal">Очерк</th>
                  <th className="py-3 px-4 font-normal">Автор</th>
                  <th className="py-3 px-4 font-normal">Дата</th>
                  <th className="py-3 px-4 font-normal">Текст</th>
                  <th className="py-3 px-4 font-normal text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {allCommentsList.map((comm) => (
                  <tr key={comm.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="py-3 px-4 font-mono-code text-[var(--accent-green)] text-[11px] max-w-[180px] truncate">
                      {comm.articleTitle}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-[var(--text-primary)]">{comm.author}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono-code">{comm.role}</div>
                    </td>
                    <td className="py-3 px-4 font-mono-code text-[var(--text-muted)] whitespace-nowrap">{comm.date}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] max-w-sm sm:max-w-lg leading-relaxed">
                      {comm.text}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isModerator && (
                        <button
                          onClick={() => {
                            setDeleteConfirmComment({
                              commentId: comm.id,
                              articleId: comm.articleId,
                              author: comm.author,
                              text: comm.text
                            });
                          }}
                          className="p-1 rounded-md hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"
                          title="Удалить комментарий"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {allCommentsList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[var(--text-muted)] font-mono-code">
                      Заметок пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SYSTEM ACTIONS & DATA MAINTENANCE */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[var(--accent-green)]" />
              <span>Обслуживание данных</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Резервное копирование и экспорт архива базы знаний в формат JSON
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Экспорт JSON</span>
            </button>

            <button
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-xs font-medium text-red-500/80 hover:text-red-500 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить данные</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Article Modal */}
      <EditArticleModal
        isOpen={!!editingArticle}
        article={editingArticle}
        onClose={() => setEditingArticle(null)}
        onSave={handleSaveEditedArticle}
      />

      {/* Create Article Modal */}
      <NewArticleModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddArticle={handleAddArticle}
      />

      {/* Delete Article Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirmArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-w-md w-full p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] text-center space-y-4 shadow-[var(--shadow-soft)]"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[var(--text-primary)]">Удалить очерк?</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Вы действительно хотите удалить «<span className="text-[var(--text-primary)] font-medium">{deleteConfirmArticle.title}</span>»?
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmArticle(null)}
                  className="px-4 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  onClick={executeDeleteArticle}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Comment Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirmComment && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-w-md w-full p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] text-center space-y-4 shadow-[var(--shadow-soft)]"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[var(--text-primary)]">Удалить комментарий?</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Отзыв пользователя <span className="font-medium text-[var(--text-primary)]">{deleteConfirmComment.author}</span> будет удален из публикации.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmComment(null)}
                  className="px-4 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  onClick={executeDeleteComment}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
