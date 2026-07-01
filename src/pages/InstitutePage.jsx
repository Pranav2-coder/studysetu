import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  Phone, MessageCircle, MapPin, Clock, Share, ArrowLeft, ShieldCheck, Eye, Globe,
  Users, Navigation, Star, ChevronDown, ChevronUp, Image as ImageIcon, X
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ImageGallery from '../components/ImageGallery';
import InstituteCard, { getCoverImage } from '../components/InstituteCard';
import OptimizedImage from '../components/OptimizedImage';
import { ProfileSkeleton } from '../components/Preloader';
import { getInstitute, getInstitutes, getReviews, addReview, getInstituteAnalytics } from '../lib/db';
import { trackEvent } from '../lib/analytics';
import { generateLocalBusinessSchema, generateFAQSchema, generateBreadcrumbSchema } from '../lib/seo';

const MOCK_REVIEWS = [
  { parent: 'Rakesh Verma', student: 'Student in 10th', text: 'Excellent teaching methodology. My son improved his scores significantly in just 3 months.', date: '2 weeks ago', img: 'https://i.pravatar.cc/150?u=4', rating: 5 },
  { parent: 'Sunita Desai', student: 'Student in 12th', text: 'The faculty is very supportive. Regular test series helped in JEE preparation.', date: '1 month ago', img: 'https://i.pravatar.cc/150?u=5', rating: 5 },
  { parent: 'Vikram Singh', student: 'Student in 9th', text: 'Highly recommend! The doubt clearing sessions are very helpful for my daughter.', date: '2 months ago', img: 'https://i.pravatar.cc/150?u=6', rating: 4 },
];

