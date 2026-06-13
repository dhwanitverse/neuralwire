import Image from 'next/image';
import { Code2, Users, Lightbulb, Rocket } from 'lucide-react';
import Newsletter from '@/components/Newsletter';

const values = [
  { icon: Code2, title: 'Deep Technical Content', desc: 'No fluff — just rigorous analysis and actionable tutorials.', gradient: 'from-indigo-500 to-violet-600' },
  { icon: Users, title: 'Global Community', desc: 'Writers and readers from 40+ countries sharing knowledge.', gradient: 'from-violet-500 to-purple-600' },
  { icon: Lightbulb, title: 'Future-Focused', desc: 'AI, cloud, security — we cover what matters next.', gradient: 'from-cyan-500 to-blue-600' },
  { icon: Rocket, title: 'Built for Builders', desc: 'Content designed for developers who ship products.', gradient: 'from-orange-500 to-red-500' },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero-mesh grid-pattern relative overflow-hidden pb-20 pt-10 sm:pt-12">
        <div className="glow-orb left-1/3 top-0 h-72 w-72 bg-indigo-600/30" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">About Us</p>
          <h1 className="font-display mt-3 text-5xl font-bold text-white">Neural<span className="gradient-text">Wire</span></h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            We&apos;re building the definitive platform for AI and technology journalism — where expert voices
            meet beautiful storytelling.
          </p>
        </div>
      </section>

      <section className="bg-[#0b1120] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
              <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop" alt="Team" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Our mission</h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                Technology moves fast. We help you move with it — through in-depth articles, expert
                tutorials, and analysis that cuts through the noise. NeuralWire is where curious minds
                come to understand the systems shaping our world.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[['100+', 'Articles'], ['5K+', 'Readers'], ['8', 'Topics'], ['24/7', 'Access']].map(([n, l]) => (
                  <div key={l} className="glass-card rounded-2xl p-4 text-center">
                    <p className="font-display text-2xl font-bold text-indigo-400">{n}</p>
                    <p className="text-xs text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card-lift glass-card rounded-2xl p-6">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${v.gradient}`}>
                  <v.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
