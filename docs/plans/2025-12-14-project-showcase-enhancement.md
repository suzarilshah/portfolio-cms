# Project Showcase Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add URL snapshot capture and thumbnail upload functionality to Project Showcase section with enterprise-grade $100B portfolio design system

**Architecture:**
- Extend existing PostgreSQL projects table with URL and thumbnail fields
- Create URL snapshot API endpoint using screenshot service
- Integrate Appwrite storage for thumbnail uploads
- Apply premium design system with smooth animations and micro-interactions
- Maintain existing CRUD functionality with enhanced UX

**Tech Stack:** Next.js 14, TypeScript, PostgreSQL, Appwrite, Framer Motion, Tailwind CSS

---

## Task 1: Database Schema Enhancement

**Files:**
- Create: `scripts/migrate-project-urls-thumbnails.js`
- Modify: `lib/security/validation.ts:100-150`

**Step 1: Create database migration script**

Write: `scripts/migrate-project-urls-thumbnails.js`

```javascript
const pool = require('../lib/db-script');

async function migrate() {
  try {
    console.log('Starting migration: Add URL and thumbnail fields to projects table...');

    // Add URL and thumbnail columns
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS project_url TEXT,
      ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
      ADD COLUMN IF NOT EXISTS snapshot_url TEXT,
      ADD COLUMN IF NOT EXISTS has_snapshot BOOLEAN DEFAULT FALSE;
    `);

    console.log('✅ Added URL and thumbnail columns to projects table');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
```

**Step 2: Run migration**

Run: `node scripts/migrate-project-urls-thumbnails.js`
Expected: "✅ Added URL and thumbnail columns to projects table"

**Step 3: Update SecurityValidator for new fields**

Modify: `lib/security/validation.ts:100-150`

Add after existing category validation:

```typescript
// Project URL validation
if (data.project_url) {
  if (typeof data.project_url !== 'string' || data.project_url.length > 500) {
    errors.push('Project URL must be a string with max 500 characters');
  } else {
    sanitized.project_url = this.sanitizeHtml(data.project_url.trim());
  }
}

// Thumbnail URL validation
if (data.thumbnail_url) {
  if (typeof data.thumbnail_url !== 'string' || data.thumbnail_url.length > 1000) {
    errors.push('Thumbnail URL must be a string with max 1000 characters');
  } else {
    sanitized.thumbnail_url = this.sanitizeHtml(data.thumbnail_url.trim());
  }
}

// Snapshot URL validation
if (data.snapshot_url) {
  if (typeof data.snapshot_url !== 'string' || data.snapshot_url.length > 1000) {
    errors.push('Snapshot URL must be a string with max 1000 characters');
  } else {
    sanitized.snapshot_url = this.sanitizeHtml(data.snapshot_url.trim());
  }
}
```

**Step 4: Commit**

```bash
git add scripts/migrate-project-urls-thumbnails.js lib/security/validation.ts
git commit -m "feat: add URL and thumbnail fields to projects table"
```

---

## Task 2: Update Projects API with New Fields

**Files:**
- Modify: `app/api/cms/projects/route.ts:34-43`

**Step 1: Update POST endpoint**

Modify: `app/api/cms/projects/route.ts:34-43`

Replace INSERT statement:

```typescript
const result = await secureDb.query(
  `INSERT INTO projects (title, tagline, challenge, solution, impact, technologies, category, icon_name, year, link, project_url, thumbnail_url, snapshot_url, has_snapshot)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
   RETURNING *`,
  [
    sanitized.title, sanitized.tagline, sanitized.challenge, sanitized.solution,
    JSON.stringify(sanitized.impact), JSON.stringify(sanitized.technologies),
    sanitized.category, sanitized.icon_name, sanitized.year, sanitized.link,
    sanitized.project_url || null, sanitized.thumbnail_url || null,
    sanitized.snapshot_url || null, sanitized.has_snapshot || false
  ]
);
```

**Step 2: Update PUT endpoint**

Modify: `app/api/cms/projects/route.ts:75-88`

Replace fields mapping:

```typescript
const fields = Object.keys(sanitized).filter(key => key !== 'id').map((key, i) => {
  if (key === 'impact' || key === 'technologies') {
    return `${key} = $${i + 2}::jsonb`;
  }
  return `${key} = $${i + 2}`;
});
```

Ensure `project_url`, `thumbnail_url`, `snapshot_url`, and `has_snapshot` are included in sanitized object.

**Step 3: Commit**

```bash
git add app/api/cms/projects/route.ts
git commit -m "feat: update projects API to handle URL and thumbnail fields"
```

---

## Task 3: Create URL Snapshot API Endpoint

**Files:**
- Create: `app/api/cms/projects/snapshot/route.ts`

**Step 1: Create snapshot API**

Write: `app/api/cms/projects/snapshot/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { stackServerApp } from '@/stack';
import { createSecureAPIHandler } from '@/lib/security/middleware';

