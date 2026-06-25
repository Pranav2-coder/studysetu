import { Search, BarChart3, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse Institutes',
    description:
      'Explore tuition and computer classes in Nagpur by subject, area, and budget.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Compare Options',
    description:
      'View profiles, fees, timings, and experience to find the best fit.',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Get Connected',
    description:
      'Inquire directly via call or WhatsApp. No spam, no hassle.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section bg-bg">
      <div className="container mx-auto text-center">
        <h2 className="section-title font-heading text-primary">
          How It Works
        </h2>
        <p className="section-subtitle mx-auto mb-12">
          Three simple steps to find the right coaching for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center animate-fade-in-up"
            >
              {/* Step number */}
              <span className="text-5xl font-heading text-accent/15 font-bold absolute -top-3 left-1/2 -translate-x-1/2 select-none">
                {step.number}
              </span>

              {/* Icon circle */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mb-5">
                <step.icon className="w-7 h-7 text-accent" />
              </div>

              <h3 className="font-heading text-lg text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
