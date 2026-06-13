'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Radar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cachedGet } from '@/lib/fetchCache';
import { Blog } from '@/types';
import BlogCard from '@/components/BlogCard';
import BlogCardSkeleton from '@/components/ui/BlogCardSkeleton';
import Newsletter from '@/components/Newsletter';
import PopularAuthors from '@/components/home/PopularAuthors';
import StoryJourney from '@/components/home/story/StoryJourney';
import JourneySection from '@/components/home/story/JourneySection';
import StoryHero from '@/components/home/story/StoryHero';
import BreakingNewsSection from '@/components/home/story/BreakingNewsSection';
import CategoriesPath from '@/components/home/story/CategoriesPath';
import StoryFinalCTA from '@/components/home/story/StoryFinalCTA';
import SectionHeader from '@/components/home/story/SectionHeader';
import FeaturedShowcase from '@/components/home/story/FeaturedShowcase';
import LatestArticles from '@/components/home/story/LatestArticles';
import { JourneyCard, JourneyStagger } from '@/components/home/story/JourneyMotion';
import ClientMount from '@/components/ui/ClientMount';

export default function HomePage() {
  const [all, setAll] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    cachedGet<Blog[]>('/blogs?limit=24')
      .then((data) => { if (!cancelled) setAll(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const breaking = useMemo(() => all.slice(0, 6), [all]);
  const trending = useMemo(() => [...all].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 8), [all]);
  const editorsPicks = useMemo(() => all.filter((b) => b.editorsPick).slice(0, 4), [all]);
  const latest = useMemo(() => all.slice(0, 6), [all]);
  const aiRadar = useMemo(() => all.filter((b) => b.category === 'Artificial Intelligence').slice(0, 4), [all]);
  const editorsShowcase = editorsPicks.length > 0 ? editorsPicks : latest.slice(0, 4);

  const scrollSlider = (dir: 'left' | 'right') => {
    sliderRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  return (
    <StoryJourney>
      <JourneySection step={0} id="journey-hero" glow="blue" isFirst compact>
        <StoryHero />
      </JourneySection>

      <JourneySection step={1} id="journey-breaking" glow="red">
        <SectionHeader
          eyebrow="Node 01 · Live signal"
          title="Breaking AI News"
          description="The stories moving markets, models, and minds — updated in real time as the intelligence network detects them."
          href="/blogs"
        />
        <JourneyStagger>
          <BreakingNewsSection items={breaking} loading={loading} />
        </JourneyStagger>
      </JourneySection>

      <JourneySection step={2} id="journey-trending" glow="cyan">
        <SectionHeader
          eyebrow="Node 02 · Momentum"
          title="Trending stories"
          description="What the technology world is reading right now."
          href="/blogs"
        />
        <JourneyStagger>
          <JourneyCard>
            <ClientMount
              fallback={
                <div className="mb-4 flex justify-end gap-2" aria-hidden>
                  <div className="h-9 w-9 rounded-xl border border-white/[0.08] bg-[var(--nw-card)]" />
                  <div className="h-9 w-9 rounded-xl border border-white/[0.08] bg-[var(--nw-card)]" />
                </div>
              }
            >
              <div className="mb-4 flex justify-end gap-2">
                <button type="button" onClick={() => scrollSlider('left')} className="rounded-xl border border-white/[0.08] bg-[var(--nw-card)] p-2 text-slate-400 hover:text-white" aria-label="Scroll left"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={() => scrollSlider('right')} className="rounded-xl border border-white/[0.08] bg-[var(--nw-card)] p-2 text-slate-400 hover:text-white" aria-label="Scroll right"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </ClientMount>
          </JourneyCard>
          <div ref={sliderRef} className="trending-scroll">
            {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-72 w-[300px] shrink-0 rounded-2xl" />)
              : trending.map((b) => (
                <JourneyCard key={b._id}>
                  <BlogCard blog={b} variant="trending" />
                </JourneyCard>
              ))}
          </div>
        </JourneyStagger>
      </JourneySection>

      <JourneySection step={3} id="journey-radar" glow="violet">
        <SectionHeader
          eyebrow="Node 03 · AI intelligence"
          title="AI Radar"
          description="Deep coverage on artificial intelligence — models, chips, policy, and the companies reshaping the field."
          href="/blogs"
        />
        <JourneyStagger>
          <JourneyCard>
            <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
              <Radar className="h-4 w-4 text-violet-400" />
              Scanning the AI landscape
            </div>
          </JourneyCard>
          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
              : (aiRadar.length > 0 ? aiRadar : latest.slice(0, 4)).map((b) => (
                <JourneyCard key={b._id}>
                  <BlogCard blog={b} variant="radar" />
                </JourneyCard>
              ))}
          </div>
        </JourneyStagger>
      </JourneySection>

      <JourneySection step={4} id="journey-editors" glow="amber">
        <SectionHeader
          eyebrow="Node 04 · Editorial"
          title="Editor's Picks"
          description="Highest-conviction stories from the NeuralWire editorial board."
        />
        {loading ? (
          <div className="skeleton min-h-[360px] rounded-3xl" />
        ) : (
          <JourneyStagger distance={40} direction={-1}>
            <FeaturedShowcase items={editorsShowcase} mode="editorial" />
          </JourneyStagger>
        )}
      </JourneySection>

      <JourneySection step={5} id="journey-domains" glow="violet">
        <SectionHeader
          eyebrow="Node 05 · The network"
          title="Technology domains"
          description="Six verticals. One connected path. Each node a gateway into curated intelligence."
        />
        <JourneyStagger>
          <CategoriesPath />
        </JourneyStagger>
      </JourneySection>

      <JourneySection step={6} id="journey-latest" glow="blue">
        <SectionHeader
          eyebrow="Node 06 · Fresh signal"
          title="Latest articles"
          description="New intelligence as it lands — analysis, reporting, and insight from across the network."
          href="/blogs"
        />
        {loading ? (
          <div className="space-y-4 pl-9 sm:pl-12">
            <div className="skeleton min-h-[200px] rounded-2xl" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-[92px] rounded-xl" />
            ))}
          </div>
        ) : (
          <JourneyStagger distance={36}>
            <LatestArticles blogs={latest} />
          </JourneyStagger>
        )}
      </JourneySection>

      <JourneySection step={7} id="journey-voices" glow="violet">
        <SectionHeader
          eyebrow="Node 07 · Voices"
          title="Popular authors"
          description="The analysts, engineers, and journalists defining technology media."
        />
        <JourneyStagger>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-40 rounded-2xl" />
              ))}
            </div>
          ) : (
            <PopularAuthors blogs={all} />
          )}
        </JourneyStagger>
      </JourneySection>

      <JourneySection step={8} id="journey-newsletter" glow="cyan">
        <SectionHeader
          eyebrow="Node 08 · Community"
          title="Intelligence briefing"
          description="50,000+ leaders start their day with NeuralWire. Subscribe for signal, not noise."
        />
        <JourneyStagger>
          <Newsletter embedded />
        </JourneyStagger>
      </JourneySection>

      <JourneySection step={9} id="journey-join" glow="violet" isLast className="pb-32">
        <StoryFinalCTA />
      </JourneySection>
    </StoryJourney>
  );
}
