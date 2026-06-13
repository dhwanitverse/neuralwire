'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import dynamic from 'next/dynamic';

const NeuralJourneyPath = dynamic(() => import('./NeuralJourneyPath'), {
  ssr: false,
  loading: () => null,
});

const STEPS = [
  'Hero',
  'Breaking',
  'Trending',
  'AI Radar',
  'Editors',
  'Categories',
  'Latest',
  'Authors',
  'Newsletter',
  'Join',
];

const JourneyContext = createContext({ registerStep: (_id: string, _index: number) => {} });

export function useJourneyStep(id: string, index: number) {
  const { registerStep } = useContext(JourneyContext);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerStep(id, index);
  }, [id, index, registerStep]);

  return ref;
}

function syncSectionStates(container: HTMLElement, activeStep: number) {
  container.querySelectorAll<HTMLElement>('[data-journey-step]').forEach((el) => {
    const s = Number(el.dataset.journeyStep);
    if (Number.isNaN(s)) return;
    const state = s < activeStep ? 'past' : s === activeStep ? 'active' : 'future';
    if (el.dataset.journeyState !== state) {
      el.dataset.journeyState = state;
    }
  });
}

interface StoryJourneyProps {
  children: ReactNode;
}

export default function StoryJourney({ children }: StoryJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [pathReady, setPathReady] = useState(false);
  const activeStepRef = useRef(0);
  const isMountedRef = useRef(false);
  const stepRefs = useRef<Map<string, number>>(new Map());

  const registerStep = useCallback((id: string, index: number) => {
    stepRefs.current.set(id, index);
  }, []);

  const handleProgress = useCallback((p: number) => {
    if (railFillRef.current) {
      railFillRef.current.style.height = `${p * 100}%`;
    }
  }, []);

  const handleActiveStep = useCallback((step: number) => {
    if (!isMountedRef.current) return;
    if (step === activeStepRef.current) return;
    activeStepRef.current = step;
    setActiveStep(step);
    const container = containerRef.current;
    if (container) syncSectionStates(container, step);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    syncSectionStates(container, 0);

    let idleId: ReturnType<typeof setTimeout> | number;
    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(() => setPathReady(true), { timeout: 300 });
    } else {
      idleId = setTimeout(() => setPathReady(true), 150);
    }

    return () => {
      isMountedRef.current = false;
      if (typeof cancelIdleCallback !== 'undefined' && typeof idleId === 'number') {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId as ReturnType<typeof setTimeout>);
      }
    };
  }, []);

  return (
    <JourneyContext.Provider value={{ registerStep }}>
      <div ref={containerRef} className="nw-journey relative">
        {pathReady && (
          <NeuralJourneyPath
            containerRef={containerRef}
            activeStep={activeStep}
            onProgress={handleProgress}
            onActiveStep={handleActiveStep}
          />
        )}

        <aside
          className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:left-6 xl:left-10 xl:block"
          aria-hidden
        >
          <div className="relative flex flex-col items-center">
            <div className="nw-journey-rail h-[min(70vh,480px)] w-px bg-white/[0.06]">
              <div
                ref={railFillRef}
                className="nw-journey-rail-fill w-full origin-top bg-gradient-to-b from-blue-500 via-violet-500 to-cyan-400"
                style={{ height: 0 }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between py-1">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ring-2 transition-[transform,box-shadow,background-color] duration-300 ease-out ${
                      i <= activeStep
                        ? 'scale-125 bg-violet-400 ring-violet-400/40 shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                        : 'bg-[var(--nw-bg)] ring-white/10'
                    } ${i === activeStep ? 'scale-[1.3]' : ''}`}
                  />
                  <span
                    className={`whitespace-nowrap text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 ${
                      i === activeStep ? 'text-violet-300' : i < activeStep ? 'text-slate-600' : 'text-slate-700'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="relative z-[1]">{children}</div>
      </div>
    </JourneyContext.Provider>
  );
}

export { STEPS };
