import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { getCoverImage } from './InstituteCard';

const PLACEHOLDER_COLORS = {
  'Tuition Classes': [
    'from-[#C8742A]/25 to-[#E9DFD1]',
    'from-[#C8742A]/15 to-[#F6F1E8]',
    'from-[#E9DFD1] to-[#C8742A]/20',
    'from-[#1F2A44]/15 to-[#F6F1E8]',
    'from-[#C8742A]/10 to-[#E9DFD1]',
  ],
  'Computer Classes': [
    'from-[#1F2A44]/20 to-[#E9DFD1]',
    'from-[#1F2A44]/10 to-[#F6F1E8]',
    'from-[#E9DFD1] to-[#1F2A44]/15',
    'from-[#C8742A]/15 to-[#F6F1E8]',
    'from-[#1F2A44]/10 to-[#E9DFD1]',
  ],
};

const isRealUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/src') || url.startsWith('/images'));
};

export default function ImageGallery({ images = [], name = '', category = 'Tuition Classes', instituteId }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const colors = PLACEHOLDER_COLORS[category] || PLACEHOLDER_COLORS['Tuition Classes'];

  // Resolve cover image
  const coverUrl = getCoverImage({ id: instituteId, category, coverImage: images[0] });
  
  // Combine cover image with other gallery images
  const allImages = [coverUrl, ...images.filter(img => img && img !== coverUrl && isRealUrl(img))];
  
  // Ensure we have at least 5 display items for the grid
  const displayCount = Math.max(allImages.length, 5);
  const items = Array.from({ length: displayCount }, (_, i) => {
    const imgUrl = allImages[i];
    return {
      url: isRealUrl(imgUrl) ? imgUrl : null,
      label: `${name} — Photo ${i + 1}`,
      gradient: colors[i % colors.length],
    };
  });

  const openLightbox = (index) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  };

  const goTo = useCallback((direction, e) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      const next = prev + direction;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  }, [items.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goTo(-1);
      if (e.key === 'ArrowRight') goTo(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goTo]);

  // Support for swipe gestures on mobile
  const [touchStart, setTouchStart] = useState(null);
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) goTo(1);
    if (touchStart - touchEnd < -50) goTo(-1);
    setTouchStart(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 1 Large + 4 Small Grid Layout */}
      <div className="flex flex-col gap-2">
        {/* Large Featured Image */}
        <div 
          onClick={() => openLightbox(0)}
          className="w-full h-[220px] rounded-t-[18px] bg-gradient-to-br flex items-center justify-center overflow-hidden cursor-pointer relative group"
        >
          {items[0]?.url ? (
            <img src={items[0].url} alt={`${name} main facility view`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${items[0]?.gradient} flex items-center justify-center`}>
              <span className="text-6xl font-heading text-primary/30">{name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* 4 Small Images */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => {
            const isLast = i === 4;
            const extraCount = Math.max(0, items.length - 5) + 18; // Mocking +18 more
            
            return (
              <div 
                key={i} 
                onClick={() => openLightbox(i)}
                className={`h-[72px] bg-gradient-to-br flex items-center justify-center overflow-hidden cursor-pointer relative group ${
                  i === 1 ? 'rounded-bl-[18px]' : ''
                } ${i === 4 ? 'rounded-br-[18px]' : ''}`}
              >
                {items[i]?.url ? (
                  <img src={items[i].url} alt={`${name} facility ${i}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${items[i]?.gradient}`} />
                )}
                
                {isLast ? (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">+{extraCount}</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={() => openLightbox(0)}
        className="w-full py-3.5 mt-3 border border-border/60 text-primary font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-bg transition-colors shadow-sm"
      >
        <Grid size={18} />
        View Full Gallery
      </button>

      {/* Fullscreen Slider Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center touch-none"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
            <span className="text-white/80 text-sm font-medium">
              {selectedIndex + 1} / {items.length}
            </span>
            <button 
              onClick={closeLightbox} 
              className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Slider Content */}
          <div className="w-full max-w-4xl h-full flex items-center justify-center relative p-0 md:p-12" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-full max-h-[80vh] flex items-center justify-center overflow-hidden">
              {items[selectedIndex]?.url ? (
                <img 
                  src={items[selectedIndex].url} 
                  alt={items[selectedIndex].label} 
                  className="max-w-full max-h-full object-contain select-none transition-transform duration-300" 
                  style={{ animation: 'fadeIn 0.2s ease-out' }}
                />
              ) : (
                <div className={`w-full max-w-lg aspect-video bg-gradient-to-br ${items[selectedIndex]?.gradient} flex items-center justify-center rounded-2xl`}>
                  <span className="text-7xl font-heading text-primary/30">{name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Navigation Arrows (Desktop) */}
            <button 
              onClick={(e) => goTo(-1, e)} 
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur text-white rounded-full hover:bg-white/20 hidden md:block"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={(e) => goTo(1, e)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur text-white rounded-full hover:bg-white/20 hidden md:block"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
