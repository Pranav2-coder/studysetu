import { Link } from 'react-router';
import { BookOpen, Search } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-primary"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 text-center relative z-10">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 rounded-full px-4 py-1.5 text-sm font-body mb-6">
            <BookOpen className="w-4 h-4" />
            <span>TOOK YOUR OWN DECISION!</span>
          </div>
        </div>

        <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 animate-fade-in-up animate-delay-100">
          Find the Right Tuition
          <br />
          <span className="text-accent-light">FINDING CLASS THAT FIT'S YOU.</span>
        </h1>

        <p className="font-body text-white/80 text-base md:text-lg max-w-xl mx-auto mb-8 animate-fade-in-up animate-delay-200">
          Compare tuition classes and computer institutes in Nagpur.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
          <Link to="/browse" className="btn btn-accent btn-lg">
            <Search className="w-5 h-5" />
            Browse Institutes
          </Link>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z"
            fill="var(--color-bg)"
          />
        </svg>
      </div>
    </section>
  );
}
