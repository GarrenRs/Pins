/**
 * Privacy Policy page — /privacy
 * Accurate privacy policy based on the actual implementation.
 * Updated: September 2026
 */
import { Link } from 'wouter';
import { SiteLayout, Breadcrumb } from '@/components/layout';
import { PageHead } from '@/components/page-head';
import { PAGE_META } from '@/lib/seo';

const meta = PAGE_META.privacy;

const LAST_UPDATED = 'September 2026';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mb-8">
      <h2 id={id} className="mb-3 text-lg font-semibold tracking-[-0.04em]">{title}</h2>
      <div className="space-y-3 text-sm leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <SiteLayout>
      <PageHead
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        breadcrumbs={meta.breadcrumbs}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 lg:px-8 lg:py-16">
        <Breadcrumb items={meta.breadcrumbs!} />

        <header className="mb-8 sm:mb-10">
          <p className="mono mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-primary">Privacy Policy</p>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl break-words">
            How we handle <span className="display-serif italic font-normal text-primary">your data.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          <p className="mt-3 text-sm sm:text-base leading-7 text-muted-foreground">
            This policy describes what information Pindrop collects when you use the service, and how that information is used. It is written to reflect what actually happens — not a generic template.
          </p>
        </header>

        <div className="rounded-[16px] border border-accent/20 bg-accent/5 p-5 mb-10">
          <p className="text-sm font-semibold text-foreground mb-1">Short version</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Pindrop does not create user accounts, does not sell your data, and does not store your submitted Pinterest links or downloaded videos after processing. Standard server logs are generated for operational purposes.
          </p>
        </div>

        <Section id="information-collected" title="1. Information collected">
          <p>
            <strong className="font-semibold text-foreground">Pinterest URLs you submit.</strong> When you paste a Pinterest link into Pindrop and click the button, that URL is sent to the Pindrop server to resolve the associated video. The URL is used solely to perform this resolution — it is not stored in a database afterward.
          </p>
          <p>
            <strong className="font-semibold text-foreground">Server logs.</strong> Like all web services, Pindrop's server generates standard access logs. These logs may contain your IP address, the HTTP method and URL path requested, the HTTP status code returned, and timestamps. Logs are used for operational monitoring, error diagnosis, and rate-limiting to prevent service abuse. Logs are retained for a short operational period and are not shared with third parties for advertising purposes.
          </p>
          <p>
            <strong className="font-semibold text-foreground">IP address.</strong> Your IP address is visible to the server when you make a request. It is used for rate-limiting (to prevent a single user from overwhelming the service) and is included in server logs as described above.
          </p>
        </Section>

        <Section id="information-not-collected" title="2. Information not collected">
          <p>Pindrop does not collect or store the following:</p>
          <ul className="ml-4 list-disc space-y-1 marker:text-primary">
            <li>User accounts, names, email addresses, or passwords</li>
            <li>Browsing history or search queries beyond the Pinterest URL you directly submit</li>
            <li>Cookies identifying you across sessions (no login session cookies are set)</li>
            <li>Downloaded video files (the video streams directly from Pinterest's servers to your browser)</li>
            <li>Payment information (the service is free)</li>
          </ul>
        </Section>

        <Section id="how-download-works" title="3. How downloads work">
          <p>
            When you request a video download, Pindrop issues a short-lived download token (expiring in 15 minutes). Your browser uses this token to retrieve the video via the Pindrop server, which streams the file directly from Pinterest's CDN to your browser. Pindrop does not cache or permanently store the video file.
          </p>
        </Section>

        <Section id="cookies" title="4. Cookies">
          <p>
            Pindrop does not set tracking or advertising cookies. No third-party advertising networks are integrated. Your browser may store small technical items (such as local storage for UI state) that never leave your device and are not transmitted to Pindrop.
          </p>
        </Section>

        <Section id="analytics" title="5. Analytics">
          <p>
            Pindrop does not currently use third-party analytics services (such as Google Analytics). Aggregate usage metrics may be derived from server logs for internal operational understanding only.
          </p>
        </Section>

        <Section id="third-party-services" title="6. Third-party services">
          <p>
            Pindrop contacts Pinterest's servers to resolve Pin pages and retrieve video files on your behalf. Pinterest's own privacy policy applies to the content it hosts. Pindrop also loads fonts from Google Fonts (fonts.googleapis.com). Google may log these requests according to its own privacy policy.
          </p>
          <p>
            Pindrop is not affiliated with, endorsed by, or in any way officially connected to Pinterest, Inc.
          </p>
        </Section>

        <Section id="data-retention" title="7. Data retention">
          <p>
            Submitted Pinterest URLs are processed in memory and are not stored in a database. Server access logs are retained for a short operational period (typically days to weeks) before being deleted or overwritten.
          </p>
        </Section>

        <Section id="childrens-privacy" title="8. Children's privacy">
          <p>
            Pindrop is not directed at children under the age of 13. We do not knowingly collect information from children. If you believe a child has submitted personal information through the service, please contact us.
          </p>
        </Section>

        <Section id="changes" title="9. Changes to this policy">
          <p>
            If this privacy policy changes in a material way, the date at the top of this page will be updated. We encourage you to review this page periodically.
          </p>
        </Section>

        <Section id="contact-privacy" title="10. Contact">
          <p>
            If you have questions about this privacy policy or how your information is handled, please visit our{' '}
            <Link href="/contact" className="font-medium text-primary underline underline-offset-2">
              contact page
            </Link>
            .
          </p>
        </Section>

        <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Use the downloader
          </Link>
          <Link
            href="/terms"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Terms of service
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Contact us
          </Link>
        </nav>
      </div>
    </SiteLayout>
  );
}
