/**
 * How to Download Pinterest Videos — /how-to-download-pinterest-videos
 *
 * Informational guide targeting long-tail intent:
 * "how to download a Pinterest video", "how to save Pinterest videos",
 * "how to download Pinterest videos on iPhone/Android/PC"
 *
 * This page is intentionally different from the homepage: it is a
 * step-by-step guide rather than a tool interface. The tool is linked
 * to from this page so users can act on the instructions.
 */
import { Link } from 'wouter';
import { SiteLayout, Breadcrumb } from '@/components/layout';
import { PageHead } from '@/components/page-head';
import { PAGE_META } from '@/lib/seo';
import { Clipboard, WandSparkles, CloudDownload, Smartphone, Monitor, Apple, AlertCircle, CheckCircle2 } from 'lucide-react';

const meta = PAGE_META.howTo;

const HOW_TO_FAQS = [
  {
    question: 'How do I find the Pinterest video link?',
    answer:
      'Open the Pin in the Pinterest app or website, tap the Share button, and choose "Copy link". The link will look like pinterest.com/pin/... or pin.it/... — either format works with Pindrop.',
  },
  {
    question: 'What video quality will I get?',
    answer:
      "Pindrop automatically selects the best available video source from the Pin. Pinterest typically offers MP4 video. The quality varies by what the original creator uploaded — Pindrop shows the resolution before you download so you know what to expect.",
  },
  {
    question: 'Why can some Pinterest videos not be downloaded?',
    answer:
      'Some Pins link to external videos hosted on YouTube, Vimeo, or other platforms rather than video files stored on Pinterest directly. Pindrop can only resolve videos hosted on Pinterest\'s own CDN. Pins without a directly embedded video file will not work.',
  },
  {
    question: 'Do I need an account to use Pindrop?',
    answer: 'No. Pindrop works entirely without an account. Just paste the link and download.',
  },
  {
    question: 'Is it free?',
    answer: 'Yes. Pindrop is completely free to use with no limits on how many videos you can download.',
  },
];

function Step({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {number}
      </div>
      <div className="pb-6 border-l border-border pl-6 flex-1 -ml-4 last:border-0">
        <div className="flex items-center gap-2 mb-2 mt-0.5">
          <span className="text-accent [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function PlatformCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-accent [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <div className="space-y-2 text-xs leading-5 text-muted-foreground">{children}</div>
    </div>
  );
}