export const POST = createSecureAPIHandler(async (request: Request) => {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { project_id, url } = await request.json();

    if (!url || !/^https?:\/\//.test(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Use screenshot API service (e.g., screenshotapi.net, urlbox.io, or screenshotlayer.com)
    const screenshotApiKey = process.env.SCREENSHOT_API_KEY;
    const screenshotApiUrl = process.env.SCREENSHOT_API_URL || 'https://api.screenshotapi.net/screen';

    const screenshotUrl = `${screenshotApiUrl}?url=${encodeURIComponent(url)}&token=${screenshotApiKey}&width=1200&height=630&output=image&file_type=png`;

    // Update project with snapshot URL
    await secureDb.query(
      `UPDATE projects SET snapshot_url = $1, has_snapshot = TRUE, updated_at = NOW() WHERE id = $2`,
      [screenshotUrl, project_id]
    );

    return NextResponse.json({ snapshot_url: screenshotUrl, success: true });
  } catch (error) {
    console.error('Snapshot error:', error);
    return NextResponse.json({ error: 'Failed to capture snapshot' }, { status: 500 });
  }
}, { requireAuth: false });
```

**Step 2: Test API endpoint**

Run: `curl -X POST http://localhost:3000/api/cms/projects/snapshot -H "Content-Type: application/json" -d '{"project_id":1,"url":"https://example.com"}'`
Expected: JSON response with snapshot_url

**Step 3: Commit**

```bash
git add app/api/cms/projects/snapshot/route.ts
git commit -m "feat: add URL snapshot capture API endpoint"
```

---

## Task 4: Create Thumbnail Upload API

**Files:**
- Create: `app/api/cms/projects/upload/route.ts`

**Step 1: Create upload API**

Write: `app/api/cms/projects/upload/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { createSecureAPIHandler } from '@/lib/security/middleware';
import { createAdminClient } from '@appwrite.io/appwrite';

export const POST = createSecureAPIHandler(async (request: Request) => {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('project_id') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or project_id' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Initialize Appwrite client
    const client = createAdminClient({
      endpoint: process.env.APPWRITE_ENDPOINT!,
      projectId: process.env.APPWRITE_PROJECT_ID!,
    });

    // Upload to Appwrite Storage
    const response = await client.storage.createFile(
      process.env.APPWRITE_BUCKET_ID!,
      'unique()',
      file
    );

    // Get file preview URL
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${response.$id}/preview`;

    return NextResponse.json({ thumbnail_url: fileUrl, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}, { requireAuth: false });
