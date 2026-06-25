import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Award,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ReferBanner from '../components/ReferBanner';
import ImageGallery from '../components/ImageGallery';
import InstituteCard, { getCoverImage } from '../components/InstituteCard';
import { ProfileSkeleton } from '../components/Preloader';
import { getInstitute, getInstitutes } from '../lib/db';
import { trackEvent } from '../lib/analytics';

export default function InstitutePage() {
  const { slug } = useParams();
  const [institute, setInstitute] = useState(null);
  const [similarInstitutes, setSimilarInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadInstituteData() {
      setLoading(true);
      try {
        const inst = await getInstitute(slug);
        if (inst) {
          setInstitute(inst);
          // Track profile view on database
          trackEvent(inst.id, 'profile_view');

          // Fetch all and filter for similar
          const allList = await getInstitutes();
          const filtered = allList
            .filter(
              (x) =>
                x.id !== inst.id &&
                (x.published ?? true) &&
                (x.category === inst.category || x.area === inst.area)
            )
            .slice(0, 3);
          setSimilarInstitutes(filtered);
        } else {
          setInstitute(null);
        }
      } catch (err) {
        console.error('Error loading institute profile data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInstituteData();
  }, [slug]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  // 404 state
  if (!institute) {
    return (
      <>
        <SEOHead title="Institute Not Found — StudySetu" />
        <section className="section">
          <div className="container text-center py-16">
            <h1 className="section-title mb-4">Institute Not Found</h1>
            <p className="text-text-muted mb-6">
              Sorry, we couldn't find the institute you're looking for.
            </p>
            <Link to="/browse" className="btn btn-primary">
              Browse All Institutes
            </Link>
          </div>
        </section>
      </>
    );
  }

  const {
    id,
    name,
    category,
    description,
    subjects,
    classesCovered,
    area,
    address,
    fees,
    timings,
    experience,
    phone,
    whatsapp,
    images = [],
    published,
  } = institute;

  const isTuition = category === 'Tuition Classes';
  const coverImg = getCoverImage(institute);

  const handleCallClick = () => {
    trackEvent(id, 'call_click');
  };

  const handleWhatsAppClick = () => {
    trackEvent(id, 'whatsapp_click');
  };

  // Google Maps search URL
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    name + ' ' + address
  )}`;

  return (
    <>
      <SEOHead title={`${name} — ${category} in ${area} | StudySetu`} />

      <section className="section py-6 md:py-10 bg-bg min-h-screen">
        <div className="container max-w-6xl px-4">
          {/* Top navigation breadcrumb */}
          <div className="flex items-center justify-between mb-5">
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors no-underline font-semibold"
            >
              <ArrowLeft size={16} />
              Back to Directory
            </Link>

            {published === false && (
              <span className="px-3 py-1 rounded bg-red-100 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
                Draft / Unpublished Preview
              </span>
            )}
          </div>

          {/* Above the Fold: Immersive Hero Banner */}
          <div className="relative w-full h-[280px] md:h-[420px] rounded-3xl overflow-hidden shadow-lg border border-border/40 mb-8">
            <img
              src={coverImg}
              alt={name}
              className="w-full h-full object-cover"
            />
            {/* Ambient Dark Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />

            {/* Overlaid Banner Info */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                    isTuition ? 'bg-accent' : 'bg-primary'
                  }`}>
                    {category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                    <MapPin size={12} className="text-accent" />
                    {area}
                  </span>
                </div>
                <h1 className="font-heading text-2xl md:text-4xl text-white leading-tight drop-shadow-md">
                  {name}
                </h1>
                
                {/* Verified Badge */}
                <div className="flex items-center gap-1.5 mt-2.5 text-white/95 text-xs md:text-sm">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck size={14} />
                    Verified Listing
                  </span>
                </div>
              </div>

              {/* Quick Info Badges */}
              <div className="hidden md:flex flex-col items-end gap-1.5 text-right">
                <span className="text-xs text-white/60">Experience</span>
                <span className="font-heading text-lg text-white font-semibold flex items-center gap-1.5">
                  <Award size={18} className="text-accent" />
                  {experience}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Full Editorial Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Above the Fold quick pills */}
              <div className="card p-6 flex flex-col gap-4">
                <h3 className="font-heading text-base text-primary mb-1 border-b border-border/40 pb-2">
                  At a Glance
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-text-muted block mb-1.5">Subjects Offered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {subjects.map(sub => (
                        <span key={sub} className="text-xs px-2.5 py-1 rounded bg-accent-light/45 text-accent font-semibold">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block mb-1.5">Classes Covered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {classesCovered.map(cls => (
                        <span key={cls} className="text-xs px-2.5 py-1 rounded bg-surface text-primary font-medium border border-border/20">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Refer Banner */}
              <ReferBanner />

              {/* About Section */}
              <div id="about" className="card p-6 md:p-8">
                <h2 className="font-heading text-xl md:text-2xl text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                  About {name}
                </h2>
                <p className="text-text leading-relaxed text-sm md:text-base whitespace-pre-line mb-4">
                  {description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-border/40">
                  <div className="flex items-start gap-2.5">
                    <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs text-text-muted font-bold uppercase tracking-wider">Experience</h4>
                      <p className="text-sm font-semibold text-primary">{experience} in education</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs text-text-muted font-bold uppercase tracking-wider">Batches</h4>
                      <p className="text-sm font-semibold text-primary">Flexible timing slots</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fees Structure */}
              <div id="fees" className="card p-6 md:p-8">
                <h2 className="font-heading text-xl md:text-2xl text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                  Fees & Pricing
                </h2>
                <div className="bg-primary/5 rounded-2xl p-5 border border-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Standard Fees</h4>
                    <p className="font-heading text-2xl text-primary font-bold">{fees}</p>
                  </div>
                  <div className="text-xs text-text-muted max-w-xs space-y-1">
                    <p className="flex items-center gap-1.5 text-primary/80 font-semibold">
                      <ShieldCheck size={14} className="text-accent" />
                      100% Free Referral Service
                    </p>
                    <p>Pay fees directly to the institute. StudySetu charges no middleman fees or brokerage.</p>
                  </div>
                </div>
              </div>

              {/* Timings */}
              <div id="timings" className="card p-6 md:p-8">
                <h2 className="font-heading text-xl md:text-2xl text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                  Class Timings
                </h2>
                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-border/40">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-text font-semibold">{timings}</p>
                    <p className="text-xs text-text-muted mt-1">Please confirm the batch slot availability during your call/chat.</p>
                  </div>
                </div>
              </div>

              {/* Location Detail Section with Visual Map */}
              <div id="location" className="card p-6 md:p-8">
                <h2 className="font-heading text-xl md:text-2xl text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                  Location & Address
                </h2>
                <p className="text-text text-sm md:text-base leading-relaxed flex items-start gap-2.5 mb-5">
                  <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </p>

                {/* Mock Map Layout */}
                <div className="relative h-44 rounded-2xl border border-border/50 overflow-hidden bg-[#F1EBE0] flex flex-col items-center justify-center p-6 text-center group">
                  {/* Styled Grid Background pattern to look like maps */}
                  <div className="absolute inset-0 bg-grid-[#1F2A44]/5 opacity-40 pointer-events-none" />
                  <div className="absolute w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center animate-ping duration-1000 pointer-events-none" />
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-md relative z-10 pointer-events-none">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <h4 className="font-heading text-sm text-primary mt-3 relative z-10 font-bold">Interactive Location Map</h4>
                  <p className="text-xs text-text-muted max-w-xs mt-1 relative z-10">Nagpur, Area: {area}</p>
                  
                  <a
                    href={mapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/95 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 no-underline cursor-pointer"
                  >
                    <span className="font-bold flex items-center gap-1 text-sm">
                      Open in Google Maps
                      <ExternalLink size={14} />
                    </span>
                    <span className="text-[11px] text-white/70">Navigate to {name} in {area}</span>
                  </a>
                </div>
              </div>

              {/* Gallery Section */}
              <div id="gallery" className="card p-6 md:p-8">
                <h2 className="font-heading text-xl md:text-2xl text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                  Photo Gallery
                </h2>
                <ImageGallery images={images} name={name} category={category} instituteId={id} />
              </div>

              {/* Similar Institutes Nearby */}
              <div className="pt-4">
                <h2 className="font-heading text-xl md:text-2xl text-primary mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                  Similar Institutes Nearby
                </h2>
                {similarInstitutes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarInstitutes.map((inst) => (
                      <InstituteCard key={inst.id} institute={inst} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic bg-white p-4 rounded-xl border border-border/40 text-center">
                    No other institutes found in {area} or category {category} currently.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Desktop Sticky Action Box */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6 hidden lg:block">
              <div className="card p-6 bg-white shadow-md border-border/50">


                <div className="space-y-4">
                  <div>
                    <h3 className="font-heading text-base text-primary mb-0.5">Contact Directly</h3>
                    <p className="text-xs text-text-muted">No commissions. Speak with the founder directly.</p>
                  </div>

                  {/* Call Button */}
                  <a
                    href={`tel:${phone}`}
                    onClick={handleCallClick}
                    className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 text-sm no-underline py-3 cursor-pointer"
                  >
                    <Phone size={18} />
                    Call {phone}
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="btn btn-success btn-lg w-full flex items-center justify-center gap-2 text-sm text-white no-underline py-3 cursor-pointer"
                  >
                    <MessageCircle size={18} />
                    WhatsApp Now
                  </a>
                </div>

                {/* Trust Signals */}
                <div className="mt-6 pt-5 border-t border-border/40 space-y-2.5 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600 w-4.5 h-4.5 flex-shrink-0" />
                    <span>Manually Verified Listing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="text-accent w-4.5 h-4.5 flex-shrink-0" />
                    <span>{experience} Teaching Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Quick Action Footer (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/45 p-3 flex gap-3 lg:hidden z-40 shadow-xl">
        <a
          href={`tel:${phone}`}
          onClick={handleCallClick}
          className="btn btn-primary flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 no-underline"
        >
          <Phone size={16} />
          Call Now
        </a>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="btn btn-success flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 text-white no-underline"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>

      {/* Scroll spacer on mobile to prevent footer overlapping content */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
