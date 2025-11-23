import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from 'next/font/google';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import './globals.css';
import pool from '@/lib/db';
import { StructuredData } from '@/components/StructuredData';
import { GoogleAnalytics } from '@/lib/analytics';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ["400", "600", "700"]
});

async function getSettings() {
  try {
    const res = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    return res.rows[0] || {};
  } catch (e) {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const title = settings.seo_title || 'Muhammad Suzaril Shah | Azure Cloud Architect & Microsoft MVP';
  const description = settings.seo_description || 'Senior IT Systems Engineer at Swift. Microsoft MVP & Docker Captain specializing in Azure Cloud Architecture, Kubernetes, DevOps, Platform Engineering & IoT Solutions. Based in Kuala Lumpur, available worldwide.';
  const keywords = settings.seo_keywords
    ? settings.seo_keywords.split(',').map((k: string) => k.trim())
    : [
        'Muhammad Suzaril Shah',
        'Azure Cloud Architect',
        'Microsoft MVP',
        'Docker Captain',
        'Kubernetes Engineer',
        'DevOps Engineer Malaysia',
        'Platform Engineering',
        'Azure Solutions Architect',
        'Cloud Native Engineer',
        'DevOps Advocate',
        'Kubernetes Consultant',
        'Azure AI Specialist',
        'IoT Cloud Solutions',
        'Infrastructure as Code',
        'CI/CD Pipeline',
        'Container Orchestration',
        'Azure OpenAI',
        'Terraform',
        'Docker Kubernetes',
        'Cloud Migration Expert',
        'Technical Speaker',
        'Community Leader',
        'Swift Engineer',
        'Kuala Lumpur',
        'Southeast Asia DevOps',
      ];
  
  // Default OpenGraph Image or fallback
  const ogImage = settings.seo_og_image || 'https://www.suzarilshah.uk/og-image.jpg'; 

  return {
    metadataBase: new URL('https://www.suzarilshah.uk'),
    title: {
      default: title,
      template: `%s | ${title.split('|')[0].trim()}`
    },
    description,
    keywords,
    authors: [{ name: 'Muhammad Suzaril Shah', url: 'https://www.suzarilshah.uk' }],
    creator: 'Muhammad Suzaril Shah',
    icons: settings.favicon_url ? {
      icon: settings.favicon_url,
      shortcut: settings.favicon_url,
      apple: settings.favicon_url
    } : undefined,
    openGraph: {
      title,
      description,
      url: 'https://www.suzarilshah.uk',
      siteName: 'Suzaril Shah Portfolio',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@suzarilshah',
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: settings.google_verification || undefined,
    },
    alternates: {
      canonical: 'https://www.suzarilshah.uk',
    },
    category: 'technology',
    classification: 'Cloud Computing, DevOps, Software Engineering',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const accent = settings?.accent_color || 'primary';
  const gaId = settings?.ga_measurement_id || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="scroll-smooth" data-accent={accent} suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased relative min-h-screen`} suppressHydrationWarning>
        {/* SEO Structured Data & Analytics (client-safe in body) */}
        <StructuredData type="all" />
        <GoogleAnalytics measurementId={gaId} />
        {/* Global Background Pattern */}
        <div className="fixed inset-0 -z-50 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_20%,#E0E7FF,transparent)] opacity-20"></div>
        </div>

        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
