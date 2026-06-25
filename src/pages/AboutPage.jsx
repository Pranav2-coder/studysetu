import { Eye, Sparkles, MapPin } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const values = [
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Honest information, no hidden fees.',
  },
  {
    icon: Sparkles,
    title: 'Simplicity',
    description: 'Easy to use, no complicated sign-ups.',
  },
  {
    icon: MapPin,
    title: 'Local',
    description: 'Built for Nagpur, by someone who understands Nagpur.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About StudySetu — Nagpur's Institute Directory"
        description="Learn about StudySetu — a simple directory helping students and parents discover the right coaching classes and computer institutes in Nagpur."
      />

      {/* Hero */}
      <div className="section bg-primary text-center">
        <div className="container">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            About StudySetu
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto">
            Helping Nagpur find the right place to learn.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="section bg-bg">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-primary mb-4">Our Mission</h2>
            <p className="text-text text-base md:text-lg leading-relaxed">
              StudySetu helps students and parents discover the right coaching classes and computer
              training institutes in Nagpur. We believe finding quality education shouldn't be a
              confusing experience.
            </p>
          </div>

          {/* Problem */}
          <div className="card p-6 md:p-8 mb-6">
            <h3 className="font-heading text-xl text-primary mb-3">The Problem</h3>
            <p className="text-text-muted leading-relaxed">
              Finding the right tuition is hard. Parents get confused with too many options, spam
              calls from random institutes, and no reliable way to compare.
            </p>
          </div>

          {/* Solution */}
          <div className="card p-6 md:p-8 border-l-4 border-accent">
            <h3 className="font-heading text-xl text-primary mb-3">Our Solution</h3>
            <p className="text-text-muted leading-relaxed">
              StudySetu is a simple directory where you can browse verified institutes, compare fees
              and features, and connect directly — without the spam.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="section bg-surface">
        <div className="container max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-primary text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-lg text-primary mb-2">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="section bg-bg">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-primary mb-4">The Team</h2>
          <p className="text-text-muted text-base md:text-lg leading-relaxed">
            Founded by a solo entrepreneur passionate about improving education access in Nagpur.
          </p>
        </div>
      </div>
    </>
  );
}
