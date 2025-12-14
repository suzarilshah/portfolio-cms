export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
}

export class SecurityValidator {
  // XSS Protection: Sanitize HTML content
  static sanitizeHtml(input: string): string {
    // Basic HTML sanitization - remove dangerous tags and attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*>?/gi, '')
      .replace(/<object\b[^<]*>?/gi, '')
      .replace(/<embed\b[^<]*>?/gi, '')
      .replace(/<form\b[^<]*>?/gi, '')
      .replace(/<input\b[^<]*>?/gi, '')
      .replace(/<textarea\b[^<]*>?/gi, '')
      .replace(/<button\b[^<]*>?/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<[^>]*>/g, '') // Remove all remaining HTML tags
      .trim();
  }

  // SQL Injection Protection: Validate identifiers
  static validateIdentifier(input: string): boolean {
    // Only allow alphanumeric, underscores, and hyphens
    return /^[a-zA-Z0-9_-]+$/.test(input);
  }

  // Input validation for project data
  static validateProjectInput(data: any): ValidationResult {
    const errors: string[] = [];
    const sanitized: any = {};

    // Title validation
    if (data.title) {
      if (typeof data.title !== 'string' || data.title.length > 200) {
        errors.push('Title must be a string with max 200 characters');
      } else {
        sanitized.title = this.sanitizeHtml(data.title.trim());
      }
    }

    // Tagline validation
    if (data.tagline) {
      if (typeof data.tagline !== 'string' || data.tagline.length > 500) {
        errors.push('Tagline must be a string with max 500 characters');
      } else {
        sanitized.tagline = this.sanitizeHtml(data.tagline.trim());
      }
    }

    // Challenge validation
    if (data.challenge) {
      if (typeof data.challenge !== 'string' || data.challenge.length > 2000) {
        errors.push('Challenge must be a string with max 2000 characters');
      } else {
        sanitized.challenge = this.sanitizeHtml(data.challenge.trim());
      }
    }

    // Solution validation
    if (data.solution) {
      if (typeof data.solution !== 'string' || data.solution.length > 2000) {
        errors.push('Solution must be a string with max 2000 characters');
      } else {
        sanitized.solution = this.sanitizeHtml(data.solution.trim());
      }
    }

    // Impact validation (array of strings)
    if (data.impact) {
      if (!Array.isArray(data.impact)) {
        errors.push('Impact must be an array');
      } else {
        sanitized.impact = data.impact
          .filter((item: any) => typeof item === 'string' && item.length <= 200)
          .map((item: string) => this.sanitizeHtml(item.trim()))
          .slice(0, 10); // Max 10 impact items
      }
    }

    // Technologies validation (array of strings)
    if (data.technologies) {
      if (!Array.isArray(data.technologies)) {
        errors.push('Technologies must be an array');
      } else {
        sanitized.technologies = data.technologies
          .filter((item: any) => typeof item === 'string' && item.length <= 100)
          .map((item: string) => this.sanitizeHtml(item.trim()))
          .slice(0, 20); // Max 20 technologies
      }
    }

    // Category validation
    if (data.category) {
      const allowedCategories = ['web', 'mobile', 'cloud', 'ai', 'data', 'infrastructure', 'other'];
      if (!allowedCategories.includes(data.category)) {
        errors.push('Invalid category');
      } else {
        sanitized.category = data.category;
      }
    }

    // Icon name validation
    if (data.icon_name) {
      if (!this.validateIdentifier(data.icon_name) || data.icon_name.length > 50) {
        errors.push('Invalid icon name');
      } else {
        sanitized.icon_name = data.icon_name;
      }
    }

    // Year validation
    if (data.year) {
      const year = parseInt(data.year);
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 1) {
        errors.push('Invalid year');
      } else {
        sanitized.year = year;
      }
    }

