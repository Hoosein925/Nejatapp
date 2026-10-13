/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { IntroductionView } from './components/IntroductionView';
import { CPRView } from './components/CPRView';
import { ChokingView } from './components/ChokingView';
import { AEDView } from './components/AEDView';
import { QuizView } from './components/QuizView';
import { WifiOff, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
import { APP_IMAGES } from './config/appImages';

const VALID_TABS: AppTab[] = ['home', 'intro', 'cpr', 'choking', 'aed', 'quiz'];

function getInitialTab(): AppTab {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '') as AppTab;
    if (VALID_TABS.includes(hash)) return hash;

    try {
      const saved = localStorage.getItem('saved_app_tab') as AppTab;
      if (VALID_TABS.includes(saved)) return saved;
    } catch {
      // Ignore
    }
  }
  return 'home';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>(getInitialTab);
  const [imageVersion, setImageVersion] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Startup sync & preload state
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [syncProgress, setSyncProgress] = useState<number>(10);
  const [syncMessage, setSyncMessage] = useState<string>('درحال همگام‌سازی و ذخیره تصاویر...');

  // Preload and cache all application images on startup
  useEffect(() => {
    let isCancelled = false;

    const preloadAssets = async () => {
      // Collect valid image URLs
      const imageUrls = Object.values(APP_IMAGES).filter(
        (url) => url && typeof url === 'string' && url.trim().length > 0
      );

      // Add default icons
      const criticalIcons = ['/app-icon.png', '/pwa-192x192.png'];
      const allUrls = Array.from(new Set([...criticalIcons, ...imageUrls]));

      let loadedCount = 0;
      const total = allUrls.length;

      const updateProgress = () => {
        if (isCancelled) return;
        loadedCount++;
        const pct = Math.min(100, Math.round((loadedCount / total) * 100));
        setSyncProgress(pct);
        if (pct < 50) {
          setSyncMessage('درحال همگام‌سازی و دانلود تصاویر...');
        } else if (pct < 100) {
          setSyncMessage('درحال ذخیره‌سازی تصاویر در حافظه دستگاه...');
        } else {
          setSyncMessage('همگام‌سازی با موفقیت انجام شد!');
        }
      };

      // Load each image in parallel with timeout protection
      const imagePromises = allUrls.map((url) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            updateProgress();
            resolve();
          };
          img.onerror = () => {
            updateProgress();
            resolve(); // Don't block startup on single image failure
          };
        });
      });

      // Allow max 1.8s for smooth transition
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(resolve, 1800);
      });

      await Promise.race([Promise.all(imagePromises), timeoutPromise]);

      if (!isCancelled) {
        setSyncProgress(100);
        setSyncMessage('همگام‌سازی کامل شد');
        setTimeout(() => {
          if (!isCancelled) setIsSyncing(false);
        }, 300);
      }
    };

    preloadAssets();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Save current tab to localStorage and URL hash on change
  const handleTabChange = (newTab: AppTab) => {
    setCurrentTab(newTab);
  };

  // Synchronize current tab state to both localStorage and URL hash on any change
  useEffect(() => {
    try {
      localStorage.setItem('saved_app_tab', currentTab);
      if (window.location.hash.replace('#', '') !== currentTab) {
        window.location.hash = currentTab;
      }
    } catch {
      // Ignore
    }
  }, [currentTab]);

  // Sync tab with browser back/forward or manual hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppTab;
      if (VALID_TABS.includes(hash)) {
        setCurrentTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Always scroll to top immediately when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });

    return () => cancelAnimationFrame(rafId);
  }, [currentTab]);

  const handleImagesUpdated = () => {
    setImageVersion((prev) => prev + 1);
  };

  // Startup Sync Screen
  if (isSyncing) {
    return (
      <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex flex-col items-center justify-center p-6 text-white text-center select-none">
        <div className="w-full max-w-sm flex flex-col items-center space-y-6 animate-fade-in">
          {/* Logo badge */}
          <div className="relative">
            <img
              src="/app-icon.png"
              alt="سامانه نجات"
              className="w-24 h-24 rounded-3xl shadow-2xl shadow-red-500/30 object-cover border-2 border-white/20 animate-pulse"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border border-white/20">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              سامانه نجات
            </h1>
            <p className="text-xs text-indigo-200">
              راهنمای تعاملی و اورژانس نجات زندگی
            </p>
          </div>

          {/* Progress Box */}
          <div className="w-full bg-white/10 p-4 rounded-2xl border border-white/15 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-100">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>{syncMessage}</span>
              </span>
              <span className="font-mono text-amber-300 font-black">{syncProgress}٪</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-300 leading-normal text-right">
              تصاویر در حافظه محلی ذخیره می‌شوند تا بدون نیاز به اینترنت سریع و آفلاین باز شوند. (ویدیوها فقط هنگام پخش بارگذاری خواهند شد)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#eaf5ea] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Offline Alert Badge if user is disconnected */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-3 py-1.5 text-center flex items-center justify-center gap-1.5 font-medium sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>حالت آفلاین — برنامه به طور کامل از حافظه محلی در دسترس است.</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        setTab={handleTabChange}
        onImagesUpdated={handleImagesUpdated}
      />

      {/* Main Content Area */}
      <main key={imageVersion} className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 pb-8">
        {currentTab === 'home' && <HomeView setTab={handleTabChange} />}
        {currentTab === 'intro' && <IntroductionView setTab={handleTabChange} />}
        {currentTab === 'cpr' && <CPRView setTab={handleTabChange} />}
        {currentTab === 'choking' && <ChokingView setTab={handleTabChange} />}
        {currentTab === 'aed' && <AEDView setTab={handleTabChange} />}
        {currentTab === 'quiz' && <QuizView setTab={handleTabChange} />}
      </main>

      {/* Global Edge-to-Edge Footer */}
      <Footer currentTab={currentTab} />
    </div>
  );
}
