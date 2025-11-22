'use client';

import Script from 'next/script';

interface AnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({ measurementId }: AnalyticsProps) {
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  );
}

// Event tracking helpers
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Common event tracking functions
export const events = {
  downloadResume: () => trackEvent('download_resume', { category: 'engagement' }),
  viewProject: (projectName: string) => trackEvent('view_project', { project_name: projectName }),
  contactFormSubmit: () => trackEvent('contact_form_submit', { category: 'conversion' }),
  socialLinkClick: (platform: string) => trackEvent('social_link_click', { platform }),
  sectionView: (section: string) => trackEvent('section_view', { section_name: section }),
  bookingClick: () => trackEvent('booking_click', { category: 'conversion' }),
};
