import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Printer,
  Share2,
  Calendar,
  Medal,
  ChevronLeft
} from 'lucide-react';
import { sound } from '../utils/sound';
import { AppTab, QuizQuestion } from '../types';

interface QuizViewProps {
  setTab: (tab: AppTab) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ setTab }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [learnerName, setLearnerName] = useState<string>('');

  const toFa = (val: number | string): string => {
    return String(val).replace(/[0-9]/g, (w) => ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][+w]);
  };

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: 'شماره تلفن تماس با اورژانس پیش‌بیمارستانی در سراسر کشور کدام است؟',
      options: ['۱۱۵', '۱۱۰', '۱۲۵', '۱۱۲'],
      correctIndex: 0,
      explanation: 'شماره ۱۱۵ تلفن مستقیم اورژانس پیش‌بیمارستانی است که در هر شرایط تهدیدکننده حیات، اولین گام درخواست کمک از آن است.',
    },
    {
      id: 2,
      question: 'سرعت استاندارد ماساژ قفسه سینه در احیای قلبی با دست چقدر است؟',
      options: [
        '۶۰ تا ۸۰ بار در دقیقه',
        '۱۰۰ تا ۱۲۰ بار در دقیقه (حدود ۲ فشار در هر ثانیه)',
        '۱۴۰ تا ۱۶۰ بار در دقیقه',
        'بدون سرعت مشخص و به دلخواه امدادگر',
      ],
      correctIndex: 1,
      explanation: 'سرعت استاندارد ۱۰۰ تا ۱۲۰ بار در دقیقه (حدود ۲ بار در ثانیه) است تا خون‌رسانی مؤثر به مغز حفظ شود.',
    },
    {
      id: 3,
      question: 'عمق استاندارد فشردن قفسه سینه در احیای قلبی بزرگسالان چند سانتی‌متر است؟',
      options: ['۲ تا ۳ سانتی‌متر', '۳ تا ۴ سانتی‌متر', '۵ تا ۶ سانتی‌متر', 'بیش از ۸ سانتی‌متر'],
      correctIndex: 2,
      explanation: 'قفسه سینه باید ۵ تا ۶ سانتی‌متر فشرده شود و پس از هر فشار اجازه داده شود قفسه کاملاً به حالت اولیه بازگردد.',
    },
    {
      id: 4,
      question: 'قطع خون‌رسانی به مغز پس از چند دقیقه باعث آسیب جدی و پس از چند دقیقه منجر به مرگ مغزی می‌شود؟',
      options: [
        'پس از ۱ دقیقه آسیب جدی، پس از ۳ دقیقه مرگ مغزی',
        'پس از ۴ تا ۶ دقیقه آسیب جدی مغزی، و پس از ۱۰ دقیقه مرگ مغزی',
        'پس از ۱۵ دقیقه آسیب جدی، پس از ۳۰ دقیقه مرگ مغزی',
        'زمان نقشی در آسیب مغزی ندارد',
      ],
      correctIndex: 1,
      explanation: 'عدم خون‌رسانی پس از ۴ تا ۶ دقیقه آسیب جدی به بافت مغز می‌زند و پس از ۱۰ دقیقه منجر به مرگ مغزی غیرقابل بازگشت خواهد شد.',
    },
    {
      id: 5,
      question: 'مهم‌ترین اقدام در مواجهه با بیماری که دچار «انسداد خفیف» راه هوایی است و سرفه مؤثر دارد چیست؟',
      options: [
        'وارد کردن ضربه‌های محکم به پشت بین دو کتف',
        'اجرای سریع مانور هایملیخ و فشردن شکم',
        'تشویق بیمار به سرفه قوی و مؤثر، و پرهیز از هر مداخله دیگر',
        'دادن یک لیوان آب به بیمار',
      ],
      correctIndex: 2,
      explanation: 'تا زمانی که بیمار سرفه مؤثر دارد، سرفه بهترین سازوکار طبیعی بدن است؛ هیچ مداخله‌ای نباید کرد و تنها باید او را به سرفه قوی تشویق نمود.',
    },
    {
      id: 6,
      question: 'چرا در فرد دارای «انسداد خفیف» نباید به پشت او ضربه زد؟',
      options: [
        'چون درد زیادی برای مصدوم ایجاد می‌کند',
        'چون ممکن است ضربه به پشت، انسداد خفیف را به انسداد کامل تبدیل کند',
        'چون مانع تنفس طبیعی دیافراگم می‌شود',
        'هیچ منعی ندارد و باید ضربه زد',
      ],
      correctIndex: 1,
      explanation: 'ضربه زدن به پشت فرد در انسداد خفیف ممکن است جسم را جا‌به‌جا کرده و راه هوایی را به طور کامل مسدود کند.',
    },
    {
      id: 7,
      question: 'کدام‌یک از موارد زیر از نشانه‌های «انسداد کامل» راه هوایی است؟',
      options: [
        'توانایی صحبت کردن با صدای رسا',
        'سرفه‌های پر سر و صدا و خروج راحت بازدم',
        'ناتوانی در تکلم، ناتوانی در سرفه مؤثر، تلاش بی‌ثمر برای تنفس و کبودی پوست',
        'آرامش و نبض طبیعی',
      ],
      correctIndex: 2,
      explanation: 'در انسداد کامل، تبادل هوا کاملاً متوقف می‌شود؛ فرد نمی‌تواند صحبت یا سرفه کند و پوست به سمت کبودی و سیانوز پیش می‌رود.',
    },
    {
      id: 8,
      question: 'در مانور هایملیخ بزرگسالان، دست مشت‌شده در چه نقطه‌ای قرار می‌گیرد؟',
      options: [
        'دقیقاً روی استخوان جناغ سینه',
        'بین ناف و استخوان جناغ',
        'پایین ناف در ناحیه مثانه',
        'روی پهلوی راست',
      ],
      correctIndex: 1,
      explanation: 'مشت دست غالب (شست داخل) بین ناف و جناغ قرار گرفته و فشار سریع و ناگهانی به سمت داخل و بالا وارد می‌شود.',
    },
    {
      id: 9,
      question: 'در کدام دسته از بیماران فشردن شکم ممنوع است و باید به جای آن قفسه سینه فشرده شود؟',
      options: [
        'فقط کودکان زیر ۶ سال',
        'خانم‌های باردار (بالای ۲۰ هفته)، بیماران چاق و افراد با جراحی اخیر شکمی',
        'فقط ورزشکاران حرفه‌ای',
        'در هیچ بیماری ممنوعیت ندارد',
      ],
      correctIndex: 1,
      explanation: 'در خانم‌های باردار، افراد بسیار چاق یا جراحی اخیر شکمی، فشردن شکم ممنوع است و باید از مانور فشار روی وسط جناغ قفسه سینه استفاده شود.',
    },
    {
      id: 10,
      question: 'وضعیت قرارگیری شیرخوار زیر یک سال هنگام وارد کردن ۵ ضربه به پشت چیست؟',
      options: [
        'ایستاده و تکیه داده به دیوار',
        'خوابیده به پشت روی زمین',
        'خوابیده روی ساعد، صورت رو به پایین و سر پایین‌تر از تنه با فک ثابت',
        'آویزان کردن شیرخوار از پاها',
      ],
      correctIndex: 2,
      explanation: 'شیرخوار روی ساعد امدادگر به صورت رو به پایین قرار می‌گیرد، سر پایین‌تر از تنه نگه داشته شده و فک با دست زیرین ثابت می‌شود.',
    },
    {
      id: 11,
      question: 'چه زمانی مجاز به خارج کردن جسم خارجی از دهان با روش «جارو کردن با انگشت» (Finger Sweep) هستیم؟',
      options: [
        'در تمام موارد خفگی بلافاصله انگشت را وارد حلق می‌کنیم',
        'تنها در صورتی که جسم خارجی به صورت کاملاً واضح با چشم دیده شود',
        'فقط زمانی که مصدوم کاملاً هوشیار است',
        'هرگز در هیچ شرایطی نباید انگشت وارد کرد',
      ],
      correctIndex: 1,
      explanation: 'اگر جسم دیده شد، با روش جارویی با احتیاط خارج می‌شود؛ اگر دیده نشد، جستجوی کورکورانه با انگشت اکیداً ممنوع است زیرا ممکن است جسم را عمیق‌تر براند.',
    },
    {
      id: 12,
      question: 'هنگام تحلیل ریتم قلب و اعمال شوک توسط دستگاه AED چه اقدامی ضروری است؟',
      options: [
        'ادامه سریع ماساژ قلبی با تمام قدرت',
        'تکان دادن مصدوم برای بررسی هوشیاری',
        'اعلام اینکه «هیچ‌کس به بیمار دست نزند» و فاصله گرفتن همه افراد',
        'جدا کردن سریع پدهای دستگاه',
      ],
      correctIndex: 2,
      explanation: 'هنگام تحلیل ریتم و اعمال شوک، هرگونه تماس دست با بیمار باعث اختلال در سیگنال و خطر برق‌گرفتگی می‌شود؛ بنابراین همه باید فوراً کنار بروند.',
    },
    {
      id: 13,
      question: 'محل صحیح قرارگیری ۲ پد الکترود دستگاه شوک خودکار (AED) در بزرگسالان کجاست؟',
      options: [
        'هر دو پد در وسط قفسه سینه روی جناغ',
        'پد اول زیر استخوان ترقوه سمت راست، و پد دوم در زیر بغل و پهلوی سمت چپ (نوک قلب)',
        'یکی روی سینه و یکی روی شکم',
        'هر دو پد در پشت کمر بین دو کتف',
      ],
      correctIndex: 1,
      explanation: 'پد اول زیر استخوان ترقوه راست و پد دوم در پهلو و زیر بغل سمت چپ قرار می‌گیرد تا مسیر جریان الکتریکی مستقیماً از عضله قلب عبور کند.',
    },
    {
      id: 14,
      question: 'تنفس غیرطبیعی و منقطع «گسپینگ» (Gasping یا تنفس شبه‌جان‌کندن) بیانگر چیست؟',
      options: [
        'تنفس طبیعی و عمیق فرد در هنگام استراحت',
        'تنفس غیرطبیعی و نشانه قطعی ایست قلبی که نباید با تنفس سالم اشتباه گرفته شود و نیاز به CPR فوری دارد',
        'بهبودی کامل تنفس مصدوم',
        'سکسه معمولی دستگاه گوارش',
      ],
      correctIndex: 1,
      explanation: 'تنفس گسپینگ (منقطع و صدادار) تنفس مؤثر نبوده بلکه نشانه دقایق اولیه ایست قلبی است و باید بلافاصله ماساژ قلبی شروع شود.',
    },
    {
      id: 15,
      question: '«وضعیت ریکاوری» (خوابیده ایمن به پهلو) در چه شرایطی برای مصدوم انجام می‌شود؟',
      options: [
        'در فردی که ایست قلبی کرده و نبض ندارد',
        'در مصدوم بیهوشی که دارای تنفس طبیعی است؛ برای جلوگیری از افتادن زبان به عقب و خفگی با استفراغ',
        'در هنگام شکستگی باز ستون فقرات',
        'در بیماری که کاملاً هوشیار و پاسخگو است',
      ],
      correctIndex: 1,
      explanation: 'وضعیت ریکاوری برای مصدومان بیهوش با تنفس طبیعی است تا راه هوایی باز بماند و ترشحات یا محتویات معده باعث خفگی نشود.',
    },
    {
      id: 16,
      question: 'در پروتکل استاندارد احیای قلبی (CPR)، چرخه ماساژ و تنفس به چه صورت است؟',
      options: [
        '۱۰ ماساژ به ۵ تنفس مصنوعی',
        '۵۰ ماساژ بدون تنفس',
        '۵ سیکلِ ۳۰ ماساژ به ۲ تنفس مصنوعی (حدود ۲ دقیقه)',
        '۱۰۰ ماساژ و ۱۰ تنفس',
      ],
      correctIndex: 2,
      explanation: 'پروتکل استاندارد شامل ۵ سیکل متوالی از ۳۰ ماساژ قفسه سینه و ۲ تنفس مصنوعی آرام است که حدود ۲ دقیقه زمان می‌برد.',
    },
    {
      id: 17,
      question: 'در صورت عدم تمایل یا آموزش ندیدن تنفس مصنوعی، چه روشی برای احیا توصیه می‌شود؟',
      options: [
        'رها کردن مصدوم و منتظر ماندن برای اورژانس',
        'احیای قلبی فقط با دست (Hands-Only CPR) به صورت ماساژ پیوسته ۱۰۰ تا ۱۲۰ در دقیقه',
        'دادن آب یا مایعات به مصدوم',
        'تنها بالا نگه داشتن پاهای بیمار',
      ],
      correctIndex: 1,
      explanation: 'در صورت عدم تمایل به تنفس دهان به دهان، ماساژ مداوم با دست (Hands-Only CPR) با سرعت ۱۰۰ تا ۱۲۰ در دقیقه می‌تواند جریان خون به مغز را حفظ کرده و جان بیمار را نجات دهد.',
    },
    {
      id: 18,
      question: 'زاویه دست‌ها و موقعیت آرنج امدادگر هنگام اجرای ماساژ قفسه سینه چگونه باید باشد؟',
      options: [
        'آرنج‌ها کاملاً خمیده با زاویه ۴۵ درجه',
        'آرنج‌ها کاملاً صاف و قفل‌شده، و دست‌ها با زاویه ۹۰ درجه عمود بر قفسه سینه با نیروی وزن بالاتنه',
        'فشار دادن تنها با قدرت مچ دست‌ها',
        'تکیه دادن دست‌ها روی شکم مصدوم',
      ],
      correctIndex: 1,
      explanation: 'آرنج‌ها باید کاملاً صاف و عمود (زاویه ۹۰ درجه) باشند تا نیروی فشار از وزن بالاتنه امدادگر تأمین شده و خستگی زودهنگام ایجاد نشود.',
    },
    {
      id: 19,
      question: 'در مانور رفع خفگی کودکان بالای ۱ سال، مهم‌ترین نکته در خصوص استقرار امدادگر چیست؟',
      options: [
        'امدادگر باید ایستاده بماند و کودک را از گردن مهار کند',
        'امدادگر باید زانو بزند یا کودک را روی بلندی قرار دهد تا با کودک «هم‌قد» شده و زاویه دست به داخل و بالا باشد',
        'وارد کردن حداکثر فشار ممکن مانند یک فرد بزرگسال',
        'خواباندن فوری کودک روی شکم بر روی زمین',
      ],
      correctIndex: 1,
      explanation: 'در کودکان، هم‌قد شدن امدادگر (زانو زدن پشت کودک یا قرار دادن او روی صندلی) برای اعمال صحیح جهت فشار به سمت داخل و بالا حیاتی است.',
    },
    {
      id: 20,
      question: 'نخستین حلقه از حلقه‌های چهارگانه حیاتی در «زنجیره نجات» (Chain of Survival) کدام است؟',
      options: [
        'استفاده سریع از دستگاه شوک AED',
        'انتقال به بخش مراقبت‌های ویژه بیمارستان',
        'شناخت سریع ایست قلبی و درخواست کمک فوری از اورژانس ۱۱۵',
        'تزریق داروهای قلبی',
      ],
      correctIndex: 2,
      explanation: 'اولین و تعیین‌کننده‌ترین حلقه زنجیره نجات، تشخیص سریع وضعیت اورژانسی و تماس بلافاصله با اورژانس ۱۱۵ است.',
    },
  ];

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    if (idx === currentQ.correctIndex) {
      sound.playSuccessSound();
      setScore((prev) => prev + 1);
    } else {
      sound.playErrorSound();
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      sound.playAedBeep('ready');
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  const percentage = Math.round((score / questions.length) * 100);

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
        <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-2xl text-xs sm:text-sm shadow-xs truncate">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>آزمون سنجش آمادگی ({toFa(questions.length)} سؤال)</span>
        </div>
      </div>

      {/* Mandatory Emergency Alert */}
      <div className="bg-red-50 border-r-4 border-red-500 p-3.5 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs sm:text-sm text-red-900 font-bold">
            در شرایط اضطراری واقعی، درنگ نکنید: اول با ۱۱۵ تماس بگیرید.
          </p>
        </div>
        <a
          href="tel:115"
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow-xs"
        >
          ۱۱۵
        </a>
      </div>

      {!isFinished ? (
        /* Quiz Question Screen */
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          {/* Progress Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
              سؤال {toFa(currentIdx + 1)} از {toFa(questions.length)}
            </span>
            <span className="text-xs text-slate-500 font-bold">
              امتیاز شما: {toFa(score)} پاسخ درست
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Title */}
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 min-h-[52px] touch-press ${btnClass}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedOption !== null && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : selectedOption !== null && isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {['الف', 'ب', 'ج', 'د'][idx]}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div
              className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>آفرین! پاسخ شما صحیح است.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>پاسخ صحیح گزینه «{['الف', 'ب', 'ج', 'د'][currentQ.correctIndex]}» است.</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {currentQ.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 touch-press"
                >
                  <span>{currentIdx + 1 < questions.length ? 'سؤال بعدی' : 'مشاهده نتیجه نهایی'}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results Screen without Certificate */
        <div className="space-y-6">
          {/* Results Summary Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Medal className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              نتیجه آزمون سنجش آمادگی
            </h3>

            <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
              شما به <strong className="text-emerald-700 text-base">{toFa(score)}</strong> سؤال از <strong className="text-slate-900 text-base">{toFa(questions.length)}</strong> سؤال پاسخ صحیح دادید (نمره: <strong className="text-sky-700 text-base">{toFa(percentage)}٪</strong>).
            </p>

            <div className="inline-block bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-3.5 max-w-md">
              <span className="text-xs text-slate-500 font-bold block mb-1">ارزیابی آمادگی شما:</span>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {percentage >= 80
                  ? 'بسیار عالی! شما آماده‌اید نخستین حلقه مؤثر زنجیره نجات باشید.'
                  : percentage >= 50
                  ? 'خوب! با یک مرور دوباره مباحث، تسلط خود را کامل کنید.'
                  : 'نیاز به مرور مباحث آموزشی و شرکت مجدد در آزمون.'}
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 touch-press cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>شرکت دوباره در آزمون</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Back Button */}
      <div className="flex justify-start items-center pt-3">
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