export default function HowToDownloadPinterestVideos() {
  return (
    <SiteLayout>
      <PageHead
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        breadcrumbs={meta.breadcrumbs}
        faqs={HOW_TO_FAQS}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 lg:px-8 lg:py-16">
        <Breadcrumb items={meta.breadcrumbs!} />

        <header className="mb-8 sm:mb-10">
          <p className="mono mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-primary">Step-by-step guide</p>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl break-words">
            How to Download <span className="display-serif italic font-normal text-primary">Pinterest Videos</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-muted-foreground">
            Downloading a Pinterest video takes about 15 seconds. You need the Pin link and a browser — no account, no app, no extension required. Here is exactly how to do it.
          </p>
        </header>

        {/* Primary CTA */}
        <div className="mb-10 rounded-[20px] border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold">Ready to download?</p>
            <p className="text-xs text-muted-foreground">Open Pindrop, paste your Pinterest link, and get the video.</p>
          </div>
          <Link
            href="/"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]"
          >
            <CloudDownload className="h-4 w-4" aria-hidden="true" />
            Download a Pinterest video
          </Link>
        </div>

        {/* Steps */}
        <section aria-labelledby="steps-heading" className="mb-12">
          <h2 id="steps-heading" className="mb-6 text-xl font-semibold tracking-[-0.04em]">Three steps to your video</h2>
          <div className="space-y-0">
            <Step
              number="1"
              icon={<Clipboard />}
              title="Find and copy the Pinterest link"
              text="Open Pinterest on any device. Find the video Pin you want to save. Tap the share icon and choose 'Copy link'. The link will be either a full pinterest.com/pin/... URL or a short pin.it/... link. Both work equally well with Pindrop."
            />
            <Step
              number="2"
              icon={<WandSparkles />}
              title="Paste the link into Pindrop"
              text="Go to Pindrop in your browser. Click the input field labelled 'Paste your Pinterest link here' and paste the link you copied. Then click 'Find my video'. Pindrop will fetch the Pin page and locate the best available video source — usually in a few seconds."
            />
            <Step
              number="3"
              icon={<CloudDownload />}
              title="Preview and download the video"
              text="Once the video is found, a preview will appear so you can verify it is the right video. You will also see the format (MP4 or similar) and resolution. Click 'Download video' to save it to your device. Where the file is saved depends on your browser's download settings."
            />
          </div>
        </section>

        {/* Where to find the link */}
        <section aria-labelledby="find-link-heading" className="mb-12">
          <h2 id="find-link-heading" className="mb-4 text-xl font-semibold tracking-[-0.04em]">Where to find the Pinterest link</h2>
          <p className="mb-5 text-sm leading-7 text-muted-foreground">
            The exact steps to copy a Pinterest link vary slightly depending on whether you are using the website or the app.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[14px] border border-border bg-card p-4">
              <h3 className="mb-2 text-sm font-bold">On pinterest.com (desktop)</h3>
              <ol className="space-y-1.5 text-xs leading-5 text-muted-foreground list-decimal ml-4">
                <li>Open the Pin you want to save.</li>
                <li>Click the share icon (arrow pointing up) in the top-right of the Pin.</li>
                <li>Select "Copy link". The full URL is now in your clipboard.</li>
                <li>Alternatively, copy the URL directly from your browser's address bar.</li>
              </ol>
            </div>
            <div className="rounded-[14px] border border-border bg-card p-4">
              <h3 className="mb-2 text-sm font-bold">On the Pinterest app (mobile)</h3>
              <ol className="space-y-1.5 text-xs leading-5 text-muted-foreground list-decimal ml-4">
                <li>Open the Pin inside the Pinterest app.</li>
                <li>Tap the share icon (the upward arrow).</li>
                <li>Choose "Copy link". You will get a short pin.it/... link.</li>
                <li>This short link works just as well as the full URL.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Platform-specific notes */}
        <section aria-labelledby="by-device-heading" className="mb-12">
          <h2 id="by-device-heading" className="mb-2 text-xl font-semibold tracking-[-0.04em]">Downloading on different devices</h2>
          <p className="mb-5 text-sm leading-7 text-muted-foreground">
            Pindrop runs in any modern browser. The core process is identical on every platform — the difference is where the downloaded file ends up.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <PlatformCard icon={<Apple />} title="iPhone / iPad">
              <p>Open Pindrop in Safari. After clicking Download video, Safari will typically ask whether to open or save the file. Choose to save it, then find it in the Files app or Photos app depending on your iOS settings.</p>
              <p className="mt-2 flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
                <span>Safari on iOS handles video downloads differently from desktop browsers. If the video opens in a player instead of downloading, long-press and choose "Download Linked File" or use the Share Sheet to save it.</span>
              </p>
            </PlatformCard>

            <PlatformCard icon={<Smartphone />} title="Android">
              <p>Open Pindrop in Chrome or your preferred Android browser. Tap Download video and the file will be saved to your Downloads folder. Access it via your Files app or Gallery app.</p>
              <p className="mt-2 flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                <span>Chrome on Android generally handles MP4 downloads well. The video should save directly without extra steps.</span>
              </p>
            </PlatformCard>

            <PlatformCard icon={<Monitor />} title="Desktop (PC / Mac)">
              <p>Open Pindrop in any browser (Chrome, Firefox, Edge, Safari). Click Download video. The file will save to your browser's default Downloads folder, typically your Downloads directory.</p>
              <p className="mt-2 flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                <span>Desktop browsers offer the most reliable download experience. You can right-click the download button and choose "Save Link As" to control exactly where the file is saved.</span>
              </p>
            </PlatformCard>
          </div>
        </section>

        {/* Why some videos fail */}
        <section aria-labelledby="why-fail-heading" className="mb-12 rounded-[16px] border border-border bg-card/60 p-6">
          <h2 id="why-fail-heading" className="mb-3 text-lg font-semibold tracking-[-0.04em]">Why some Pinterest videos cannot be downloaded</h2>
          <p className="mb-4 text-sm leading-7 text-muted-foreground">
            Pindrop works with publicly accessible video Pins. A download may not be possible in these situations:
          </p>
          <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
            <li className="flex gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
              <span><strong className="font-semibold text-foreground">Externally hosted videos.</strong> Some Pins embed videos from YouTube, Vimeo, or TikTok. Pindrop can only download videos stored directly on Pinterest's servers.</span>
            </li>
            <li className="flex gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
              <span><strong className="font-semibold text-foreground">Image-only Pins.</strong> Not every Pin contains a video. Pindrop only works with video Pins.</span>
            </li>
            <li className="flex gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
              <span><strong className="font-semibold text-foreground">Private or login-protected Pins.</strong> Pindrop cannot access content that requires a Pinterest account to view.</span>
            </li>
            <li className="flex gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
              <span><strong className="font-semibold text-foreground">Temporary unavailability.</strong> Occasionally Pinterest's servers are temporarily slow or unavailable. Trying again after a few minutes usually resolves this.</span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mb-12">
          <h2 id="faq-heading" className="mb-6 text-xl font-semibold tracking-[-0.04em]">Frequently asked questions</h2>
          <div className="divide-y divide-border">
            {HOW_TO_FAQS.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none text-sm font-bold text-foreground select-none flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <nav aria-label="Related pages" className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <CloudDownload className="h-4 w-4" aria-hidden="true" />
            Download a Pinterest video now
          </Link>
          <Link
            href="/pinterest-video-downloader"
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Pinterest Video Downloader
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
