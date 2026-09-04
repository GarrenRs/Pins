/**
 * About page — /about
 * Explains what Pindrop is, how it works, privacy philosophy, and responsible use.
 */
import { Link } from 'wouter';
import { SiteLayout, Breadcrumb } from '@/components/layout';
import { PageHead } from '@/components/page-head';
import { PAGE_META } from '@/lib/seo';
import { ShieldCheck, Zap, Download, Globe } from 'lucide-react';

const meta = PAGE_META.about;

export default function About() {
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
          <p className="mono mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-primary">About Pindrop</p>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl break-words">
            A quiet shortcut for <span className="display-serif italic font-normal text-primary">saving</span> videos you love.
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-muted-foreground">
            Pindrop is a free, browser-based Pinterest video downloader. You paste a link. We find the video. You save it. That is all it does — and that is intentional.
          </p>
        </header>

        <section aria-labelledby="what-pindrop-does" className="mb-10 sm:mb-12">
          <h2 id="what-pindrop-does" className="mb-4 text-xl font-semibold tracking-[-0.04em]">What Pindrop does</h2>
          <p className="mb-4 text-sm leading-7 text-muted-foreground">
            When you paste a Pinterest Pin URL into Pindrop, the service fetches the publicly accessible Pin page, locates the video file embedded in it, verifies that the file is reachable, and returns a direct download link to your browser. The video is streamed to you — Pindrop does not store a copy on its servers.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            Pindrop works with standard Pinterest Pin URLs (e.g. <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] sm:text-xs break-all">pinterest.com/pin/...</code>) and short share links from the Pinterest app (e.g. <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] sm:text-xs break-all">pin.it/...</code>). Only publicly accessible video Pins are supported — Pindrop cannot access private boards, restricted content, or Pins that require login.
          </p>
        </section>

        <section aria-labelledby="what-pindrop-does-not" className="mb-12">
          <h2 id="what-pindrop-does-not" className="mb-4 text-xl font-semibold tracking-[-0.04em]">What Pindrop does not do</h2>
          <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-accent">✓</span> Does not require an account or login</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-accent">✓</span> Does not save your submitted Pinterest URLs after processing</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-accent">✓</span> Does not store the downloaded videos on its servers</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-accent">✓</span> Does not build a user profile or track your browsing history</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-accent">✓</span> Does not claim affiliation with Pinterest, Inc.</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-accent">✓</span> Does not bypass private or login-protected content</li>
          </ul>
        </section>

        <div className="mb-12 grid gap-5 sm:grid-cols-2">
          {[
            {
              icon: <Zap className="h-5 w-5" />,
              title: 'Instant, no setup',
              text: 'There is nothing to install. The downloader runs directly in your browser on any device.',
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: 'Privacy-conscious',
              text: 'Submitted Pinterest links are used only to resolve the video and are not stored afterward.',
            },
            {
              icon: <Download className="h-5 w-5" />,
              title: 'Best quality available',
              text: 'Pindrop returns the highest-quality video source found in the Pin — usually MP4 when available.',
            },
            {
              icon: <Globe className="h-5 w-5" />,
              title: 'Works everywhere',
              text: 'Pindrop works on desktop browsers, mobile browsers on iPhone and Android, without any additional app.',
            },
          ].map(({ icon, title, text }) => (
            <div key={title} className="rounded-[16px] border border-border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                {icon}
              </div>
              <h3 className="mb-1 text-sm font-semibold">{title}</h3>
              <p className="text-xs leading-5 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <section aria-labelledby="responsible-use" className="mb-12 rounded-[16px] border border-border bg-card/60 p-6">
          <h2 id="responsible-use" className="mb-3 text-lg font-semibold tracking-[-0.04em]">Responsible use</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Pindrop processes publicly accessible Pinterest links. You should only download content you own, have created, or are otherwise authorized or legally permitted to save. Downloading and redistributing other people's creative work without permission is not something Pindrop encourages or supports.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            If you are a content creator whose work is being downloaded without your consent, you can report it directly to{' '}
            <a
              href="https://policy.pinterest.com/en/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              Pinterest's copyright policy team
            </a>
            .
          </p>
        </section>

        <nav aria-label="Related pages" className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Download a Pinterest video
          </Link>
          <Link
            href="/how-to-download-pinterest-videos"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            How it works
          </Link>
          <Link
            href="/privacy"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Privacy policy
          </Link>
        </nav>
      </div>
    </SiteLayout>
  );
}
