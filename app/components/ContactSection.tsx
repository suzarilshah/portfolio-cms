'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, ArrowRight, Linkedin, Github, Twitter, Globe, Send, CheckCircle, AlertCircle, User, MessageSquare } from 'lucide-react';

const defaultContact = {
  bookingUrl: 'https://suzarilshah.youcanbook.me',
  email: 'shah@suzarilshah.uk',
  linkedin: 'https://linkedin.com/in/suzarilshah',
  github: 'https://github.com/suzarilshah',
  twitter: 'https://x.com/suzarilshah',
  website: 'https://blog.suzarilshah.uk/'
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection({ content }: { content?: any }) {
  const bookingUrl = content?.bookingUrl || defaultContact.bookingUrl;
  const email = content?.email || defaultContact.email;
  const linkedin = content?.linkedin || defaultContact.linkedin;
  const github = content?.github || defaultContact.github;
  const twitter = content?.twitter || defaultContact.twitter;
  const website = content?.website || defaultContact.website;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Send via mailto as fallback (opens email client)
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(formData.subject || 'Contact from Portfolio')}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;

      window.location.href = mailtoLink;
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">Let's Collaborate</h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Whether you're interested in discussing cloud architecture, AI solutions,
            or community building, I'm always open to connecting.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary-600" />
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none text-sm"
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all text-sm ${
                  status === 'success'
                    ? 'bg-green-600 text-white'
                    : status === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-primary-600 hover:shadow-lg'
                } disabled:opacity-70`}
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle size={18} />
                    Message Ready!
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle size={18} />
                    Try Again
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Quick Actions & Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Book a Session */}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-2xl bg-primary-50 hover:bg-primary-100 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center text-primary-600 transition-colors flex-shrink-0">
                  <Calendar size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Book a Session</h3>
                  <p className="text-sm text-slate-600 mb-2">Schedule a 1-on-1 meeting for technical consultation or mentorship.</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary-700 group-hover:translate-x-1 transition-transform">
                    Schedule Now <ArrowRight size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            </a>

            {/* Direct Email */}
            <a
              href={`mailto:${email}`}
              className="group block p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 group-hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Email Directly</h3>
                  <p className="text-sm text-slate-600 mb-2">For speaking opportunities or general inquiries.</p>
                  <span className="inline-flex items-center text-sm font-medium text-slate-700 group-hover:translate-x-1 transition-transform">
                    {email} <ArrowRight size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            </a>

            {/* Social Links */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Connect on Social</h4>
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, href: linkedin, label: 'LinkedIn', color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200' },
                  { icon: Github, href: github, label: 'GitHub', color: 'hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300' },
                  { icon: Twitter, href: twitter, label: 'Twitter', color: 'hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200' },
                  { icon: Globe, href: website, label: 'Blog', color: 'hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className={`p-3 rounded-xl bg-white border border-slate-200 text-slate-500 transition-all ${social.color}`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
