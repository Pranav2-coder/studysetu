/* eslint-disable react-refresh/only-export-components */
import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import './index.css';

// Lazy loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const BrowsePage = lazy(() => import('./pages/BrowsePage'));
const InstitutePage = lazy(() => import('./pages/InstitutePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// A simple full-screen loader for chunk loading
const ChunkLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Suspense fallback={<ChunkLoader />}><HomePage /></Suspense> },
      { path: 'browse', element: <Suspense fallback={<ChunkLoader />}><BrowsePage /></Suspense> },
      { path: 'institutes/:slug', element: <Suspense fallback={<ChunkLoader />}><InstitutePage /></Suspense> },
      { path: 'admin', element: <Suspense fallback={<ChunkLoader />}><AdminDashboard /></Suspense> },
      { path: 'about', element: <Suspense fallback={<ChunkLoader />}><AboutPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<ChunkLoader />}><ContactPage /></Suspense> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
