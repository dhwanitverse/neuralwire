'use client';

import { Parallax } from '@/components/home/story/Parallax';
import { useLightMotion } from '@/components/home/story/useLightMotion';

export default function MissionControlBackground() {
  const light = useLightMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="nw-mission-bg-base absolute inset-0" />
      <div className="nw-mission-world-grid absolute inset-0" />
      <Parallax className="absolute -inset-y-16 inset-x-0" distance={light ? 0 : 40}>
        <div className="nw-mission-aurora nw-mission-aurora-a" />
        <div className="nw-mission-aurora nw-mission-aurora-b" />
        <div className="nw-mission-aurora nw-mission-aurora-c" />
      </Parallax>
      <div className="nw-mission-scanlines absolute inset-0 opacity-[0.04]" />
      <div className="nw-mission-noise absolute inset-0" />
      <div className="nw-mission-vignette absolute inset-0" />
    </div>
  );
}
