/**
 * ============================================================================
 * 📷 فایل تنظیمات، آدرس تصاویر و ویدیوهای آموزشی برنامه
 * ============================================================================
 */

// نکته: تصاویر پشتیبان از پوشه public سرو می‌شوند (بدون import)، پس هرگز باعث خطای build نمی‌شوند.
// فایل‌ها باید در public/images/ موجود باشند.
export const LOCAL_IMAGE_FALLBACKS: Record<string, string> = {
  chainOfSurvival: '/images/chain_of_survival.png',
  cprRecovery: '/images/recovery.jpg',
};

export const APP_IMAGES = {
  // ۱. صفحه اصلی و مفاهیم کلی (زنجیره حیات ۵ حلقه)
  heroBanner: "",
  chainOfSurvival: "https://s25.uupload.ir/files/ho3in72/barnameh/%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87%20%D8%AD%DB%8C%D8%A7%D8%AA%D8%9B%20%D9%87%D8%B1%20%D8%AB%D8%A7%D9%86%DB%8C%D9%87%20%D9%85%D9%87%D9%85%20%D8%A7%D8%B3%D8%AA.png",

  // ۲. بخش ماساژ قلبی با دست (CPR)
  cprScene: "https://s9.uupload.ir/files/ho3in72/barnameh/%D9%85%D8%A7%D8%B3%D8%A7%DA%984404101.png",
  cprHandPlacement: "https://s9.uupload.ir/files/ho3in72/barnameh/%D9%85%D8%A7%D8%B3%D8%A7%DA%984404101.png",
  cprRecovery: "https://s9.uupload.ir/files/ho3in72/barnameh/recovery.jpg",

  // ۳. اسلایدهای CPR
  cprStep1Safety: "",
  cprStep2Assessment: "",
  cprStep3Call115: "",
  cprStep4Breathing: "",
  cprStep5Compressions: "https://s9.uupload.ir/files/ho3in72/barnameh/%D9%85%D8%A7%D8%B3%D8%A7%DA%984404101.png",
  cprStep6Continue: "",

  // ۴. بخش انسداد راه هوایی با جسم خارجی (مانور هایملیخ)
  chokingUniversalSign: "",
  heimlichAdultBackBlows: "https://s27.uupload.ir/files/ho3in72/barnameh/Back-blows%20adult.png",
  heimlichAdultAbdominalThrusts: "https://s27.uupload.ir/files/ho3in72/barnameh/Heimlich%20adult.png",
  heimlichChildBackBlows: "https://s27.uupload.ir/files/ho3in72/barnameh/back%20blows%20child.jpg",
  heimlichChild: "https://s27.uupload.ir/files/ho3in72/barnameh/heimlich%20child.jpg",
  heimlichPregnant: "https://s17.uupload.ir/files/ho3in72/barnameh/chest-thrust-pregnant.png",
  heimlichInfantBackBlows: "https://s27.uupload.ir/files/ho3in72/barnameh/back%20blows%20infant.jpg",
  heimlichInfantChestThrusts: "https://s27.uupload.ir/files/ho3in72/barnameh/heimlich%20infant.jpg",
  heimlichInfantFingerSweep: "https://s27.uupload.ir/files/ho3in72/barnameh/%D8%B3%D9%88%D8%A7%D9%BE%DB%8C%D9%86.png",

  // ۵. دستگاه شوک خودکار خارجی (AED)
  aedOverview: "https://s9.uupload.ir/files/ho3in72/barnameh/%D8%AF%D8%B3%D8%AA%DA%AF%D8%A7%D9%87-AED--1536x864.jpg",
  aedPadsPlacement: "https://s9.uupload.ir/files/ho3in72/barnameh/%D8%AF%D8%B3%D8%AA%DA%AF%D8%A7%D9%87-AED--1536x864.jpg",
  aedStep1Power: "",
  aedStep2PrepareChest: "",
  aedStep3AttachPads: "",
  aedStep4AnalyzeRhythm: "",
  aedStep5DeliverShock: "",
  aedStep6ResumeCPR: "",
};

