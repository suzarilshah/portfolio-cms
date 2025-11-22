'use client';

import { motion } from 'framer-motion';
import { Mail, Calendar, ArrowRight, Linkedin, Github, Twitter, Globe } from 'lucide-react';

const defaultContact = {
  bookingUrl: 'https://suzarilshah.youcanbook.me',
  email: 'shah@suzarilshah.uk',
  linkedin: 'https://linkedin.com/in/suzarilshah',
  github: 'https://github.com/suzarilshah',
  twitter: 'https://x.com/suzarilshah',
  website: 'https://blog.suzarilshah.uk/'
};

export default function ContactSection({ content }: { content?: any }) {
  const bookingUrl = content?.bookingUrl || defaultContact.bookingUrl;
  const email = content?.email || defaultContact.email;
  const linkedin = content?.linkedin || defaultContact.linkedin;
  const github = content?.github || defaultContact.github;
  const twitter = content?.twitter || defaultContact.twitter;
  const website = content?.website || defaultContact.website;

  return (
    <section id="contact" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-6">Let's Collaborate</h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Whether you're interested in discussing cloud architecture, AI solutions, 
            or community building, I'm always open to connecting.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <a 
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className="group p-8 rounded-2xl bg-primary-50 hover:bg-primary-100 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center text-primary-600 mb-6 transition-colors">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book a Session</h3>
              <p className="text-slate-600 mb-4">Schedule a 1-on-1 meeting to discuss technical consultation or mentorship.</p>
              <span className="inline-flex items-center font-medium text-primary-700 group-hover:translate-x-1 transition-transform">
                Schedule Now <ArrowRight size={16} className="ml-2" />
              </span>
            </a>

            <a 
              href={`mailto:${email}`}
              className="group p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 mb-6 transition-colors">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Me</h3>
              <p className="text-slate-600 mb-4">Drop me a line for speaking opportunities or general inquiries.</p>
              <span className="inline-flex items-center font-medium text-slate-900 group-hover:translate-x-1 transition-transform">
                Send Email <ArrowRight size={16} className="ml-2" />
              </span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {[
              { icon: Linkedin, href: linkedin },
              { icon: Github, href: github },
              { icon: Twitter, href: twitter },
              { icon: Globe, href: website }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-200 hover:shadow-md transition-all"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