```

**Step 2: Test upload API**

Run: Test with Postman or curl with multipart/form-data
Expected: JSON response with thumbnail_url

**Step 3: Commit**

```bash
git add app/api/cms/projects/upload/route.ts
git commit -m "feat: add thumbnail upload API with Appwrite"
```

---

## Task 5: Enhance Main Page Project Showcase

**Files:**
- Modify: `components/ProjectsShowcase.tsx:1-50`
- Modify: `components/ProjectsShowcase.tsx:160-200`

**Step 1: Update Project interface**

Modify: `components/ProjectsShowcase.tsx:20-35`

Add new fields:

```typescript
interface Project {
  title: string;
  tagline: string;
  challenge: string;
  solution: string;
  impact: {
    metric: string;
    value: string;
  }[];
  technologies: string[];
  category: string;
  icon: React.ReactNode;
  icon_name?: string;
  year: string;
  link?: string;
  project_url?: string;
  thumbnail_url?: string;
  snapshot_url?: string;
  has_snapshot?: boolean;
}
```

**Step 2: Add snapshot/thumbnail display**

Modify: `components/ProjectsShowcase.tsx:160-200`

Add after project header (after line 199):

```typescript
{(project.thumbnail_url || project.snapshot_url) && (
  <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">
    <img
      src={project.thumbnail_url || project.snapshot_url}
      alt={`${project.title} preview`}
      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  </div>
)}
```

**Step 3: Add preview button**

Modify: `components/ProjectsShowcase.tsx:188-199`

Add before closing project header div:

```typescript
{(project.project_url || project.link) && (
  <a
    href={project.project_url || project.link}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl"
  >
    <span className="font-medium">Live Preview</span>
    <ExternalLink className="w-4 h-4" />
  </a>
)}
```

**Step 4: Update fallback projects with URLs**

Modify: `components/ProjectsShowcase.tsx:106-124`

Add URLs to fallbackProjects array.

**Step 5: Commit**

```bash
git add components/ProjectsShowcase.tsx
git commit -m "feat: enhance project showcase with URL snapshots and thumbnails"
```

---

## Task 6: Enhance Admin CRUD Interface

**Files:**
- Modify: `app/admin/projects/page.tsx:6-35`
- Modify: `app/admin/projects/page.tsx:280-370`

**Step 1: Update Project interface**

Modify: `app/admin/projects/page.tsx:6-20`

Add new fields:

```typescript
interface Project {
    id?: number;
    title: string;
    tagline: string;
    challenge: string;
    solution: string;
    impact: { metric: string; value: string }[];
    technologies: string[];
    category: string;
    icon_name: string;
    year: string;
    link: string;
    project_url?: string;
    thumbnail_url?: string;
    snapshot_url?: string;
    has_snapshot?: boolean;
    updated_at?: string;
}
```

**Step 2: Add state for upload and snapshot**

Modify: `app/admin/projects/page.tsx:40-50`

Add after existing state:

```typescript
const [snapshotLoading, setSnapshotLoading] = useState(false);
const [uploadLoading, setUploadLoading] = useState(false);
```

**Step 3: Add URL input fields**

Modify: `app/admin/projects/page.tsx:345-370`

Add after icon selection:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="text-sm font-medium">Project URL</label>
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-slate-400" />
      <input type="text" className="w-full border p-2 rounded-lg" placeholder="https://your-project-url.com"
        value={formData.project_url || ''} onChange={e => setFormData({...formData, project_url: e.target.value})} />
    </div>
  </div>
  <div className="space-y-2">
    <label className="text-sm font-medium">Thumbnail URL</label>
    <div className="flex items-center gap-2">
      <ImageIcon size={16} className="text-slate-400" />
      <input type="text" className="w-full border p-2 rounded-lg" placeholder="Auto-filled on upload"
        value={formData.thumbnail_url || ''} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} readOnly />
    </div>
  </div>
</div>
```

**Step 4: Add snapshot and upload buttons**

Modify: `app/admin/projects/page.tsx:370-382`

Add before form submit buttons:

```typescript
<div className="flex gap-3 pt-4 border-t">
  {formData.project_url && (
    <button
      type="button"
      onClick={async () => {
        if (!editingId) {
          alert('Save project first before capturing snapshot');
          return;
        }
        setSnapshotLoading(true);
        try {
          const res = await fetch('/api/cms/projects/snapshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: editingId, url: formData.project_url })
          });
          const data = await res.json();
          if (data.snapshot_url) {
            setFormData({ ...formData, snapshot_url: data.snapshot_url, has_snapshot: true });
            alert('Snapshot captured successfully!');
          }
        } catch (e) {
          alert('Failed to capture snapshot');
        } finally {
          setSnapshotLoading(false);
        }
      }}
      disabled={snapshotLoading}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
    >
      {snapshotLoading && <Loader2 size={16} className="animate-spin" />}
      <Camera size={16} /> Capture Snapshot
    </button>
  )}

  <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer">
    {uploadLoading && <Loader2 size={16} className="animate-spin" />}
    <Upload size={16} /> Upload Thumbnail
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file || !editingId) {
          if (!editingId) alert('Save project first before uploading thumbnail');
          return;
        }
        setUploadLoading(true);
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('project_id', editingId.toString());
          const res = await fetch('/api/cms/projects/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.thumbnail_url) {
            setFormData({ ...formData, thumbnail_url: data.thumbnail_url });
            alert('Thumbnail uploaded successfully!');
          }
        } catch (e) {
          alert('Failed to upload thumbnail');
        } finally {
          setUploadLoading(false);
        }
      }}
    />
  </label>
</div>
```

