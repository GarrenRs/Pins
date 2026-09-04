/**
 * Terms of Service page — /terms
 * Clear terms covering acceptable use, intellectual property, and service limitations.
 * Updated: September 2026
 */
import { Link } from 'wouter';
import { SiteLayout, Breadcrumb } from '@/components/layout';
import { PageHead } from '@/components/page-head';
import { PAGE_META } from '@/lib/seo';

const meta = PAGE_META.terms;
const LAST_UPDATED = 'September 2026';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mb-8">
      <h2 id={id} className="mb-3 text-lg font-semibold tracking-[-0.04em]">{title}</h2>
      <div className="space-y-3 text-sm leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Terms() {
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
          <p className="mono mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-primary">Terms of Service</p>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl break-words">
            Terms of <span className="display-serif italic font-normal text-primary">use.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          <p className="mt-3 text-sm sm:text-base leading-7 text-muted-foreground">
            By using Pindrop, you agree to these terms. Please read them carefully. They explain what the service does, what you are responsible for, and the limits of the service.
          </p>
        </header>

        <Section id="service-description" title="1. Service description">
          <p>
            Pindrop is a free web-based tool that resolves and facilitates the download of publicly accessible video content from Pinterest. Pindrop operates independently and is not affiliated with, sponsored by, endorsed by, or in any way officially connected to Pinterest, Inc.
          </p>
          <p>
            The service requires a publicly accessible Pinterest Pin URL as input. It does not access private, restricted, or login-protected content.
          </p>
        </Section>

        <Section id="acceptable-use" title="2. Acceptable use">
          <p>You may use Pindrop to download Pinterest videos for personal, non-commercial purposes, provided you have the right to access and save the content. By using this service, you confirm that:</p>
          <ul className="ml-4 list-disc space-y-1 marker:text-primary">
            <li>You will only download content you own, have created, or are otherwise legally permitted to save.</li>
            <li>You will not use Pindrop to download and redistribute other creators' content without their permission.</li>
            <li>You will not use automated scripts, bots, or crawlers to make large volumes of requests to Pindrop.</li>
            <li>You will not attempt to circumvent any rate-limiting, access controls, or security measures in place.</li>
            <li>You will comply with Pinterest's own Terms of Service and Community Guidelines when accessing Pinterest content.</li>
          </ul>
        </Section>

        <Section id="intellectual-property" title="3. Intellectual property and content rights">
          <p>
            Pinterest videos are the creative work of their respective authors and are subject to copyright. Pindrop does not grant you any right to use, copy, distribute, or publish content downloaded through this service beyond what is already permitted by the content's creator or applicable law.
          </p>
          <p>
            Downloading a video does not transfer ownership of that video to you. Responsibility for how downloaded content is used rests entirely with you.
          </p>
        </Section>

        <Section id="no-affiliation" title="4. No Pinterest affiliation">
          <p>
            Pindrop is an independent service and is not an official product of Pinterest, Inc. Pinterest® is a registered trademark of Pinterest, Inc. The name "Pinterest" is used solely to describe the type of content this service processes. There is no commercial or legal relationship between Pindrop and Pinterest, Inc.
          </p>
        </Section>

        <Section id="service-availability" title="5. Service availability">
          <p>
            Pindrop is provided on an "as is" basis without guarantees of availability, uptime, or continuity. The service may be interrupted, modified, or discontinued at any time without notice. Pinterest may also change the technical structure of its platform in ways that affect Pindrop's ability to resolve video files.
          </p>
          <p>
            Pindrop cannot guarantee that every Pinterest link will yield a downloadable video. Some Pins may not contain video files, or the video source may be inaccessible for technical reasons.
          </p>
        </Section>

        <Section id="user-responsibility" title="6. Your responsibility">
          <p>
            You are solely responsible for your use of Pindrop and any content you download through it. Pindrop is a technical facilitator — it does not curate, review, or endorse the content accessible through the service.
          </p>
          <p>
            If your use of Pindrop violates any applicable law, Pinterest's terms, or the rights of a third party, you are responsible for the consequences of that use.
          </p>
        </Section>

        <Section id="abuse-reporting" title="7. Abuse and misuse reporting">
          <p>
            If you believe Pindrop is being used in a manner that violates these terms or causes harm, please contact us through our{' '}
            <Link href="/contact" className="font-medium text-primary underline underline-offset-2">
              contact page
            </Link>
            . We take misuse reports seriously and will investigate and act where appropriate.
          </p>
        </Section>

        <Section id="limitation-of-liability" title="8. Limitation of liability">
          <p>
            To the fullest extent permitted by applicable law, Pindrop and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the service, including but not limited to loss of data, content, or business opportunity.
          </p>
          <p>
            This limitation applies whether the claim is based on warranty, contract, tort, or any other legal theory, even if Pindrop has been advised of the possibility of such damages.
          </p>
        </Section>

        <Section id="changes-to-terms" title="9. Changes to these terms">
          <p>
            These terms may be updated from time to time. The date at the top of this page indicates when they were last revised. Continued use of Pindrop after a change constitutes acceptance of the revised terms.
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
            href="/privacy"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Privacy policy
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Contact
          </Link>
        </nav>
      </div>
    </SiteLayout>
  );
}
