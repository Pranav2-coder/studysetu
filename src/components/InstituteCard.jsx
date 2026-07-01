/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router';
import { MapPin, CheckCircle2, Image as ImageIcon, Clock } from 'lucide-react';

export function getCoverImage(institute) {
  if (institute.coverImage) {
    const urls = institute.coverImage.split(',').map(s => s.trim()).filter(Boolean);
    if (urls.length > 0 && urls[0].startsWith('http')) {
      return urls[0];
    }
  }
  return null;
}

export default function InstituteCard({ institute }) {
  const { slug, name, subjects, classesCovered, area, fees, expertise, experience } = institute;
  const imageUrl = getCoverImage(institute);

  return (
    <Link
      to={`/institutes/${slug}`}
      className="flex flex-row bg-white rounded-[22px] shadow-[0_8px_24px_-6px_rgba(31,42,68,0.06)] p-3.5 gap-4 relative no-underline group transition-all duration-300 active:scale-[0.97] hover:shadow-[0_12px_32px_-8px_rgba(31,42,68,0.12)] border border-border/40 hover:border-accent/30"
    >
      {/* Image Area */}
      <div className="w-[30%] max-w-[110px] shrink-0 relative rounded-[16px] overflow-hidden min-h-[120px] bg-[#F6F1E8] shadow-inner">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F2A44]/10 to-[#E9DFD1]">
            <span className="text-4xl font-heading text-primary/20 select-none">
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Verified Badge (Top Left) */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <span className="flex items-center bg-white/90 backdrop-blur-md p-1 rounded-full shadow-sm border border-white/40">
            <CheckCircle2 size={12} className="text-[#22c55e]" />
          </span>
        </div>

        {/* Photo Counter (Bottom Left) */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-white text-[9px] font-semibold tracking-wide">
            <ImageIcon size={9} />
            <span>1/4</span>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col min-w-0 py-1">
        {/* Institute Name */}
        <h3 className="text-[19px] font-extrabold text-primary leading-[1.15] tracking-tight truncate mb-1 pr-8">
          {name}
        </h3>

        {/* Subjects */}
        <p className="text-[13px] font-medium text-text-muted/90 truncate mb-1.5">
          {subjects.join(', ')}
        </p>

        {/* Area */}
        <p className="text-[12px] font-medium text-text-muted flex items-center gap-1 mb-2">
          <MapPin size={12} className="text-accent opacity-80" />
          <span className="truncate">{area}</span>
        </p>

        {/* Experience & Expertise */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-auto">
          {experience && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-text-muted bg-[#F6F1E8]/60 px-2 py-0.5 rounded-md border border-border/40">
              <Clock size={10} className="opacity-70" />
              <span className="truncate max-w-[70px]">{experience}</span>
            </div>
          )}
          {expertise && (
            <div className="text-[11px] text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-md truncate max-w-[100px] border border-accent/10">
              {expertise}
            </div>
          )}
          {!experience && !expertise && <div className="mb-auto"></div>}
        </div>


        {/* Bottom Info */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/30">
          {/* Class Chips */}
          <div className="flex">
            <span className="bg-[#F6F1E8] px-3 py-1.5 rounded-xl text-[11px] font-bold text-text-muted truncate max-w-[90px] border border-border/40 shadow-sm">
              {classesCovered[0]}
              {classesCovered.length > 1 ? ` +${classesCovered.length - 1}` : ''}
            </span>
          </div>

          {/* Fee Badge */}
          <div className="bg-primary px-3 py-1.5 rounded-xl text-[13px] font-bold text-white shadow-sm shadow-primary/20">
            {fees}
          </div>
        </div>
      </div>
    </Link>
  );
}
