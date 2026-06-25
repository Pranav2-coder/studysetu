import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCoverImage } from './InstituteCard';

const PLACEHOLDER_COLORS = {
  'Tuition Classes': [
    'from-[#C8742A]/25 to-[#E9DFD1]',
    'from-[#C8742A]/15 to-[#F6F1E8]',
    'from-[#E9DFD1] to-[#C8742A]/20',
  ],
  'Computer Classes': [
    'from-[#1F2A44]/20 to-[#E9DFD1]',
    'from-[#1F2A44]/10 to-[#F6F1E8]',
    'from-[#E9DFD1] to-[#1F2A44]/15',
  ],
};

const isRealUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/src') || url.startsWith('/images'));
};

export default function ImageGallery({ images = [], name = '', category = 'Tuition Classes', instituteId }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const colors = PLACEHOLDER_COLORS[category] || PLACEHOLDER_COLORS['Tuition Classes'];

  // Resolve cover image
  const coverUrl = getCoverImage({ id: instituteId, category });
  
  // Combine cover image with other gallery images
  const allImages = [coverUrl, ...images.filter(img => img && img !== coverUrl && isRealUrl(img))];
  
  // Ensure we have at least 3 display items
  const displayCount = Math.max(allImages.length, 3);
  const items = Array.from({ length: displayCount }, (_, i) => {
    const imgUrl = allImages[i];
    return {
      url: isRealUrl(imgUrl) ? imgUrl : null,
      label: `${name} — Photo ${i + 1}`,
      gradient: colors[i % colors.length],
    };
  });

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goTo = (direction) => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      const next = prev + direction;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  };

  return (
    <>
      <div className="space-y-2.5">
        {/* Large cover image */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br flex items-center justify-center cursor-pointer overflow-hidden border border-border/40 relative group"
        >
          {items[0]?.url ? (
            <img
              src={items[0].url}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${items[0]?.gradient} flex items-center justify-center`}>
              <span className="text-6xl font-heading text-primary/30 select-none">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        </button>

        {/* Thumbnail row */}
        {items.length > 1 && (
          <div className="grid grid-cols-3 gap-2.5">
            {items.slice(1).map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(i + 1)}
                className="h-20 md:h-24 rounded-xl bg-gradient-to-br flex items-center justify-center cursor-pointer overflow-hidden border border-border/40 relative group"
              >
                {item.url ? (
                  <img
                    src={item.url}
                    alt={`${name} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                    <span className="text-xs text-text-muted/60 font-body select-none">
                      Photo {i + 2}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-accent cursor-pointer transition-colors"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            {/* Image area */}
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl bg-black flex items-center justify-center overflow-hidden border border-white/10">
              {items[selectedIndex]?.url ? (
                <img
                  src={items[selectedIndex].url}
                  alt={items[selectedIndex].label}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${items[selectedIndex]?.gradient} flex items-center justify-center`}>
                  <div className="text-center">
                    <span className="text-7xl font-heading text-primary/30 block mb-2 select-none">
                      {name.charAt(0)}
                    </span>
                    <span className="text-sm text-text-muted">
                      {items[selectedIndex]?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation arrows */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-2.5 shadow-lg hover:bg-white cursor-pointer transition-transform hover:scale-105"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} className="text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-2.5 shadow-lg hover:bg-white cursor-pointer transition-transform hover:scale-105"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} className="text-primary" />
                </button>
              </>
            )}

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                    i === selectedIndex ? 'bg-white scale-110 w-4' : 'bg-white/45'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
