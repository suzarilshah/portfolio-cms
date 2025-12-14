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

interface StructuredDataProps {
  type?: 'person' | 'professional-service' | 'all'
}

export function StructuredData({ type = 'all' }: StructuredDataProps) {
  const baseUrl = 'https://www.suzarilshah.uk'

  // Person Schema - Professional Profile
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Suzaril Shah',
    url: baseUrl,
    image: `${baseUrl}/images/profile.jpg`,
    jobTitle: 'Senior IT Systems & Customer Engineer',
    description: 'Microsoft MVP, Docker Captain, and Cloud Engineering Technologist specializing in Azure, Kubernetes, DevOps, and IoT solutions. Senior IT Systems Engineer at Swift with expertise in cloud architecture, infrastructure automation, and platform engineering.',
    email: 'shah@suzarilshah.uk',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kuala Lumpur',
      addressCountry: 'Malaysia',
    },
    sameAs: [
      'https://www.linkedin.com/in/suzarilshah',
      'https://github.com/suzarilshah',
      'https://twitter.com/suzarilshah',
      'https://blog.suzarilshah.uk',
      'https://mvp.microsoft.com/en-us/PublicProfile/5005264',
      'https://www.docker.com/captains/muhammad-suzaril-shah/',
      'https://sessionize.com/suzaril-shah',
    ],
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
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Award',
        name: 'Microsoft MVP - AI & Azure',
        url: 'https://mvp.microsoft.com/en-us/PublicProfile/5005264',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Microsoft Corporation',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Recognition',
        name: 'Docker Captain',
        url: 'https://www.docker.com/captains/',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Docker Inc.',
        },
      },
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Swift',
      description: 'Global provider of secure financial messaging services',
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
