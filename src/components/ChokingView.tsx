import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wind,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Activity,
  UserCheck,
  Baby,
  Heart,
  HelpCircle,
  Sparkles,
  MoveUp,
  AlertOctagon,
  Video,
  Info,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/sound';
import { AppTab } from '../types';
import { EducationalVideoPlayer } from './common/EducationalVideoPlayer';
import { APP_VIDEOS, APP_IMAGES } from '../config/images';

interface ChokingViewProps {
  setTab: (tab: AppTab) => void;
}

export const ChokingView: React.FC<ChokingViewProps> = ({ setTab }) => {
  // Sub-tabs: 'why_choking', 'adult', 'children', 'infant', 'pregnant', 'exercises'
  const [activeChokingTab, setActiveChokingTab] = useState<
    'why_choking' | 'adult' | 'children' | 'infant' | 'pregnant' | 'exercises'
  >('why_choking');

  // Visual pulse animation state during Heimlich / Back Blows
  const [isHeimlichVisual, setIsHeimlichVisual] = useState(false);

  // Diagnostic Quiz State
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswer, setDiagAnswer] = useState<'mild' | 'severe' | null>(null);
  const [diagFeedback, setDiagFeedback] = useState<boolean | null>(null);

  // Adult Heimlich Animation Stage (0: Back blows 1-5, 1: Abdominal thrusts 1-5, 2: Object expelled)
  const [heimlichStep, setHeimlichStep] = useState<number>(0);
  const [heimlichCount, setHeimlichCount] = useState<number>(1);

  // Exercise 1: Step ordering
  const initialStepsOrder = [
    { id: 3, text: 'ایستادن پشت بیمار، کمی خمیده کردن او و وارد کردن ۵ ضربه با پاشنه دست بین دو کتف' },
    { id: 1, text: 'در قدم اول درخواست کمک فوری از اورژانس ۱۱۵' },
    { id: 4, text: 'مشت کردن دست غالب (شست داخل، بقیه انگشتان روی آن) و بردن دست‌ها از زیر بغل بین ناف و جناغ' },
    { id: 2, text: 'اطمینان از امنیت و ایمنی خود و بیمار' },
    { id: 5, text: '۵ بار فشردن سریع و ناگهانی شکم به سمت داخل و بالا (حالت بلند کردن بیمار از زمین)' },
    { id: 6, text: 'تکرار توالی ۵ ضربه پشت و ۵ فشار شکم تا خروج جسم یا رسیدن اورژانس' },
  ];
  const [orderedSteps, setOrderedSteps] = useState(initialStepsOrder);
  const [orderEvaluated, setOrderEvaluated] = useState<boolean | null>(null);

  // Exercise 2: Hand placement target test
  const [targetSelected, setTargetSelected] = useState<string | null>(null);

  // Infant Animation Step (1 to 3)
  const [infantStage, setInfantStage] = useState<number>(1);

  // Interactive Maneuver States
  const [childStage, setChildStage] = useState<'backBlows' | 'heimlich'>('backBlows');
  const [childManeuverCount, setChildManeuverCount] = useState<number>(1);
  const [pregnantManeuverCount, setPregnantManeuverCount] = useState<number>(1);
  const [infantManeuverCount, setInfantManeuverCount] = useState<number>(1);

  // Diagnostic scenarios directly based on the brochure
  const diagnosticScenarios = [
    {
      id: 1,
      title: 'سناریوی شماره ۱: فرد در حال غذا خوردن',
      text: 'شخصی هنگام خوردن غذا دچار سرفه‌های شدید و پر سر و صدا می‌شود، می‌تواند با صدایی گرفته حرف بزند و هوا در ریه‌هایش رد و بدل می‌شود.',
      correct: 'mild' as const,
      explanation:
        'انسداد خفیف است: چون بیمار هوشیار است، سرفه مؤثر دارد و هوا رد و بدل می‌شود. اقدام صحیح: فقط تشویق به سرفه قوی! هیچ ضربه‌ای به پشت نزنید، چون ممکن است آن را به انسداد کامل تبدیل کند.',
    },
    {
      id: 2,
      title: 'سناریوی شماره ۲: بیقراری ناگهانی و سکوت',
      text: 'فرد دست‌هایش را به سمت گلو برده، قادر به صحبت کردن یا کشیدن نفس نیست، سرفه‌ای شنیده نمی‌شود و رنگ چهره‌اش به سمت کبودی می‌رود.',
      correct: 'severe' as const,
      explanation:
        'انسداد کامل است: بیمار نمی‌تواند صحبت کند، سرفه مؤثر ندارد و هوا تبادل نمی‌شود. اقدام فوری: تماس با ۱۱۵، ۵ ضربه بین دو کتف + ۵ فشار شکمی هایملیخ (داخل و بالا).',
    },
    {
      id: 3,
      title: 'سناریوی شماره ۳: کودک در حال بازی با اسباب‌بازی',
      text: 'کودک ناگهان به نفس‌نفس افتاده، اشک در چشمانش جمع شده ولی کاملاً بی‌صداست و هیچ گریه یا صدایی از گلوی او خارج نمی‌شود.',
      correct: 'severe' as const,
      explanation:
        'انسداد کامل است: در کودکان وجود اشک بدون هیچ صدایی نشانه قطعی انسداد کامل راه هوایی است. نیاز به اقدام اورژانسی با رعایت هم‌قد شدن دارد.',
    },
  ];

  const handleDiagSelect = (type: 'mild' | 'severe') => {
    setDiagAnswer(type);
    const isCorrect = type === diagnosticScenarios[diagStep].correct;
    setDiagFeedback(isCorrect);
    if (isCorrect) sound.playSuccessSound();
    else sound.playErrorSound();
  };

  const nextDiagScenario = () => {
    setDiagAnswer(null);
    setDiagFeedback(null);
    setDiagStep((prev) => (prev + 1) % diagnosticScenarios.length);
  };

  // Reordering helpers
  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedSteps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setOrderedSteps(newOrder);
    setOrderEvaluated(null);
  };

  const checkStepsOrder = () => {
    const isCorrect = orderedSteps.every((step, idx) => step.id === idx + 1);
    setOrderEvaluated(isCorrect);
    if (isCorrect) sound.playSuccessSound();
    else sound.playErrorSound();
  };

  // Adult Heimlich action advance
  const advanceHeimlich = () => {
    sound.playCompressSound();
    setIsHeimlichVisual(true);
    setTimeout(() => setIsHeimlichVisual(false), 240);

    if (heimlichStep === 0) {
      if (heimlichCount < 5) {
        setHeimlichCount((c) => c + 1);
      } else {
        setHeimlichStep(1);
        setHeimlichCount(1);
      }
    } else if (heimlichStep === 1) {
      if (heimlichCount < 5) {
        setHeimlichCount((c) => c + 1);
      } else {
        setHeimlichStep(2);
        sound.playSuccessSound();
      }
    } else {
      setHeimlichStep(0);
      setHeimlichCount(1);
    }
  };

  // Child Heimlich advance
  const advanceChildManeuver = () => {
    sound.playCompressSound();
    setIsHeimlichVisual(true);
    setTimeout(() => setIsHeimlichVisual(false), 240);

    if (childManeuverCount < 5) {
      setChildManeuverCount((c) => c + 1);
    } else {
      setChildManeuverCount(1);
      setChildStage((prev) => (prev === 'backBlows' ? 'heimlich' : 'backBlows'));
      sound.playSuccessSound();
    }
  };

  // Pregnant / Obese Chest Thrust advance
  const advancePregnantManeuver = () => {
    sound.playCompressSound();
    setIsHeimlichVisual(true);
    setTimeout(() => setIsHeimlichVisual(false), 240);

    if (pregnantManeuverCount < 5) {
      setPregnantManeuverCount((c) => c + 1);
    } else {
      setPregnantManeuverCount(1);
      sound.playSuccessSound();
    }
  };

  // Infant Relief advance
  const advanceInfantManeuver = () => {
    sound.playCompressSound();
    setIsHeimlichVisual(true);
    setTimeout(() => setIsHeimlichVisual(false), 240);

    if (infantManeuverCount < 5) {
      setInfantManeuverCount((c) => c + 1);
    } else {
      setInfantManeuverCount(1);
      setInfantStage((prev) => (prev === 1 ? 2 : 1));
      sound.playSuccessSound();
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Breadcrumb with Distinct Orange Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all touch-press cursor-pointer shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>
        <div className="flex items-center gap-1.5 bg-sky-100 text-sky-800 font-extrabold px-3 py-1.5 rounded-2xl text-xs sm:text-sm shadow-xs truncate">
          <Wind className="w-4 h-4 text-sky-600 shrink-0" />
          <span>انسداد راه هوایی</span>
        </div>
      </div>

      {/* Mandatory Emergency Alert */}
      <div className="bg-red-50 border-r-4 border-red-500 p-3.5 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs sm:text-sm text-red-900 font-bold">
            اول با ۱۱۵ تماس بگیرید! در صورت مشاهده انسداد کامل، هر ثانیه حیاتی است.
          </p>
        </div>
        <a
          href="tel:115"
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow-xs"
        >
          ۱۱۵
        </a>
      </div>

      {/* Prominent, Distinct & High-Contrast Navigation Sub-Tabs */}
      <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="text-[11px] sm:text-xs font-black text-slate-500 mb-2 px-2 flex items-center justify-between">
          <span>سربرگ‌های آموزشی انسداد راه هوایی و مانورها:</span>
          <span className="text-indigo-900 font-black">۶ سربرگ تخصصی</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {[
            {
              id: 'why_choking' as const,
              label: '۱. چرا انسداد رخ می‌دهد؟',
              desc: 'علل و تشخیص نوع',
              icon: Wind,
              activeClass: 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-300',
            },
            {
              id: 'adult' as const,
              label: '۲. هایملیخ بزرگسالان',
              desc: '۵ ضربه + ۵ فشار',
              icon: UserCheck,
              activeClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-300',
            },
            {
              id: 'children' as const,
              label: '۳. کودکان',
              desc: 'رعایت هم‌قد شدن',
              icon: Baby,
              activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300',
            },
            {
              id: 'infant' as const,
              label: '۴. شیرخواران',
              desc: 'زیر ۱ سال روی ساعد',
              icon: Baby,
              activeClass: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-300',
            },
            {
              id: 'pregnant' as const,
              label: '۵. بارداری و چاقی',
              desc: 'فشار روی جناغ سینه',
              icon: Heart,
              activeClass: 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-300',
            },
            {
              id: 'exercises' as const,
              label: '۶. تمرین‌های تعاملی',
              desc: 'ترتیب مراحل و نقطه مشت',
              icon: Sparkles,
              activeClass: 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChokingTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveChokingTab(tab.id);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  if (document.documentElement) document.documentElement.scrollTop = 0;
                  if (document.body) document.body.scrollTop = 0;
                }}
                className={`p-2.5 rounded-2xl text-xs font-black transition-all touch-press flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                  isActive
                    ? tab.activeClass
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </div>
                <span className={`text-[10px] hidden sm:inline ${isActive ? 'text-white/85' : 'text-slate-500'}`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SUB-TAB 1: WHY CHOKING OCCURS & DIAGNOSTIC SCENARIOS ================= */}
      {activeChokingTab === 'why_choking' && (
        <div className="space-y-5 animate-fade-in">
          {/* Card: Why choking occurs */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Wind className="w-6 h-6 text-sky-600" />
                <span>چرا انسداد راه هوایی رخ می‌دهد؟</span>
              </h3>
              <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
                بقا بیش از ۹۵٪ با اقدام به‌موقع
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              از نظر ساختار آناتومی بدن، <strong>ابتدای راه هوایی و مسیر گوارش مشترک است</strong>. به همین علت اجسام خارجی که بلعیده می‌شوند مانند لقمه غذا، تکه اسباب‌بازی و... می‌توانند در مسیر راه هوایی قرار گرفته و انسداد خفیف تا شدید ایجاد کنند.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <strong className="text-slate-900 block text-xs sm:text-sm">در بزرگسالان:</strong>
                <span className="text-slate-600 leading-relaxed">معمولاً هنگام غذا خوردن، صحبت کردن موقع جویدن یا ورود ناگهانی لقمه غذا به مجرای تنفس رخ می‌دهد.</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <strong className="text-slate-900 block text-xs sm:text-sm">در شیرخواران و کودکان:</strong>
                <span className="text-slate-600 leading-relaxed">هنگام بلعیدن تکه‌های نامناسب غذا یا کنجکاوی و بازی با قطعات کوچک اسباب‌بازی اتفاق می‌افتد.</span>
              </div>
            </div>
          </div>

          {/* Reference Side-by-Side Comparison: Mild vs Severe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mild Obstruction Box */}
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-sky-900 font-black text-sm sm:text-base pb-2 border-b border-sky-100">
                <span className="w-3.5 h-3.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>علائم و اقدام در انسداد خفیف</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 pr-4 list-disc leading-relaxed">
                <li>بیمار هوشیار و پاسخگو است.</li>
                <li>صدای غیرطبیعی هنگام تنفس دارد.</li>
                <li>سرفه مؤثر دارد (در شیرخواران گریه مؤثر).</li>
                <li>هوا در ریه‌ها مبادله می‌شود و رنگ چهره طبیعی است.</li>
              </ul>
              <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 text-xs text-sky-950 space-y-1">
                <strong className="block text-sky-900">اقدام حیاتی:</strong>
                <span>تنها تشویق بیمار به سرفه قوی و مؤثر!</span>
                <div className="text-red-700 font-black pt-1">
                  هشدار: به پشت فرد ضربه نزنید و مداخله دیگری نکنید؛ زیرا ممکن است جسم جابه‌جا شده و انسداد خفیف به کامل تبدیل شود!
                </div>
              </div>
            </div>

            {/* Severe Obstruction Box */}
            <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-black text-sm sm:text-base pb-2 border-b border-rose-100">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 shrink-0"></span>
                <span>علائم و اقدام در انسداد کامل</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 pr-4 list-disc leading-relaxed">
                <li>توانایی سرفه کردن را ندارد یا سرفه بسیار ضعیف و بی‌صداست.</li>
                <li>نمی‌تواند صحبت کند و دست‌ها را به سمت گلو می‌برد (علامت جهانی خفگی).</li>
                <li>تلاش برای تنفس وجود دارد ولی هیچ هوایی رد و بدل نمی‌شود.</li>
                <li>پس از چند دقیقه پوست و لب‌ها به سمت کبودی (سیانوز) می‌رود.</li>
                <li>در کودکان اشک در چشمان جاری است ولی کودک کاملاً بی‌صداست.</li>
              </ul>
              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-xs text-rose-950">
                <strong className="block text-rose-900 mb-0.5">اقدام فوری:</strong>
                <span>درخواست کمک از ۱۱۵ + آغاز فوری مانور هایملیخ (۵ ضربه بین دو کتف + ۵ فشار شکمی به داخل و بالا).</span>
              </div>
            </div>
          </div>

          {/* Interactive Diagnostic Scenarios Box - EXACTLY BELOW ALL EXPLANATIONS AND BELOW SEVERE OBSTRUCTION BOX */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600 shrink-0" />
                <span>ابزار تعاملی: سناریو تشخیص خفیف یا کامل بودن انسداد</span>
              </h4>
              <span className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200 font-black">
                سناریوی {diagStep + 1} از {diagnosticScenarios.length}
              </span>
            </div>

            {/* Scenario Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
              <h5 className="font-black text-xs sm:text-sm text-slate-900">
                {diagnosticScenarios[diagStep].title}
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {diagnosticScenarios[diagStep].text}
              </p>
            </div>

            {/* Diagnostic Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleDiagSelect('mild')}
                disabled={diagAnswer !== null}
                className={`p-4 rounded-2xl border-2 text-right transition-all min-h-[56px] touch-press cursor-pointer ${
                  diagAnswer === 'mild'
                    ? diagFeedback
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300'
                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-xs sm:text-sm text-slate-900 font-black">انسداد خفیف</strong>
                  <span className="text-[11px] text-slate-500 font-bold">سرفه مؤثر، هوشیار</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  فرد همچنان قادر به تبادل مقداری هوا و سرفه کردن است.
                </p>
              </button>

              <button
                onClick={() => handleDiagSelect('severe')}
                disabled={diagAnswer !== null}
                className={`p-4 rounded-2xl border-2 text-right transition-all min-h-[56px] touch-press cursor-pointer ${
                  diagAnswer === 'severe'
                    ? diagFeedback
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300'
                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-xs sm:text-sm text-slate-900 font-black">انسداد کامل</strong>
                  <span className="text-[11px] text-red-600 font-black">ناتوان از سرفه یا تکلم</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  راه هوایی به طور کامل مسدود شده و هیچ هوایی رد و بدل نمی‌شود.
                </p>
              </button>
            </div>

            {/* Feedback & Detailed Explanation */}
            {diagFeedback !== null && (
              <div
                className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
                  diagFeedback
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                  {diagFeedback ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>پاسخ شما کاملاً صحیح است!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>توجه به نشانه‌های بالینی:</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  {diagnosticScenarios[diagStep].explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={nextDiagScenario}
                    className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs touch-press cursor-pointer"
                  >
                    سناریوی بعدی
                  </button>
                </div>
              </div>
            )}

            {/* Next Button to Adult */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveChokingTab('adult');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  if (document.documentElement) document.documentElement.scrollTop = 0;
                  if (document.body) document.body.scrollTop = 0;
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/20 touch-press cursor-pointer"
              >
                <span>گام بعدی: هایملیخ بزرگسالان</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Adult Heimlich Maneuver */}
      {activeChokingTab === 'adult' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                مانور هایملیخ در بزرگسالان (Heimlich Maneuver)
              </h3>
              <p className="text-xs text-slate-500">
                چرخه ۵ ضربه پشت + ۵ فشار شکمی تا خروج کامل جسم خارجی
              </p>
            </div>
            <span className="text-xs bg-red-100 text-red-700 font-black px-3 py-1 rounded-full">
              انسداد کامل
            </span>
          </div>

          {/* ۱. توضیح مانور چی هست و برای چی هست (تعریف و مکانیسم اثر) */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-2 border-indigo-200 rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-black text-sm sm:text-base">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <span>مانور هایملیخ چیست و برای چیست؟ (هدف و مکانیسم عمل)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <strong>مانور هایملیخ:</strong> یک روش فوری و اورژانسی برای نجات جان فردی است که به دلیل گیر کردن غذا یا جسم خارجی در مجرای تنفس، دچار خفگی کامل شده است.
            </p>
            <div className="bg-white/90 p-3.5 rounded-2xl border border-indigo-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
              <strong className="text-indigo-950 block text-xs sm:text-sm">مکانیسم عمل (چگونه باعث نجات می‌شود؟):</strong>
              <span>
                با وارد کردن فشار ناگهانی به زیر دیافراگم، هوای حبس‌شده در انتهای ریه‌ها فشرده می‌شود؛ این هوا مانند یک پیستون پرفشار به سمت بالا حرکت کرده و جسم خارجی را همانند پرتاب چوب‌پنبه بطری به بیرون پرتاب می‌کند تا راه تنفس بلافاصله باز شود.
              </span>
            </div>
          </div>

          {/* ۲. روش انجام مانور (دستورالعمل بالینی و مراحل ۷ گانه) */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-3xl">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>روش انجام مانور هایملیخ بزرگسال (روش کار و مراحل ۷ گانه):</span>
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed pr-1">
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">۱</span>
                <span>در قدم اول باید از <strong>اورژانس ۱۱۵</strong> کمک بخواهید.</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">۲</span>
                <span>از <strong>امنیت بیمار</strong> و عدم وجود خطر در صحنه اطمینان حاصل کنید.</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">۳</span>
                <span>بیمار را کمی به جلو خمیده کرده و با قسمت پاشنه دست <strong>۵ ضربه به پشت بیمار بین دو کتف</strong> وارد نمایید.</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">۴</span>
                <span><strong>دست غالب خود را مشت کنید</strong>؛ به این صورت که انگشت شست داخل و سایر انگشتان روی آن قرار بگیرند.</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">۵</span>
                <span>دست‌ها را از زیر بغل بیمار به سمت شکم برده و مشت را <strong>بین ناف و جناغ</strong> قرار دهید.</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">۶</span>
                <span>شکم را <strong>۵ بار به صورت سریع و ناگهانی به سمت داخل و بالا</strong> بفشارید (حالتی شبیه به بلند کردن بیمار از زمین).</span>
              </div>
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">۷</span>
                <span>توالی ۵ ضربه به پشت و ۵ فشردن شکم را تا زمان رسیدن اورژانس یا خروج جسم ادامه دهید. با مشاهده خروج جسم، مانور را متوقف کنید.</span>
              </div>
            </div>
          </div>

          {/* ۳. تصاویر، گام‌ها و شبیه‌ساز همراه با افکت تصویری جریان هوا */}
          <div className="space-y-3 pt-1">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>تصاویر و شبیه‌ساز گام‌به‌گام مانور:</span>
            </h4>

            {/* Status indicator ABOVE image */}
            <div className="bg-sky-50 text-slate-800 p-3 rounded-2xl border border-sky-200 shadow-xs flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="text-sky-950">
                {heimlichStep === 0 && `مرحله اول: ۵ ضربه با پاشنه دست بین دو کتف (ضربه ${heimlichCount} از ۵)`}
                {heimlichStep === 1 && `مرحله دوم: ۵ فشار شکمی به داخل و بالا (فشار ${heimlichCount} از ۵)`}
                {heimlichStep === 2 && 'رفع موفقیت‌آمیز انسداد و خروج جسم خارجی! ✓'}
              </span>
              <span className="text-sky-700 bg-white px-2.5 py-1 rounded-xl border border-sky-200 font-mono text-xs font-black shadow-2xs">
                {heimlichStep < 2 ? `${heimlichCount} از ۵` : 'انجام شد'}
              </span>
            </div>

            {/* Self-adjusting image container with dynamic air pulse effect */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent flex items-center justify-center">
              <img
                src={
                  heimlichStep === 0
                    ? APP_IMAGES.heimlichAdultBackBlows
                    : APP_IMAGES.heimlichAdultAbdominalThrusts
                }
                alt="آموزش مانور رفع انسداد هایملیخ بزرگسالان"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none rounded-2xl sm:rounded-3xl"
                loading="lazy"
              />

              {/* Dynamic visual effect for Heimlich thrust / back blow */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <AnimatePresence>
                  {isHeimlichVisual && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1.25, opacity: 0.95 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center text-white shadow-2xl backdrop-blur-xs ${
                        heimlichStep === 0
                          ? 'border-amber-400 bg-amber-500/35 shadow-[0_0_35px_rgba(245,158,11,0.85)]'
                          : 'border-cyan-400 bg-sky-600/35 shadow-[0_0_35px_rgba(6,182,212,0.85)]'
                      }`}
                    >
                      <Wind className="w-9 h-9 text-white animate-pulse drop-shadow-md" />
                      <span className="text-[11px] font-black text-white mt-1">
                        {heimlichStep === 0 ? 'ضربه بین دو کتف' : 'پرتاب جریان هوای ریه ↑'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive button COMPACTLY BELOW the image */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3.5 sm:p-4 flex flex-col items-center justify-center gap-2">
              <button
                onClick={advanceHeimlich}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white font-black text-xs sm:text-sm px-7 py-3 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 touch-press cursor-pointer border border-red-400/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {heimlichStep === 0 && `وارد کردن ضربه ${heimlichCount} به پشت`}
                  {heimlichStep === 1 && `وارد کردن فشار شکمی ${heimlichCount} (داخل و بالا)`}
                  {heimlichStep === 2 && 'شروع دوباره چرخه مانور'}
                </span>
              </button>
              <p className="text-[11px] sm:text-xs text-slate-500 text-center">
                توالی ۵ ضربه پشت و ۵ فشار شکمی را تا خروج کامل جسم یا رسیدن اورژانس تکرار کنید.
              </p>
            </div>
          </div>

          {/* ۴. ویدیو آموزشی مانور هایملیخ بزرگسالان */}
          <div className="pt-2">
            <EducationalVideoPlayer
              src={APP_VIDEOS.adultChoking}
              title="کلیپ آموزشی مانور خفگی در بزرگسالان"
              subtitle="آموزش نحوه اجرای ۵ ضربه بین دو کتف و ۵ فشار شکمی هایملیخ"
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Interactive Exercises */}
      {activeChokingTab === 'exercises' && (
        <div className="space-y-6">
          {/* Exercise 1: Reordering Steps */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span>تمرین اول: مرتب‌سازی مراحل مانور هایملیخ</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">با دکمه‌های بالا/پایین مرتب کنید</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              با استفاده از فلش‌های کنار هر مرحله، مراحل را از شماره ۱ تا ۶ به ترتیب صحیح انجام مانور مرتب کنید و دکمه بررسی را بزنید:
            </p>

            <div className="space-y-2">
              {orderedSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-200 transition-all text-xs sm:text-sm gap-2"
                >
                  <div className="flex items-center gap-2 text-right">
                    <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 leading-snug">{step.text}</span>
                  </div>

                  {/* Reorder controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-sky-50 text-slate-600 disabled:opacity-30 disabled:pointer-events-none"
                      title="انتقال به بالا"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveStep(idx, 'down')}
                      disabled={idx === orderedSteps.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-sky-50 text-slate-600 disabled:opacity-30 disabled:pointer-events-none"
                      title="انتقال به پایین"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={checkStepsOrder}
                className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs"
              >
                بررسی ترتیب مراحل
              </button>

              {orderEvaluated !== null && (
                <div
                  className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                    orderEvaluated ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {orderEvaluated ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ترتیب کاملاً درست است! آفرین.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>ترتیب نادرست است، دوباره مراحل را مرور کنید.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Exercise 2: Point of Hand Placement */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>تمرین دوم: تعیین نقطه صحیح قرار گرفتن مشت روی بدن</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              روی یکی از ۳ ناحیه مشخص شده زیر کلیک کنید تا نقطه استاندارد قرار گرفتن دست مشت‌شده را مشخص نمایید:
            </p>

            <div className="max-w-xs mx-auto bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center">
              <svg viewBox="0 0 160 220" className="w-44 h-56">
                {/* Torso outline */}
                <path d="M 40 20 C 40 20, 80 15, 120 20 C 130 50, 140 100, 130 180 C 100 190, 60 190, 30 180 C 20 100, 30 50, 40 20 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                {/* Sternum area */}
                <line x1="80" y1="35" x2="80" y2="85" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                {/* Navel */}
                <circle cx="80" cy="140" r="4" fill="#64748b" />

                {/* Zone A: Chest / Above sternum (Incorrect for regular Heimlich) */}
                <g
                  onClick={() => {
                    setTargetSelected('chest');
                    sound.playErrorSound();
                  }}
                  className="cursor-pointer"
                >
                  <circle cx="80" cy="55" r="16" fill={targetSelected === 'chest' ? '#ef4444' : '#cbd5e1'} opacity="0.8" />
                  <text x="80" y="59" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">الف</text>
                </g>

                {/* Zone B: Between navel and sternum (CORRECT!) */}
                <g
                  onClick={() => {
                    setTargetSelected('correct');
                    sound.playSuccessSound();
                  }}
                  className="cursor-pointer"
                >
                  <circle cx="80" cy="110" r="18" fill={targetSelected === 'correct' ? '#10b981' : '#38bdf8'} opacity="0.85" />
                  <text x="80" y="114" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">ب</text>
                </g>

                {/* Zone C: Below navel (Incorrect) */}
                <g
                  onClick={() => {
                    setTargetSelected('low');
                    sound.playErrorSound();
                  }}
                  className="cursor-pointer"
                >
                  <circle cx="80" cy="165" r="16" fill={targetSelected === 'low' ? '#ef4444' : '#cbd5e1'} opacity="0.8" />
                  <text x="80" y="169" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">ج</text>
                </g>
              </svg>

              {/* Explanations of clicked zone */}
              <div className="w-full text-center mt-3 text-xs sm:text-sm font-semibold">
                {targetSelected === 'correct' && (
                  <span className="text-emerald-700 block bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    کاملاً درست است! نقطه (ب) دقیقاً <strong>بین ناف و استخوان جناغ</strong> قرار دارد.
                  </span>
                )}
                {targetSelected === 'chest' && (
                  <span className="text-rose-600 block bg-rose-50 p-2 rounded-xl border border-rose-200">
                    نادرست! این ناحیه روی قفسه سینه است که فقط در خانم‌های باردار و افراد چاق استفاده می‌شود.
                  </span>
                )}
                {targetSelected === 'low' && (
                  <span className="text-rose-600 block bg-rose-50 p-2 rounded-xl border border-rose-200">
                    نادرست! این ناحیه زیر ناف و پایین شکم است و فشار مؤثری به دیافراگم وارد نمی‌کند.
                  </span>
                )}
                {!targetSelected && (
                  <span className="text-slate-500 text-xs">یکی از دایره‌های الف، ب یا ج را لمس کنید</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Children (اطفال) */}
      {activeChokingTab === 'children' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-sky-600" />
              <span>مانور هایملیخ در اطفال (کودکان بالای ۱ سال)</span>
            </h3>
            <span className="text-xs sm:text-sm bg-sky-100 text-sky-800 font-extrabold px-3 py-1.5 rounded-2xl">
              راهنمای استاندارد اطفال
            </span>
          </div>

          {/* ۱. توضیح مانور در کودکان چیست و چرا انجام می‌شود */}
          <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 border-2 border-sky-200 rounded-3xl p-4 sm:p-5 space-y-2.5">
            <h4 className="font-black text-sky-950 text-sm sm:text-base flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              <span>مانور رفع خفگی در کودکان چیست و چرا انجام می‌شود؟</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              در کودکان بالای یک سال، به دلیل کنجکاوی در بازی با اشیا یا جویدن ناقص خوراکی‌ها، انسداد راه هوایی شایع است. هدف مانور، فشرده‌سازی هوای ریه‌ها با نیروی کنترل‌شده برای پرتاب فوری جسم به بیرون بدون ایجاد آسیب است.
            </p>
            <div className="bg-white/90 p-3 rounded-2xl border border-sky-100 text-xs sm:text-sm text-sky-950 leading-relaxed">
              <strong>اصل حیاتی هم‌قد شدن:</strong> امدادگر باید حتماً پشت کودک زانو بزند، یا خم شود و یا کودک را روی صندلی قرار دهد تا هم‌قد کودک شده و زاویه دست‌ها دقیقاً به سمت داخل و بالا قرار گیرد.
            </div>
          </div>

          {/* ۲. روش انجام مانور در کودکان */}
          <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-3xl space-y-2 text-xs sm:text-sm">
            <h5 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>روش انجام گام‌به‌گام مانور در کودک:</span>
            </h5>
            <ol className="pr-4 list-decimal space-y-1.5 text-slate-700 leading-relaxed">
              <li>تماس با اورژانس ۱۱۵ و اطمینان از ایمنی محل حادثه.</li>
              <li>زانو زدن پشت کودک به طوری که هم‌قد او شوید و کودک را کمی به جلو خم کنید.</li>
              <li>با پاشنه دست، <strong>۵ ضربه کنترل‌شده بین دو کتف کودک</strong> وارد نمایید.</li>
              <li>دست خود را مشت کرده و از زیر بغل بین ناف و جناغ کودک قرار دهید.</li>
              <li><strong>۵ فشار شکمی به سمت داخل و بالا</strong> با نیروی متناسب با جثه کودک وارد کنید.</li>
              <li>چرخه ۵ ضربه پشت و ۵ فشار شکمی را تا خروج جسم یا رسیدن اورژانس تکرار کنید.</li>
            </ol>
          </div>

          {/* ۳. تصاویر و شبیه‌ساز همراه با افکت پرتاب هوا */}
          <div className="space-y-3 pt-1">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>تصاویر و شبیه‌ساز مانور اطفال:</span>
            </h4>

            {/* Child Stage Selector & Status Bar */}
            <div className="bg-sky-50 text-slate-800 p-3 rounded-2xl border border-sky-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-black">
              <div className="flex items-center gap-2">
                <span className="text-sky-950">
                  {childStage === 'backBlows'
                    ? `مرحله ۱: ۵ ضربه بین دو کتف کودک (${childManeuverCount} از ۵)`
                    : `مرحله ۲: ۵ فشار شکمی هایملیخ (${childManeuverCount} از ۵)`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setChildStage('backBlows');
                    setChildManeuverCount(1);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                    childStage === 'backBlows'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  ضربه به پشت
                </button>
                <button
                  onClick={() => {
                    setChildStage('heimlich');
                    setChildManeuverCount(1);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                    childStage === 'heimlich'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  هایملیخ
                </button>
              </div>
            </div>

            {/* Clean Child Illustration with dynamic effect */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent flex items-center justify-center">
              <img
                src={
                  childStage === 'backBlows'
                    ? APP_IMAGES.heimlichChildBackBlows
                    : APP_IMAGES.heimlichChild
                }
                alt="آموزش مانور رفع انسداد در کودکان"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none rounded-2xl sm:rounded-3xl"
                loading="lazy"
              />

              {/* Dynamic visual effect */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <AnimatePresence>
                  {isHeimlichVisual && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1.25, opacity: 0.95 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center text-white shadow-2xl backdrop-blur-xs ${
                        childStage === 'backBlows'
                          ? 'border-amber-400 bg-amber-500/35 shadow-[0_0_35px_rgba(245,158,11,0.85)]'
                          : 'border-cyan-400 bg-sky-600/35 shadow-[0_0_35px_rgba(6,182,212,0.85)]'
                      }`}
                    >
                      <Wind className="w-9 h-9 text-white animate-pulse drop-shadow-md" />
                      <span className="text-[11px] font-black text-white mt-1">
                        {childStage === 'backBlows' ? 'ضربه بین دو کتف' : 'پرتاب جریان هوای ریه ↑'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Maneuver Button */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3.5 sm:p-4 flex flex-col items-center justify-center gap-2">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={advanceChildManeuver}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 touch-press cursor-pointer border border-sky-400/30 select-none"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {childStage === 'backBlows'
                    ? `وارد کردن ضربه ${childManeuverCount} به پشت کودک`
                    : `وارد کردن فشار شکمی ${childManeuverCount} به کودک`}
                </span>
              </motion.button>
              <p className="text-[11px] sm:text-xs text-slate-500 text-center">
                برای کودکان، هم‌قد شدن با کودک با زانو زدن پشت وی یک اصل حیاتی است.
              </p>
            </div>
          </div>

          {/* ۴. ویدیو آموزشی مانور در اطفال */}
          <div className="pt-2">
            <EducationalVideoPlayer
              src={APP_VIDEOS.childChoking}
              title="کلیپ آموزشی مانور خفگی در اطفال و کودکان"
              subtitle="آموزش هم‌قد شدن با کودک و نحوه اجرای مانور رفع خفگی"
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Pregnant / Obese / Recent Abdominal Surgery */}
      {activeChokingTab === 'pregnant' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <span>مانور در بارداری و افراد چاق (فشار قفسه سینه)</span>
            </h3>
            <span className="text-xs sm:text-sm bg-amber-100 text-amber-800 font-extrabold px-3 py-1.5 rounded-2xl">
              راهنمای بالینی بارداری و چاقی
            </span>
          </div>

          {/* ۱. توضیح مانور در بارداری و چاقی چیست و چرا فشردن شکم ممنوع است */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 space-y-3">
            <h4 className="font-black text-amber-950 text-sm sm:text-base flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700" />
              <span>علت تغییر تکنیک در خانم‌های باردار و افراد با چاقی مفرط:</span>
            </h4>
            <div className="bg-rose-50 border-r-4 border-rose-500 p-3.5 rounded-2xl space-y-1.5 text-xs sm:text-sm">
              <strong className="text-rose-950 block font-black">
                ⚠️ هشدار قطعی: فشردن شکم در بارداری (بالای ۲۰ هفته) و جراحی اخیر شکمی اکیداً ممنوع است!
              </strong>
              <p className="text-rose-900 leading-relaxed">
                فشار بر روی شکم مادر باردار می‌تواند باعث پارگی جفت، آسیب به جنین یا خونریزی داخلی شود. همچنین در افراد با چاقی شکمی، دست‌ها به دور شکم قفل نمی‌شوند. بنابراین در این افراد، نقطه فشار از روی شکم به <strong>وسط قفسه سینه (استخوان جناغ)</strong> منتقل می‌شود تا با فشردن سینه، هوای ریه‌ها جسم را به بیرون براند.
              </p>
            </div>
          </div>

          {/* ۲. روش انجام مانور در بارداری و چاقی */}
          <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-3xl space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>روش کار و مراحل ۵ گانه در بارداری و چاقی:</span>
            </h4>
            <ol className="pr-4 list-decimal space-y-1.5 text-slate-700">
              <li>با پاشنه دست <strong>۵ ضربه کنترل‌شده بین دو کتف</strong> بیمار وارد کنید.</li>
              <li>پشت بیمار ایستاده، دستان خود را <strong>از زیر بغل وی رد کرده و روی قفسه سینه حلقه کنید</strong>.</li>
              <li>دست خود را مشت کرده و در <strong>وسط قفسه سینه (قسمت میانی استخوان جناغ)</strong> قرار دهید و دست دیگر را روی آن بگذارید.</li>
              <li>قفسه سینه را <strong>به سمت داخل و عقب فشار دهید</strong> (فشار مستقیم قفسه سینه به جای شکم).</li>
              <li>چرخه ۵ ضربه پشت و ۵ فشار سینه را تا خروج کامل جسم یا رسیدن اورژانس تکرار کنید.</li>
            </ol>
          </div>

          {/* ۳. تصاویر و شبیه‌ساز همراه با افکت پرتاب هوا */}
          <div className="space-y-3 pt-1">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>تصاویر و شبیه‌ساز فشار قفسه سینه:</span>
            </h4>

            {/* Instruction Banner - ABOVE image */}
            <div className="bg-amber-50 text-slate-800 p-3 rounded-2xl border border-amber-300 shadow-xs flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="text-amber-950">
                فشار روی وسط قفسه سینه (جناغ) • فشردن شکم اکیداً ممنوع!
              </span>
              <span className="font-mono text-xs bg-white px-2.5 py-1 rounded-xl text-amber-800 border border-amber-200 shadow-2xs">
                فشار {pregnantManeuverCount} از ۵
              </span>
            </div>

            {/* Clean Medical Illustration with dynamic effect */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent flex items-center justify-center">
              <img
                src={APP_IMAGES.heimlichPregnant}
                alt="مانور رفع انسداد در خانم باردار و افراد چاق"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none rounded-2xl sm:rounded-3xl"
                loading="lazy"
              />

              {/* Dynamic visual effect */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <AnimatePresence>
                  {isHeimlichVisual && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1.25, opacity: 0.95 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-28 h-28 rounded-full border-4 border-rose-400 bg-rose-500/35 shadow-[0_0_35px_rgba(244,63,94,0.85)] flex flex-col items-center justify-center text-white backdrop-blur-xs"
                    >
                      <Wind className="w-9 h-9 text-white animate-pulse drop-shadow-md" />
                      <span className="text-[11px] font-black text-white mt-1">
                        فشار قفسه سینه ↑
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Maneuver Button */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3.5 sm:p-4 flex flex-col items-center justify-center gap-2">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={advancePregnantManeuver}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 touch-press cursor-pointer border border-red-400/30 select-none"
              >
                <Heart className="w-5 h-5 text-white fill-white" />
                <span>انجام مانور فشار قفسه سینه: فشار {pregnantManeuverCount} از ۵</span>
              </motion.button>
              <p className="text-[11px] sm:text-xs text-rose-700 text-center font-bold">
                در خانم‌های باردار و افراد چاق دست‌ها را به جای شکم، روی وسط قفسه سینه (استخوان جناغ) حلقه کنید.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: Infant Under 1 Year (شیرخواران) */}
      {activeChokingTab === 'infant' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
                <Baby className="w-6 h-6 text-sky-600" />
                <span>رفع انسداد و باز کردن راه هوایی شیرخواران (زیر یک سال)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                پنج ضربه بین شانه‌ها + چرخش به پشت + پنج فشار قفسه سینه + باز کردن ملایم راه هوایی
              </p>
            </div>
            <span className="text-xs sm:text-sm bg-sky-100 text-sky-800 font-extrabold px-3 py-1.5 rounded-2xl">
              راهنمای بالینی شیرخواران
            </span>
          </div>

          {/* ۱. توضیح مانور در نوزاد و شیرخوار چیست و چرا انجام می‌شود */}
          <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 border-2 border-sky-200 rounded-3xl p-4 sm:p-5 space-y-2.5">
            <h4 className="font-black text-sky-950 text-sm sm:text-base flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              <span>مانور در شیرخواران چیست و چه تفاوتی با بزرگسالان دارد؟</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              در شیرخواران زیر ۱ سال، کبد و طحال بسیار آسیب‌پذیرند، بنابراین <strong>فشردن شکم اکیداً ممنوع است</strong>. مانور شیرخوار شامل خواباندن نوزاد روی ساعد دست با سر پایین‌تر از تنه، و ترکیب ۵ ضربه به پشت با ۵ فشار دو انگشتی روی قفسه سینه است.
            </p>
            <div className="bg-white/90 p-3 rounded-2xl border border-sky-100 text-xs sm:text-sm text-sky-950">
              <strong>مکانیسم اثر:</strong> شیب سر به پایین از افتادن عمیق‌تر جسم به نای جلوگیری می‌کند، و ضربات بین کتف به همراه فشار ملایم جناغ، فشار هوای ریه را برای راندن جسم به دهان فعال می‌سازد.
            </div>
          </div>

          {/* ۲. دستورالعمل کامل گام‌به‌گام در شیرخواران */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-3xl">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>روش انجام کامل رفع انسداد در نوزادان و کودکان زیر یک سال:</span>
            </h4>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed pr-4 list-decimal">
              <li>
                روی زانوهای خود خم شده یا روی یک صندلی بنشینید و <strong>شیرخوار را روی ساعد دست خود بخوابانید</strong>؛ به نحوی که صورتش رو به پایین و سرش پایین‌تر از تنه قرار گیرد.
              </li>
              <li>
                در حالی که دهان شیرخوار باز است؛ <strong>فک او را با دست زیرین خود ثابت نگه دارید</strong> (مراقب باشید روی گلوی نوزاد فشار نیاید).
              </li>
              <li>
                با پاشنه دست دیگر <strong>پنج ضربه سریع بین شانه‌های شیرخوار</strong> بزنید.
              </li>
              <li>
                بدن شیرخوار را روی پا و بین دستان خود گرفته، او را به پشت بچرخانید؛ به طوری که <strong>سر از تنه پایین‌تر باشد</strong>؛ حالا با ۲ انگشت یا پاشنه دست <strong>پنج فشار در ناحیه وسط جناغ</strong> وارد نمایید.
              </li>
              <li>
                بعد از هر دوره ۵ ضربه و ۵ فشار، <strong>دهان کودک را از نظر خروج جسم خارجی بررسی کنید</strong>.
              </li>
              <li className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 font-bold">
                در صورتی که جسم را با چشم دیدید، با روش جارویی با احتیاط آن را خارج کنید.
              </li>
              <li className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-950 font-bold">
                ⚠️ اگر جسم دیده نشد، جستجوی کورکورانه با انگشت اکیداً ممنوع است.
              </li>
            </ol>
          </div>

          {/* ۳. شبیه‌ساز تصویری و انتخاب گام‌ها */}
          <div className="space-y-3 pt-1">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>تصاویر و شبیه‌ساز مانور شیرخوار:</span>
            </h4>

            {/* Infant Stage Selector & Status Bar */}
            <div className="bg-sky-50 text-slate-800 p-3 rounded-2xl border border-sky-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-black">
              <div>
                <span className="text-sky-950">
                  {infantStage === 1 && `گام اول: خواباندن روی ساعد • ۵ ضربه با کف دست (${infantManeuverCount} از ۵)`}
                  {infantStage === 2 && `گام دوم: چرخش به پشت • ۵ فشار قفسه سینه (${infantManeuverCount} از ۵)`}
                  {infantStage === 3 && 'گام سوم: روش جارویی مورد استفاده در نوزاد و سایر سنین (فقط در صورت مشاهده قطعی جسم)'}
                </span>
              </div>

              {/* Step Selection Buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => setInfantStage(1)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                    infantStage === 1 ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  ضربه پشت
                </button>
                <button
                  onClick={() => setInfantStage(2)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                    infantStage === 2 ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  فشار سینه
                </button>
                <button
                  onClick={() => setInfantStage(3)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                    infantStage === 3 ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  روش جارویی
                </button>
              </div>
            </div>

            {/* Clean Medical Illustration with dynamic effect */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent flex items-center justify-center">
              <img
                src={
                  infantStage === 1
                    ? APP_IMAGES.heimlichInfantBackBlows
                    : infantStage === 2
                    ? APP_IMAGES.heimlichInfantChestThrusts
                    : APP_IMAGES.heimlichInfantFingerSweep
                }
                alt="آموزش رفع انسداد و باز کردن راه هوایی شیرخواران"
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none rounded-2xl sm:rounded-3xl"
                loading="lazy"
              />

              {/* Dynamic visual effect for infant maneuvers */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <AnimatePresence>
                  {isHeimlichVisual && infantStage !== 3 && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1.25, opacity: 0.95 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center text-white shadow-2xl backdrop-blur-xs ${
                        infantStage === 1
                          ? 'border-amber-400 bg-amber-500/35 shadow-[0_0_35px_rgba(245,158,11,0.85)]'
                          : 'border-cyan-400 bg-sky-600/35 shadow-[0_0_35px_rgba(6,182,212,0.85)]'
                      }`}
                    >
                      <Wind className="w-9 h-9 text-white animate-pulse drop-shadow-md" />
                      <span className="text-[11px] font-black text-white mt-1">
                        {infantStage === 1 ? 'ضربه بین شانه‌ها' : 'فشار سینه نوزاد ↑'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Maneuver Button - ONLY for Stage 1 & 2; REMOVED for Stage 3 as requested */}
            {infantStage !== 3 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3.5 sm:p-4 flex flex-col items-center justify-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={advanceInfantManeuver}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 touch-press cursor-pointer border border-sky-400/30 select-none"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {infantStage === 1 && `انجام مانور: ضربه به پشت (${infantManeuverCount} از ۵)`}
                    {infantStage === 2 && `انجام مانور: فشار قفسه سینه (${infantManeuverCount} از ۵)`}
                  </span>
                </motion.button>
                <p className="text-[11px] sm:text-xs text-slate-500 text-center">
                  در شیرخواران، خواباندن روی ساعد به صورتی که سر پایین‌تر از تنه باشد مانع ورود بیشتر جسم می‌شود.
                </p>
              </div>
            ) : (
              /* Educational Guide for Sweeping Method without action button */
              <div className="bg-sky-50 border border-sky-200 rounded-3xl p-4 text-center space-y-1.5 text-xs sm:text-sm text-sky-950">
                <h5 className="font-black text-sky-900 text-sm">
                  روش جارویی مورد استفاده در نوزاد و سایر سنین (Finger Sweep):
                </h5>
                <p className="leading-relaxed text-slate-700 text-xs sm:text-sm">
                  تنها زمانی که جسم خارجی را با چشم در دهان یا حلق نوزاد و مصدوم مشاهده کردید، انگشت کوچک یا اشاره را به صورت قلاب مانند وارد کرده و جسم را با حرکت جارویی به بیرون هدایت کنید. از فرو بردن کورکورانه انگشت خودداری نمایید.
                </p>
              </div>
            )}
          </div>

          {/* ۴. ویدیو آموزشی مانور در شیرخوار */}
          <div className="pt-2">
            <EducationalVideoPlayer
              src={APP_VIDEOS.infantChoking}
              title="کلیپ آموزشی مانور خفگی در شیرخوار و نوزاد"
              subtitle="آموزش نحوه مهار نوزاد، ضربات پشت روی ساعد و فشارهای قفسه سینه"
            />
          </div>
        </div>
      )}

      {/* Navigation CTA to AED with Orange Back Button */}
      <div className="flex justify-between items-center pt-3 gap-2">
        <button
          onClick={() => {
            setTab('cpr');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 touch-press cursor-pointer transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>

        <button
          onClick={() => {
            setTab('aed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 touch-press cursor-pointer"
        >
          <span>بخش سوم: دستگاه AED</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
