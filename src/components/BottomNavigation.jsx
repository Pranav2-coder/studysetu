import { Link, useLocation } from 'react-router';
import { Home, Compass, Bookmark, User } from 'lucide-react';

export default function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Browse', path: '/browse', icon: Compass },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none md:hidden">
      <div className="backdrop-glass shadow-soft rounded-2xl mx-auto max-w-sm flex items-center justify-between px-6 py-3 pointer-events-auto border border-white/60">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/browse' && location.pathname.startsWith('/browse'));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              aria-label={item.name}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 no-underline ${isActive ? 'text-accent scale-110' : 'text-text-muted hover:text-primary'
                }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-semibold ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
