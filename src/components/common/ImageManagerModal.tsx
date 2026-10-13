import React, { useState } from 'react';
import {
  APP_IMAGES,
  ImageKey,
  getAppImage,
  setCustomImage,
  resetAllCustomImages,
  IMAGE_METADATA,
} from '../../config/images';
import {
  X,
  ImageIcon,
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  FileCode,
  Info,
  Copy,
  Search,
} from 'lucide-react';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesUpdated: () => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  isOpen,
  onClose,
  onImagesUpdated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.keys(APP_IMAGES).forEach((k) => {
      initial[k] = getAppImage(k as ImageKey);
    });
    return initial;
  });
  const [savedKey, setSavedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    'همه',
    'صفحه اصلی',
    'ماساژ قلبی (CPR)',
    'مراحل ۶ گانه CPR',
    'انسداد راه هوایی',
    'دستگاه شوک خودکار (AED)',
  ];

  const handleInputChange = (key: string, val: string) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (key: ImageKey) => {
    setCustomImage(key, inputs[key] || '');
    setSavedKey(key);
    onImagesUpdated();
    setTimeout(() => setSavedKey(null), 2000);
  };

  const handleSaveAll = () => {
    Object.entries(inputs).forEach(([k, v]) => {
      setCustomImage(k as ImageKey, v);
    });
    onImagesUpdated();
    setSavedKey('all');
    setTimeout(() => setSavedKey(null), 2500);
  };

  const handleReset = (key: ImageKey) => {
    setCustomImage(key, '');
    setInputs((prev) => ({ ...prev, [key]: '' }));
    onImagesUpdated();
  };

  const handleCopySlotCode = (key: ImageKey) => {
    const code = `  ${key}: "${inputs[key] || ''}",`;
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const allKeys = Object.keys(APP_IMAGES) as ImageKey[];
  const filteredKeys = allKeys.filter((k) => {
    const meta = IMAGE_METADATA[k];
    const matchesCategory =
      selectedCategory === 'همه' || meta?.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      k.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta?.title.includes(searchQuery) ||
      meta?.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 text-right">
      <div className="w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-fade-in">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                مدیریت و تنظیم آدرس تصاویر
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                آدرس تصاویر را در فیلدهای زیر وارد کنید یا مستقیماً در فایل{' '}
                <code
                  className="bg-slate-200 text-sky-900 px-1.5 py-0.5 rounded font-mono font-bold"
                  dir="ltr"
                >
                  src/config/images.ts
                </code>{' '}
                قرار دهید.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Guide Notice & Actions */}
        <div className="bg-sky-50/90 p-3 px-5 border-b border-sky-100 text-xs text-sky-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              فایل منبع تنظیمات در سورس‌کد: <strong>src/config/images.ts</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ذخیره همه در مرورگر</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="p-3 px-5 border-b border-slate-200 bg-slate-50 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس نام، کلید یا توضیحات تصویر..."
              className="w-full pr-9 pl-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Slots List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {filteredKeys.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              موردی با این عبارت جستجو یافت نشد.
            </div>
          ) : (
            filteredKeys.map((key) => {
              const meta = IMAGE_METADATA[key] || {
                title: key,
                category: '',
                description: '',
              };
              const currentVal = inputs[key] || '';
              const isSaved = savedKey === key || savedKey === 'all';
              const isCopied = copiedKey === key;

              return (
                <div
                  key={key}
                  className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 space-y-2.5 transition-all hover:border-sky-300 hover:bg-sky-50/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <span>{meta.title}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {meta.description}
                      </p>
                      <div
                        className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1.5"
                        dir="ltr"
                      >
                        <span className="text-slate-500">نام متغیر در فایل:</span>
                        <code className="text-sky-700 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {key}
                        </code>
                        <button
                          onClick={() => handleCopySlotCode(key)}
                          className="text-slate-400 hover:text-sky-600 p-0.5 transition"
                          title="کپی قطعه‌کد"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <span className="text-[11px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md self-start sm:self-auto shrink-0">
                      {meta.category}
                    </span>
                  </div>

                  {/* Input and Save */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      placeholder="https://example.com/photo.jpg یا /images/photo.png"
                      className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-left"
                      dir="ltr"
                    />

                    <button
                      onClick={() => handleSave(key)}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0 transition"
                      title="ذخیره این تصویر"
                    >
                      {isSaved ? (
                        <Check className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isSaved ? 'ذخیره شد' : 'ذخیره'}</span>
                    </button>

                    {currentVal && (
                      <button
                        onClick={() => handleReset(key)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:bg-rose-50 transition"
                        title="حذف آدرس"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Live Thumbnail Preview */}
                  {currentVal && (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200">
                      <img
                        src={currentVal}
                        alt={meta.title}
                        className="w-16 h-12 object-cover rounded-lg border border-slate-100 bg-slate-100"
                        onError={(e) => {
                          (e.target as HTMLElement).style.opacity = '0.4';
                        }}
                      />
                      <div
                        className="text-xs text-slate-600 truncate flex-1 font-mono"
                        dir="ltr"
                      >
                        {currentVal}
                      </div>
                      <a
                        href={currentVal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:text-sky-800 p-1"
                        title="باز کردن عکس در تب جدید"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              برای اعمال دائمی در سرور یا پروژه، آدرس‌ها را در فایل{' '}
              <strong className="font-mono text-slate-800">
                src/config/images.ts
              </strong>{' '}
              قرار دهید.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
