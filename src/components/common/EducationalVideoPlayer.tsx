import React, { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';

interface EducationalVideoPlayerProps {
  src: string;
  title?: string;
  subtitle?: string;
  poster?: string;
  className?: string;
}

/**
 * پخش ویدیو با استفاده مستقیم از پلیر بومی مرورگر و گوشی تلفن همراه
 * بدون استفاده از پلیر اختصاصی، دکمه‌های سفارشی یا لایه‌های مزاحم
 */
export const EducationalVideoPlayer: React.FC<EducationalVideoPlayerProps> = ({
  src,
  title,
  subtitle,
  poster,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <div className="flex flex-col gap-0.5 px-1 text-right">
          <span className="text-xs sm:text-sm font-black text-slate-900">{title}</span>
          {subtitle && <span className="text-[11px] text-slate-500">{subtitle}</span>}
        </div>
      )}

      {/* پلیر استاندارد و بومی مرورگر گوشی */}
      <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 bg-black shadow-sm">
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          onError={() => setHasError(true)}
          className="w-full h-auto max-h-[440px] block mx-auto"
          controlsList="nodownload"
        />

        {hasError && (
          <div className="bg-slate-900 p-4 text-center space-y-2">
            <p className="text-xs text-red-400 font-bold">
              خطا در بارگذاری ویدیو. می‌توانید آن را مستقیماً در مرورگر باز کنید:
            </p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl"
            >
              <span>مشاهده مستقیم ویدیو</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
