'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Briefcase, Award, BookOpen, Users, Mail } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Awards', href: '#awards', icon: Award },
  { name: 'Publications', href: '#publications', icon: BookOpen },
  { name: 'Community', href: '#community', icon: Users },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export default function Navigation({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const logoText = settings?.logo_text || 'SUZARIL';
  const logoHighlight = settings?.logo_highlight || 'SHAH';
  const logoUrl = settings?.logo_url;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.slice(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    // Check if any project modal is open
    const checkModalOpen = () => {
      const modals = document.querySelectorAll('.project-modal');
      const isModalOpen = Array.from(modals).some(modal => {
        // Check if modal has :target pseudo-class by checking computed style
        // or by checking if URL hash matches modal ID
        const hash = window.location.hash;
        return hash && modal.id === hash.slice(1);
      });
      return isModalOpen;
    };

    window.addEventListener('scroll', handleScroll);

    // Listen for hash changes (when modal opens/closes)
    const handleHashChange = () => {
      const isOpen = checkModalOpen();
      document.body.classList.toggle('modal-open', isOpen);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check on mount
    handleHashChange();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6`}
      >
        <div className={`max-w-5xl mx-auto rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border border-slate-200/50 py-3 px-6' 
            : 'bg-white/50 backdrop-blur-sm border border-transparent py-4 px-6'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="relative z-50 group">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="font-display font-bold text-xl tracking-tight flex items-center gap-1">
                  <span className="text-slate-900 group-hover:text-primary-600 transition-colors">{logoText}</span>
                  <span className="text-primary-600 group-hover:text-slate-900 transition-colors">{logoHighlight}</span>
                </div>
              )}
            </a>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-full hover:bg-slate-100 text-slate-900 transition-colors touch-target"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl border-l border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2 p-4 mt-20">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 touch-target ${
                      activeSection === item.href.slice(1)
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
