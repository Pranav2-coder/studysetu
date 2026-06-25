import { Link } from 'react-router';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center no-underline mb-4" aria-label="StudySetu home">
              <img
                src="/studysetu-logo.png"
                alt="StudySetu"
                className="h-14 w-auto max-w-[230px] object-contain brightness-110"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Helping students and parents find the right tuition classes and computer
              training institutes in Nagpur.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-white/80">
              <MapPin className="w-3 h-3" />
              Made in Nagpur
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/browse', label: 'Browse Institutes' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-white text-sm no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@studysetu.in"
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm no-underline transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  contact@studysetu.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919371742672"
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm no-underline transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +91 93717 42672
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  Nagpur, Maharashtra
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} StudySetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
