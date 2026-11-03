import React from 'react'

// Sanitize string to prevent XSS
function sanitizeString(str: any): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*>?/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/** The identity facts JSON-LD asserts, as stored in site_settings.identity. */
export interface SiteIdentity {
  name?: string
  job_title?: string
  employer?: string
  locality?: string
  country?: string
  same_as?: string[]
  description?: string
  email?: string
}

interface StructuredDataProps {
  type?: 'person' | 'professional-service' | 'all'
  profilePhotoUrl?: string
  /** From the CMS. Anything unset falls back to the values below. */
  identity?: SiteIdentity | null
  /** Hero credentials, reused as schema.org credentials. */
  credentials?: { label?: string; issuer?: string; url?: string }[] | null
}

// What the component asserted before any of this was editable. Kept as the
// fallback so an unmigrated database still emits correct structured data
// rather than a Person with no name.
const FALLBACK_IDENTITY: Required<Omit<SiteIdentity, 'same_as'>> & { same_as: string[] } = {
  name: 'Muhammad Suzaril Shah',
  job_title: 'Senior IT Systems & Customer Engineer',
  employer: 'Swift',
  locality: 'Kuala Lumpur',
  country: 'Malaysia',
  description:
    'Microsoft MVP, Docker Captain, and Cloud Engineering Technologist specializing in Azure, Kubernetes, DevOps, and IoT solutions.',
  email: 'shah@suzarilshah.uk',
  same_as: [
    'https://www.linkedin.com/in/suzarilshah',
    'https://github.com/suzarilshah',
    'https://blog.suzarilshah.uk',
    'https://mvp.microsoft.com/en-us/PublicProfile/5005264',
    'https://www.docker.com/captains/muhammad-suzaril-shah/',
    'https://sessionize.com/suzaril-shah',
  ],
}

