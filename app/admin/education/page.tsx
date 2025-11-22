'use client';

import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2 } from 'lucide-react';

interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  specialization: string;
  details: string;
}

interface EducationContent {
  title: string;
  items: EducationItem[];
}

const defaultEducation: EducationContent = {
  title: "Academic Foundation",
  items: [
    {
      degree: 'Master of Information Technology',
      institution: 'Universiti Kuala Lumpur (UniKL)',
      period: '2023 - 2025',
      specialization: 'Smart Agriculture & AI',
      details: 'Research on Automated Aquaponics Systems using Azure AI'
    },
    {
      degree: 'Bachelor of Computer Engineering Technology (Networking Systems)',
      institution: 'Universiti Kuala Lumpur (UniKL)',
      period: '2018 - 2022',
      specialization: 'Networking & Systems',
      details: 'First Class Honours'
    },
    {
      degree: 'Foundation in Science and Technology',
      institution: 'Universiti Kuala Lumpur (UniKL)',
      period: '2017 - 2018',
      specialization: 'Computer Science Fundamentals',
      details: 'Dean\'s List'
    }
  ]
};

export default function EducationPage() {
  return (
    <SectionEditor<EducationContent>
      sectionKey="education"
      title="Education Section"
      description="Manage your academic background."
      defaultContent={defaultEducation}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Section Title</label>
            <input 
              type="text" 
              value={content.title} 
              onChange={(e) => onChange({ ...content, title: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Academic History</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  items: [
                    { degree: 'New Degree', institution: 'University', period: '2025', specialization: '', details: '' },
                    ...(content.items || [])
                  ]
                })}
                className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>

            <div className="grid gap-4">
                {content.items?.map((item, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:border-blue-200 transition-colors">
                    <button 
                    onClick={() => {
                        const newItems = [...content.items];
                        newItems.splice(index, 1);
                        onChange({ ...content, items: newItems });
                    }}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                    >
                    <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Degree</label>
                                <input 
                                type="text" 
                                value={item.degree} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].degree = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Institution</label>
                                <input 
                                type="text" 
                                value={item.institution} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].institution = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Period</label>
                                <input 
                                type="text" 
                                value={item.period} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].period = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Specialization</label>
                                <input 
                                type="text" 
                                value={item.specialization} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].specialization = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Details / Honors</label>
                                <textarea 
                                value={item.details} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].details = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm h-20 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
