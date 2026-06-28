import { Link } from 'react-router';
import { MapPin, Phone, MessageCircle, Clock, BookOpen, Award } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

// Curated high-quality stock photo mapping to give seed data a premium visual feel
export function getCoverImage(institute) {
  if (institute.coverImage && institute.coverImage.startsWith('http')) {
    return institute.coverImage;
  }
  
  return null;
}

export default function InstituteCard({ institute }) {
  const {
    id,
    slug,
    name,
    category,
    description,
    subjects,
    classesCovered,
    area,
    fees,
    timings,
    experience,
    phone,
    whatsapp,
  } = institute;

  const isTuition = category === 'Tuition Classes';
  const imageUrl = getCoverImage(institute);

  const handleCallClick = (e) => {
    e.stopPropagation(); // Avoid triggering card links
    trackEvent(id, 'call_click');
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation(); // Avoid triggering card links
    trackEvent(id, 'whatsapp_click');
  };

  return (
    <Link
      to={`/institutes/${slug}`}
      className="card flex flex-col h-full bg-white relative overflow-hidden group no-underline cursor-pointer"
    >
      {/* Large Cover Image with Overlays */}
      <div className="relative h-56 overflow-hidden bg-[#F6F1E8]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center ${isTuition ? 'from-[#C8742A]/20 to-[#E9DFD1]' : 'from-[#1F2A44]/20 to-[#E9DFD1]'}`}>
            <span className="text-6xl font-heading text-primary/30 select-none">
              {name.charAt(0)}
            </span>
          </div>
        )}
        {/* Dark Gradient Overlay for Typography readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Badge */}
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-xs ${
            isTuition ? 'bg-accent/90' : 'bg-primary/90'
          }`}>
            {category}
          </span>
          {/* Experience Badge */}
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-primary shadow-sm backdrop-blur-xs">
            <Award size={12} className="text-accent" />
            {experience} exp
          </span>
        </div>

        {/* Bottom Overlays */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 pointer-events-none">
          {/* Tuition name */}
          <h3 className="font-heading text-lg md:text-xl text-white leading-tight drop-shadow-sm line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center justify-between text-white/95 text-xs">
            {/* Area Badge */}
            <span className="flex items-center gap-1 font-medium bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
              <MapPin size={12} className="text-accent" />
              {area}
            </span>
            {/* Fee range badge */}
            <span className="font-bold bg-accent/95 px-2 py-0.5 rounded text-white shadow-sm">
              {fees}
            </span>
          </div>
        </div>
      </div>

      {/* Card Details (Below Image) */}
      <div className="p-4 flex flex-col gap-3.5 flex-1">
        {/* Subject Badges */}
        <div className="flex flex-wrap gap-1">
          {subjects.slice(0, 3).map((subject) => (
            <span
              key={subject}
              className="text-[10px] px-2 py-0.5 rounded bg-accent-light/50 text-accent font-semibold border border-accent/10"
            >
              {subject}
            </span>
          ))}
          {subjects.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface text-text-muted font-medium">
              +{subjects.length - 3} more
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Classes Covered */}
        <div className="text-xs text-text font-medium flex items-center gap-1.5 flex-wrap">
          <span className="text-text-muted font-normal">Classes:</span>
          {classesCovered.slice(0, 4).map((cls) => (
            <span key={cls} className="bg-surface px-1.5 py-0.5 rounded text-[11px]">
              {cls}
            </span>
          ))}
          {classesCovered.length > 4 && (
            <span className="text-[11px] text-accent font-semibold">+{classesCovered.length - 4}</span>
          )}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-2 py-2.5 my-0.5 border-t border-b border-border/45 text-[11px] text-text-muted">
          <span className="flex items-center gap-1 truncate" title={timings}>
            <Clock size={12} className="text-accent flex-shrink-0" />
            {timings}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} className="text-accent flex-shrink-0" />
            {subjects.length} Subjects
          </span>
        </div>

        {/* Actions: WhatsApp + Call only (card itself is the link) */}
        <div className="grid grid-cols-2 gap-2 pt-1.5 mt-auto">
          {/* WhatsApp Action button */}
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="btn btn-success btn-sm flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white text-xs font-semibold border-0 hover:bg-[#236b42]"
            title="Chat on WhatsApp"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>

          {/* Call Action button */}
          <a
            href={`tel:${phone}`}
            onClick={handleCallClick}
            className="btn btn-outline btn-sm flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-white"
            title="Call Institute"
          >
            <Phone size={14} />
            Call
          </a>
        </div>
      </div>
    </Link>
  );
}