export default function InstitutePage() {
  const { slug } = useParams();
  const [institute, setInstitute] = useState(null);
  const [similarInstitutes, setSimilarInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ parentName: '', studentContext: '', rating: 5, text: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [analytics, setAnalytics] = useState({ views: 0 });

  useEffect(() => {
    async function loadInstituteData() {
      setLoading(true);
      try {
        const inst = await getInstitute(slug);
        if (inst) {
          setInstitute(inst);
          trackEvent(inst.id, 'profile_view');

          const allList = await getInstitutes();
          const filtered = allList
            .filter(x => x.id !== inst.id && (x.published ?? true) && (x.category === inst.category || x.area === inst.area))
            .slice(0, 4);
          setSimilarInstitutes(filtered);

          const instReviews = await getReviews(inst.id);
          setReviews(instReviews.length > 0 ? instReviews : MOCK_REVIEWS);

          const stat = await getInstituteAnalytics(inst.id);
          setAnalytics(stat || { views: 0 });
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { coverImage } = institute || {};
  const displayImages = coverImage ? coverImage.split(',').map(s => s.trim()).filter(Boolean) : [];

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % displayImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  if (loading) return <ProfileSkeleton />;
  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold text-primary mb-2">Institute Not Found</h1>
          <Link to="/browse" className="text-accent underline font-semibold">Back to Browse</Link>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const added = await addReview({ ...newReview, instituteId: id });
      setReviews(prev => prev === MOCK_REVIEWS ? [added] : [added, ...prev]);
      setShowReviewModal(false);
      setNewReview({ parentName: '', studentContext: '', rating: 5, text: '' });
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const { id, name, category, description, subjects, classesCovered, area, address, fees, timings, experience, expertise, phone, whatsapp, studentsEnrolled = 0, facilities = [], faculty = [], images = [] } = institute;
  const profileViews = analytics.views;
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;

  // Generate Schemas
  const localBusinessSchema = generateLocalBusinessSchema(institute);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://studysetu.com/' },
    { name: 'Browse', url: 'https://studysetu.com/browse' },
    { name: name, url: `https://studysetu.com/institutes/${slug}` }
  ]);
  const faqSchema = generateFAQSchema([
    { question: `What subjects are taught at ${name}?`, answer: subjects.join(', ') },
    { question: `Where is ${name} located?`, answer: address },
    { question: `What are the monthly fees at ${name}?`, answer: fees }
  ]);
  const schema = [localBusinessSchema, breadcrumbSchema, faqSchema].filter(Boolean);

  return (
    <main className="bg-bg min-h-screen pb-24">
      <SEOHead 
        title={`${name} | StudySetu`} 
        description={`Find fees, contact details, reviews, and subjects for ${name} in ${area}. Verified tuition classes in Nagpur.`} 
        url={`/institutes/${slug}`}
        schema={schema}
      />

      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-4'}`}>
        <div className="flex items-center justify-between px-4">
          <Link to="/browse" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-[#F6F1E8] text-primary' : 'bg-black/20 text-white backdrop-blur-sm'}`}>
            <ArrowLeft size={20} />
          </Link>
          <span className={`font-heading text-lg font-bold transition-opacity duration-300 ${isScrolled ? 'opacity-100 text-primary' : 'opacity-0'}`}>
            {name.length > 20 ? name.substring(0, 20) + '...' : name}
          </span>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-[#F6F1E8] text-primary' : 'bg-black/20 text-white backdrop-blur-sm'}`}>
            <Share size={18} />
          </button>
        </div>
      </header>

      {/* Hero Image Slider */}
      <div className="relative w-full h-[320px] overflow-hidden bg-[#1F2A44]">
        {displayImages.length > 0 ? (
          displayImages.map((imgUrl, idx) => (
            <OptimizedImage
              key={idx}
              src={imgUrl}
              alt={`${name} classroom and facilities in ${area} image ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              priority={idx === 0}
            />
          ))
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
            <span className="text-8xl font-heading text-white/10">{name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />

        {/* Overlay Info */}
        <div className="absolute bottom-[60px] left-4 right-4 flex justify-between items-end z-30 pointer-events-none">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-success text-white px-2 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                <ShieldCheck size={12} /> VERIFIED
              </span>
              <span className="bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <MapPin size={12} className="text-accent" /> {area}
              </span>
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[11px] font-medium flex items-center gap-1">
            <ImageIcon size={12} /> {displayImages.length > 0 ? `${currentImageIndex + 1}/${displayImages.length}` : '1/1'}
          </div>
        </div>
      </div>

      <article className="px-4 -mt-10 relative z-40 space-y-5">
        {/* Floating Info Card */}
        <header className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40">
          <h1 className="font-heading text-2xl text-primary font-bold leading-tight mb-1">{name}</h1>
          <p className="text-sm text-text-muted mb-4">{subjects.join(', ')}</p>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex flex-col items-center flex-1 border-r border-border/50">
              <span className="text-primary font-bold flex items-center gap-1"><Clock size={14} className="text-accent" /> {experience}</span>
              <span className="text-[11px] text-text-muted">Experience</span>
            </div>
            <div className="flex flex-col items-center flex-1 border-r border-border/50">
              <span className="text-primary font-bold flex items-center gap-1"><Users size={14} className="text-accent" /> {studentsEnrolled}+</span>
              <span className="text-[11px] text-text-muted">Students</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-primary font-bold flex items-center gap-1"><Eye size={14} className="text-accent" /> {profileViews}</span>
              <span className="text-[11px] text-text-muted">Profile Views</span>
            </div>
          </div>
        </header>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <a href={`tel:${phone}`} onClick={() => trackEvent(id, 'call_click')} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-soft border border-border/40 text-primary hover:bg-[#F6F1E8] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2D7A4F] flex items-center justify-center mb-1"><Phone size={18} /></div>
            <span className="text-[11px] font-semibold">Call</span>
          </a>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent(id, 'whatsapp_click')} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-soft border border-border/40 text-primary hover:bg-[#F6F1E8] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2D7A4F] flex items-center justify-center mb-1"><MessageCircle size={18} /></div>
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </a>
          <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-soft border border-border/40 text-primary hover:bg-[#F6F1E8] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E3F2FD] text-[#1976D2] flex items-center justify-center mb-1"><Navigation size={18} /></div>
            <span className="text-[11px] font-semibold">Directions</span>
          </a>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40 space-y-4">
          {expertise && (
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <span className="text-sm font-semibold text-text-muted">Expertise</span>
              <span className="text-[13px] font-bold text-primary text-right max-w-[60%]">{expertise}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <span className="text-sm font-semibold text-text-muted">Monthly Fees</span>
            <span className="text-base font-bold text-primary">{fees}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <span className="text-sm font-semibold text-text-muted">Class Timings</span>
            <span className="text-[13px] font-bold text-primary">{timings}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-sm font-semibold text-text-muted">Days Open</span>
            <span className="text-[13px] font-bold text-primary">Mon - Sat</span>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40">
          <h2 className="text-lg font-bold text-primary mb-3">About Institute</h2>
          <div className="relative">
            <p className={`text-sm text-text-muted leading-relaxed ${!aboutExpanded && 'line-clamp-3'}`}>
              {description}
            </p>
            {!aboutExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
          <button onClick={() => setAboutExpanded(!aboutExpanded)} className="mt-2 text-accent text-sm font-semibold flex items-center gap-1">
            {aboutExpanded ? <>Read Less <ChevronUp size={16} /></> : <>Read More <ChevronDown size={16} /></>}
          </button>
        </div>

        {/* Subjects & Classes */}
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40">
          <h2 className="text-lg font-bold text-primary mb-4">Subjects Taught</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {subjects.map(s => (
              <span key={s} className="bg-[#F6F1E8] text-primary px-3 py-1.5 rounded-full text-[13px] font-medium border border-border/50">{s}</span>
            ))}
          </div>

          <h2 className="text-lg font-bold text-primary mb-4">Classes Covered</h2>
          <div className="flex flex-wrap gap-2">
            {classesCovered.map(c => (
              <span key={c} className="bg-white border-2 border-border/60 text-primary px-4 py-1.5 rounded-full text-[13px] font-bold shadow-sm">{c}</span>
            ))}
          </div>
        </div>

        {/* Facilities */}
        {facilities && facilities.length > 0 && (
          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40">
            <h2 className="text-lg font-bold text-primary mb-4">Facilities</h2>
            <div className="grid grid-cols-2 gap-3">
              {facilities.map(f => (
                <div key={f} className="flex items-center gap-2 p-2.5 bg-[#F6F1E8] rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={12} className="text-success" />
                  </div>
                  <span className="text-[13px] font-medium text-primary">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Faculty */}
        {faculty && faculty.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="text-lg font-bold text-primary">Expert Faculty</h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x hide-scrollbar">
              {faculty.map((f, i) => (
                <div key={i} className="min-w-[200px] bg-white rounded-[20px] p-4 shadow-soft border border-border/40 snap-start flex flex-col items-center text-center">
                  <img src={f.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random`} alt={f.name} className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-[#F6F1E8]" />
                  <h4 className="font-bold text-primary text-[15px]">{f.name}</h4>
                  <p className="text-accent text-xs font-semibold mb-2">{f.subject}</p>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted mt-auto w-full justify-center pt-2 border-t border-border/50">
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {f.exp || f.experience}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>{f.qual || f.qualification}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-lg font-bold text-primary">Parent & Student Reviews</h2>
            <button onClick={() => setShowReviewModal(true)} className="text-accent text-sm font-semibold flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors">
              Write a Review
            </button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x hide-scrollbar">
            {reviews.map((r, i) => (
              <div key={i} className="min-w-[280px] w-[280px] bg-white rounded-[20px] p-4 shadow-soft border border-border/40 snap-start">
                <div className="flex items-center gap-3 mb-3">
                  <img src={r.img} alt={r.parent} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-primary text-sm leading-tight">{r.parent}</h4>
                    <span className="text-[11px] text-text-muted">{r.student}</span>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} size={10} className="fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                </div>
                <p className="text-[13px] text-primary/80 italic leading-relaxed">"{r.text}"</p>
                <p className="text-[10px] text-text-muted mt-3">{r.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Gallery</h2>
            <p className="text-[13px] text-text-muted">Take a look inside our institute</p>
          </div>
          <ImageGallery images={images} name={name} category={category} instituteId={id} />
        </div>

        {/* Location */}
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40">
          <h2 className="text-lg font-bold text-primary mb-4">Location</h2>
          <div className="relative h-40 rounded-[14px] overflow-hidden mb-4 bg-[#E3F2FD]">
            {/* Map Placeholder Graphic */}
            <div className="absolute inset-0 bg-grid-[#1976D2]/10 opacity-50 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center mb-2 z-10 relative">
                <MapPin size={20} className="text-[#1976D2]" />
              </div>
              <span className="text-[#1976D2] font-semibold text-sm bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">View on Map</span>
            </div>
            <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" aria-label="Open in Google Maps"></a>
          </div>
          <p className="text-sm text-text-muted flex items-start gap-2 mb-4">
            <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
            <span>{address}</span>
          </p>
          <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-[#F6F1E8] text-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-border/50 active:scale-[0.98] transition-transform">
            <Navigation size={16} /> Get Directions
          </a>
        </div>

        {/* Similar Institutes */}
        {similarInstitutes.length > 0 && (
          <div className="pt-2 mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 px-1">Similar Institutes Nearby</h2>
            <div className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 snap-x hide-scrollbar">
              {similarInstitutes.map(inst => (
                <div key={inst.id} className="min-w-[300px] w-[300px] snap-start">
                  <InstituteCard institute={inst} />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Floating Bottom CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 flex gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/60">
          <a href={`tel:${phone}`} onClick={() => trackEvent(id, 'call_click')} className="flex-1 py-3.5 bg-[#1F2A44] text-white rounded-[14px] text-sm font-bold flex items-center justify-center gap-2 shadow-soft active:scale-[0.98] transition-transform">
            <Phone size={16} /> Call Now
          </a>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent(id, 'whatsapp_click')} className="flex-1 py-3.5 bg-[#2D7A4F] text-white rounded-[14px] text-sm font-bold flex items-center justify-center gap-2 shadow-soft active:scale-[0.98] transition-transform">
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in-up">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-primary">
              <X size={24} />
            </button>
            <h3 className="text-xl font-heading text-primary font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Your Name</label>
                <input required type="text" value={newReview.parentName} onChange={e => setNewReview({ ...newReview, parentName: e.target.value })} className="w-full bg-[#F6F1E8] border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Context</label>
                <input required type="text" value={newReview.studentContext} onChange={e => setNewReview({ ...newReview, studentContext: e.target.value })} className="w-full bg-[#F6F1E8] border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" placeholder="e.g. Student in 10th / Parent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Rating</label>
                <select value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })} className="w-full bg-[#F6F1E8] border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent">
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Review</label>
                <textarea required rows={3} value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} className="w-full bg-[#F6F1E8] border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" placeholder="Share your experience..."></textarea>
              </div>
              <button disabled={isSubmittingReview} type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-soft hover:bg-[#2a3755] active:scale-[0.98] transition-all disabled:opacity-70">
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
