import React, { useState, useEffect } from 'react';
import {
  Zap,
  Power,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Info,
  Radio,
  Users,
  Video,
  Clock
} from 'lucide-react';
import { sound } from '../utils/sound';
import { AppTab } from '../types';
import { EducationalVideoPlayer } from './common/EducationalVideoPlayer';
import { APP_VIDEOS, APP_IMAGES } from '../config/images';

interface AEDViewProps {
  setTab: (tab: AppTab) => void;
}

export const AEDView: React.FC<AEDViewProps> = ({ setTab }) => {
  // 4 Distinct Tabs: 'about' (دستگاه چیست و کاربرد) | 'guide' (مراحل ۷ گانه و تصویر) | 'video' (فیلم آموزشی) | 'simulator' (شبیه‌ساز تعاملی)
  const [activeMode, setActiveMode] = useState<'about' | 'guide' | 'video' | 'simulator'>('about');

  // Simulator State Machine
  // 0: Off -> click power to turn on
  // 1: Device powered on -> click pads to attach to chest
  // 2: Pads attached -> plug connector
  // 3: Analyzing rhythm -> "Everyone Stand Clear!"
  // 4: Shock advised -> click flashing shock button
  // 5: Shock delivered -> Resume CPR immediately
  const [simStep, setSimStep] = useState<number>(0);
  const [pad1Placed, setPad1Placed] = useState<boolean>(false);
  const [pad2Placed, setPad2Placed] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [voicePrompt, setVoicePrompt] = useState<string>('دستگاه را با لمس دکمه سبز روشن کنید.');

  // Handle power button
  const handlePowerOn = () => {
    if (simStep === 0) {
      sound.playAedBeep('ready');
      setSimStep(1);
      setVoicePrompt('سینه بیمار را برهنه و خشک کنید. پدها را روی نقاط مشخص شده بچسبانید.');
    } else {
      resetSimulator();
    }
  };

  // Handle pad placements
  const handlePlacePad1 = () => {
    if (simStep >= 1 && !pad1Placed) {
      sound.playCompressSound();
      setPad1Placed(true);
      if (pad2Placed) {
        setSimStep(2);
        setVoicePrompt('پدها متصل شدند. فیش کابل را به دستگاه متصل کنید.');
      } else {
        setVoicePrompt('پد اول متصل شد. پد دوم را زیر بغل سمت چپ بچسبانید.');
      }
    }
  };

  const handlePlacePad2 = () => {
    if (simStep >= 1 && !pad2Placed) {
      sound.playCompressSound();
      setPad2Placed(true);
      if (pad1Placed) {
        setSimStep(2);
        setVoicePrompt('پدها متصل شدند. فیش کابل را به دستگاه متصل کنید.');
      } else {
        setVoicePrompt('پد دوم متصل شد. پد اول را زیر ترقوه سمت راست بچسبانید.');
      }
    }
  };

  const handlePlugConnector = () => {
    if (simStep === 2) {
      sound.playAedBeep('ready');
      setSimStep(3);
      setIsAnalyzing(true);
      setVoicePrompt('در حال تحلیل ریتم قلب... هیچ‌کس به بیمار دست نزند! کنار بروید.');

      // Simulate rhythm analysis after 3 seconds
      setTimeout(() => {
        setIsAnalyzing(false);
        sound.playAedBeep('alert');
        setSimStep(4);
        setVoicePrompt('شوک توصیه شد! در حال شارژ... مطمئن شوید هیچ‌کس تماس ندارد، دکمه شوک را بزنید.');
      }, 3200);
    }
  };

  const handleDeliverShock = () => {
    if (simStep === 4) {
      sound.playAedBeep('shock');
      setSimStep(5);
      setVoicePrompt('شوک تخلیه شد! بلافاصله ماساژ قفسه سینه را با سرعت ۱۰۰ تا ۱۲۰ از سر بگیرید.');
      sound.playSuccessSound();
    }
  };

  const resetSimulator = () => {
    setSimStep(0);
    setPad1Placed(false);
    setPad2Placed(false);
    setIsAnalyzing(false);
    setVoicePrompt('دستگاه را با لمس دکمه سبز روشن کنید.');
  };

  const switchTab = (mode: 'about' | 'guide' | 'video' | 'simulator') => {
    setActiveMode(mode);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Breadcrumb with Distinct Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all touch-press cursor-pointer shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>
        <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 font-extrabold px-3 py-1.5 rounded-2xl text-xs sm:text-sm shadow-xs truncate">
          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          <span>دستگاه شوک خودکار (AED)</span>
        </div>
      </div>

      {/* Mandatory Emergency Alert */}
      <div className="bg-red-50 border-r-4 border-red-500 p-3.5 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs sm:text-sm text-red-900 font-bold">
            اول با ۱۱۵ تماس بگیرید! تا رسیدن AED ماساژ قلبی را هرگز متوقف نکنید.
          </p>
        </div>
        <a
          href="tel:115"
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow-xs"
        >
          ۱۱۵
        </a>
      </div>

      {/* Prominent, Distinct Tab Bar with 4 Clear Sub-tabs */}
      <div className="bg-slate-100/90 p-1.5 rounded-2xl border-2 border-slate-200 shadow-sm">
        <div className="text-[11px] font-black text-slate-500 mb-1.5 px-2 flex items-center justify-between">
          <span>سربرگ‌های آموزشی بخش AED:</span>
          <span className="text-amber-700 font-bold">۴ سربرگ تخصصی</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {/* Tab 1: About AED */}
          <button
            onClick={() => switchTab('about')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all min-h-[50px] touch-press flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'about'
                ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400 scale-[1.02]'
                : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
              activeMode === 'about' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
            }`}>۱</span>
            <span className="truncate">دستگاه چیست و کاربرد</span>
          </button>

          {/* Tab 2: 7 Steps & Overview Artwork */}
          <button
            onClick={() => switchTab('guide')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all min-h-[50px] touch-press flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'guide'
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-400 scale-[1.02]'
                : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-slate-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
              activeMode === 'guide' ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-800'
            }`}>۲</span>
            <span className="truncate">مراحل ۷ گانه و تصویر</span>
          </button>

          {/* Tab 3: Educational Video */}
          <button
            onClick={() => switchTab('video')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all min-h-[50px] touch-press flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'video'
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-400 scale-[1.02]'
                : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-slate-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
              activeMode === 'video' ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-800'
            }`}>۳</span>
            <span className="truncate">کلیپ آموزشی AED</span>
          </button>

          {/* Tab 4: Simulator */}
          <button
            onClick={() => switchTab('simulator')}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all min-h-[50px] touch-press flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'simulator'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 scale-[1.02]'
                : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
              activeMode === 'simulator' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'
            }`}>۴</span>
            <span className="truncate">شبیه‌ساز تعاملی AED</span>
          </button>
        </div>
      </div>

      {/* TAB 1: What is AED (سربرگ اول: دستگاه AED چیست، عملکرد و کاربرد) */}
      {activeMode === 'about' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500 shrink-0" />
                <span>دستگاه شوک خودکار خارجی (AED) چیست و چه کاربردی دارد؟</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                راهنمای جامع آشنایی با دستگاه، عملکرد فیزیولوژیک و زمان استفاده در ایست قلبی
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-black px-3 py-1.5 rounded-2xl shrink-0">
              سربرگ ۱
            </span>
          </div>

          {/* Definition Box */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-200 rounded-3xl p-4 sm:p-6 space-y-3">
            <h4 className="font-black text-amber-950 text-sm sm:text-base flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600" />
              <span>تعریف دستگاه AED (Automated External Defibrillator):</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              دستگاه <strong>AED (دفیبریلاتور خودکار خارجی)</strong> یک وسیله پزشکی نجات‌بخش، سبک و قابل‌حمل است که می‌تواند فعالیت الکتریکی قلب بیمار را به صورت کاملاً خودکار آنالیز کند و در صورت لزوم با تخلیه یک شوک الکتریکی دقیق، ریتم نامنظم و کشنده قلب را برطرف کرده و ضربان طبیعی را برگرداند.
            </p>
            <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1.5">
              <strong className="text-amber-950 block">مکانیسم عمل (چرا شوک نجات‌بخش است؟):</strong>
              <p>
                در بیشتر موارد ایست قلبی ناگهانی بزرگسالان، قلب کاملاً متوقف نشده بلکه دچار لرزش الکتریکی بسیار سریع و آشفته موسوم به <strong>فیبریلاسیون بطنی (VF)</strong> یا <strong>تاکی‌کاردی بطنی بدون نبض (VT)</strong> می‌شود؛ در این حالت خون پمپاژ نمی‌گردد. شوک AED مانند یک راه‌اندازی مجدد (ری‌استارت) عمل کرده و به سلول‌های ضربان‌ساز قلب اجازه می‌دهد دوباره ریتم منظم و هماهنگ را ایجاد نمایند.
              </p>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl space-y-2">
              <h5 className="font-black text-sky-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-600" />
                <span>طراحی اختصاصی برای استفاده عموم جامعه:</span>
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                این دستگاه به صورت <strong>هوشمند، صوتی و تصویری</strong> کاربر را قدم به قدم راهنمایی می‌کند و نیازی به دانش پزشکی تخصصی ندارد. هر فرد عادی در صحنه می‌تواند آن را روشن کرده و از راهنمایی‌های صوتی دستگاه پیروی نماید.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
              <h5 className="font-black text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ایمنی صددرصد و عدم امکان اشتباه:</span>
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                دستگاه AED به هیچ عنوان به فردی که نیازی به شوک ندارد شوک نمی‌دهد! هوش مصنوعی دستگاه ریتم را تحلیل می‌کند؛ اگر ریتم شوک‌پذیر نباشد، دکمه شوک فعال نمی‌شود و دستگاه دستور ادامه ماساژ قلبی را صادر می‌کند.
              </p>
            </div>
          </div>

          {/* When to use */}
          <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-3xl space-y-3">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>چه زمانی باید از دستگاه AED استفاده کرد؟</span>
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">۱</span>
                <span>فرد <strong>کاملاً بی‌پاسخ</strong> باشد (با صدا زدن و تکان دادن شانه پاسخی ندهد).</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">۲</span>
                <span><strong>تنفس ندارد یا تنفس غیرطبیعی و بریده‌بریده (گسپینگ)</strong> دارد.</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">۳</span>
                <span><strong>قانون طلایی:</strong> ماساژ قلبی را تا رسیدن دستگاه متوقف نکنید؛ از فرد دیگری بخواهید بلافاصله برود و دستگاه AED را بیاورد.</span>
              </div>
            </div>
          </div>

          {/* The Vital Time Factor */}
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-rose-950 block font-black text-sm mb-0.5">
                عامل زمان: هر یک دقیقه تأخیر = کاهش ۷ تا ۱۰ درصدی شانس زنده ماندن!
              </strong>
              <span>
                در ریتم‌های شوک‌پذیر، اعمال شوک در دقایق ۱ تا ۳ شانس بقا را تا بالای ۷۰٪ افزایش می‌دهد. به همین دلیل دستگاه‌های AED در اماکن عمومی پرتردد (فرودگاه‌ها، ایستگاه‌های مترو، ورزشگاه‌ها، مراکز تجاری) نصب می‌شوند.
              </span>
            </div>
          </div>

          {/* CTA to next tab */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => switchTab('guide')}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 touch-press cursor-pointer"
            >
              <span>مشاهده مراحل ۷ گانه و تصویر دستگاه (سربرگ ۲)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: Step by Step Guide (سربرگ دوم: مراحل ۷ گانه و تصویر) */}
      {activeMode === 'guide' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              مراحل ۷ گانه به‌کارگیری دستگاه AED
            </h3>

            {/* User's Exact High-Resolution AED Artwork - Auto-resolution without dark borders */}
            <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent flex items-center justify-center">
              <img
                src={APP_IMAGES.aedOverview}
                alt="نحوه کار با دستگاه AED"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none rounded-2xl sm:rounded-3xl"
                loading="lazy"
              />
            </div>

            {/* Steps Visual List */}
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: '۱. روشن کردن دستگاه',
                  desc: 'دستگاه را روشن کنید و بلافاصله دستورات صوتی و تصویری آن را دنبال کنید.',
                },
                {
                  step: 2,
                  title: '۲. آماده‌سازی قفسه سینه',
                  desc: 'قفسه سینه را کاملاً برهنه کنید و در صورت خیس بودن یا عرق زیاد، آن را با پارچه خشک نمایید.',
                },
                {
                  step: 3,
                  title: '۳. چسباندن پدها روی نقاط درست',
                  desc: 'دو پد را مطابق شکل روی پدها بچسبانید: یکی بالا سمت راست قفسه سینه (زیر استخوان ترقوه) و دیگری سمت چپ بدن، پایین‌تر از زیر بغل. سپس کابل پدها را به دستگاه وصل کنید.',
                },
                {
                  step: 4,
                  title: '۴. تحلیل ریتم قلب و اعلام «کنار بروید»',
                  desc: 'هنگام تحلیل ریتم توسط دستگاه، «هیچ‌کس نباید به بیمار دست بزند». با صدای بلند اعلام کنید: «همه کنار بروید!».',
                },
                {
                  step: 5,
                  title: '۵. تخلیه شوک (در صورت توصیه دستگاه)',
                  desc: 'اگر دستگاه شوک را توصیه کرد، مطمئن شوید هیچ‌کس با بیمار تماس فیزیکی ندارد، سپس دکمه شوک (چشمک‌زن) را فشار دهید (در مدل‌های تمام‌خودکار، دستگاه خودبه‌خود شوک می‌دهد).',
                },
                {
                  step: 6,
                  title: '۶. از سرگیری فوری ماساژ قلبی',
                  desc: 'بلافاصله بعد از شوک، بدون اتلاف وقت ماساژ قلبی را از سر بگیرید و دستورات دوره‌ای دستگاه را دنبال نمایید.',
                },
                {
                  step: 7,
                  title: '۷. ادامه تا رسیدن اورژانس یا بهبود بیمار',
                  desc: 'عملیات را تا رسیدن تیم تخصصی ۱۱۵ یا بازگشت علائم بهبودی ادامه دهید و هرگز پدها را جدا نکنید.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Considerations */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>نکات ایمنی بسیار مهم هنگام کار با AED:</span>
            </h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2 pr-4 list-disc leading-relaxed">
              <li>
                <strong>روی سطح خیس شوک ندهید:</strong> بیمار را از آب یا گودال آب به یک سطح خشک انتقال دهید و سینه او را کاملاً خشک کنید.
              </li>
              <li>
                <strong>برآمدگی دستگاه زیر پوست (پیس‌میکر / باتری قلب):</strong> اگر برآمدگی سفت در زیر پوست دیده شد، پد را دقیقاً روی آن نچسبانید و حداقل چند سانتی‌متر با آن فاصله بدهید.
              </li>
              <li>
                <strong>کودکان:</strong> در کودکان در صورت وجود پدهای مخصوص کودکان از آن استفاده شود؛ در غیر این صورت از پد استاندارد استفاده کرده و دقت کنید پدها به هم نچسبند.
              </li>
            </ul>
          </div>

          {/* Subtab Navigation Buttons */}
          <div className="pt-2 flex justify-between items-center gap-2">
            <button
              onClick={() => switchTab('about')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:bg-slate-50 touch-press cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>سربرگ ۱: دستگاه چیست</span>
            </button>
            <button
              onClick={() => switchTab('video')}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-sky-600/20 touch-press cursor-pointer"
            >
              <span>مشاهده فیلم آموزشی (سربرگ ۳)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: Educational Video Clip (سربرگ سوم) */}
      {activeMode === 'video' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Video className="w-6 h-6 text-sky-600" />
              <span>کلیپ آموزشی کار با دستگاه AED</span>
            </h3>
            <span className="text-xs bg-sky-100 text-sky-800 font-extrabold px-3 py-1.5 rounded-xl">
              سربرگ ۳
            </span>
          </div>

          <EducationalVideoPlayer
            src={APP_VIDEOS.aed}
            title="آموزش عملی کار با دستگاه شوک خودکار (AED)"
            subtitle="نحوه روشن کردن، جای‌گذاری پدها، تحلیل ریتم و تخلیه شوک ایمن"
          />

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 space-y-1.5">
            <h4 className="font-extrabold text-amber-900 text-sm">نکات مهم نمایش داده شده در ویدیو:</h4>
            <ul className="pr-5 list-disc space-y-1 text-slate-700">
              <li>پد اول زیر استخوان ترقوه راست و پد دوم زیر بغل سمت چپ قرار می‌گیرد.</li>
              <li>هنگام تحلیل ریتم قلب و اعلام دستگاه، همه افراد باید از تماس با بیمار خودداری کنند.</li>
              <li>پس از تخلیه شوک یا اعلام عدم نیاز به شوک، بلافاصله ماساژ قفسه سینه را ادامه دهید.</li>
            </ul>
          </div>

          {/* Subtab Navigation Buttons */}
          <div className="pt-2 flex justify-between items-center gap-2">
            <button
              onClick={() => switchTab('guide')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:bg-slate-50 touch-press cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>سربرگ ۲: مراحل ۷ گانه</span>
            </button>
            <button
              onClick={() => switchTab('simulator')}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 touch-press cursor-pointer"
            >
              <span>ورود به شبیه‌ساز تعاملی (سربرگ ۴)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: Interactive AED Simulator */}
      {activeMode === 'simulator' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>شبیه‌ساز تعاملی دستگاه AED</span>
              </h3>
              <p className="text-xs text-slate-500">
                مراحل روشن کردن، چسباندن پدها، تحلیل ریتم و تخلیه شوک را تمرین کنید
              </p>
            </div>
            <button
              onClick={resetSimulator}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>شروع مجدد</span>
            </button>
          </div>

          {/* Voice Prompt Banner on Simulator */}
          <div className="bg-slate-900 text-amber-400 p-3.5 rounded-2xl flex items-center gap-3 border border-slate-800 shadow-inner">
            <Volume2 className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div className="text-xs sm:text-sm font-bold leading-relaxed text-right flex-1">
              پیام صوتی AED: «{voicePrompt}»
            </div>
          </div>

          {/* Virtual Patient Chest & AED Unit Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chest Pad Placement Area */}
            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-700 mb-2">
                قفسه سینه بیمار (روی دایره‌های هدف کلیک کنید)
              </span>

              <div className="relative w-48 h-64 bg-slate-200/90 rounded-3xl border-2 border-slate-300 p-2 flex flex-col items-center justify-between">
                {/* Neck & Shoulders */}
                <div className="w-16 h-8 bg-slate-300 rounded-t-xl" />

                {/* Pad 1 Target: Upper Right Chest (Left side from our view) */}
                <button
                  onClick={handlePlacePad1}
                  disabled={simStep < 1 || pad1Placed}
                  className={`absolute top-12 left-5 w-14 h-16 rounded-xl border-2 transition-all flex flex-col items-center justify-center p-1 text-[10px] font-bold touch-press ${
                    pad1Placed
                      ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-md'
                      : simStep >= 1
                      ? 'bg-white border-amber-500 text-amber-700 animate-pulse shadow-md'
                      : 'bg-slate-200 border-slate-300 text-slate-400'
                  }`}
                >
                  <span>پد ۱</span>
                  <span className="text-[8px] leading-tight text-center">زیر ترقوه راست</span>
                </button>

                {/* Pad 2 Target: Lower Left Chest (Right side from our view) */}
                <button
                  onClick={handlePlacePad2}
                  disabled={simStep < 1 || pad2Placed}
                  className={`absolute bottom-16 right-5 w-14 h-16 rounded-xl border-2 transition-all flex flex-col items-center justify-center p-1 text-[10px] font-bold touch-press ${
                    pad2Placed
                      ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-md'
                      : simStep >= 1
                      ? 'bg-white border-amber-500 text-amber-700 animate-pulse shadow-md'
                      : 'bg-slate-200 border-slate-300 text-slate-400'
                  }`}
                >
                  <span>پد ۲</span>
                  <span className="text-[8px] leading-tight text-center">زیر بغل چپ</span>
                </button>

                {/* Sternum Center mark */}
                <div className="w-2 h-16 bg-slate-300 rounded-full" />
                <span className="text-[10px] text-slate-500 pb-2">بدن بیمار</span>
              </div>

              <div className="text-[11px] text-slate-500 mt-2 text-center">
                {pad1Placed && pad2Placed
                  ? 'هر دو پد در محل مناسب نصب شدند.'
                  : 'پد ۱ و پد ۲ را با لمس روی بدن بچسبانید.'}
              </div>
            </div>

            {/* Virtual AED Device Unit */}
            <div className="bg-gradient-to-b from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg flex flex-col justify-between border-4 border-amber-700">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-amber-400/40">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-white" />
                    <span className="font-black text-sm tracking-wide">AED TRAINER 115</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${simStep > 0 ? 'bg-emerald-300 animate-ping' : 'bg-amber-800'}`} />
                </div>

                {/* Device Screen */}
                <div className="bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-xs my-3 min-h-[70px] border border-amber-800 flex flex-col justify-center text-center">
                  {simStep === 0 && <span className="text-slate-500">دستگاه خاموش است</span>}
                  {simStep === 1 && <span>UNIT READY: ATTACH PADS</span>}
                  {simStep === 2 && <span>PLUG IN CONNECTOR</span>}
                  {simStep === 3 && (
                    <span className="text-amber-400 animate-pulse font-bold">
                      ANALYZING... STAND CLEAR!
                    </span>
                  )}
                  {simStep === 4 && (
                    <span className="text-rose-400 animate-bounce font-bold">
                      SHOCK ADVISED! PRESS SHOCK
                    </span>
                  )}
                  {simStep === 5 && <span className="text-emerald-300">SHOCK DELIVERED - RESUME CPR</span>}
                </div>
              </div>

              {/* AED Hardware Buttons */}
              <div className="space-y-2.5">
                {/* 1. Green Power Button */}
                <button
                  onClick={handlePowerOn}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all min-h-[44px] touch-press ${
                    simStep === 0
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md animate-pulse'
                      : 'bg-emerald-700 text-emerald-200'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{simStep === 0 ? '۱. روشن کردن دستگاه (POWER)' : 'دستگاه روشن است'}</span>
                </button>

                {/* 2. Cable Connector Button */}
                <button
                  onClick={handlePlugConnector}
                  disabled={simStep !== 2}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all min-h-[44px] touch-press ${
                    simStep === 2
                      ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md animate-bounce'
                      : 'bg-amber-700/60 text-amber-200 opacity-60'
                  }`}
                >
                  <span>۲. اتصال کابل پدها به دستگاه</span>
                </button>

                {/* 3. Red Shock Button */}
                <button
                  onClick={handleDeliverShock}
                  disabled={simStep !== 4}
                  className={`w-full py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all min-h-[48px] touch-press ${
                    simStep === 4
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-2xl ring-4 ring-white animate-pulse scale-105'
                      : 'bg-red-950/40 text-red-300 opacity-50'
                  }`}
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>۳. فشردن دکمه شوک (SHOCK)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Success Result Box */}
          {simStep === 5 && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-2 text-emerald-950 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>عملیات شوک با موفقیت انجام شد!</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                طبق دستور استاندارد، <strong>بلافاصله بدون وقفه ماساژ قلبی را از سر بگیرید</strong> و اجازه دهید دستگاه در دوره‌های ۲ دقیقه‌ای ریتم را مجدداً تحلیل کند.
              </p>
            </div>
          )}

          {/* Subtab Navigation Buttons */}
          <div className="pt-2 flex justify-start items-center gap-2">
            <button
              onClick={() => switchTab('video')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:bg-slate-50 touch-press cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به سربرگ ۳: کلیپ آموزشی</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation CTA to Quiz with Orange Back Button */}
      <div className="flex justify-between items-center pt-3 gap-2">
        <button
          onClick={() => {
            setTab('choking');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 touch-press cursor-pointer transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>

        <button
          onClick={() => {
            setTab('quiz');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 touch-press cursor-pointer"
        >
          <span>بخش چهارم: آزمون پایانی</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
