import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PagePreloader } from './components/Preloader';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBooting(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  if (isBooting) {
    return <PagePreloader message="Preparing your experience" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
