import { useMemo, useRef } from 'react';
import { Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

function sanitizeFilePart(value) {
  return String(value || 'institute')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'institute';
}

export default function InstituteQRCode({ instituteName, slug, profileUrl, variant = 'card' }) {
  const qrWrapRef = useRef(null);
  const qrValue = useMemo(() => {
    if (profileUrl) return profileUrl;
    return `https://studysetu.tech/institutes/${slug || ''}`;
  }, [profileUrl, slug]);

  function handleDownload() {
    const canvas = qrWrapRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${sanitizeFilePart(instituteName || slug)}-studysetu-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  if (variant === 'button') {
    return (
      <span ref={qrWrapRef} className="inline-flex">
        <QRCodeCanvas
          value={qrValue}
          size={220}
          level="H"
          bgColor="#FFFFFF"
          fgColor="#000000"
          marginSize={2}
          title="Scan to View Institute Profile"
          className="hidden"
        />
        <button
          type="button"
          onClick={handleDownload}
          className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-surface transition-colors cursor-pointer"
          title="Download QR"
        >
          <Download size={15} />
        </button>
      </span>
    );
  }

  return (
    <section className="bg-white rounded-[22px] p-5 shadow-soft border border-border/40">
      <div className="flex flex-col items-center text-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-primary">Scan to View Institute Profile</h2>
          <p className="text-[13px] text-text-muted mt-1">studysetu.tech</p>
        </div>

        <div
          ref={qrWrapRef}
          className="w-full max-w-[260px] rounded-2xl border border-border/50 bg-white p-4 flex justify-center"
        >
          <QRCodeCanvas
            value={qrValue}
            size={220}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#000000"
            marginSize={2}
            title="Scan to View Institute Profile"
          />
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:w-auto px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-soft hover:bg-[#2a3755] active:scale-[0.98] transition-all"
        >
          <Download size={16} />
          Download QR
        </button>
      </div>
    </section>
  );
}
