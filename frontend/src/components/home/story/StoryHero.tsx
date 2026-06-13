'use client';

import { useRef, useState } from 'react';
import VaultBackground from '@/components/home/story/vault/VaultBackground';
import IntelligenceVault from '@/components/home/story/vault/IntelligenceVault';
import VaultCopy from '@/components/home/story/vault/VaultCopy';
import HeroScrollSignal from '@/components/home/story/HeroScrollSignal';
import { useVaultParallax } from '@/components/home/story/vault/useVaultParallax';

export default function StoryHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { innerX, innerY, glowX, glowY, sceneRotateX, sceneRotateY } = useVaultParallax(heroRef);
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      ref={heroRef}
      className="nw-vault-hero relative isolate flex min-h-[calc(100dvh-var(--site-header-offset,84px))] flex-col overflow-x-clip pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-12"
    >
      <VaultBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <IntelligenceVault
          innerX={innerX}
          innerY={innerY}
          glowX={glowX}
          glowY={glowY}
          sceneRotateX={sceneRotateX}
          sceneRotateY={sceneRotateY}
          onRevealed={() => setRevealed(true)}
        />

        <VaultCopy visible={revealed} />
      </div>

      {/* Signal beam — vault exit → journey path */}
      <HeroScrollSignal containerRef={heroRef} />

      <div
        className="nw-vault-journey-bridge pointer-events-none absolute bottom-[min(6vh,56px)] left-1/2 z-[5] -translate-x-1/2"
        aria-hidden
      >
        <span className="nw-vault-bridge-beam" />
      </div>
    </div>
  );
}
