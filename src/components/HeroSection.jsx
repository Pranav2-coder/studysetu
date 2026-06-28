import { Link } from 'react-router';
import { BookOpen, Search } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-section relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="hero-bg-mesh" aria-hidden="true">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>
        <div className="hero-blob hero-blob-3"></div>
        <div className="hero-blob hero-blob-4"></div>
      </div>

      {/* Floating particles */}
      <div className="hero-particles" aria-hidden="true">
        <span className="hero-particle hero-particle-1"></span>
        <span className="hero-particle hero-particle-2"></span>
        <span className="hero-particle hero-particle-3"></span>
        <span className="hero-particle hero-particle-4"></span>
        <span className="hero-particle hero-particle-5"></span>
        <span className="hero-particle hero-particle-6"></span>
        <span className="hero-particle hero-particle-7"></span>
        <span className="hero-particle hero-particle-8"></span>
      </div>

      {/* Subtle grid overlay */}
      <div className="hero-grid-overlay" aria-hidden="true"></div>

      {/* Radial glow behind text */}
      <div className="hero-glow" aria-hidden="true"></div>

      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 text-center relative z-10">
        <div className="animate-fade-in-up">
          <div className="hero-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-body mb-6">
            <BookOpen className="w-4 h-4" />
            <span>TAKE YOUR OWN DECISION!</span>
          </div>
        </div>

        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-tight mb-3 animate-fade-in-up animate-delay-100">
          <span className="hero-brand-name">StudySetu</span>
        </h1>

        <p className="hero-tagline font-heading text-xl md:text-2xl lg:text-3xl mb-6 animate-fade-in-up animate-delay-200">
          <span className="hero-tagline-tuition">Tuition</span>
          <span className="hero-tagline-separator">&</span>
          <span className="hero-tagline-computer">Computer Classes</span>
        </p>

        <p className="font-body text-white/80 text-base md:text-lg max-w-xl mx-auto mb-8 animate-fade-in-up animate-delay-300">
          Find, compare, and connect with the best coaching institutes in Nagpur — no spam, no hassle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-400">
          <Link to="/browse" className="hero-cta-btn">
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
