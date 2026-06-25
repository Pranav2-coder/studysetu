import { ShieldCheck, CheckCircle, Heart, MapPin } from 'lucide-react';

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'No Spam Calls',
    description: 'We never share your number without permission.',
  },
  {
    icon: CheckCircle,
    title: 'Verified Institutes',
    description: 'Every listed institute is manually verified by our team.',
  },
  {
    icon: Heart,
    title: '100% Free',
    description: 'Our service is completely free for students and parents.',
  },
  {
    icon: MapPin,
    title: 'Local Focus',
    description: 'Built exclusively for Nagpur. We know the city.',
  },
];

export default function WhyTrustUs() {
  return (
    <section className="section bg-surface">
      <div className="container mx-auto text-center">
        <h2 className="section-title font-heading text-primary">
          Why Students Trust Us
        </h2>
        <p className="section-subtitle mx-auto mb-12">
          We're built different — because students deserve better.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="card p-6 text-center animate-fade-in-up"
            >
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-base text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