**Step 5: Import new icons**

Modify: `app/admin/projects/page.tsx:1-5`

Add imports:

```typescript
import { Save, Loader2, Plus, Trash2, Edit2, ExternalLink, Code, Cloud, Zap, Server, Globe, History, RotateCcw, Camera, Upload, ImageIcon } from 'lucide-react';
```

**Step 6: Commit**

```bash
git add app/admin/projects/page.tsx
git commit -m "feat: enhance admin CRUD with URL snapshots and thumbnail upload"
```

---

## Task 7: Apply $100B Design System to Main Page

**Files:**
- Modify: `components/ProjectsShowcase.tsx:128-170`
- Modify: `components/ProjectsShowcase.tsx:200-250`

**Step 1: Enhance section header with premium design**

Modify: `components/ProjectsShowcase.tsx:132-151`

Replace with:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="text-center mb-20"
>
  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-500/10 to-purple-500/10 text-primary-700 rounded-full mb-6 backdrop-blur-sm border border-primary-200/50">
    <Award className="w-5 h-5" />
    <span className="font-mono text-sm font-bold uppercase tracking-widest">
      Featured Work
    </span>
    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
  </div>
  <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tight">
    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
      Projects &
    </span>
    <br />
    <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent">
      Case Studies
    </span>
  </h2>
  <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
    Real-world cloud architecture, DevOps transformations, and IoT solutions
    <br />
    <span className="text-primary-600 font-semibold">driving measurable business impact</span>
  </p>
</motion.div>
```

**Step 2: Enhance project cards with premium animations**

Modify: `components/ProjectsShowcase.tsx:162-170`

Replace with:

```typescript
<motion.div
  key={index}
  variants={itemVariants}
  className="group relative bg-gradient-to-br from-white via-slate-50/30 to-white rounded-3xl p-8 md:p-12 hover:bg-white hover:shadow-2xl transition-all duration-700 border border-slate-100/50 hover:border-primary-200/50 overflow-hidden"
