import React from 'react';
import { Home, Heart, Wind, Zap, Award } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: 'home' as AppTab, label: 'خانه', icon: Home },
    { id: 'cpr' as AppTab, label: 'ماساژ قلبی', icon: Heart },
    { id: 'choking' as AppTab, label: 'انسداد هوایی', icon: Wind },
    { id: 'aed' as AppTab, label: 'دستگاه AED', icon: Zap },
    { id: 'quiz' as AppTab, label: 'آزمون', icon: Award },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'home' && currentTab === 'intro');
          return (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-150 min-h-[48px] touch-press ${
                isActive
                  ? 'text-sky-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-700 active:text-sky-700'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-sky-100/80 text-sky-700' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] sm:text-xs mt-0.5 leading-tight ${isActive ? 'font-bold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
