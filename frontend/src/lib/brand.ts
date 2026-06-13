export const BRAND = {
  name: 'NeuralWire',
  tagline: 'Breaking AI, Technology & Innovation News',
  heroSubheadline:
    'Breaking AI, technology, startup, cybersecurity, software, and innovation stories in one intelligent platform.',
  description:
    'Premium technology journalism covering AI, startups, engineering, cybersecurity, and the future of innovation.',
} as const;

export const DISPLAY_CATEGORIES = [
  { label: 'AI', query: 'Artificial Intelligence', icon: '🧠', gradient: 'from-violet-600 to-purple-600' },
  { label: 'Startups', query: 'Tech News', icon: '🚀', gradient: 'from-orange-500 to-rose-500' },
  { label: 'Programming', query: 'Programming', icon: '⚡', gradient: 'from-amber-500 to-yellow-500' },
  { label: 'Cybersecurity', query: 'Cyber Security', icon: '🔒', gradient: 'from-red-500 to-rose-600' },
  { label: 'Cloud', query: 'Cloud Computing', icon: '☁️', gradient: 'from-sky-500 to-blue-600' },
  { label: 'Mobile', query: 'Mobile Apps', icon: '📱', gradient: 'from-emerald-500 to-teal-500' },
  { label: 'Web Development', query: 'Web Development', icon: '🌐', gradient: 'from-blue-500 to-indigo-600' },
  { label: 'Machine Learning', query: 'Artificial Intelligence', icon: '🤖', gradient: 'from-cyan-500 to-violet-500' },
] as const;

export const AUTHOR_PROFILES: Record<
  string,
  { bio: string; title: string; twitter?: string; linkedin?: string }
> = {
  'Sarah Chen': {
    title: 'Senior AI Correspondent',
    bio: 'Covers OpenAI, Anthropic, Google DeepMind, and the frontier of artificial intelligence.',
    twitter: '#',
    linkedin: '#',
  },
  'Marcus Webb': {
    title: 'Web Development Editor',
    bio: 'Full-stack engineer turned journalist. Writes about React, Next.js, and modern web architecture.',
    twitter: '#',
    linkedin: '#',
  },
  'Priya Sharma': {
    title: 'Cybersecurity Analyst',
    bio: 'Former penetration tester reporting on threats, zero-days, and enterprise security.',
    twitter: '#',
    linkedin: '#',
  },
  'James Okafor': {
    title: 'Cloud & Infrastructure Reporter',
    bio: 'Tracks AWS, Azure, GCP, and the infrastructure powering the AI revolution.',
    twitter: '#',
    linkedin: '#',
  },
  'Elena Vasquez': {
    title: 'Programming Staff Writer',
    bio: 'Deep dives into languages, frameworks, and the craft of software engineering.',
    twitter: '#',
    linkedin: '#',
  },
  'David Kim': {
    title: 'Hardware & Gadgets Editor',
    bio: 'Reviews chips, devices, and the hardware stack behind modern computing.',
    twitter: '#',
    linkedin: '#',
  },
  'Rachel Torres': {
    title: 'Startups & Venture Reporter',
    bio: 'Covers funding rounds, founder stories, and the startup ecosystem.',
    twitter: '#',
    linkedin: '#',
  },
  'Alex Morgan': {
    title: 'Editor in Chief',
    bio: 'Leads editorial strategy at NeuralWire with 15 years in technology journalism.',
    twitter: '#',
    linkedin: '#',
  },
};
