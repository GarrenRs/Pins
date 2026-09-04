/**
 * Contact page — /contact
 * Provides a contact method for user feedback, issues, and abuse reports.
 * Contact email is configured via VITE_CONTACT_EMAIL environment variable.
 */
import { Link } from 'wouter';
import { SiteLayout, Breadcrumb } from '@/components/layout';
import { PageHead } from '@/components/page-head';
import { PAGE_META } from '@/lib/seo';
import { Mail, MessageSquare, AlertTriangle } from 'lucide-react';

const meta = PAGE_META.contact;

// Contact email: set VITE_CONTACT_EMAIL in your environment to configure this.
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'hello@pindrop.app';

export default function Contact() {
  return (
    <SiteLayout>
      <PageHead
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        breadcrumbs={meta.breadcrumbs}
      />

      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <Breadcrumb items={meta.breadcrumbs!} />

        <header className="mb-10">
          <p className="mono mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">Contact</p>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
            Get in <span className="display-serif italic font-normal text-primary">touch.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Have a question, found a bug, or want to send feedback? Send us an email and we will get back to you as soon as we can.
          </p>
        </header>

        <div className="mb-10 grid gap-5 sm:grid-cols-1 md:grid-cols-3">
          {[
            {
              icon: <MessageSquare className="h-5 w-5" />,
              title: 'General questions',
              text: 'Questions about how Pindrop works, supported link types, or video quality.',
            },
            {
              icon: <AlertTriangle className="h-5 w-5" />,
              title: 'Report an issue',
              text: 'A Pinterest link that should work but does not, or an unexpected error message.',
            },
            {
              icon: <Mail className="h-5 w-5" />,
              title: 'Feedback',
              text: 'Suggestions, improvement ideas, or anything else you would like us to know.',
            },
          ].map(({ icon, title, text }) => (
            <div key={title} className="rounded-[16px] border border-border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                {icon}
              </div>
              <h2 className="mb-1 text-sm font-semibold">{title}</h2>
              <p className="text-xs leading-5 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[20px] border border-border bg-card p-5 sm:p-8">
          <h2 className="mb-1 text-lg font-semibold tracking-[-0.04em]">Email us</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            We respond to all messages, usually within a few business days.
          </p>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Pindrop%20Feedback`}
            className="inline-flex max-w-full items-center justify-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px] break-all"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{CONTACT_EMAIL}</span>
          </a>

          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            Please include the Pinterest link you were trying to download and a description of the issue when reporting a problem. This helps us investigate quickly.
          </p>
        </div>

        <div className="mt-8 rounded-[16px] border border-border/60 bg-card/40 p-5">
          <h2 className="mb-2 text-sm font-semibold">Copyright and content concerns</h2>
          <p className="text-xs leading-5 text-muted-foreground">
            If you are a content creator whose work has been downloaded without your consent, please contact{' '}
            <a
              href="https://policy.pinterest.com/en/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              Pinterest's copyright reporting team
            </a>{' '}
            directly. Pinterest controls access to its content and is the appropriate authority for content removal requests.
          </p>
        </div>

        <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Download a video
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Privacy policy
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            About Pindrop
          </Link>
        </nav>
      </div>
    </SiteLayout>
  );
}
