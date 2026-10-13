import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Download, X, Info, Send, Heart, Home, Share } from 'lucide-react';
import { sound } from '../utils/sound';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  onImagesUpdated?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setTab }) => {
  const [isMuted, setIsMuted] = useState(!sound.enabled);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsMuted(!sound.enabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white shadow-md border-b border-indigo-700/60 backdrop-blur-md">
      {/* Main navigation header */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo and brand name with official app icon */}
        <button
          onClick={() => setTab('home')}
          className="flex items-center gap-2.5 text-right group transition-transform active:scale-95 cursor-pointer"
          aria-label="بازگشت به صفحه اصلی"
        >
          <img
            src="/app-icon.png"
            alt="آیکون احیای قلبی ریوی"
            className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform shrink-0 object-cover border border-white/20"
          />
          <div>
            <h1 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight">
              احیای قلبی ریوی
            </h1>
          </div>
        </button>

        {/* Action buttons: Home (White), Sound (Orange), About (Green) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Home Button - White icon & styling */}
          <button
            onClick={() => setTab('home')}
            className="p-2 sm:px-2.5 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/40 text-white border border-white/40 transition-all touch-press cursor-pointer flex items-center gap-1 shadow-sm"
            title="رفتن به صفحه اصلی"
            aria-label="صفحه اصلی"
          >
            <Home className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
            <span className="text-xs font-black hidden sm:inline text-white">خانه</span>
          </button>

          {/* Sound Toggle - Orange icon & styling */}
          <button
            onClick={toggleSound}
            className={`p-2 sm:px-2.5 rounded-xl border border-amber-400/70 transition-all touch-press cursor-pointer flex items-center gap-1 shadow-sm ${
              isMuted
                ? 'bg-amber-600/30 text-amber-200 hover:bg-amber-600/40'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
            }`}
            title={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
            aria-label={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-amber-100 shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 text-white shrink-0 animate-pulse" />
            )}
            <span className="text-xs font-black hidden sm:inline text-white">
              {isMuted ? 'بی‌صدا' : 'صدا'}
            </span>
          </button>

          {/* About Modal Button - Green icon & styling */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="p-2 sm:px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-400/60 transition-all touch-press cursor-pointer flex items-center gap-1 shadow-sm shadow-emerald-600/20"
            title="درباره برنامه و سازنده"
            aria-label="درباره برنامه"
          >
            <Info className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
            <span className="text-xs font-black hidden sm:inline text-white">درباره</span>
          </button>

          {/* PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-2 rounded-xl font-medium border border-white/20 transition touch-press"
              title="نصب اپلیکیشن"
            >
              <Download className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">نصب</span>
            </button>
          )}

          {!isInstalled && !isInstallable && isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="flex items-center gap-1 bg-white/10 text-white text-xs px-2.5 py-2 rounded-xl font-medium border border-white/20 touch-press"
              title="نصب در آیفون"
            >
              <Download className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">iOS</span>
            </button>
          )}
        </div>
      </div>

      {/* About Application Modal - Rendered via createPortal to avoid sticky header clipping */}
      {showAboutModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
            onClick={() => setShowAboutModal(false)}
          >
            <div
              className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white text-slate-800 p-4 sm:p-5 shadow-2xl text-right border border-indigo-200 max-h-[88dvh] flex flex-col overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/app-icon.png"
                    alt="آیکون احیا"
                    className="w-10 h-10 rounded-xl shadow-xs shrink-0 object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-black text-slate-900 text-base sm:text-lg">درباره برنامه</h3>
                    <span className="text-[11px] text-slate-500">راهنمای اورژانس و احیای قلبی ریوی</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  aria-label="بستن پنجره"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="py-3.5 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed overflow-y-auto overscroll-contain pr-1 flex-1">
                {/* Silent Mode Advice Card */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="text-right">
                    <h5 className="font-black text-amber-950 text-xs sm:text-sm mb-0.5">
                      نکته مهم برای کاربری بهتر برنامه:
                    </h5>
                    <p className="text-amber-900 text-xs leading-relaxed font-bold">
                      برای کاربری بهتر برنامه دستگاه را از حالت بی‌صدا خارج کنید تا ریتم دقیق مترونوم ماساژ قلبی (۱۱۰ بار در دقیقه) و هشدارهای صوتی راهنما به صورت واضح شنیده شوند.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50/90 border border-indigo-100 rounded-2xl p-3">
                  <h4 className="font-black text-indigo-950 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                    <span>سامانه جامع احیای قلبی ریوی</span>
                  </h4>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    راهنمای سریع و استاندارد احیای قلبی ریوی (CPR)، رفع انسداد راه هوایی در رده‌های سنی مختلف و نحوه کار با دستگاه شوک خودکار (AED).
                  </p>
                </div>

                <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <h5 className="font-black text-slate-900 text-xs">مباحث آموزشی:</h5>
                  <ul className="space-y-1 text-[11px] sm:text-xs text-slate-600 pr-3.5 list-disc leading-normal">
                    <li>ارزیابی صحنه، بررسی هوشیاری و ارزیابی ۱۰ ثانیه‌ای تنفس</li>
                    <li>تشخیص تنفس غیرطبیعی (گسپینگ) و کلیپ آموزشی مرتبط</li>
                    <li>نسبت ۳۰ ماساژ به ۲ تنفس، یا ماساژ پیوسته ۱۰۰ تا ۱۲۰ در دقیقه</li>
                    <li>رفع خفگی بزرگسالان، کودکان، بارداری و شیرخواران</li>
                    <li>کلیپ‌های آموزشی مستقیم و قابل پخش در پلیر اصلی گوشی</li>
                    <li>آموزش گام‌به‌گام کار با دستگاه شوک خودکار (AED)</li>
                  </ul>
                </div>

                {/* Creator Credit & Telegram */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-indigo-900 text-white rounded-2xl p-3.5 text-center space-y-2.5 shadow-sm border border-indigo-700/60">
                  <p className="font-black text-xs sm:text-sm text-white">
                    سازنده: <span className="text-amber-300 font-black">حسین نصاری</span>
                  </p>

                  <a
                    href="https://t.me/ho3in925"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#1E88E5] text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 touch-press cursor-pointer w-full"
                  >
                    <Send className="w-3.5 h-3.5 rotate-45" />
                    <span>ارتباط در تلگرام: ho3in925@</span>
                  </a>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 shrink-0 border-t border-slate-100">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl font-black text-xs sm:text-sm transition cursor-pointer shadow-sm"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* iOS Install Modal - Rendered via createPortal */}
      {showIOSModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-right">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-800 text-base">نصب در آیفون و آیپد</h3>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed space-y-2 mb-4">
                ۱. در مرورگر Safari دکمه <strong>اشتراک‌گذاری (Share <Share className="inline w-3.5 h-3.5" />)</strong> را لمس کنید.
                <br />
                ۲. به پایین اسکرول کنید و گزینه <strong>Add to Home Screen (افزودن به صفحه اصلی)</strong> را انتخاب کنید.
              </p>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2 bg-sky-600 text-white rounded-xl font-medium text-sm hover:bg-sky-700 cursor-pointer"
              >
                متوجه شدم
              </button>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

