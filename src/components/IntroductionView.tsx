import React, { useState } from 'react';
import { PhoneCall, Heart, Zap, Ambulance, ArrowLeft, ArrowRight, CheckCircle2, AlertOctagon, Users, Clock, ShieldCheck } from 'lucide-react';
import { AppTab } from '../types';
import { AppImage } from './common/AppImage';

interface IntroductionViewProps {
  setTab: (tab: AppTab) => void;
}

export const IntroductionView: React.FC<IntroductionViewProps> = ({ setTab }) => {
  const [activeChainStep, setActiveChainStep] = useState(0);

  const chainSteps = [
    {
      id: 1,
      title: '۱) شناخت سریع و تماس با ۱۱۵',
      desc: 'تشخیص فوری عدم پاسخ‌دهی و فقدان تنفس یا تنفس غیرطبیعی (گسپینگ)، و تماس سریع با اورژانس ۱۱۵ جهت اعزام تیم امدادی.',
      icon: PhoneCall,
      color: 'bg-red-500 text-white',
    },
    {
      id: 2,
      title: '۲) شروع فوری ماساژ قلبی (CPR)',
      desc: 'آغاز بلافاصله فشردن قفسه سینه با عمق ۵ تا ۶ سانتی‌متر و ریتم ۱۰۰ تا ۱۲۰ بار در دقیقه برای برقراری مجدد گردش خون به مغز و قلب.',
      icon: Heart,
      color: 'bg-rose-500 text-white',
    },
    {
      id: 3,
      title: '۳) شوک زودهنگام با دستگاه AED',
      desc: 'در صورت در دسترس بودن دستگاه شوک خودکار خارجی (AED)، روشن کردن سریع، چسباندن پدها و اعمال دفیبریلاسیون در صورت توصیه دستگاه.',
      icon: Zap,
      color: 'bg-amber-500 text-white',
    },
    {
      id: 4,
      title: '۴) اقدامات پیشرفته احیا (اورژانس ۱۱۵)',
      desc: 'رسیدن نیروهای تخصصی اورژانس پیش‌بیمارستانی ۱۱۵، باز کردن پیشرفته راه هوایی، تجویز داروهای احیا و انتقال ایمن به بیمارستان.',
      icon: Ambulance,
      color: 'bg-sky-600 text-white',
    },
    {
      id: 5,
      title: '۵) مراقبت‌های پس از احیا و بازتوانی',
      desc: 'مراقبت‌های یکپارچه و تخصصی در بخش مراقبت‌های ویژه (ICU)، کنترل هدفمند دما، درمان علت زمینه‌ای ایست قلبی، و بازتوانی جسمی و مغزی.',
      icon: ShieldCheck,
      color: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="space-y-6 text-right">
      {/* Breadcrumb / Top Bar with Distinct Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all touch-press cursor-pointer shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>
        <span className="text-xs bg-sky-100 text-sky-800 font-extrabold px-3 py-1.5 rounded-2xl">
          مفاهیم کلی و زنجیره حیات (۵ حلقه حیاتی)
        </span>
      </div>

      {/* Emergency Callout in every educational view */}
      <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs sm:text-sm text-red-800 font-bold">
            قانون طلایی: در هر حادثه اورژانسی، اول با ۱۱۵ تماس بگیرید!
          </p>
        </div>
        <a
          href="tel:115"
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow-xs"
        >
          تماس با ۱۱۵
        </a>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-600" />
          <span>چرا یادگیری احیای قلبی ریوی پایه (BLS) اهمیت دارد؟</span>
        </h2>

        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <p>
            ایست قلبی و تنفسی یکی از جدی‌ترین شرایط اورژانسی است و می‌تواند در هر زمان و مکانی (منزل، مدرسه، محیط ورزشی، فضاهای عمومی) رخ دهد. در این شرایط <strong>زمان نقش تعیین‌کننده‌ای دارد</strong>.
          </p>
          <p>
            در دقایق نخست و پیش از رسیدن نیروهای تخصصی اورژانس، اقدام سریع و صحیح افراد حاضر در صحنه شانس بقا را به طور چشمگیری بالا می‌برد. هر فرد می‌تواند <strong>«نخستین حلقه مؤثر در زنجیره حیات»</strong> باشد.
          </p>
          <p>
            آموزش مهارت‌های پایه احیای قلبی ریوی (BLS) به عموم، آمادگی جامعه را بالا می‌برد و فرهنگ <strong>«کمک به دیگری»</strong> و احساس مسئولیت‌پذیری اجتماعی را ترویج می‌کند.
          </p>
        </div>

        {/* Golden Rule Highlight */}
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-sky-900">
          <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5 text-sky-800">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            اصل کلی و بنیادین نجات:
          </h3>
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            «در شرایط تهدیدکننده حیات، شناخت سریع، درخواست کمک و اقدام به‌موقع و صحیح می‌تواند نجات‌بخش باشد.»
          </p>
        </div>
      </div>

      {/* Interactive Animated Chain of Survival (اینفوگرافیک متحرک زنجیره حیات) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              اینفوگرافیک زنجیره حیات (۵ حلقه حیاتی نجات؛ هر ثانیه مهم است)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ۵ حلقه به‌هم‌پیوسته که از لحظه ایست قلبی تا بهبودی کامل، شانس بقا را تضمین می‌کنند
            </p>
          </div>
        </div>

        {/* Chain of Survival Image Slot */}
        <div className="w-full mb-4">
          <AppImage
            imageKey="chainOfSurvival"
            alt="اینفوگرافیک زنجیره حیات؛ هر ثانیه مهم است"
            title="زنجیره حیات (۵ حلقه حیاتی؛ هر ثانیه مهم است)"
            subtitle="۱) شناخت سریع و تماس با ۱۱۵ ← ۲) شروع فوری ماساژ قلبی ← ۳) شوک زودهنگام با AED ← ۴) رسیدن تیم اورژانس ۱۱۵ ← ۵) مراقبت‌های پس از احیا و بازتوانی"
          />
        </div>

        {/* Chain visualization - 5 distinct links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 my-4">
          {chainSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeChainStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveChainStep(idx)}
                className={`relative text-right p-3 rounded-2xl border transition-all text-sm flex flex-col justify-between min-h-[145px] touch-press cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/90 shadow-md ring-2 ring-sky-400/40'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400">حلقه {step.id}</span>
                    <div className={`w-8 h-8 rounded-xl ${step.color} flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xs sm:text-[13px] text-slate-800 leading-snug">
                    {step.title}
                  </h4>
                </div>

                <div className="text-[11px] text-sky-700 font-semibold mt-2 flex items-center gap-1">
                  {isSelected ? '✓ در حال بررسی' : 'کلیک برای جزئیات'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Box */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4 text-sm text-slate-700 flex items-start gap-3">
          <div className="p-2 bg-sky-600 text-white rounded-xl shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sky-900 text-sm mb-1">
              توضیح {chainSteps[activeChainStep].title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {chainSteps[activeChainStep].desc}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation CTA to CPR */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all touch-press cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>

        <button
          onClick={() => {
            setTab('cpr');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-95 touch-press"
        >
          <span>شروع بخش اول: ماساژ قلبی</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
