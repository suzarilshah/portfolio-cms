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
          if (job.company) {
            sanitizedJob.company = this.sanitizeHtml((job.company as string).trim().substring(0, 200));
          }
          if (job.description) {
            sanitizedJob.description = this.sanitizeHtml((job.description as string).trim().substring(0, 1000));
          }
          if (job.period) {
            sanitizedJob.period = this.sanitizeHtml((job.period as string).trim().substring(0, 100));
          }
          return sanitizedJob;
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
