import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import FeaturedInstitutes from '../components/FeaturedInstitutes';
import WhyTrustUs from '../components/WhyTrustUs';

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="StudySetu — Find Tuition & Computer Classes in Nagpur"
        description="Compare tuition classes and computer training institutes in Nagpur. No spam calls."
      />

      <HeroSection />
      <HowItWorks />
      <FeaturedInstitutes />
      <WhyTrustUs />

      {/* CTA Section */}
      <section
        className="section bg-primary relative overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="container mx-auto text-center relative z-10">
          <h2 className="font-heading text-2xl md:text-4xl text-white mb-4 animate-fade-in-up">
            Ready to Find the Right Institute?
          </h2>
          <p className="text-white/80 font-body text-base md:text-lg max-w-lg mx-auto mb-8 animate-fade-in-up animate-delay-100">
            Explore verified tuition classes and computer training institutes in Nagpur. Find details, compare fees, and contact them directly — no spam, no hassle.
          </p>
          <div className="animate-fade-in-up animate-delay-200">
            <Link to="/browse" className="btn btn-accent btn-lg">
              Browse Institutes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