>
  {/* Animated gradient background */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

  {/* Floating particles effect */}
  <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-float" />
```

**Step 3: Enhance project header with premium styling**

Modify: `components/ProjectsShowcase.tsx:170-190`

Replace with:

```typescript
<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
  <div className="flex-1">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
        {project.icon}
      </div>
      <div>
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 text-xs font-bold rounded-full mb-3 border border-primary-200/50">
          {project.category}
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
        </span>
        <p className="text-sm text-slate-500 font-mono font-semibold">{project.year}</p>
      </div>
    </div>
    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
      {project.title}
    </h3>
    <p className="text-xl text-primary-600 font-bold">
      {project.tagline}
    </p>
  </div>
```

**Step 4: Add CSS animations**

Modify: `components/ProjectsShowcase.tsx:1`

Add to top of file:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Award,
  TrendingUp,
  Users,
  Cloud,
  Container,
  Cpu,
  Network,
  Zap,
  Code,
  Server,
  Globe
} from 'lucide-react';

// Add to your global CSS or component
const floatKeyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;
```

**Step 5: Commit**

```bash
git add components/ProjectsShowcase.tsx
git commit -m "design: apply $100B design system to main page showcase"
```

---

## Task 8: Apply $100B Design System to Admin Interface

**Files:**
- Modify: `app/admin/projects/page.tsx:169-220`
- Modify: `app/admin/projects/page.tsx:278-320`

**Step 1: Enhance admin page header**

Modify: `app/admin/projects/page.tsx:171-185`

Replace with:

```typescript
<div className="flex gap-1 bg-gradient-to-r from-slate-100 to-slate-200 p-1.5 rounded-2xl w-fit mb-12 shadow-inner">
  <button
    onClick={() => setActiveTab('projects')}
    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'projects' ? 'bg-white text-slate-900 shadow-lg transform scale-105' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
  >
    <span className="flex items-center gap-2">
      <Code size={16} />
      Manage Projects
    </span>
  </button>
  <button
    onClick={() => setActiveTab('settings')}
    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-lg transform scale-105' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
  >
    <span className="flex items-center gap-2">
      <Settings size={16} />
      Section Settings
    </span>
  </button>
</div>
```

**Step 2: Enhance form styling**

Modify: `app/admin/projects/page.tsx:278-285`

Replace with:

```typescript
<div className="bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl border border-slate-200/50 p-8 md:p-12 shadow-xl shadow-primary-500/5 backdrop-blur-sm">
  <div className="flex items-center gap-3 mb-8">
    <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-xl">
      <Edit2 size={20} />
    </div>
    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
      {editingId ? 'Edit Project' : 'Create New Project'}
    </h3>
  </div>
```

**Step 3: Enhance input styling**

Modify: `app/admin/projects/page.tsx:283-315`

Add classes to all inputs:

```typescript
<input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm" required
```

**Step 4: Enhance button styling**

Modify: `app/admin/projects/page.tsx:371-382`

Replace snapshot and upload buttons:

```typescript
<button
  type="button"
  onClick={async () => { /* ... */ }}
  disabled={snapshotLoading}
  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
>
  {snapshotLoading && <Loader2 size={16} className="animate-spin" />}
  <Camera size={16} />
  <span className="font-bold">Capture Snapshot</span>
</button>

<label className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
  {uploadLoading && <Loader2 size={16} className="animate-spin" />}
  <Upload size={16} />
  <span className="font-bold">Upload Thumbnail</span>
  <input type="file" /* ... */ />
</label>
```

**Step 5: Enhance project list cards**

Modify: `app/admin/projects/page.tsx:387-405`

Replace with:

```typescript
<div className="bg-gradient-to-br from-white via-slate-50/30 to-white p-6 rounded-2xl border border-slate-200/50 flex items-center justify-between group hover:shadow-xl hover:border-primary-200/50 transition-all duration-300">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-xl">
      <Code className="w-5 h-5 text-primary-600" />
    </div>
    <div>
      <h4 className="font-black text-slate-900 text-lg">{project.title}</h4>
      <p className="text-sm text-slate-500 font-medium">{project.category} • {project.year}</p>
    </div>
  </div>
```

**Step 6: Commit**

```bash
git add app/admin/projects/page.tsx
git commit -m "design: apply $100B design system to admin interface"
```

---

## Task 9: Test All Functionality

**Files:**
- Test: All modified files

**Step 1: Run build test**

Run: `npm run build`
Expected: No TypeScript errors, successful build

**Step 2: Test database migration**

Run: `node scripts/migrate-project-urls-thumbnails.js`
Expected: "✅ Added URL and thumbnail columns"

**Step 3: Test main page rendering**

Visit: `http://localhost:3000`
Expected: Projects section visible with proper styling

**Step 4: Test admin CRUD**

Visit: `http://localhost:3000/admin/projects`
Expected: Admin interface loads with enhanced design

**Step 5: Test snapshot capture**

Use admin interface to add project with URL
Click "Capture Snapshot"
Expected: Snapshot URL populated

**Step 6: Test thumbnail upload**

Use admin interface to upload thumbnail image
Expected: Thumbnail URL populated

**Step 7: Commit test results**

```bash
git add .
git commit -m "test: verify all functionality works correctly"
```

---

## Task 10: Push to GitHub

**Step 1: Push all changes**

Run: `git push origin main`
Expected: All commits pushed successfully

**Step 2: Verify Vercel deployment**

Visit: Deployed Vercel URL
Expected: Site deploys successfully with new features

**Step 3: Commit deployment verification**

```bash
git commit --allow-empty -m "deploy: verify Vercel deployment successful"
git push origin main
```

---

## Plan Complete

**Total Tasks:** 10
**Estimated Time:** 3-4 hours
**Key Features Added:**
- ✅ Database schema with URL and thumbnail fields
- ✅ URL snapshot capture API
- ✅ Thumbnail upload with Appwrite
- ✅ Enhanced main page showcase
- ✅ Full admin CRUD interface
- ✅ $100B premium design system
- ✅ Complete testing and deployment

**Next Steps:**
1. Execute plan task-by-task using superpowers:executing-plans
2. Set up SCREENSHOT_API_KEY environment variable
3. Configure Appwrite bucket for thumbnail storage
4. Verify Vercel deployment after push

