import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Wind,
  Zap,
  Award,
  BookOpen,
  ArrowLeft,
  PhoneCall,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AppTab } from '../types';
import { AppImage } from './common/AppImage';

interface HomeViewProps {
  setTab: (tab: AppTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setTab }) => {
  return (
    <div className="space-y-6">
      {/* Compact Mobile-First Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 via-sky-800 to-blue-900 text-white p-3.5 sm:p-4 shadow-sm border border-sky-600/30">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-2 py-0.5 rounded-lg text-[11px] font-bold text-sky-100">
              <Activity className="w-3.5 h-3.5 text-sky-200 animate-pulse" />
              <span>راهنمای ضروری نجات زندگی</span>
            </div>

            <h2 className="text-base sm:text-lg font-black leading-tight tracking-tight">
              آموزش احیای قلبی ریوی و کمک‌های فوری
            </h2>

            <p className="text-xs text-sky-100/90 leading-relaxed font-normal">
              شناخت سریع، تماس با ۱۱۵ و شروع فوری ماساژ قلبی؛ نجات‌بخش جان انسان‌ها.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-stretch sm:justify-end shrink-0 pt-1 sm:pt-0">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab('cpr')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white text-sky-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all touch-press cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>شروع ماساژ قلبی</span>
              <ArrowLeft className="w-3.5 h-3.5 text-sky-600" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab('intro')}
              className="inline-flex items-center justify-center gap-1 bg-sky-950/60 hover:bg-sky-950 text-white font-bold px-3 py-2 rounded-xl text-xs border border-sky-400/30 transition-all touch-press cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>مفاهیم</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main 4 Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-2.5 h-6 bg-sky-600 rounded-full inline-block" />
            <span>بخش‌های اصلی آموزش</span>
          </h3>
          <span className="text-xs sm:text-sm text-slate-500 font-bold">
            ۴ مبحث جامع با شبیه‌سازهای تصویری
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: CPR - Crimson / Rose Palette */}
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab('cpr')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setTab('cpr')}
            className="group relative bg-gradient-to-br from-white via-rose-50/50 to-red-50/40 rounded-3xl p-5 sm:p-6 border-2 border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-md transition-all text-right cursor-pointer flex flex-col justify-between touch-press"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black px-3 py-1 bg-rose-500 text-white rounded-xl shadow-xs">
                  بخش اول
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 animate-pulse fill-white/20" />
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2 group-hover:text-rose-700 transition-colors">
                ماساژ قلبی (احیای قلبی با دست)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                تصویرسازی فلت آموزشی، شبیه‌ساز زنده ماساژ ۳۰ به ۲ با مترونوم صوتی ۱۱۰ BPM و بازخورد عمق ۵ تا ۶ سانتی‌متر.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-rose-100 text-xs sm:text-sm font-black text-rose-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                شبیه‌ساز زنده ماساژ
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform font-black">
                ورود به آموزش
                <ArrowLeft className="w-4 h-4" />
              </span>
            </div>
          </motion.div>

          {/* Card 2: Choking - Ocean Cyan / Teal Palette */}
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab('choking')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setTab('choking')}
            className="group relative bg-gradient-to-br from-white via-cyan-50/50 to-teal-50/40 rounded-3xl p-5 sm:p-6 border-2 border-teal-200/80 hover:border-teal-400 shadow-sm hover:shadow-md transition-all text-right cursor-pointer flex flex-col justify-between touch-press"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black px-3 py-1 bg-teal-600 text-white rounded-xl shadow-xs">
                  بخش دوم
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/30 group-hover:scale-105 transition-transform">
                  <Wind className="w-6 h-6" />
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                انسداد راه هوایی (مانور هایملیخ)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                تفاوت انسداد خفیف و کامل، مانور هایملیخ بزرگسالان، کودکان، بارداری و شیرخواران همراه با کلیپ‌های مستقل.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-teal-100 text-xs sm:text-sm font-black text-teal-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                تمرین و کلیپ آموزشی
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform font-black">
                ورود به آموزش
                <ArrowLeft className="w-4 h-4" />
              </span>
            </div>
          </motion.div>

          {/* Card 3: AED - Golden Amber / Warm Orange Palette */}
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab('aed')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setTab('aed')}
            className="group relative bg-gradient-to-br from-white via-amber-50/50 to-orange-50/40 rounded-3xl p-5 sm:p-6 border-2 border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all text-right cursor-pointer flex flex-col justify-between touch-press"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black px-3 py-1 bg-amber-500 text-slate-950 rounded-xl shadow-xs">
                  بخش سوم
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6 fill-white/20" />
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                آشنایی با دستگاه AED
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                آموزش ۷ مرحله‌ای کار با شوک خودکار، کلیپ اختصاصی و شبیه‌ساز لمسی با پیام‌های صوتی و چسباندن پدها.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-amber-100 text-xs sm:text-sm font-black text-amber-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                شبیه‌ساز لمسی و ویدیو
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform font-black">
                ورود به آموزش
                <ArrowLeft className="w-4 h-4" />
              </span>
            </div>
          </motion.div>

          {/* Card 4: Quiz - Royal Purple / Violet Palette */}
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab('quiz')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setTab('quiz')}
            className="group relative bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/40 rounded-3xl p-5 sm:p-6 border-2 border-purple-200/80 hover:border-purple-400 shadow-sm hover:shadow-md transition-all text-right cursor-pointer flex flex-col justify-between touch-press"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black px-3 py-1 bg-purple-600 text-white rounded-xl shadow-xs">
                  بخش چهارم
                </span>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                آزمون سنجش آمادگی
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                ۱۲ سؤال چهارگزینه‌ای از مباحث آموزش با تحلیل پاسخ‌ها و ارزیابی سطح آمادگی امدادی.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-purple-100 text-xs sm:text-sm font-black text-purple-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ۱۲ سؤال با بازخورد تشریحی
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform font-black">
                شروع آزمون
                <ArrowLeft className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Life-Saving Principles Box */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2.5 text-slate-900 font-black text-base sm:text-lg">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <span>اصل کلی در شرایط تهدیدکننده حیات</span>
        </div>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          شناخت سریع، درخواست کمک و اقدام به‌موقع و صحیح می‌تواند نجات‌بخش باشد. عدم خون‌رسانی به مغز پس از ۴ تا ۶ دقیقه آسیب جدی مغزی و پس از ۱۰ دقیقه مرگ مغزی به دنبال دارد.
        </p>
      </div>
    </div>
  );
};
