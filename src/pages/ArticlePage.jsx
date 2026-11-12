import React from 'react';
import ArticleReader from '../components/ArticleReader';

export default function ArticlePage({
  articles,
  onIncrementViews,
  favorites,
  onToggleFavorite,
  likes,
  onToggleLike
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ArticleReader
        articles={articles}
        onIncrementViews={onIncrementViews}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        likes={likes}
        onToggleLike={onToggleLike}
      />
    </div>
  );
}
