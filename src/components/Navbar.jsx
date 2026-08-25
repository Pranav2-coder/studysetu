import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 rounded-b-2xl transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(255,255,255,0.75)] backdrop-blur-[18px] border-b border-white/40 shadow-[0_4px_20px_rgba(15,23,42,0.08)]'
          : 'bg-[rgba(255,255,255,0.65)] backdrop-blur-[18px] border-b border-white/25 shadow-[0_4px_20px_rgba(15,23,42,0.06)]'
      }`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center no-underline" aria-label="StudySetu home" onClick={handleLinkClick}>
            <img
              src="/studysetu-logo.png"
              alt="StudySetu"
              className="h-10 w-auto max-w-[190px] object-contain sm:h-12 sm:max-w-[230px]"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold no-underline transition-all ${
                  location.pathname === link.to
                    ? 'text-accent bg-accent-light/80 shadow-sm'
                    : 'text-text-muted hover:text-primary hover:bg-surface/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button on Right */}
          <button
            className="md:hidden p-2 rounded-xl text-primary bg-white/40 hover:bg-white/70 active:scale-95 transition-all border border-white/30 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[rgba(255,255,255,0.92)] backdrop-blur-[20px] border-b border-white/30 shadow-lg rounded-b-2xl px-4 py-3 space-y-1 animate-fade-in-up">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold no-underline transition-all ${
                location.pathname === link.to
                  ? 'text-accent bg-accent-light shadow-sm'
                  : 'text-primary hover:bg-surface/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
