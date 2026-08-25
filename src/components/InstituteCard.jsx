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
      className="flex flex-row bg-white rounded-2xl shadow-[0_4px_16px_rgba(15,23,42,0.04)] p-3.5 gap-3.5 relative no-underline group transition-all duration-300 active:scale-[0.98] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] border border-slate-200/80 hover:border-[#F97316]/40"
    >
      {/* Image Area */}
      <div className="w-[30%] max-w-[110px] shrink-0 relative rounded-xl overflow-hidden min-h-[115px] bg-slate-100 shadow-inner">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="text-3xl font-bold text-[#0F172A]/20 select-none">
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Verified Badge (Top Left) */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <span className="flex items-center bg-white/90 backdrop-blur-md p-1 rounded-full shadow-xs border border-white/40">
            <CheckCircle2 size={12} className="text-[#1B6B40]" />
          </span>
        </div>

        {/* Photo Counter (Bottom Left) */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-white text-[9px] font-semibold tracking-wide">
            <ImageIcon size={9} />
            <span>1/4</span>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col min-w-0 py-0.5">
        {/* Institute Name */}
        <h3 className="text-[17px] font-bold text-[#0F172A] leading-snug tracking-tight truncate mb-1 pr-2">
          {name}
        </h3>

        {/* Subjects */}
        <p className="text-[13px] font-medium text-slate-500 truncate mb-1">
          {subjects.join(', ')}
        </p>

        {/* Area */}
        <p className="text-[12px] font-medium text-slate-500 flex items-center gap-1 mb-2">
          <MapPin size={12} className="text-[#F97316]" />
          <span className="truncate">{area}</span>
        </p>

        {/* Experience & Expertise */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mb-auto">
          {experience && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
              <Clock size={10} className="opacity-70 text-slate-500" />
              <span className="truncate max-w-[70px]">{experience}</span>
            </div>
          )}
          {expertise && (
            <div className="text-[11px] text-[#F97316] font-bold bg-orange-50 px-2 py-0.5 rounded-md truncate max-w-[100px] border border-orange-100">
              {expertise}
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
          {/* Class Chips */}
          <div className="flex">
            <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 truncate max-w-[90px] border border-slate-200/60 shadow-2xs">
              {classesCovered[0]}
              {classesCovered.length > 1 ? ` +${classesCovered.length - 1}` : ''}
            </span>
          </div>

          {/* Fee Badge */}
          <div className="bg-[#0F172A] px-3 py-1 rounded-xl text-[12px] font-bold text-white shadow-xs">
            {fees}
          </div>
        </div>
      </div>
    </Link>
  );
}
