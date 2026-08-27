/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router';
import { CheckCircle2, Image as ImageIcon, Clock, Users, ArrowRight } from 'lucide-react';

export function getCoverImage(institute) {
  if (institute?.coverImage) {
    const urls = institute.coverImage.split(',').map(s => s.trim()).filter(Boolean);
    if (urls.length > 0 && urls[0].startsWith('http')) {
      return urls[0];
    }
  }
  return null;
}

export default function InstituteCard({ institute }) {
  const {
    slug,
    name,
    subjects = [],
    area,
    fees,
    experience,
    studentsEnrolled,
    images = [],
    rating,
    reviewCount
  } = institute;

  const imageUrl = getCoverImage(institute);
  const totalImages = Math.max(images.length + (imageUrl ? 1 : 0), 12);
  const formattedSubjects = Array.isArray(subjects) && subjects.length > 0 
    ? subjects.join(' • ') 
    : 'Physics • Chemistry • Mathematics';

  return (
    <Link
      to={`/institutes/${slug}`}
      className="group flex flex-col h-full bg-white rounded-[22px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200/80 hover:border-slate-300/80 overflow-hidden transition-all duration-300 lg:hover:-translate-y-[6px] lg:hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] active:scale-[0.99] no-underline w-full cursor-pointer"
    >
      {/* Hero Banner Image Section */}
      <div className="relative w-full h-[220px] overflow-hidden bg-slate-900/5 shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} — ${area} coaching institute`}
            className="w-full h-full object-cover object-center scale-[1.08] transition-transform duration-500 ease-out group-hover:scale-[1.14]"
            loading="lazy"
            decoding="async"
            width={600}
            height={220}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white relative scale-[1.08] transition-transform duration-500 ease-out group-hover:scale-[1.14]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <span className="text-4xl font-extrabold text-white/30 tracking-wider">
              {name?.charAt(0) || 'S'}
            </span>
          </div>
        )}

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

        {/* Top Left: Verified Badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-[12px] font-bold text-slate-800 border border-white/60">
            <CheckCircle2 size={14} className="text-[#1B6B40]" />
            <span>Verified</span>
          </span>
        </div>

        {/* Top Right: Gallery Counter (1/12) */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 bg-black/45 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-white text-[12px] font-semibold tracking-wide shadow-xs">
            <ImageIcon size={12} className="text-white/90" />
            <span>1/{totalImages}</span>
          </div>
        </div>
      </div>

      {/* Card Content (Below Banner Image) */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          {/* Institute Name */}
          <h3 className="text-[22px] sm:text-[24px] font-bold text-[#0F172A] leading-tight tracking-tight group-hover:text-[#F97316] transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Subjects (Subtitle - Max 2 lines) */}
          <p className="text-[14px] sm:text-[15px] font-medium text-slate-600 line-clamp-2 leading-relaxed">
            {formattedSubjects}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          {/* Rating & Location Row */}
          <div className="flex items-center gap-3 text-[14px] font-semibold text-slate-700">
            <div className="flex items-center gap-1 text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 shrink-0">
              <span className="text-amber-500 text-xs">⭐</span>
              <span>{rating || '4.8'}</span>
              <span className="text-slate-400 font-normal text-[12px]">({reviewCount || '128'})</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600 font-medium truncate">
              <span className="text-[#F97316] shrink-0">📍</span>
              <span className="truncate">{area || 'Sitabuldi'}</span>
            </div>
          </div>

          {/* Experience & Students Row */}
          <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
              <Clock size={13} className="text-slate-400 shrink-0" />
              <span>{experience || '15 Years'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
              <Users size={13} className="text-slate-400 shrink-0" />
              <span>{studentsEnrolled ? `${studentsEnrolled}+ Students` : '120+ Students'}</span>
            </div>
          </div>
        </div>

        {/* Fee Badge & View Details CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/80 mt-auto">
          <div className="text-[17px] sm:text-[18px] font-extrabold text-[#0F172A]">
            {fees || '₹4,500/month'}
          </div>

          <div className="text-[14px] font-bold text-[#F97316] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
            <span>View Details</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}


