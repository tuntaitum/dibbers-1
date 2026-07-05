import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

export default function PhotoGallery({ photos = [], alt = "Venue", className = "" }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (photos.length === 0) {
    return <div className={`w-full bg-brand-brown/10 ${className}`} />;
  }

  if (photos.length === 1) {
    return (
      <>
        <div className={`relative group ${className}`}>
          <img src={photos[0]} alt={alt} className="w-full h-full object-cover" />
          <button
            onClick={() => setLightbox(true)}
            className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Expand size={16} />
          </button>
        </div>
        {lightbox && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
            <img src={photos[0]} alt={alt} className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </>
    );
  }

  const go = (dir) => {
    setIndex(i => (i + dir + photos.length) % photos.length);
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        <img src={photos[index]} alt={alt} className="w-full h-full object-cover" />

        {/* Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); go(1); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        {/* Counter + expand */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {index + 1} / {photos.length}
          </span>
          <button
            onClick={() => setLightbox(true)}
            className="bg-black/40 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/60 transition-colors"
          >
            <Expand size={16} />
          </button>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? "bg-white scale-110" : "bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <img src={photos[index]} alt={alt} className="max-w-full max-h-full object-contain" />
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}