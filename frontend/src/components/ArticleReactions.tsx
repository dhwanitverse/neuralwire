'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const REACTIONS = [
  { id: 'insightful', emoji: '💡', label: 'Insightful' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
] as const;

function getKey(articleId: string) {
  return `nw_reactions_${articleId}`;
}

export default function ArticleReactions({ articleId }: { articleId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({ insightful: 0, fire: 0, clap: 0 });
  const [userPick, setUserPick] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getKey(articleId));
      if (raw) {
        const data = JSON.parse(raw);
        setCounts(data.counts || counts);
        setUserPick(data.userPick || null);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const react = (id: string) => {
    const next = { ...counts };
    if (userPick === id) {
      next[id] = Math.max(0, (next[id] || 0) - 1);
      setUserPick(null);
      localStorage.setItem(getKey(articleId), JSON.stringify({ counts: next, userPick: null }));
      setCounts(next);
      return;
    }
    if (userPick) next[userPick] = Math.max(0, (next[userPick] || 0) - 1);
    next[id] = (next[id] || 0) + 1;
    setUserPick(id);
    setCounts(next);
    localStorage.setItem(getKey(articleId), JSON.stringify({ counts: next, userPick: id }));
    toast.success('Reaction added');
  };

  return (
    <div className="nw-glass rounded-2xl p-5">
      <p className="mb-3 text-sm font-semibold text-white">Was this article helpful?</p>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((r) => (
          <motion.button
            key={r.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => react(r.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all ${
              userPick === r.id
                ? 'border-violet-500/50 bg-violet-500/15 text-violet-200'
                : 'border-white/8 bg-white/5 text-slate-400 hover:border-white/15 hover:text-white'
            }`}
          >
            <span>{r.emoji}</span>
            <span>{r.label}</span>
            {(counts[r.id] || 0) > 0 && (
              <span className="rounded-full bg-white/10 px-1.5 text-xs">{counts[r.id]}</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
