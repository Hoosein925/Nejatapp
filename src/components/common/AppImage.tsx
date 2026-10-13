import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAppImage, ImageKey, IMAGE_METADATA, LOCAL_IMAGE_FALLBACKS } from '../../config/images';
import { ImageIcon, AlertCircle, Maximize2, X, RefreshCw } from 'lucide-react';

interface AppImageProps {
  imageKey: ImageKey;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  fallbackComponent?: React.ReactNode;
  title?: string;
  subtitle?: string;
  allowZoom?: boolean;
}

export const AppImage: React.FC<AppImageProps> = ({
  imageKey,
  alt,
  className = '',
  aspectRatioClass = 'aspect-[16/10]',
  fallbackComponent,
  title,
  subtitle,
  allowZoom = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const initialUrl = getAppImage(imageKey);
  const fallbackUrl = LOCAL_IMAGE_FALLBACKS[imageKey];
  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl || fallbackUrl || '');

  const meta = IMAGE_METADATA[imageKey];
  const displayTitle = title || meta?.title || alt;
  const displaySubtitle = subtitle || meta?.description;


  // Case 1: Custom image URL is provided and has not errored
  if (currentSrc && currentSrc.trim() !== '' && !hasError) {
    return (
      <>
        <div className={`overflow-hidden rounded-2xl sm:rounded-3xl bg-transparent transition-all ${className}`}>
          {/* Image Container with Natural Auto-Resolution and Clean Background without dark borders */}
          <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="w-full aspect-[16/6] bg-slate-100 animate-pulse flex items-center justify-center rounded-2xl">
                <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
            )}

            <img
              src={currentSrc}
              alt={alt}
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                if (fallbackUrl && currentSrc !== fallbackUrl) {
                  setCurrentSrc(fallbackUrl);
                } else {
                  setIsLoading(false);
                  setHasError(true);
                }
              }}
              className={`w-full h-auto block select-none rounded-2xl sm:rounded-3xl transition-opacity duration-300 ${
                isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
              }`}
            />

            {allowZoom && !isLoading && (
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20 touch-press cursor-pointer"
                title="مشاهده بزرگ‌نمایی تصویر"
                aria-label="مشاهده بزرگ‌نمایی تصویر"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Caption & Title below image - never covers the visual content */}
          {(displayTitle || displaySubtitle) && (
            <div className="p-3 sm:p-3.5 bg-slate-50 rounded-2xl mt-2 border border-slate-100 text-right">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                {displayTitle}
              </h4>
              {displaySubtitle && (
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-0.5">
                  {displaySubtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Lightbox Zoom Modal */}
        {isZoomed &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fade-in"
              onClick={() => setIsZoomed(false)}
            >
              <div
                className="relative max-w-4xl max-h-[95vh] w-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  className="absolute top-2 left-2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
                  aria-label="بستن تصویر"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-full max-h-[82vh] flex items-center justify-center overflow-hidden">
                  <img
                    src={currentSrc}
                    alt={alt}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
                  />
                </div>

                <div className="mt-2.5 text-center text-white bg-slate-900/90 px-4 py-2 rounded-xl backdrop-blur-md max-w-xl border border-slate-700">
                  <h5 className="font-bold text-xs sm:text-sm">{displayTitle}</h5>
                  {displaySubtitle && (
                    <p className="text-[11px] text-slate-300 mt-0.5">{displaySubtitle}</p>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  // Case 2: Error loading image from URL
  if (hasError) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-3xl bg-rose-50 border-2 border-dashed border-rose-300 flex flex-col items-center justify-center p-5 text-center ${aspectRatioClass} ${className}`}
      >
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <h4 className="text-xs sm:text-sm font-bold text-rose-900">
          خطا در نمایش تصویر از آدرس مشخص شده
        </h4>
        <p className="text-[11px] text-rose-600 mt-1 max-w-sm truncate font-mono text-left" dir="ltr">
          {currentSrc}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHasError(false)}
            className="text-xs bg-rose-200 hover:bg-rose-300 text-rose-900 font-bold px-3.5 py-1.5 rounded-xl transition"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  // Case 3: No URL provided, but has fallback illustration
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Case 4: No URL and no fallback component: show clean educational placeholder
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center ${aspectRatioClass} ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs mb-2.5">
        <ImageIcon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-extrabold text-slate-800">{displayTitle}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
        {displaySubtitle || 'برای قرار دادن تصویر خود، آدرس آن را در فایل تنظیمات مشخص کنید.'}
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono text-sky-800 shadow-2xs">
        <span>کلید در فایل:</span>
        <code className="font-bold text-sky-600" dir="ltr">
          {imageKey}
        </code>
      </div>
    </div>
  );
};
