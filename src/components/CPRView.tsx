import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  RotateCcw,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Activity,
  Sparkles,
  ShieldCheck,
  Video,
  Wind,
  Eye,
  AlertOctagon,
  Flame,
  Zap,
  Volume2
} from 'lucide-react';
import { sound } from '../utils/sound';
import { AppTab } from '../types';
import { EducationalVideoPlayer } from './common/EducationalVideoPlayer';
import { APP_VIDEOS, APP_IMAGES } from '../config/images';

interface CPRViewProps {
  setTab: (tab: AppTab) => void;
}

type CprSubTab = 'scene' | 'responsiveness' | 'breathing' | 'compressions' | 'recovery';

export const CPRView: React.FC<CPRViewProps> = ({ setTab }) => {
  // Clinical flow tabs: scene -> responsiveness -> breathing -> compressions -> recovery
  const [activeTab, setActiveTab] = useState<CprSubTab>('scene');

  // Simulator state
  const [compressionsCount, setCompressionsCount] = useState(0);
  const [targetHitCount, setTargetHitCount] = useState(0);
  const [lastPressTimes, setLastPressTimes] = useState<number[]>([]);
  const [currentBpm, setCurrentBpm] = useState<number>(0);
  const [bpmFeedback, setBpmFeedback] = useState<'none' | 'slow' | 'perfect' | 'fast'>('none');
  const [isCompressingVisual, setIsCompressingVisual] = useState(false);

  // Helper to convert any number/string to clean Persian numerals
  const toPersianDigits = (val: number | string): string => {
    return String(val).replace(/[0-9]/g, (w) => ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][+w]);
  };

  // 30:2 Cycle Mode tracker (5 cycles of 30:2 = ~2 minutes protocol)
  const cycleCount = compressionsCount % 30;
  const cycleCompletedRounds = Math.floor(compressionsCount / 30);
  const currentCompInCycle = cycleCount === 0 && compressionsCount > 0 ? 30 : cycleCount;
  const currentCycleNumber = (cycleCompletedRounds % 5) + 1;
  const isBreathTime = compressionsCount > 0 && cycleCount === 0;
  const isFiveCyclesCompleted = compressionsCount > 0 && compressionsCount % 150 === 0;

  // Auto demonstration mode (110 BPM continuous loop)
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const autoDemoTimerRef = useRef<number | null>(null);

  // Metronome state (110 BPM target = 545.45 ms interval)
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const metronomeIntervalRef = useRef<number | null>(null);

  // Pause when hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsMetronomeActive(false);
        setIsAutoDemo(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Metronome logic (110 BPM)
  useEffect(() => {
    if (isMetronomeActive) {
      const intervalMs = Math.round(60000 / 110);
      metronomeIntervalRef.current = window.setInterval(() => {
        sound.playMetronomeClick(650, 0.04);
      }, intervalMs);
    } else {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    }
    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, [isMetronomeActive]);

  // Handle chest compression
  const handleCompression = useCallback(() => {
    sound.playCompressSound();
    const now = Date.now();

    setIsCompressingVisual(true);
    setTimeout(() => setIsCompressingVisual(false), 120);

    setCompressionsCount((prev) => prev + 1);

    setLastPressTimes((prev) => {
      const recent = [...prev, now].filter((t) => now - t <= 5000);
      if (recent.length >= 3) {
        const intervals = [];
        for (let i = 1; i < recent.length; i++) {
          intervals.push(recent[i] - recent[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const bpm = Math.round(60000 / avgInterval);
        setCurrentBpm(bpm);

        if (bpm < 100) {
          setBpmFeedback('slow');
        } else if (bpm <= 120) {
          setBpmFeedback('perfect');
          setTargetHitCount((c) => c + 1);
        } else {
          setBpmFeedback('fast');
        }
      }
      return recent;
    });
  }, []);

  // Auto demo loop
  useEffect(() => {
    if (isAutoDemo) {
      const intervalMs = Math.round(60000 / 110);
      autoDemoTimerRef.current = window.setInterval(() => {
        handleCompression();
      }, intervalMs);
    } else {
      if (autoDemoTimerRef.current) clearInterval(autoDemoTimerRef.current);
    }
    return () => {
      if (autoDemoTimerRef.current) clearInterval(autoDemoTimerRef.current);
    };
  }, [isAutoDemo, handleCompression]);

  // Space key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'compressions' && e.code === 'Space') {
        e.preventDefault();
        handleCompression();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleCompression]);

  const resetSimulator = () => {
    setIsAutoDemo(false);
    setCompressionsCount(0);
    setTargetHitCount(0);
    setLastPressTimes([]);
    setCurrentBpm(0);
    setBpmFeedback('none');
  };

  const switchTab = (tab: CprSubTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Navigation Bar with Distinct Blue Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all touch-press cursor-pointer shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>

        <div className="flex items-center gap-2 bg-red-100 text-red-700 font-black px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm shadow-xs truncate">
          <Heart className="w-4 h-4 fill-red-600 animate-pulse shrink-0" />
          <span className="truncate">احیای قلبی ریوی (CPR)</span>
        </div>
      </div>

      {/* Mandatory Emergency Alert Banner */}
      <div className="bg-red-50 border-r-4 border-red-600 p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <PhoneCall className="w-5 h-5 text-red-600 shrink-0 animate-bounce" />
          <p className="text-xs sm:text-sm text-red-950 font-black">
            اول با ۱۱۵ تماس بگیرید! در صورت ایست قلبی، هر ثانیه حیاتی است.
          </p>
        </div>
        <a
          href="tel:115"
          className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shrink-0 shadow-sm transition-transform touch-press"
        >
          تماس با ۱۱۵
        </a>
      </div>

      {/* Clinical Flow Navigation Tabs - Highly Distinct & Bold */}
      <div className="bg-white/95 backdrop-blur-md p-2 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="text-[11px] sm:text-xs font-black text-slate-500 mb-2 px-2 flex items-center justify-between">
          <span>مراحل ارزیابی بالینی تا شروع احیا (به ترتیب گام‌ها):</span>
          <span className="text-indigo-900 font-black">۵ سربرگ آموزشی</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {/* Tab 1: Scene Safety */}
          <button
            onClick={() => switchTab('scene')}
            className={`p-2.5 rounded-2xl text-xs font-black transition-all touch-press flex items-center justify-center gap-1.5 ${
              activeTab === 'scene'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>۱. ارزیابی صحنه</span>
          </button>

          {/* Tab 2: Responsiveness */}
          <button
            onClick={() => switchTab('responsiveness')}
            className={`p-2.5 rounded-2xl text-xs font-black transition-all touch-press flex items-center justify-center gap-1.5 ${
              activeTab === 'responsiveness'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>۲. بررسی هوشیاری</span>
          </button>

          {/* Tab 3: Breathing & Gasping */}
          <button
            onClick={() => switchTab('breathing')}
            className={`p-2.5 rounded-2xl text-xs font-black transition-all touch-press flex items-center justify-center gap-1.5 ${
              activeTab === 'breathing'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Wind className="w-4 h-4 shrink-0" />
            <span>۳. بررسی تنفس و گسپینگ</span>
          </button>

          {/* Tab 4: Chest Compressions */}
          <button
            onClick={() => switchTab('compressions')}
            className={`p-2.5 rounded-2xl text-xs font-black transition-all touch-press flex items-center justify-center gap-1.5 ${
              activeTab === 'compressions'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 shrink-0" />
            <span>۴. ماساژ قلبی (CPR)</span>
          </button>

          {/* Tab 5: Recovery Position */}
          <button
            onClick={() => switchTab('recovery')}
            className={`p-2.5 rounded-2xl text-xs font-black transition-all touch-press flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1 ${
              activeTab === 'recovery'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>۵. وضعیت ریکاوری</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SCENE SAFETY ================= */}
      {activeTab === 'scene' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <span>گام اول: ارزیابی ایمنی صحنه از نظر خطرات و مخاطرات</span>
            </h3>
            <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
              اولویت شماره یک
            </span>
          </div>

          {/* Golden Rule Callout */}
          <div className="bg-rose-50 border-r-4 border-rose-600 p-4 rounded-2xl space-y-2">
            <h4 className="font-black text-rose-950 text-sm sm:text-base flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
              <span>اصل طلایی نجات: جان امدادگر در اولویت است!</span>
            </h4>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-bold">
              ابتدا ایمنی صحنه را از نظر مخاطرات بررسی می‌کنیم و <strong>در صورت نبود ایمنی به هیچ عنوان نزدیک نمی‌شویم!</strong> شما نمی‌توانید با تبدیل شدن به مصدوم دوم، به فرد کمکی برسانید.
            </p>
          </div>

          {/* Hazards Checklist */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm sm:text-base">
              مخاطرات احتمالی که باید پیش از ورود فوراً ارزیابی شوند:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>۱. خطر برق‌گرفتگی:</span>
                </div>
                <p className="text-slate-600 leading-relaxed pr-6">
                  سیم‌ها و کابل‌های برق افتاده، آب‌های متصل به جریان برق یا کلیدهای محافظت‌نشده.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>۲. گازگرفتگی و آتش‌سوزی:</span>
                </div>
                <p className="text-slate-600 leading-relaxed pr-6">
                  بوی گاز شهری یا مونواکسید کربن در فضای بسته، دود متراکم، شعله باز یا خطر انفجار.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>۳. ترافیک و تصادفات جاده‌ای:</span>
                </div>
                <p className="text-slate-600 leading-relaxed pr-6">
                  خودروهای در حال تردد با سرعت بالا، عدم دید در پیچ جاده یا احتمال تصادف ثانویه.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>۴. ریزش آوار و خطرات فیزیکی:</span>
                </div>
                <p className="text-slate-600 leading-relaxed pr-6">
                  شیشه‌های شکسته، دیوار یا سقف در حال ریزش، چاه‌ها یا پرتگاه‌های مجاور.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs sm:text-sm text-amber-950 space-y-1">
            <strong>اقدام در شرایط ناامن:</strong> صحنه را ترک کرده و در فاصله‌ای مطمئن قرار بگیرید؛ بلافاصله با <strong>۱۲۵ (آتش‌نشانی)</strong> یا <strong>۱۱۰ (پلیس)</strong> و <strong>۱۱۵ (اورژانس)</strong> تماس بگیرید و درخواست تیم تخصصی ایمن‌سازی کنید.
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-3">
            <button
              onClick={() => switchTab('responsiveness')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-600/20 touch-press cursor-pointer"
            >
              <span>گام بعدی: بررسی سطح هوشیاری</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RESPONSIVENESS & 115 ================= */}
      {activeTab === 'responsiveness' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-sky-600" />
              <span>گام دوم: بررسی سطح هوشیاری و درخواست کمک از ۱۱۵</span>
            </h3>
            <span className="text-xs font-black bg-sky-100 text-sky-900 px-3 py-1 rounded-xl">
              پاسخ‌دهی مصدوم
            </span>
          </div>

          {/* Action Steps */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm sm:text-base">نحوه بررسی هوشیاری بیمار:</h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed pr-1">
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="w-6 h-6 rounded-xl bg-sky-600 text-white text-xs font-black flex items-center justify-center shrink-0">۱</span>
                <span>کنار شانه بیمار زانو بزنید و <strong>روی هر دو شانه بیمار آرام ضربه بزنید</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="w-6 h-6 rounded-xl bg-sky-600 text-white text-xs font-black flex items-center justify-center shrink-0">۲</span>
                <span>با صدای بلند و رسا بپرسید: <strong>«آقا / خانم، صدای من رو می‌شنوید؟ حالتون خوبه؟»</strong></span>
              </div>
              <div className="flex items-start gap-2.5 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-950 font-bold">
                <span className="w-6 h-6 rounded-xl bg-amber-600 text-white text-xs font-black flex items-center justify-center shrink-0">!</span>
                <span>هشدار مهم: از تکان دادن شدید سر و گردن مصدوم خودداری کنید تا در صورت وجود آسیب نخاعی، آسیبی تشدید نشود.</span>
              </div>
            </div>
          </div>

          {/* Decision Tree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-emerald-950 font-black">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>حالت اول: بیمار پاسخ می‌دهد (هوشیار است)</span>
              </div>
              <p className="text-emerald-900 leading-relaxed">
                بیمار را تکان ندهید، علت بدحالی را جویا شوید و در صورت لزوم با ۱۱۵ مشورت کنید.
              </p>
            </div>

            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-rose-950 font-black">
                <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                <span>حالت دوم: بیمار پاسخ نمی‌دهد (بیهوش است)</span>
              </div>
              <p className="text-rose-900 leading-relaxed font-bold">
                بلافاصله با ۱۱۵ تماس بگیرید یا به یک فرد مشخص بگویید: «شما سریعاً با ۱۱۵ تماس بگیر و بگو بیمار بیهوش داریم و اگر دستگاه AED نزدیک است بیاور!»
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-3">
            <button
              onClick={() => switchTab('scene')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <ArrowRight className="w-4 h-4" />
              <span>گام قبلی</span>
            </button>

            <button
              onClick={() => switchTab('breathing')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-600/20 touch-press cursor-pointer"
            >
              <span>گام بعدی: بررسی ۱۰ ثانیه‌ای تنفس و گسپینگ</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BREATHING & GASPING ================= */}
      {activeTab === 'breathing' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Wind className="w-6 h-6 text-purple-600" />
              <span>گام سوم: بررسی تنفس و تشخیص تنفس غیرطبیعی گسپینگ</span>
            </h3>
            <span className="text-xs font-black bg-purple-100 text-purple-900 px-3 py-1 rounded-xl">
              حداکثر ۱۰ ثانیه
            </span>
          </div>

          {/* How to check breathing */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-sm sm:text-base">روش بررسی تنفس (حداکثر ظرف ۱۰ ثانیه):</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed text-slate-700">
              <p>
                سر بیمار را کمی به عقب داده و چانه را به آرامی بالا بکشید تا راه هوایی باز شود. سپس <strong>به مدت حداکثر ۱۰ ثانیه به قفسه سینه نگاه کنید</strong>:
              </p>
              <ul className="pr-5 list-disc space-y-1">
                <li>آیا قفسه سینه بالا و پایین می‌رود؟</li>
                <li>آیا صدای تنفس منظم شنیده می‌شود؟</li>
                <li>آیا جریان هوای بازدم را روی گونه خود حس می‌کنید؟</li>
              </ul>
            </div>
          </div>

          {/* 2 Scenarios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-emerald-950 font-black">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>اگر تنفس طبیعی و منظم دارد:</span>
              </div>
              <p className="text-emerald-900 leading-relaxed font-bold">
                بیمار را فوراً در <strong>وضعیت ریکاوری (به پهلو)</strong> قرار دهید تا راه هوایی بسته نشود و منتظر اورژانس بمانید.
              </p>
              <button
                onClick={() => switchTab('recovery')}
                className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer mt-1"
              >
                <span>مشاهده آموزش وضعیت ریکاوری</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-rose-950 font-black">
                <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                <span>اگر تنفس ندارد یا تنفس غیرطبیعی دارد:</span>
              </div>
              <p className="text-rose-900 leading-relaxed font-bold">
                <strong>بدون درنگ احیا (ماساژ قفسه سینه) را آغاز کنید!</strong> وقت را تلف نکنید؛ هر ثانیه در حفظ سلول‌های مغز حیاتی است.
              </p>
              <button
                onClick={() => switchTab('compressions')}
                className="inline-flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer mt-1"
              >
                <span>ورود به آموزش ماساژ قلبی</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CRITICAL SECTION: GASPING EXPLANATION & VIDEO */}
          <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 border-2 border-rose-400 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
                !
              </div>
              <div>
                <h4 className="font-black text-rose-950 text-base sm:text-lg">
                  هشدار مرگبار: تنفس غیرطبیعی «گسپینگ» (Agonal Breathing) چیست؟
                </h4>
                <p className="text-xs text-rose-800">
                  شایع‌ترین اشتباهی که باعث به تاخیر افتادن ماساژ قلبی می‌شود!
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <p>
                <strong>تنفس گسپینگ (Gasping):</strong> تنفسی بریده‌بریده، مقطع، با دهان باز، سنگین و صدایی شبیه خفگی یا خرخر عمیق است (مشابه حرکات ماهی بیرون افتاده از آب).
              </p>
              <div className="bg-rose-100/80 p-3 rounded-2xl border border-rose-300 text-rose-950 font-black">
                ❌ تنفس گسپینگ تنفس طبیعی نیست! این حالت علامت آشکار ایست قلبی و نرسیدن اکسیژن به ساقه مغز است. فردی که گسپینگ دارد را دقیقاً مانند فردی که هیچ نفسی ندارد در نظر بگیرید و فوراً ماساژ قلبی را شروع کنید.
              </div>
            </div>

            {/* Video Player for Gasping */}
            <div className="pt-2">
              <EducationalVideoPlayer
                src={APP_VIDEOS.gasping}
                title="کلیپ آموزشی: نحوه تشخیص تنفس غیرطبیعی گسپینگ"
                subtitle="مشاهده ویدیو برای شناخت شکل ظاهری تنفس بریده‌بریده در دقایق اول ایست قلبی"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-3">
            <button
              onClick={() => switchTab('responsiveness')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <ArrowRight className="w-4 h-4" />
              <span>گام قبلی</span>
            </button>

            <button
              onClick={() => switchTab('compressions')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xs sm:text-sm shadow-md shadow-red-600/20 touch-press cursor-pointer"
            >
              <span>گام بعدی: شروع ماساژ قفسه سینه (CPR)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CHEST COMPRESSIONS & SIMULATOR ================= */}
      {activeTab === 'compressions' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                <span>گام چهارم: نحوه صحیح ماساژ قفسه سینه و شبیه‌ساز زنده</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                پاشنه دست وسط استخوان جناغ، آرنج‌ها کاملاً صاف، عمق ۵ تا ۶ سانتی‌متر
              </p>
            </div>

            {/* Metronome & Demo buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setIsAutoDemo(!isAutoDemo)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-black transition-all touch-press cursor-pointer ${
                  isAutoDemo
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{isAutoDemo ? 'توقف پخش خودکار' : 'پخش خودکار (۱۱۰ BPM)'}</span>
              </button>

              <button
                onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-black transition-all touch-press cursor-pointer ${
                  isMetronomeActive
                    ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>مترونوم {isMetronomeActive ? '(روشن)' : '(خاموش)'}</span>
              </button>
            </div>
          </div>

          {/* Standard 30:2 or Continuous 100-120 Guideline */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-sky-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>دستورالعمل استاندارد ماساژ و تنفس مصنوعی:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
                <strong className="text-amber-900 block mb-0.5">چرخه استاندارد (۵ سیکلِ ۳۰ ماساژ و ۲ تنفس):</strong>
                <span className="text-slate-700 text-xs">پروتکل بین‌المللی شامل ۵ سیکل متوالی (حدود ۲ دقیقه) است. هر سیکل شامل ۳۰ ماساژ سینه و ۲ تنفس مصنوعی می‌باشد.</span>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-sky-200">
                <strong className="text-sky-900 block mb-0.5">ماساژ مداوم با دست (Hands-Only):</strong>
                <span className="text-slate-700 text-xs">در صورت عدم تمایل به دادن تنفس، ماساژ مداوم را با سرعت ۱۰۰ تا ۱۲۰ در دقیقه تا رسیدن امداد ادامه دهید.</span>
              </div>
            </div>
          </div>

          {/* Status Indicators Bar - Clean & bright without dark borders */}
          <div className="bg-sky-50 text-slate-800 p-3 rounded-2xl border border-sky-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-sky-950">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>زاویه ۹۰° • آرنج‌ها کاملاً صاف • عمق ۵ تا ۶ سانتی‌متر</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 border border-sky-200 shadow-2xs">
                <span className="text-slate-600">ماساژ این دور:</span>
                <span className="text-amber-700 text-sm font-black">
                  {toPersianDigits(currentCompInCycle)} از ۳۰
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-indigo-800 text-xs font-bold">
                  سیکل {toPersianDigits(currentCycleNumber)} از ۵ (دوره ۲ دقیقه‌ای)
                </span>
              </div>

              {currentBpm > 0 && (
                <div className="bg-sky-600 text-white px-2.5 py-1.5 rounded-xl text-xs font-black shadow-xs font-mono">
                  {toPersianDigits(currentBpm)} BPM
                </div>
              )}
            </div>
          </div>

          {/* Fully responsive auto-resolution image container - no dark bars, full size display */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent flex items-center justify-center">
            <motion.img
              src={APP_IMAGES.cprScene}
              alt="آموزش نحوه صحیح ماساژ قفسه سینه"
              referrerPolicy="no-referrer"
              className="w-full h-auto block select-none rounded-2xl sm:rounded-3xl"
              animate={{
                scale: isCompressingVisual ? 1.02 : 1,
              }}
              transition={{ duration: 0.1 }}
            />

            {/* Subtle Heart compression pulse */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <AnimatePresence>
                {isCompressingVisual && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0.8 }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-16 h-16 rounded-full border-4 border-red-500 bg-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.8)] flex items-center justify-center"
                  >
                    <Heart className="w-7 h-7 text-white fill-red-500 animate-ping" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* COMPACT INTERACTIVE PRESS BUTTON BELOW IMAGE */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center gap-3 text-center shadow-xs">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onPointerDown={(e) => {
                e.preventDefault();
                handleCompression();
              }}
              className="w-full sm:w-auto px-8 py-3.5 sm:px-12 sm:py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 active:to-rose-700 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 border border-red-400/40 flex items-center justify-center gap-2.5 touch-press cursor-pointer select-none"
              style={{ touchAction: 'manipulation' }}
              aria-label="فشار دادن قفسه سینه"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white animate-pulse" />
              <span>فشار قفسه سینه (ماساژ)</span>
              <span className="text-xs bg-black/25 px-2.5 py-0.5 rounded-lg font-bold">یا کلید Space</span>
            </motion.button>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-md pt-1 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">فشارهای کل</span>
                <span className="text-base font-black text-slate-900">
                  {toPersianDigits(compressionsCount)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">سرعت لحظه‌ای</span>
                <span className={`text-base font-black ${bpmFeedback === 'perfect' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {currentBpm > 0 ? `${toPersianDigits(currentBpm)} BPM` : '—'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">سیکل جاری</span>
                <span className="text-base font-black text-indigo-700">
                  {toPersianDigits(currentCycleNumber)} از ۵
                </span>
              </div>
            </div>

            {/* 30:2 Completed Alert */}
            {isBreathTime && (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 text-emerald-950 font-black text-xs sm:text-sm animate-fade-in flex items-center gap-2">
                <Wind className="w-5 h-5 text-emerald-600 animate-bounce shrink-0" />
                <span>
                  ۳۰ ماساژ کامل شد! اکنون ۲ تنفس آرام بدهید (سیکل {toPersianDigits(currentCycleNumber)} از ۵)؛ یا در صورت عدم تمایل به تنفس، ماساژ مداوم را با سرعت ۱۰۰ تا ۱۲۰ ادامه دهید.
                </span>
              </div>
            )}

            {/* 5 Cycles (2 Minutes) Completed Alert */}
            {isFiveCyclesCompleted && (
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-3.5 text-amber-950 font-black text-xs sm:text-sm animate-fade-in flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  پایان ۵ سیکل کامل (۲ دقیقه احیا انجام شد)! تنفس و نبض یا دستورات صوتی دستگاه AED را بررسی کرده و بدون وقفه احیا را ادامه دهید.
                </span>
              </div>
            )}
          </div>

          {/* Educational Video for CPR */}
          <div className="pt-2">
            <EducationalVideoPlayer
              src={APP_VIDEOS.cpr}
              title="کلیپ آموزشی: احیای قلبی ریوی پایه (CPR)"
              subtitle="آموزش گام‌به‌گام ماساژ قفسه سینه و نحوه استقرار امدادگر"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-3">
            <button
              onClick={() => switchTab('breathing')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <ArrowRight className="w-4 h-4" />
              <span>گام قبلی</span>
            </button>

            <button
              onClick={() => switchTab('recovery')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 touch-press cursor-pointer"
            >
              <span>گام بعدی: وضعیت ریکاوری</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 5: RECOVERY POSITION ================= */}
      {activeTab === 'recovery' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              <span>گام پنجم: وضعیت ریکاوری (Recovery Position - خوابیده به پهلو)</span>
            </h3>
            <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
              مصدوم دارای تنفس
            </span>
          </div>

          {/* Safe Recovery Image - Self-adjusting container with clean background */}
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent flex items-center justify-center">
            <img
              src="/src/assets/images/recovery_position_safe_1791830021539.jpg"
              alt="وضعیت ریکاوری استاندارد"
              referrerPolicy="no-referrer"
              className="w-full h-auto block select-none rounded-2xl sm:rounded-3xl"
              loading="lazy"
            />
          </div>

          {/* Educational Video for Recovery Position */}
          <div className="pt-1">
            <EducationalVideoPlayer
              src={APP_VIDEOS.recovery}
              title="کلیپ آموزشی: نحوه قرار دادن بیمار در وضعیت ریکاوری"
              subtitle="آموزش گام‌به‌گام چرخاندن مصدوم به پهلو جهت باز ماندن راه هوایی و پیشگیری از خفگی"
            />
          </div>

          <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <p className="font-black text-emerald-950 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              اگر مصدوم تنفس طبیعی دارد یا پس از ماساژ قلبی علائم هوشیاری و تنفس بازگشت، او را در وضعیت ریکاوری (به پهلو) قرار دهید تا راه هوایی باز بماند.
            </p>

            <h4 className="font-black text-slate-900 text-sm sm:text-base pt-1">
              اهداف اصلی وضعیت ریکاوری:
            </h4>
            <ul className="space-y-1.5 pr-5 list-disc list-outside text-slate-600">
              <li>باز ماندن مجرای تنفسی و جلوگیری از افتادن زبان به عقب گلو</li>
              <li>خروج طبیعی استفراغ یا بزاق از دهان و پیشگیری از ورود ترشحات به ریه (آسپیراسیون)</li>
              <li>پایداری بدن روی زمین بدون غلتیدن و آسیب مجدد</li>
            </ul>

            <h4 className="font-black text-slate-900 text-sm sm:text-base pt-2">
              مراحل اجرایی قرار دادن به پهلو:
            </h4>
            <ol className="space-y-2 pr-5 list-decimal list-outside text-slate-600">
              <li>دست نزدیک به خود را در زاویه ۹۰ درجه نسبت به بدن باز کنید (کف دست رو به بالا).</li>
              <li>دست دورتر را روی سینه آورده و پشت دست را زیر گونه بیمار بگذارید.</li>
              <li>پای دورتر را از زانو خم کنید و با گرفتن زانو و شانه، بیمار را به آرامی به سمت خود بچرخانید.</li>
              <li>سر را کمی به عقب متمایل کنید تا راه هوایی باز بماند و تنفس بیمار را هر ۱ دقیقه بررسی کنید.</li>
            </ol>
          </div>

          {/* Navigation to next main chapter */}
          <div className="flex justify-between items-center pt-3 gap-2">
            <button
              onClick={() => switchTab('compressions')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <ArrowRight className="w-4 h-4" />
              <span>گام قبلی: ماساژ قلبی</span>
            </button>

            <button
              onClick={() => {
                setTab('choking');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 touch-press cursor-pointer"
            >
              <span>بخش دوم: انسداد راه هوایی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Bottom Back Button */}
      <div className="flex justify-start items-center pt-2">
        <button
          onClick={() => {
            setTab('home');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 touch-press cursor-pointer transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>
      </div>
    </div>
  );
};
