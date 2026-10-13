import React, { useState, useEffect } from 'react';
import { User, Clock, Calendar } from 'lucide-react';

import { AppTab } from '../types';

interface FooterProps {
  currentTab?: AppTab;
}

export const Footer: React.FC<FooterProps> = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Persian Solar Date
      const dateStr = new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(now);

      // Persian Time
      const timeStr = new Intl.DateTimeFormat('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);

      setCurrentDate(dateStr);
      setCurrentTime(timeStr);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white border-t border-indigo-700/60 py-3.5 px-3 sm:px-6 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Creator section */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white">
              سازنده: <span className="text-amber-300 font-black">حسین نصاری</span>
            </h4>
          </div>
        </div>

        {/* Live Date and Time in Persian format */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          {/* Persian Date */}
          <div className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-white/95">
            <Calendar className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span className="font-black text-xs">{currentDate || 'در حال دریافت...'}</span>
          </div>

          {/* Live Clock */}
          <div className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-white font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-black text-xs sm:text-sm text-amber-200 tracking-wider">
              {currentTime || '۰۰:۰۰:۰۰'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