export const APP_VIDEOS = {
  // آموزش احیا
  cpr: "https://s41.uupload.ir/files/ho3in72/CPR/%D8%A7%D8%AD%DB%8C%D8%A7%DB%8C%20%D9%82%D9%84%D8%A8%DB%8C%20%D8%B1%DB%8C%D9%88%DB%8C.mp4",
  // دستگاه AED
  aed: "https://s50.uupload.ir/files/ho3in72/CPR/AED-720p%2000_00_44-00_04_44.mp4",
  // باز کردن راه هوایی بزرگسال
  adultChoking: "https://s9.uupload.ir/files/ho3in72/barnameh/%D9%85%D8%A7%D9%86%D9%88%D8%B1%20%D8%AE%D9%81%DA%AF%DB%8C%20%D8%AF%D8%B1%20%D8%A8%D8%B2%D8%B1%DA%AF%D8%B3%D8%A7%D9%84~1.mp4",
  // باز کردن راه هوایی اطفال
  childChoking: "https://s9.uupload.ir/files/ho3in72/barnameh/%D9%85%D8%A7%D9%86%D9%88%D8%B1%20%D8%AE%D9%81%DA%AF%DB%8C%20%D8%AF%D8%B1%20%D8%A7%D8%B7%D9%81%D8%A7%D9%84~1.mp4",
  // باز کردن راه هوایی نوزاد و شیرخوار
  infantChoking: "https://s25.uupload.ir/files/ho3in72/barnameh/%D9%85%D8%A7%D9%86%D9%88%D8%B1%20%D8%AE%D9%81%DA%AF%DB%8C%20%D8%AF%D8%B1%20%D8%B4%DB%8C%D8%B1%D8%AE%D9%88%D8%A7%D8%B1%20%D9%88%20%D9%86%D9%88%D8%B2%D8%A7%D8%AF~1.mp4",
  // وضعیت ریکاوری
  recovery: "https://s9.uupload.ir/files/ho3in72/barnameh/recovery.mp4",
  // تنفس غیرطبیعی گسپینگ
  gasping: "https://s9.uupload.ir/files/ho3in72/barnameh/gasping-720p%2000_00_06-00_00_48.mp4",
};

export type ImageKey = keyof typeof APP_IMAGES;

export const IMAGE_METADATA: Record<
  ImageKey,
  { title: string; category: string; description: string }
