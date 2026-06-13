'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, MapPin, Phone, Send, User, MessageSquare } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email) errs.email = 'Required';
    if (!form.subject.trim()) errs.subject = 'Required';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success('Message sent! We\'ll reply within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const info = [
    { icon: Mail, label: 'Email', value: 'hello@techblog.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: MapPin, label: 'Office', value: 'San Francisco, CA' },
  ];

  return (
    <>
      <section className="hero-mesh grid-pattern relative overflow-hidden pb-16 pt-10 sm:pt-12">
        <div className="glow-orb right-1/4 top-0 h-64 w-64 bg-violet-600/25" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Contact</p>
          <h1 className="font-display mt-2 text-4xl font-bold text-white sm:text-5xl">Let&apos;s talk</h1>
          <p className="mt-4 text-slate-400">Questions, partnerships, or feedback — we&apos;re all ears.</p>
        </div>
      </section>

      <section className="bg-[#0b1120] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              {info.map((item) => (
                <div key={item.label} className="glass-card card-lift flex items-center gap-4 rounded-2xl p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="glass-form space-y-5 rounded-2xl p-8 lg:col-span-3">
              <div className="mb-2 flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                <h2 className="font-display font-bold text-white">Send a message</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label="Name" icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
                <InputField label="Email" type="email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
              </div>
              <InputField label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} error={errors.subject} />
              <InputField as="textarea" label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} rows={6} />
              <Button type="submit" loading={loading} size="lg"><Send className="h-4 w-4" /> Send Message</Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
