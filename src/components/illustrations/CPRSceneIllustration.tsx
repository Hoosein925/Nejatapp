import React from 'react';
import { motion } from 'motion/react';

interface CPRSceneIllustrationProps {
  isCompressing?: boolean;
  compressionCount?: number;
  showGuides?: boolean;
  bpmRate?: number;
  autoPlayDemo?: boolean;
}

export const CPRSceneIllustration: React.FC<CPRSceneIllustrationProps> = ({
  isCompressing = false,
  compressionCount = 0,
  showGuides = true,
  bpmRate,
  autoPlayDemo = false,
}) => {
  // If autoPlayDemo is active and not currently manually compressing, we can pulse gently
  const activeCompression = isCompressing;

  return (
    <div className="relative w-full aspect-[16/10] max-h-[460px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50/80 via-white to-blue-50/70 border border-sky-100 shadow-md">
      <svg
        viewBox="0 0 760 480"
        className="w-full h-full drop-shadow-xs"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle room lighting gradients */}
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Rescuer uniform gradients */}
          <linearGradient id="maleShirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          <linearGradient id="malePantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Patient shirt gradient */}
          <linearGradient id="patientShirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Skin tones */}
          <linearGradient id="maleSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>

          <linearGradient id="patientSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>

          <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= 1. ENVIRONMENT / ROOM BACKGROUND ================= */}
        {/* Wall */}
        <rect x="0" y="0" width="760" height="310" fill="url(#wallGradient)" />
        {/* Baseboard divider */}
        <rect x="0" y="308" width="760" height="6" fill="#94a3b8" opacity="0.7" />
        {/* Clean Floor with subtle medical parquet lines */}
        <rect x="0" y="314" width="760" height="166" fill="url(#floorGradient)" />
        <line x1="0" y1="380" x2="760" y2="380" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />
        <line x1="180" y1="314" x2="120" y2="480" stroke="#94a3b8" strokeWidth="1" opacity="0.2" />
        <line x1="420" y1="314" x2="380" y2="480" stroke="#94a3b8" strokeWidth="1" opacity="0.2" />
        <line x1="640" y1="314" x2="610" y2="480" stroke="#94a3b8" strokeWidth="1" opacity="0.2" />

        {/* Ambient Ground Shadows */}
        <ellipse cx="280" cy="406" rx="210" ry="24" fill="#64748b" opacity="0.26" />
        <ellipse cx="480" cy="412" rx="90" ry="20" fill="#64748b" opacity="0.32" />

        {/* ================= 2. THE PATIENT (بیمار آقا خوابیده به پشت) ================= */}
        <g id="patient-body">
          {/* Patient Legs & Dark Trousers */}
          <path
            d="M 120 380 C 130 374, 210 375, 255 378 L 250 405 C 200 406, 130 404, 110 394 Z"
            fill="#334155"
          />
          {/* Patient Shoes */}
          <path
            d="M 90 382 C 100 375, 118 376, 120 388 L 110 398 C 98 400, 88 393, 90 382 Z"
            fill="#1e293b"
          />

          {/* Patient Pelvis */}
          <path
            d="M 245 376 C 265 374, 285 374, 305 376 L 305 404 C 280 406, 255 406, 245 404 Z"
            fill="#334155"
          />

          {/* Patient Left Arm (Resting peacefully by his side on floor) */}
          <path
            d="M 290 384 C 270 395, 240 402, 215 404 C 205 405, 202 398, 208 394 C 230 390, 260 384, 285 378 Z"
            fill="#fde68a"
          />

          {/* Patient Neck & Head (Resting horizontally, realistic male features) */}
          <g id="patient-head">
            {/* Soft pillow/support under head */}
            <rect x="375" y="388" width="55" height="14" rx="7" fill="#cbd5e1" opacity="0.7" />
            {/* Neck */}
            <path d="M 370 376 L 388 376 L 388 392 L 370 392 Z" fill="#fde68a" />
            {/* Jaw and Face profile (facing slightly up) */}
            <path
              d="M 384 374 C 395 372, 412 376, 418 386 C 420 396, 412 404, 396 405 C 386 405, 380 396, 384 374 Z"
              fill="url(#patientSkinGrad)"
            />
            {/* Male Haircut (Modern dark hair) */}
            <path
              d="M 390 372 C 396 362, 420 363, 428 376 C 434 386, 430 402, 422 405 C 420 400, 418 388, 408 382 C 398 378, 392 378, 390 372 Z"
              fill="#1e293b"
            />
            {/* Eyebrow */}
            <path d="M 398 378 Q 404 380 410 377" fill="none" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
            {/* Closed eye (calm, unconscious) */}
            <path d="M 400 384 Q 405 387 410 384" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            {/* Nose */}
            <path d="M 408 386 L 413 390 L 409 392" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Mouth */}
            <path d="M 400 397 Q 405 398 409 397" fill="none" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Patient Chest & Torso (ANIMATED TO SINK 5-6 CM WHEN COMPRESSED) */}
          <motion.g
            id="patient-chest"
            animate={{
              y: activeCompression ? 14 : 0,
              scaleY: activeCompression ? 0.90 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 600,
              damping: 24,
            }}
            style={{ transformOrigin: '340px 386px' }}
          >
            {/* Upper Chest with shirt */}
            <path
              d="M 295 374 C 320 358, 365 358, 385 374 L 385 402 C 355 406, 315 406, 295 402 Z"
              fill="url(#patientShirtGrad)"
            />
            {/* Shirt Collar V-neck exposing chest sternum */}
            <path d="M 365 374 L 375 385 L 385 374 Z" fill="#fde68a" />

            {/* Sternum Center Target (Red glowing zone) */}
            <circle cx="340" cy="374" r="16" fill="#ef4444" opacity="0.3" />
            <circle cx="340" cy="374" r="9" fill="#ef4444" opacity="0.8" />
            <circle cx="340" cy="374" r="3.5" fill="#ffffff" />
          </motion.g>

          {/* Blood flow / Oxygen wave pulse to Brain */}
          <motion.path
            d="M 340 374 C 360 365, 385 365, 408 382"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            animate={{
              strokeDashoffset: activeCompression ? [20, 0] : 0,
              opacity: activeCompression ? [0.4, 1, 0.4] : 0.2,
            }}
            transition={{ duration: 0.5, repeat: activeCompression ? Infinity : 0 }}
          />
        </g>

        {/* ================= 3. THE MALE RESCUER (امدادگر آقا زانو زده) ================= */}
        {/* Rescuer Lower Body: Kneeling sturdy on floor (Stable base) */}
        <g id="male-rescuer-legs">
          {/* Knees and Thighs in dark tactical emergency pants with kneepads */}
          {/* Right Leg / Thigh bent towards patient */}
          <path
            d="M 390 415 C 365 415, 350 402, 362 390 C 378 376, 420 370, 455 372 L 465 415 Z"
            fill="url(#malePantsGrad)"
          />
          {/* Left Leg behind */}
          <path
            d="M 445 422 C 485 424, 525 410, 520 392 C 510 376, 470 368, 455 372 L 445 422 Z"
            fill="#0f172a"
          />
          {/* Tactical Paramedic Boots */}
          <path
            d="M 515 396 C 525 390, 545 395, 540 408 L 525 412 C 515 412, 510 404, 515 396 Z"
            fill="#1e293b"
          />
          {/* Reflective silver safety stripe on trousers */}
          <path d="M 405 388 L 415 415" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Rescuer Upper Body: Torso, Head and Locked Straight Arms */}
        {/* PIVOTS NATURALLY DOWNWARD ON CHEST COMPRESSION */}
        <motion.g
          id="male-rescuer-upper-body"
          animate={{
            y: activeCompression ? 18 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 600,
            damping: 24,
            mass: 0.9,
          }}
          style={{ transformOrigin: '450px 370px' }}
        >
          {/* Belt and Waist */}
          <rect x="420" y="340" width="55" height="14" rx="4" fill="#0f172a" />
          <rect x="442" y="342" width="12" height="10" rx="2" fill="#94a3b8" />

          {/* Muscular Male Torso in Royal Blue Paramedic Polo */}
          <path
            d="M 395 235 C 385 285, 400 335, 420 345 L 475 345 C 495 335, 505 285, 495 235 Z"
            fill="url(#maleShirtGrad)"
            filter="url(#softShadow)"
          />

          {/* Paramedic Polo Collar & Placket */}
          <path d="M 425 232 L 445 260 L 465 232 Z" fill="#0f172a" />
          <line x1="445" y1="260" x2="445" y2="285" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="445" cy="270" r="1.5" fill="#ffffff" />
          <circle cx="445" cy="280" r="1.5" fill="#ffffff" />

          {/* Star of Life / Medical Heart Emblem on chest */}
          <circle cx="425" cy="268" r="11" fill="#ffffff" opacity="0.95" />
          <path
            d="M 420 268 L 430 268 M 425 263 L 425 273"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Neck (Strong male neck) */}
          <rect x="435" y="206" width="22" height="30" rx="8" fill="url(#maleSkinGrad)" />

          {/* ================= MALE RESCUER HEAD & FACE ================= */}
          <g id="male-head">
            {/* Head Base */}
            <ellipse cx="446" cy="176" rx="22" ry="26" fill="url(#maleSkinGrad)" />

            {/* Modern Stylish Haircut (Neat short haircut with fade) */}
            <path
              d="M 422 170 C 420 140, 465 132, 474 152 C 478 162, 474 176, 468 182 C 466 170, 460 162, 448 160 C 434 160, 426 166, 422 170 Z"
              fill="#1e293b"
            />
            {/* Sideburns */}
            <rect x="462" y="166" width="6" height="14" rx="2" fill="#1e293b" />

            {/* Ear */}
            <ellipse cx="466" cy="180" rx="5" ry="8" fill="#fdba74" />
            <path d="M 466 177 Q 464 180 466 183" fill="none" stroke="#ea580c" strokeWidth="1.5" />

            {/* Focused Eyebrow (Angled down in professional focus) */}
            <path
              d="M 428 170 Q 436 165 444 170"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Focused Male Eye (Looking straight down at hands on the sternum) */}
            <ellipse cx="434" cy="176" rx="4" ry="4.5" fill="#ffffff" />
            <ellipse cx="433" cy="177" rx="2.5" ry="3" fill="#0f172a" />
            <circle cx="432.5" cy="176" r="1" fill="#ffffff" />

            {/* Defined Male Nose */}
            <path
              d="M 430 178 L 424 186 L 430 188"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Strong Jawline and Chin */}
            <path
              d="M 432 196 Q 440 204 452 202"
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Concentrated mouth */}
            <path
              d="M 428 194 Q 434 195 438 193"
              fill="none"
              stroke="#9a3412"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* ================= RESCUER ARMS & INTERLOCKED HANDS ================= */}
          {/* SHOULDERS DIRECTLY OVER PATIENT'S STERNUM, ARMS 100% STRAIGHT */}
          <g id="male-rescuer-arms">
            {/* Left Shoulder (Back) */}
            <circle cx="480" cy="245" r="17" fill="#0369a1" />
            {/* Right Shoulder (Front) */}
            <circle cx="405" cy="245" r="18" fill="#0284c7" />

            {/* Left Arm (Behind) - completely straight, locked elbow */}
            <line
              x1="475"
              y1="245"
              x2="352"
              y2="362"
              stroke="#0369a1"
              strokeWidth="28"
              strokeLinecap="round"
            />

            {/* Right Arm (Foreground) - completely straight down to sternum (x=340) */}
            <line
              x1="405"
              y1="245"
              x2="340"
              y2="360"
              stroke="#0284c7"
              strokeWidth="30"
              strokeLinecap="round"
            />

            {/* Muscle definition line & sleeve border */}
            <ellipse cx="348" cy="354" rx="16" ry="10" fill="#f8fafc" />

            {/* Beautiful Interlocked Hands pressing firmly onto sternum */}
            <g id="hands-interlocked">
              {/* Lower Hand Palm Heel placed directly on sternum center */}
              <ellipse cx="340" cy="372" rx="17" ry="11" fill="url(#maleSkinGrad)" />
              {/* Upper Clasping Hand */}
              <path
                d="M 330 362 C 336 354, 352 354, 358 364 C 362 372, 350 379, 340 377 Z"
                fill="#fdba74"
              />
              {/* Interlaced fingers wrapped around lower hand */}
              <path
                d="M 334 366 Q 340 373 346 366 Q 352 373 358 366"
                fill="none"
                stroke="#c2410c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </g>
        </motion.g>

        {/* ================= 4. MEDICAL GUIDES & INTERACTIVE HUD ================= */}
        {showGuides && (
          <g id="hud-guidelines">
            {/* Perfect 90-degree vertical alignment guideline */}
            <line
              x1="340"
              y1="190"
              x2="340"
              y2="355"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              opacity="0.75"
            />

            {/* 90-degree square corner symbol */}
            <path
              d="M 340 325 L 354 325 L 354 340"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              opacity="0.9"
            />
            <rect x="360" y="320" width="130" height="26" rx="13" fill="#0284c7" />
            <text x="425" y="337" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
              زاویه ۹۰° (آرنج‌ها کاملاً صاف)
            </text>

            {/* Pulsating Heart Target Ring */}
            <motion.circle
              cx="340"
              cy="374"
              r={activeCompression ? 34 : 22}
              fill="none"
              stroke="#ef4444"
              strokeWidth={activeCompression ? 4 : 2.5}
              opacity={activeCompression ? 1 : 0.4}
              filter="url(#glowEffect)"
              transition={{ duration: 0.12 }}
            />

            {/* Depth feedback indicator pill on side */}
            {activeCompression && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <rect x="270" y="420" width="140" height="30" rx="15" fill="#15803d" />
                <text
                  x="340"
                  y="440"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="bold"
                >
                  عمق: ۵ تا ۶ سانتی‌متر ✓
                </text>
              </motion.g>
            )}
          </g>
        )}
      </svg>

      {/* Floating Info Overlay Tags */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs sm:text-sm font-black text-slate-800">
            موقعیت امدادگر: زانو زده در کنار بیمار
          </span>
        </div>

        {bpmRate !== undefined && bpmRate > 0 && (
          <div className="bg-sky-600 text-white px-3.5 py-1 rounded-xl text-xs sm:text-sm font-black shadow-sm">
            سرعت: {bpmRate} ضربه/دقیقه
          </div>
        )}
      </div>

      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl border border-slate-700/80 shadow-sm flex items-center gap-2">
          <span className="text-xs text-slate-300 font-bold">فشارهای ثبت‌شده:</span>
          <span className="text-base font-black text-amber-300 font-mono">
            {compressionCount}
          </span>
        </div>
      </div>
    </div>
  );
};
