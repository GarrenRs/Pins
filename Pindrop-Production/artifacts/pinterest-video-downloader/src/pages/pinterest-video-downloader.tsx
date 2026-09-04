/**
 * Online Pinterest Video Downloader — /pinterest-video-downloader
 *
 * Distinct search intent:
 * Target: "online pinterest video downloader", "pinterest video downloader hd 1080p mp4"
 * Role: Focused online utility landing page + technical format, resolution,
 *       and troubleshooting specifications.
 */
import { type ReactNode, useState } from 'react';
import { Link } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiteLayout, Breadcrumb } from '@/components/layout';
import { PageHead } from '@/components/page-head';
import { PAGE_META } from '@/lib/seo';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResolvePinterestPin } from '@workspace/api-client-react';
import type { ResolveResponse } from '@workspace/api-client-react';
import {
  ArrowDownToLine, Check, CircleHelp, Clipboard,
  Link2, LoaderCircle, RefreshCw, ShieldCheck, Video, FileVideo2, Zap,
  SlidersHorizontal, CheckCircle2, AlertTriangle, Layers, Smartphone
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const meta = PAGE_META.pinterestVideoDownloader;

const queryClient = new QueryClient();

const resolveSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Paste a Pinterest video link to continue.')
    .max(2048, 'That link is too long.')
    .url('Enter a valid Pinterest URL, starting with https://.')
    .refine(
      (value) => /(?:pinterest\.[a-z.]+|pin\.it)/i.test(value),
      'That does not look like a Pinterest link.',
    ),
});
type ResolveFormValues = z.infer<typeof resolveSchema>;

/** 5 Unique Technical FAQs specific to the Online Downloader tool */
const TECHNICAL_FAQS = [
  {
    question: 'Does Pindrop re-encode or compress downloaded Pinterest videos?',
    answer:
      "No. Pindrop retrieves the exact video stream delivered by Pinterest's CDN servers without applying any re-compression, transcoding, or downscaling. If the creator uploaded a 1080p source, you receive the uncompressed 1080p MP4 directly.",
  },
  {
    question: 'How does Pindrop ensure the audio track is included in the MP4?',
    answer:
      "Some social media platforms separate video and audio streams. Pinterest video Pins that feature audio typically provide multiplexed MP4 containers. Pindrop's ranking engine prioritizes complete audio-visual MP4 streams over muted variants so you always get sound when it was present in the original Pin.",
  },
  {
    question: 'Why do Pindrop download tokens expire after 15 minutes?',
    answer:
      'Download tokens are generated using cryptographically secure 24-byte random keys with a 15-minute Time-To-Live (TTL). This security measure prevents stale cache accumulation and protects the streaming pipeline. If your download link expires, simply paste the Pin link again to generate a new token.',
  },
  {
    question: 'Can I download 4K or 60fps Pinterest Pins?',
    answer:
      "Videos can only be downloaded at the maximum resolution rendered by Pinterest's ingestion pipeline (typically 1080p Full HD or 720p HD at 30fps). Pindrop displays the exact resolution and file size in the preview before you download so you know precisely what format is available.",
  },
  {
    question: 'Are private boards or secret Pins supported by this online tool?',
    answer:
      'No. Pindrop strictly processes publicly accessible Pinterest links. Secret Pins, invite-only group boards, and login-gated content cannot be fetched or resolved. This protects user privacy and respects content permissions.',
  },
];

