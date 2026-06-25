import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import InstituteCard from './InstituteCard';
import { SkeletonGrid } from './Preloader';
import { getInstitutes } from '../lib/db';

export default function FeaturedInstitutes() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const list = await getInstitutes();
        const activeFeatured = list.filter(inst => inst.featured && (inst.published ?? true));
        setFeatured(activeFeatured);
      } catch (err) {
        console.error('Error loading featured institutes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  if (loading) {
    return (
      <section className="section bg-bg">
        <div className="container mx-auto py-8">
          <SkeletonGrid count={3} />
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="section bg-bg">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title font-heading text-primary">
            Featured Institutes
          </h2>
          <p className="section-subtitle mx-auto">
            Handpicked coaching centers trusted by students across Nagpur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((institute) => (
            <InstituteCard key={institute.id} institute={institute} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/browse"
            className="btn btn-outline btn-lg inline-flex items-center gap-2"
          >
            View All Institutes
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
