import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';
import AnatomyExplorer from '../components/AnatomyExplorer';
import EncyclopediaExplorer from '../components/EncyclopediaExplorer';
import HabitatMap from '../components/HabitatMap';
import EthologyQuiz from '../components/EthologyQuiz';
import PhotoGallery from '../components/PhotoGallery';

export default function HomePage({
  articles,
  favorites,
  onToggleFavorite,
  likes,
  onToggleLike
}) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Капибаропедия — Научно-образовательная монография';
  }, []);

  const handleSelectArticle = (id) => {
    navigate(`/articles/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Hero section */}
      <Hero
        onStartReading={() => navigate('/articles')}
        onExploreAnatomy={() => handleScrollTo('anatomy')}
      />

      {/* Bento Grid Overview */}
      <div id="bento">
        <BentoGrid onSelectArticle={handleSelectArticle} />
      </div>

      {/* Chapter 01: Anatomy Explorer */}
      <div id="anatomy">
        <AnatomyExplorer />
      </div>

      {/* Chapter 02: Encyclopedia Articles Preview */}
      <div id="journal">
        <EncyclopediaExplorer
          articles={articles}
          onSelectArticle={handleSelectArticle}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          likes={likes}
          onToggleLike={onToggleLike}
        />
      </div>

      {/* Chapter 03: GIS South American Biomes Map */}
      <div id="atlas">
        <HabitatMap />
      </div>

      {/* Chapter 04: Ethological Analysis & Totem */}
      <div id="quiz">
        <EthologyQuiz />
      </div>

      {/* Chapter 05: Photographic Archive */}
      <div id="gallery">
        <PhotoGallery />
      </div>
    </div>
  );
}