export function StructuredData({
  type = 'all',
  profilePhotoUrl,
  identity,
  credentials,
}: StructuredDataProps) {
  const baseUrl = 'https://www.suzarilshah.uk'

  const name = sanitizeString(identity?.name) || FALLBACK_IDENTITY.name
  const jobTitle = sanitizeString(identity?.job_title) || FALLBACK_IDENTITY.job_title
  const employer = sanitizeString(identity?.employer) || FALLBACK_IDENTITY.employer
  const locality = sanitizeString(identity?.locality) || FALLBACK_IDENTITY.locality
  const country = sanitizeString(identity?.country) || FALLBACK_IDENTITY.country
  const sameAs =
    Array.isArray(identity?.same_as) && identity.same_as.length > 0
      ? identity.same_as
      : FALLBACK_IDENTITY.same_as

  // Credentials come from the hero, so the page and its structured data make
  // the same claims — two lists would eventually disagree.
  const credentialSchema = (credentials ?? [])
    .filter((credential) => credential?.label)
    .map((credential) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Award',
      name: sanitizeString(credential.label),
      ...(credential.url ? { url: credential.url } : {}),
      ...(credential.issuer
        ? { recognizedBy: { '@type': 'Organization', name: sanitizeString(credential.issuer) } }
        : {}),
    }))

  // Person Schema - Professional Profile
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: baseUrl,
    image: profilePhotoUrl || undefined,
    jobTitle,
    description: sanitizeString(identity?.description) || FALLBACK_IDENTITY.description,
    email: sanitizeString(identity?.email) || FALLBACK_IDENTITY.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
      addressCountry: country,
    },
    sameAs,
    knowsAbout: [
      'Microsoft Azure',
      'Azure Cloud Architecture',
      'Kubernetes',
      'Docker',
      'DevOps',
      'Platform Engineering',
      'CI/CD',
      'Infrastructure as Code',
      'Terraform',
      'Azure AI',
      'Azure OpenAI',
      'IoT Solutions',
      'Smart Agriculture',
      'System Architecture',
      'Cloud Native',
      'Container Orchestration',
      'Azure Machine Learning',
      'Python',
      'TypeScript',
      'React',
      'Next.js',
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Universiti Kuala Lumpur',
        sameAs: 'https://www.unikl.edu.my',
      },
    ],
    award: [
      'Microsoft AI & Azure MVP (2024)',
      'Docker Captain (2024)',
      'Windows Insider MVP (2023)',
      'Gold Student Ambassador (2022)',
      'Imagine Cup Runner Up - Top 4 Asia (2022)',
      'ITEX Silver Medal (2021)',
    ],
    // Falls back to the hardcoded pair only when the hero has no credentials
    // set, so the two never disagree about what you hold.
    hasCredential:
      credentialSchema.length > 0
        ? credentialSchema
        : [
            {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'Award',
              name: 'Microsoft MVP - AI & Azure',
              url: 'https://mvp.microsoft.com/en-us/PublicProfile/5005264',
              recognizedBy: { '@type': 'Organization', name: 'Microsoft Corporation' },
            },
            {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'Recognition',
              name: 'Docker Captain',
              url: 'https://www.docker.com/captains/',
              recognizedBy: { '@type': 'Organization', name: 'Docker Inc.' },
            },
          ],
    worksFor: {
      '@type': 'Organization',
      name: employer,
    },
  }

  // Professional Service Schema
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Muhammad Suzaril Shah - Cloud & DevOps Engineering',
    url: baseUrl,
    description: 'Cloud architecture, DevOps consulting, Azure solutions, Kubernetes implementation, and platform engineering services. Specializing in enterprise cloud migration, infrastructure automation, CI/CD pipelines, and IoT cloud solutions.',
    serviceType: [
      'Cloud Architecture',
      'DevOps Engineering',
      'Azure Solutions Architecture',
      'Kubernetes Consulting',
      'Platform Engineering',
      'Infrastructure as Code',
      'CI/CD Pipeline Design',
      'IoT Cloud Solutions',
      'Azure AI Integration',
      'Technical Speaking',
      'Community Advocacy',
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    provider: {
      '@type': 'Person',
      name: 'Muhammad Suzaril Shah',
      jobTitle: 'Senior IT Systems & Customer Engineer',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Enterprise Technology Teams',
    },
    knowsAbout: [
      'Microsoft Azure',
      'Kubernetes',
      'Docker',
      'DevOps',
      'Cloud Native',
      'Infrastructure Automation',
    ],
  }

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Muhammad Suzaril Shah - Portfolio',
    url: baseUrl,
    description: 'Professional portfolio of Muhammad Suzaril Shah - Microsoft MVP, Docker Captain, Engineering Technologist specializing in Azure Cloud, Kubernetes, DevOps, and IoT solutions.',
    author: {
      '@type': 'Person',
      name: 'Muhammad Suzaril Shah',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: `${baseUrl}#about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Experience',
        item: `${baseUrl}#experience`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Awards',
        item: `${baseUrl}#awards`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Publications',
        item: `${baseUrl}#publications`,
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Community',
        item: `${baseUrl}#community`,
      },
    ],
  }

  const renderSchema = () => {
    switch (type) {
      case 'person':
        return personSchema
      case 'professional-service':
        return professionalServiceSchema
      case 'all':
      default:
        return [personSchema, professionalServiceSchema, websiteSchema, breadcrumbSchema]
    }
  }

  const schemaData = renderSchema()

  return (
    <>
      {Array.isArray(schemaData) ? (
        schemaData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        ))
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      )}
    </>
  )
}

// Event Schema Generator for Community Section
export function EventSchema({ event }: { event: any }) {
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.isOnline
      ? {
          '@type': 'VirtualLocation',
          url: event.url,
        }
      : {
          '@type': 'Place',
          name: event.location,
        },
    performer: {
      '@type': 'Person',
      name: 'Muhammad Suzaril Shah',
      url: 'https://www.suzarilshah.uk',
    },
    organizer: {
      '@type': 'Organization',
      name: sanitizeString(event.organizerName) || 'Event Organizer',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(eventSchema),
      }}
    />
  )
}

// Article Schema Generator for Publications Section
export function ArticleSchema({ article }: { article: any }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: sanitizeString(article.title),
    description: sanitizeString(article.description),
    url: article.url,
    datePublished: article.publishedDate,
    author: {
      '@type': 'Person',
      name: 'Muhammad Suzaril Shah',
      url: 'https://www.suzarilshah.uk',
    },
    publisher: {
      '@type': 'Organization',
      name: sanitizeString(article.publisher) || 'Publisher',
    },
    keywords: article.keywords?.map((k: any) => sanitizeString(k)).join(', '),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  )
}
