'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionFrame';

const education = [
  {
    degree: 'Master of Information Technology',
    institution: 'Universiti Kuala Lumpur (UniKL)',
    period: '2023 - 2025',
    specialization: 'Smart Agriculture & AI',
    details: 'Research on Automated Aquaponics Systems using Azure AI',
    icon: GraduationCap
  },
  {
    degree: 'Bachelor of Computer Engineering Technology (Networking Systems)',
    institution: 'Universiti Kuala Lumpur (UniKL)',
    period: '2018 - 2022',
    specialization: 'Networking & Systems',
    details: 'First Class Honours',
    icon: BookOpen
  },
  {
    degree: 'Foundation in Science and Technology',
    institution: 'Universiti Kuala Lumpur (UniKL)',
    period: '2017 - 2018',
    specialization: 'Computer Science Fundamentals',
    details: 'Dean\'s List',
    icon: Award
  }
];

export default function EducationSection({ content, index }: { content?: any; index?: number }) {
  const educationList = content?.items || education;
  const title = content?.title || "Academic Foundation";

  return (
    <section id="education" className="scroll-mt-28 py-20 sm:py-24">
      <div className="river">
        <SectionHeading
          index={index}
          title={title}
          standfirst={
            content?.subtitle ||
            'Theoretical computer science and practical engineering, with research as a pillar rather than an afterthought.'
          }
        />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Header Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Research Focus</h3>
              <p className="text-slate-600 text-sm md:text-base">
                Currently exploring the intersection of IoT and Artificial Intelligence 
                in sustainable agriculture systems, utilizing Azure Cloud infrastructure.
              </p>
            </div>
          </motion.div>

          {/* List Column */}
          <div className="space-y-6">
            {educationList.map((edu: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <GraduationCap size={24} />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-primary-600 mb-1 block">{edu.period || edu.year}</span>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-1">{edu.degree}</h3>
                  <p className="text-slate-700 font-medium mb-2">{edu.institution || edu.school}</p>
                  <p className="text-slate-500 text-sm">{edu.details || edu.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