function DownloaderTool() {
  const [result, setResult] = useState<ResolveResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const resolver = useResolvePinterestPin({
    mutation: { onSuccess: (data) => setResult(data) },
  });

  const form = useForm<ResolveFormValues>({
    resolver: zodResolver(resolveSchema),
    defaultValues: { url: '' },
  });

  const submit = (values: ResolveFormValues) => {
    setResult(null);
    resolver.mutate({ data: { url: values.url } });
  };

  const copyLink = async () => {
    if (!result?.media.download_url) return;
    await navigator.clipboard?.writeText(result.media.download_url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const errorMessage = (() => {
    const error = resolver.error as { error?: { message?: string } } | null;
    return error?.error?.message || 'We could not read that Pin. Check the link and try once more.';
  })();

  return (
    <div
      className="mb-10 rounded-[24px] border border-border bg-card p-4 sm:p-6 shadow-[0_16px_40px_rgba(67,42,35,.08)]"
      aria-label="Online Pinterest video downloader tool"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3" data-testid="form-resolve-pvd">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Pinterest video URL</FormLabel>
                <div
                  className={`flex flex-col gap-2 rounded-[16px] border bg-background p-2 transition-all focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/.1)] sm:flex-row sm:items-center ${
                    form.formState.errors.url ? 'border-destructive/70' : 'border-border'
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                    <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        autoComplete="url"
                        placeholder="Paste your Pinterest video link here"
                        className="h-12 border-0 bg-transparent px-0 text-sm sm:text-base shadow-none focus-visible:ring-0"
                        data-testid="input-pinterest-url-pvd"
                      />
                    </FormControl>
                  </div>
                  <Button
                    type="submit"
                    disabled={resolver.isPending}
                    className="h-12 w-full sm:w-auto rounded-[12px] bg-primary px-6 font-bold text-primary-foreground shadow-none hover:bg-primary/90"
                    data-testid="button-resolve-pvd"
                  >
                    {resolver.isPending ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" /> Finding video
                      </>
                    ) : (
                      <>
                        Get video <ArrowDownToLine className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                <FormMessage className="px-1" />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {resolver.isPending && (
        <div className="mt-4 rounded-[14px] border border-border bg-background p-4" aria-live="polite">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-44 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <p className="mono mt-3 text-[10px] uppercase tracking-[.14em] text-muted-foreground">
            Resolving CDN video source…
          </p>
        </div>
      )}

      {resolver.isError && !resolver.isPending && (
        <div className="mt-4 flex items-start gap-4 rounded-[14px] border border-destructive/25 bg-destructive/5 p-4" role="alert">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <CircleHelp className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Unable to resolve video</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{errorMessage}</p>
            <button
              onClick={() => form.handleSubmit(submit)()}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </div>
      )}

      {result && !resolver.isPending && (
        <div className="mt-4 overflow-hidden rounded-[16px] border border-accent/25 bg-background" data-testid="card-result-pvd">
          <div className="relative aspect-video overflow-hidden bg-foreground">
            <video
              src={result.media.download_url}
              controls
              preload="metadata"
              className="h-full w-full object-contain"
              aria-label={result.pin.title || 'Resolved Pinterest video'}
            />
            <span className="absolute left-3 top-3 rounded-full bg-foreground/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-card backdrop-blur-sm">
              {result.media.format.toUpperCase()} ready
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{result.pin.title || 'Your Pinterest video'}</p>
                <p className="mono mt-1 text-[10px] uppercase tracking-[.12em] text-muted-foreground">
                  {result.media.quality || 'Best available'} ·{' '}
                  {result.media.width && result.media.height ? `${result.media.width} × ${result.media.height}` : 'Original size'} ·{' '}
                  {result.media.size ? `${(result.media.size / 1024 / 1024).toFixed(1)} MB` : 'Size varies'}
                </p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Check className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={result.media.download_url}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowDownToLine className="h-4 w-4" /> Download MP4 file
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-border px-4 text-sm font-bold transition-colors hover:bg-muted"
              >
                {copied ? <Check className="h-4 w-4 text-accent" /> : <Clipboard className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Direct CDN stream
        </span>
        <span className="flex items-center gap-2">
          <Video className="h-3.5 w-3.5 text-accent" /> 1080p / 720p MP4
        </span>
        <span className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-accent" /> Instant browser save
        </span>
      </div>
    </div>
  );
}

function SpecCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-[16px] border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-bold">{title}</h3>
      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

export default function PinterestVideoDownloaderPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteLayout>
        <PageHead
          title={meta.title}
          description={meta.description}
          canonical={meta.canonical}
          breadcrumbs={meta.breadcrumbs}
          faqs={TECHNICAL_FAQS}
        />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 lg:px-8 lg:py-16">
          <Breadcrumb items={meta.breadcrumbs!} />

          <header className="mb-8 sm:mb-10">
            <p className="mono mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
              Online Browser Utility
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              Online Pinterest Video <span className="display-serif italic font-normal text-primary">Downloader</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-muted-foreground">
              Extract and download MP4 video files directly from public Pinterest Pins in full resolution. Our online tool queries Pinterest's CDN in real time to provide clean, uncompressed video streams with original audio tracks.
            </p>
          </header>

          {/* Interactive Tool */}
          <DownloaderTool />

          {/* ── Technical Resolution & Format Specifications ──────────────── */}
          <section aria-labelledby="specs-heading" className="mb-12 sm:mb-16">
            <div className="mb-6">
              <p className="mono text-[10px] font-bold uppercase tracking-[.18em] text-primary mb-1">
                Technical Overview
              </p>
              <h2 id="specs-heading" className="text-2xl font-semibold tracking-[-0.04em]">
                Resolution & Bitrate Specifications
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SpecCard
                icon={<FileVideo2 className="h-4 w-4" />}
                title="1080p & 720p MP4"
                description="Pinterest encodes videos in standard H.264/MP4 profiles. Pindrop identifies the highest bitrate profile available and streams it directly to your device."
              />
              <SpecCard
                icon={<SlidersHorizontal className="h-4 w-4" />}
                title="Zero Transcoding"
                description="We do not re-encode or compress your video. The file is streamed directly from Pinterest's content delivery network to your device without modification."
              />
              <SpecCard
                icon={<Layers className="h-4 w-4" />}
                title="Synchronized Audio"
                description="Our candidate ranking engine strictly checks audio track availability, ensuring you receive videos with fully synchronized sound rather than muted visual tracks."
              />
            </div>
          </section>

          {/* ── Technical URL Syntax Guide ─────────────────────────────────── */}
          <section aria-labelledby="syntax-heading" className="mb-12 sm:mb-16 rounded-[20px] border border-border bg-card p-5 sm:p-7">
            <h2 id="syntax-heading" className="text-xl font-semibold tracking-[-0.04em] mb-3">
              Supported URL Schemas & Syntax
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-6">
              Pindrop's resolver engine normalizes multiple variations of Pinterest links, following HTTP 301/302 redirects automatically:
            </p>
            <div className="space-y-3">
              {[
                {
                  type: 'Canonical Desktop Pins',
                  syntax: 'https://www.pinterest.com/pin/{pin_id}/',
                  note: 'Direct Pin identifier, quickest resolution time (~1.2s)',
                },
                {
                  type: 'Mobile App Shortlinks',
                  syntax: 'https://pin.it/{shortcode}',
                  note: 'Automatically followed to the destination Pin ID via secure header redirects',
                },
                {
                  type: 'Regional TLDs',
                  syntax: 'https://{country}.pinterest.com/pin/...',
                  note: 'Supports regional domains (e.g. pinterest.co.uk, pinterest.fr, pinterest.de)',
                },
                {
                  type: 'Mobile Query Strings',
                  syntax: '.../pin/{id}/?invite_code=...&sender=...',
                  note: 'Tracking parameters are stripped cleanly prior to resolution',
                },
              ].map(({ type, syntax, note }) => (
                <div key={type} className="rounded-[12px] border border-border/70 bg-background p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-foreground">{type}</span>
                    <span className="text-[11px] text-muted-foreground">{note}</span>
                  </div>
                  <code className="block text-[11px] sm:text-xs text-primary font-mono break-all">
                    {syntax}
                  </code>
                </div>
              ))}
            </div>
          </section>

          {/* ── Troubleshooting & Error Diagnostics ───────────────────────── */}
          <section aria-labelledby="diagnostics-heading" className="mb-12 sm:mb-16">
            <h2 id="diagnostics-heading" className="text-2xl font-semibold tracking-[-0.04em] mb-4">
              Troubleshooting & Diagnostics
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-6">
              Encountering an issue while saving a Pin? Here is how Pindrop handles common edge cases:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[16px] border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <h3 className="text-sm font-bold text-foreground">External Video Pins (YouTube/Vimeo)</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-5">
                  Some Pins embed players from external platforms rather than native Pinterest files. Pindrop only downloads videos hosted on Pinterest's own CDN (pinimg.com).
                </p>
              </div>

              <div className="rounded-[16px] border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2 text-accent">
                  <Smartphone className="h-4 w-4" />
                  <h3 className="text-sm font-bold text-foreground">iPhone / Safari Download Prompt</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-5">
                  If Safari opens the video stream in the media player instead of saving, tap the Safari Share button and select "Save to Files" or long-press the download button and choose "Download Linked File".
                </p>
              </div>

              <div className="rounded-[16px] border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <RefreshCw className="h-4 w-4" />
                  <h3 className="text-sm font-bold text-foreground">Token Expiration (15 Minutes)</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-5">
                  For server security and token cleanliness, temporary download URLs expire 15 minutes after issuance. If your download stalls or expires, re-submit the link for an immediate fresh token.
                </p>
              </div>

              <div className="rounded-[16px] border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2 text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                  <h3 className="text-sm font-bold text-foreground">Rate Limiting Safeguards</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-5">
                  Pindrop enforces an in-memory limit of 10 requests per minute per IP to maintain service stability and prevent abuse. Normal browsing and downloads are never impacted.
                </p>
              </div>
            </div>
          </section>

          {/* ── Dedicated Technical FAQs ───────────────────────────────────── */}
          <section aria-labelledby="faq-tech-heading" className="mb-12">
            <h2 id="faq-tech-heading" className="text-2xl font-semibold tracking-[-0.04em] mb-4">
              Online Downloader FAQ
            </h2>
            <Accordion type="single" collapsible className="border-t border-border">
              {TECHNICAL_FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                  <AccordionTrigger className="py-4 text-left text-sm font-bold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-xs sm:text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* ── Cross-Navigation ───────────────────────────────────────────── */}
          <nav aria-label="Related guides" className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back to Home
            </Link>
            <Link
              href="/how-to-download-pinterest-videos"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Step-by-step device guide
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              About Pindrop
            </Link>
          </nav>
        </div>
      </SiteLayout>
    </QueryClientProvider>
  );
}