> = {
  heroBanner: {
    title: 'تصویر هدر بالای صفحه اصلی',
    category: 'صفحه اصلی',
    description: 'تصویر پس‌زمینه یا شاخص بالای صفحه اصلی برای معرفی آموزش',
  },
  chainOfSurvival: {
    title: 'اینفوگرافیک زنجیره حیات (۵ حلقه حیاتی)',
    category: 'صفحه اصلی',
    description: '۱) شناخت سریع و ۱۱۵، ۲) شروع فوری ماساژ قلبی، ۳) شوک زودهنگام با AED، ۴) رسیدن تیم اورژانس ۱۱۵، ۵) مراقبت‌های پس از احیا و ریکاوری',
  },
  cprScene: {
    title: 'تصویر اصلی ماساژ قلبی (شبیه‌ساز)',
    category: 'ماساژ قلبی (CPR)',
    description: 'امدادگر زانو زده کنار بیمار، بازوها کاملاً صاف و دست‌ها روی جناغ',
  },
  cprHandPlacement: {
    title: 'محل قرارگیری دست‌ها روی استخوان جناغ',
    category: 'ماساژ قلبی (CPR)',
    description: 'قفل شدن انگشتان و قرارگیری پاشنه دست روی وسط قفسه سینه',
  },
  cprRecovery: {
    title: 'وضعیت ریکاوری (خوابیده به پهلو)',
    category: 'ماساژ قلبی (CPR)',
    description: 'بیمار دارای تنفس خوابیده به پهلو با دست زیر سر و زانوی خمیده',
  },
  cprStep1Safety: {
    title: 'مرحله ۱: بررسی ایمنی صحنه',
    category: 'مراحل ۶ گانه CPR',
    description: 'اطمینان از ایمنی خود و مصدوم در صحنه حادثه',
  },
  cprStep2Assessment: {
    title: 'مرحله ۲: ارزیابی پاسخ‌دهی و هوشیاری',
    category: 'مراحل ۶ گانه CPR',
    description: 'ضربه آرام به شانه‌ها و صدا زدن برای بررسی هوشیاری',
  },
  cprStep3Call115: {
    title: 'مرحله ۳: خونسردی و تماس با اورژانس ۱۱۵',
    category: 'مراحل ۶ گانه CPR',
    description: 'تماس فوری با ۱۱۵ و قراردادن گوشی روی بلندگو',
  },
  cprStep4Breathing: {
    title: 'مرحله ۴: بررسی تنفس ۱۰ ثانیه',
    category: 'مراحل ۶ گانه CPR',
    description: 'نگاه به قفسه سینه برای بررسی بالا و پایین رفتن و تنفس طبیعی',
  },
  cprStep5Compressions: {
    title: 'مرحله ۵: ماساژ قفسه سینه',
    category: 'مراحل ۶ گانه CPR',
    description: 'فشار با عمق ۵ تا ۶ سانتی‌متر و ریتم ۱۰۰ تا ۱۲۰ بار در دقیقه',
  },
  cprStep6Continue: {
    title: 'مرحله ۶: ادامه مداوم تا رسیدن اورژانس',
    category: 'مراحل ۶ گانه CPR',
    description: 'ادامه ماساژ بدون وقفه تا تحویل به اورژانس یا بازگشت علائم',
  },
  chokingUniversalSign: {
    title: 'علامت جهانی خفگی',
    category: 'انسداد راه هوایی',
    description: 'دست‌ها روی گلو، ناتوانی در صحبت و سرفه، تغییر رنگ چهره',
  },
  heimlichAdultBackBlows: {
    title: 'هایملیخ بزرگسال: ۵ ضربه بین دو کتف',
    category: 'انسداد راه هوایی',
    description: 'بیمار کمی خمیده و ۵ ضربه با پاشنه دست بین دو کتف',
  },
  heimlichAdultAbdominalThrusts: {
    title: 'هایملیخ بزرگسال: ۵ فشار شکمی (داخل و بالا)',
    category: 'انسداد راه هوایی',
    description: 'مشت دست غالب بین ناف و جناغ و فشار ناگهانی به سمت داخل و بالا',
  },
  heimlichChildBackBlows: {
    title: 'هایملیخ اطفال: ۵ ضربه بین دو کتف',
    category: 'انسداد راه هوایی',
    description: '۵ ضربه با کف دست بین دو کتف کودک',
  },
  heimlichChild: {
    title: 'هایملیخ در کودکان (هم‌قد شدن)',
    category: 'انسداد راه هوایی',
    description: 'زانو زدن پشت کودک یا قرار دادن او روی صندلی برای زاویه مناسب',
  },
  heimlichPregnant: {
    title: 'مانور در بارداری و چاقی (فشار قفسه سینه)',
    category: 'انسداد راه هوایی',
    description: 'فشار روی وسط قفسه سینه؛ فشردن شکم در بارداری اکیداً ممنوع است',
  },
  heimlichInfantBackBlows: {
    title: 'شیرخوار: ۵ ضربه به پشت روی ساعد',
    category: 'انسداد راه هوایی',
    description: 'صورت رو به پایین، سر پایین‌تر از تنه و ضربه بین شانه‌ها',
  },
  heimlichInfantChestThrusts: {
    title: 'شیرخوار: ۵ فشار قفسه سینه',
    category: 'انسداد راه هوایی',
    description: 'چرخش شیرخوار به پشت و ۵ فشار با دو انگشت/کف دست وسط جناغ',
  },
  heimlichInfantFingerSweep: {
    title: 'روش جارویی مورد استفاده در نوزاد و سایر سنین (Finger Sweep)',
    category: 'انسداد راه هوایی',
    description: 'خارج کردن جسم با انگشت خمیده به صورت جارویی تنها در صورت مشاهده قطعی آن',
  },
  aedOverview: {
    title: 'دستگاه AED و لوازم همراه',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'نمای کامل دستگاه شوک خودکار، پدها، کانکتور و کیف',
  },
  aedPadsPlacement: {
    title: 'نحوه صحیح چسباندن ۲ پد روی سینه',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'پد اول زیر استخوان ترقوه راست، پد دوم زیر بغل سمت چپ',
  },
  aedStep1Power: {
    title: 'مرحله ۱ AED: روشن کردن دستگاه',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'فشردن دکمه روشن/خاموش و فعال شدن راهنمای صوتی',
  },
  aedStep2PrepareChest: {
    title: 'مرحله ۲ AED: آماده‌سازی و خشک کردن سینه',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'برهنه کردن کامل سینه و پاک کردن رطوبت یا عرق',
  },
  aedStep3AttachPads: {
    title: 'مرحله ۳ AED: چسباندن پدها و اتصال فیش',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'نصب محکم پدها و اتصال کابل رابط به سوکت دستگاه',
  },
  aedStep4AnalyzeRhythm: {
    title: 'مرحله ۴ AED: تحلیل ریتم (همه کنار بروند)',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'عدم لمس بیمار هنگام تحلیل سیگنال قلب توسط دستگاه',
  },
  aedStep5DeliverShock: {
    title: 'مرحله ۵ AED: فشردن دکمه تخلیه شوک',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'فشردن دکمه قرمز/نارنجی شوک پس از دستور دستگاه',
  },
  aedStep6ResumeCPR: {
    title: 'مرحله ۶ AED: از سرگیری فوری ماساژ قلبی',
    category: 'دستگاه شوک خودکار (AED)',
    description: 'شروع مجدد ماساژ قفسه سینه بلافاصله بدون فوت وقت',
  },
};

export function getAppImage(key: ImageKey): string {
  if (typeof window !== 'undefined') {
    try {
      const localUrl = localStorage.getItem(`custom_img_${key}`);
      if (localUrl && localUrl.trim() !== '') {
        return localUrl.trim();
      }
    } catch {
      // Ignore
    }
  }

  const fileUrl = APP_IMAGES[key];
  return fileUrl ? fileUrl.trim() : '';
}

export function setCustomImage(key: ImageKey, url: string): void {
  if (typeof window !== 'undefined') {
    try {
      if (url.trim() === '') {
        localStorage.removeItem(`custom_img_${key}`);
      } else {
        localStorage.setItem(`custom_img_${key}`, url.trim());
      }
    } catch {
      // Ignore
    }
  }
}

export function resetAllCustomImages(): void {
  if (typeof window !== 'undefined') {
    try {
      Object.keys(APP_IMAGES).forEach((k) => {
        localStorage.removeItem(`custom_img_${k}`);
      });
    } catch {
      // Ignore
    }
  }
}
