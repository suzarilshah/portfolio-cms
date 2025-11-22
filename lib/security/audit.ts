import { NextRequest } from 'next/server';

export interface SecurityAuditLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  event: string;
  details: Record<string, any>;
  ip?: string;
  userAgent?: string;
  userId?: string;
}

export class SecurityAuditor {
  private static logs: SecurityAuditLog[] = [];
  private static maxLogs = 1000;

  static log(event: string, details: Record<string, any>, level: SecurityAuditLog['level'] = 'info', request?: NextRequest) {
    const log: SecurityAuditLog = {
      timestamp: new Date().toISOString(),
      level,
      event,
      details,
      ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
    };

    this.logs.push(log);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log critical issues to console
    if (level === 'critical' || level === 'error') {
      console.error(`[SECURITY AUDIT] ${level.toUpperCase()}: ${event}`, details);
    }
  }

  static logAuthAttempt(request: NextRequest, success: boolean, userId?: string) {
    this.log('auth_attempt', {
      success,
      userId,
      endpoint: request.url,
    }, success ? 'info' : 'warning', request);
  }

  static logSuspiciousActivity(request: NextRequest, activity: string, details: Record<string, any>) {
    this.log('suspicious_activity', {
      activity,
      ...details,
    }, 'error', request);
  }

  static logDataAccess(request: NextRequest, resource: string, action: string) {
    this.log('data_access', {
      resource,
      action,
      endpoint: request.url,
    }, 'info', request);
  }

  static logSecurityViolation(request: NextRequest, violation: string, details: Record<string, any>) {
    this.log('security_violation', {
      violation,
      ...details,
    }, 'critical', request);
  }

  static getLogs(level?: SecurityAuditLog['level'], limit?: number): SecurityAuditLog[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }
    
    return filteredLogs;
  }

  static clearLogs() {
    this.logs = [];
  }

  // Security metrics
  static getSecurityMetrics() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentLogs = this.logs.filter(log => new Date(log.timestamp) > last24h);
    
    return {
      totalEvents: recentLogs.length,
      authAttempts: recentLogs.filter(log => log.event === 'auth_attempt').length,
      suspiciousActivities: recentLogs.filter(log => log.event === 'suspicious_activity').length,
      securityViolations: recentLogs.filter(log => log.event === 'security_violation').length,
      dataAccessEvents: recentLogs.filter(log => log.event === 'data_access').length,
      criticalEvents: recentLogs.filter(log => log.level === 'critical').length,
      errorEvents: recentLogs.filter(log => log.level === 'error').length,
    };
  }
}

// Common security checks
export class SecurityChecks {
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/)/,
      /(\bOR\b.*\b1\s*=\s*1\b)/i,
      /(\bAND\b.*\b1\s*=\s*1\b)/i,
      /(\bWHERE\b.*\bOR\b)/i,
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^>]*>/gi,
      /<object\b[^>]*>/gi,
      /<embed\b[^>]*>/gi,
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  static detectSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /scanner/i,
      /sqlmap/i,
      /nmap/i,
      /nikto/i,
      /burp/i,
      /metasploit/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  static isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^localhost$/,
    ];
    
    return privateRanges.some(range => range.test(ip));
  }

  static validateJSON(input: string): boolean {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }
}

// Security monitoring middleware
export function createSecurityMonitor(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  // Log suspicious user agents
  if (SecurityChecks.detectSuspiciousUserAgent(userAgent)) {
    SecurityAuditor.logSuspiciousActivity(request, 'suspicious_user_agent', { userAgent });
  }
  
  // Monitor request patterns
  const url = request.url;
  const method = request.method;
  
  // Log unusual request patterns
  if (method === 'DELETE' && url.includes('/api/')) {
    SecurityAuditor.logDataAccess(request, 'api_endpoint', 'delete_request');
  }
  
  return {
    logSecurityViolation: (violation: string, details: Record<string, any>) => {
      SecurityAuditor.logSecurityViolation(request, violation, details);
    },
    logSuspiciousActivity: (activity: string, details: Record<string, any>) => {
      SecurityAuditor.logSuspiciousActivity(request, activity, details);
    }
  };
}
