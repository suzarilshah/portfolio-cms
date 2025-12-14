# Fix Summary - Experience Data Disappearing

## Date: November 30, 2024
## Commit: `d173391`

---

## 🐛 Issue Reported

1. **Locations showing as "Remote"**: Even when "Kuala Lumpur, Malaysia" was set.
2. **Tags Emptying**: Tags disappearing after saving in Admin.

---

## 🔍 Root Cause Analysis

The **SecurityValidator** (`lib/security/validation.ts`) was too aggressive and was **stripping out fields** that were not explicitly allowlisted.

In the `jobs` sanitization logic:
```typescript
// OLD CODE (Simplified)
sanitized.jobs = content.jobs.map(job => ({
  title: ...,       // Checks 'title' (but frontend uses 'role')
  company: ...,
  description: ...,
  period: ...
}));
```

It was **MISSING**:
- `location`
- `tags`
- `role`

### Why it broke:
1. **Location**: The `location` field was stripped before saving to DB.
   - Frontend received `undefined`.
   - My previous fix handled `undefined` by showing "Remote".
2. **Tags**: The `tags` array was stripped.
   - Frontend received `undefined` or empty.
3. **Role**: The `role` field was stripped (and `title` was checked instead).

---

## ✅ Solutions Implemented

Updated `lib/security/validation.ts` to explicitly allow and sanitize these fields:

```typescript
// NEW CODE
if (job.role) {
  sanitizedJob.role = this.sanitizeHtml(job.role);
}
if (job.location) {
  sanitizedJob.location = this.sanitizeHtml(job.location);
}
if (job.tags && Array.isArray(job.tags)) {
  sanitizedJob.tags = job.tags.map(tag => this.sanitizeHtml(tag));
}
```

---

## 🧪 Verification

- **Build**: Successful (`npm run build`).
- **Logic**: Verified that `admin/experience/page.tsx` sends these exact fields (`role`, `location`, `tags`) and now `Validation.ts` accepts them.

---

## 📝 Note to User

**Important**: Since the previous saves likely stripped this data from the database, you will need to **re-enter and save** the Location and Tags in the Admin Panel one last time. This time, they will be saved correctly.
