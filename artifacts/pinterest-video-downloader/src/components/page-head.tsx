/**
 * PageHead — injects per-page SEO metadata using React 19's native
 * document metadata support. No external library needed.
 *
 * React 19 hoists <title>, <meta>, and <link> rendered inside components
 * directly into <head>. This component replaces the need for react-helmet.
 *
 * References:
 * - https://react.dev/blog/2024/12/05/react-19#support-for-metadata-tags
 */
import { SITE_NAME } from '@/lib/seo';

export interface BreadcrumbItem {
  readonly name: string;
  readonly url: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

interface PageHeadProps {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  breadcrumbs?: readonly BreadcrumbItem[];
  faqs?: readonly FaqItem[];
}

export function PageHead({ title, description, canonical, noindex = false, breadcrumbs, faqs }: PageHeadProps) {
  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 1
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `https://pindrop.app${crumb.url}`,
          })),
        })
      : null;

  const faqSchema =
    faqs && faqs.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        })
      : null;

  const webPageSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: 'https://pindrop.app',
    },
  });

  return (
    <>
      {/* React 19 hoists these into <head> automatically */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured data: WebPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webPageSchema }} />

      {/* Structured data: BreadcrumbList (inner pages only) */}
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      )}

      {/* Structured data: FAQPage */}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      )}
    </>
  );
}
