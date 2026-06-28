import { Gift } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919371742672?text=Hi%2C%20I%27d%20like%20to%20refer%20a%20student%20to%20StudySetu!';

export default function ReferBanner() {
  return (
    <div className="bg-accent-light border border-accent/30 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-accent/10 rounded-full p-2.5 shrink-0">
          <Gift size={22} className="text-accent" />
        </div>
        <div>
          <p className="font-heading text-primary text-base md:text-lg leading-snug">
            Refer a Student and Earn upto 100-1000rs
          </p>
          <p className="text-text-muted text-xs mt-0.5">
            Share with friends and earn rewards for every referral.
          </p>
        </div>
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-accent btn-sm shrink-0"
      >
        Refer Now
      </a>
    </div>
  );
}