    // Link validation
    if (data.link) {
      try {
        const url = new URL(data.link);
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.push('Link must be a valid HTTP or HTTPS URL');
        } else {
          sanitized.link = url.toString();
        }
      } catch {
        errors.push('Invalid link format');
      }
    }

    // Project URL validation
    if (data.project_url) {
      if (typeof data.project_url !== 'string' || data.project_url.length > 500) {
        errors.push('Project URL must be a string with max 500 characters');
      } else {
        try {
          const url = new URL(data.project_url);
          if (!['http:', 'https:'].includes(url.protocol)) {
            errors.push('Project URL must be a valid HTTP or HTTPS URL');
          } else {
            sanitized.project_url = url.toString();
          }
        } catch {
          errors.push('Invalid project URL format');
        }
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

    // Has snapshot validation
    if (data.has_snapshot !== undefined) {
      sanitized.has_snapshot = Boolean(data.has_snapshot);
    }

    // ID validation for updates
    if (data.id) {
      const id = parseInt(data.id);
      if (isNaN(id) || id <= 0) {
        errors.push('Invalid ID');
      } else {
        sanitized.id = id;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: errors.length === 0 ? sanitized : undefined
    };
  }

  // Section content validation
  static validateSectionContent(sectionKey: string, content: any): ValidationResult {
    const errors: string[] = [];
    const sanitized: any = {};

    // Section key validation
    if (!this.validateIdentifier(sectionKey) || sectionKey.length > 50) {
      errors.push('Invalid section key');
    }

    // Content validation
    if (content && typeof content === 'object') {
      // Title validation
      if (content.title) {
        if (typeof content.title !== 'string' || content.title.length > 200) {
          errors.push('Title must be a string with max 200 characters');
        } else {
          sanitized.title = this.sanitizeHtml(content.title.trim());
        }
      }

      // Description validation
      if (content.description) {
        if (typeof content.description !== 'string' || content.description.length > 2000) {
          errors.push('Description must be a string with max 2000 characters');
        } else {
          sanitized.description = this.sanitizeHtml(content.description.trim());
        }
      }

      // Subtitle validation
      if (content.subtitle) {
        if (typeof content.subtitle !== 'string' || content.subtitle.length > 500) {
          errors.push('Subtitle must be a string with max 500 characters');
        } else {
          sanitized.subtitle = this.sanitizeHtml(content.subtitle.trim());
        }
      }

      // Handle nested arrays (like jobs in experience section)
      if (content.jobs && Array.isArray(content.jobs)) {
        sanitized.jobs = content.jobs.slice(0, 20).map((job: any) => {
          const sanitizedJob: any = {};
          if (job.title) {
            sanitizedJob.title = this.sanitizeHtml((job.title as string).trim().substring(0, 200));
          }
          if (job.role) {
            sanitizedJob.role = this.sanitizeHtml((job.role as string).trim().substring(0, 200));
          }
          if (job.company) {
            sanitizedJob.company = this.sanitizeHtml((job.company as string).trim().substring(0, 200));
          }
          if (job.description) {
            sanitizedJob.description = this.sanitizeHtml((job.description as string).trim().substring(0, 1000));
          }
          if (job.period) {
            sanitizedJob.period = this.sanitizeHtml((job.period as string).trim().substring(0, 100));
          }
          if (job.location) {
            sanitizedJob.location = this.sanitizeHtml((job.location as string).trim().substring(0, 100));
          }
          if (job.tags && Array.isArray(job.tags)) {
            sanitizedJob.tags = job.tags
              .filter((tag: any) => typeof tag === 'string' && tag.length <= 50)
              .map((tag: string) => this.sanitizeHtml(tag.trim()))
              .slice(0, 10);
          }
          return sanitizedJob;
        });
      }

      // Handle items array (for awards section)
      if (content.items && Array.isArray(content.items)) {
        sanitized.items = content.items.slice(0, 20).map((item: any) => {
          const sanitizedItem: any = {};
          if (item.title) {
            sanitizedItem.title = this.sanitizeHtml((item.title as string).trim().substring(0, 200));
          }
          if (item.issuer) {
            sanitizedItem.issuer = this.sanitizeHtml((item.issuer as string).trim().substring(0, 200));
          }
          if (item.year) {
            sanitizedItem.year = this.sanitizeHtml((item.year as string).trim().substring(0, 20));
          }
          if (item.description) {
            sanitizedItem.description = this.sanitizeHtml((item.description as string).trim().substring(0, 1000));
          }
          // Education fields
          if (item.degree) {
            sanitizedItem.degree = this.sanitizeHtml((item.degree as string).trim().substring(0, 200));
          }
          if (item.institution) {
            sanitizedItem.institution = this.sanitizeHtml((item.institution as string).trim().substring(0, 200));
          }
          if (item.period) {
            sanitizedItem.period = this.sanitizeHtml((item.period as string).trim().substring(0, 100));
          }
          if (item.specialization) {
            sanitizedItem.specialization = this.sanitizeHtml((item.specialization as string).trim().substring(0, 200));
          }
          if (item.details) {
            sanitizedItem.details = this.sanitizeHtml((item.details as string).trim().substring(0, 1000));
          }
          // Common fields
          if (item.icon) {
            sanitizedItem.icon = this.sanitizeHtml((item.icon as string).trim().substring(0, 50));
          }
          if (item.link) {
             try {
                const url = new URL(item.link);
                if (['http:', 'https:'].includes(url.protocol)) {
                    sanitizedItem.link = url.toString();
                }
             } catch {
                // invalid link, ignore or strip
             }
          }
          return sanitizedItem;
        });
      }

      // Handle skills array (for about section)
      if (content.skills && Array.isArray(content.skills)) {
        sanitized.skills = content.skills
          .filter((item: any) => typeof item === 'string' && item.length <= 50)
          .map((item: string) => this.sanitizeHtml(item.trim()))
          .slice(0, 50); // Max 50 skills
      }

      // Handle Community Section Arrays
      if (content.communityEvents && Array.isArray(content.communityEvents)) {
        sanitized.communityEvents = content.communityEvents.slice(0, 50).map((item: any) => {
            const sanitizedItem: any = {};
            if (item.title) sanitizedItem.title = this.sanitizeHtml((item.title as string).trim().substring(0, 200));
            if (item.date) sanitizedItem.date = this.sanitizeHtml((item.date as string).trim().substring(0, 100));
            if (item.role) sanitizedItem.role = this.sanitizeHtml((item.role as string).trim().substring(0, 100));
            if (item.topic) sanitizedItem.topic = this.sanitizeHtml((item.topic as string).trim().substring(0, 500));
            if (item.venue) sanitizedItem.venue = this.sanitizeHtml((item.venue as string).trim().substring(0, 200));
            if (item.type) sanitizedItem.type = this.sanitizeHtml((item.type as string).trim().substring(0, 50));
            if (item.link) {
                try {
                    const url = new URL(item.link);
                    if (['http:', 'https:'].includes(url.protocol)) sanitizedItem.link = url.toString();
                } catch {}
            }
            if (item.id) sanitizedItem.id = item.id; // Preserve ID
            return sanitizedItem;
        });
      }

      if (content.pastEvents && Array.isArray(content.pastEvents)) {
        sanitized.pastEvents = content.pastEvents.slice(0, 100).map((item: any) => {
            const sanitizedItem: any = {};
            if (item.title) sanitizedItem.title = this.sanitizeHtml((item.title as string).trim().substring(0, 200));
            if (item.date) sanitizedItem.date = this.sanitizeHtml((item.date as string).trim().substring(0, 100));
            return sanitizedItem;
        });
      }

      if (content.mlsaInvolvements && Array.isArray(content.mlsaInvolvements)) {
        sanitized.mlsaInvolvements = content.mlsaInvolvements.slice(0, 50).map((item: any) => {
            const sanitizedItem: any = {};
            if (item.title) sanitizedItem.title = this.sanitizeHtml((item.title as string).trim().substring(0, 200));
            if (item.date) sanitizedItem.date = this.sanitizeHtml((item.date as string).trim().substring(0, 100));
            if (item.type) sanitizedItem.type = this.sanitizeHtml((item.type as string).trim().substring(0, 50));
            if (item.link) {
                try {
                    const url = new URL(item.link);
                    if (['http:', 'https:'].includes(url.protocol)) sanitizedItem.link = url.toString();
                } catch {}
            }
            return sanitizedItem;
        });
      }

    } else {
      errors.push('Content must be a valid object');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: errors.length === 0 ? { sectionKey, content: sanitized } : undefined
    };
  }

  // File upload validation
  static validateFileUpload(file: File): ValidationResult {
    const errors: string[] = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // File size validation (max 15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size exceeds 15MB limit');
    }

    // File type validation
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    // File name validation
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      errors.push('File name contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
