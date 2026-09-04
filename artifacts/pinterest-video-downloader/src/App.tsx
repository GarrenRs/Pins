/**
 * App.tsx — Root application component for Pindrop
 *
 * Routing (wouter):
 *   /                                    → Home (main downloader, primary SEO intent)
 *   /pinterest-video-downloader          → Pinterest Video Downloader landing page
 *   /how-to-download-pinterest-videos    → Step-by-step guide
 *   /about                               → About Pindrop
 *   /contact                             → Contact page
 *   /privacy                             → Privacy policy
 *   /terms                               → Terms of service
 *   *                                    → 404 Not Found
 */
import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useHealthCheck, useResolvePinterestPin, getHealthCheckQueryKey } from '@workspace/api-client-react';
import type { ResolveResponse } from '@workspace/api-client-react';
import {
  ArrowDownToLine, Check, CircleHelp, Clipboard, CloudDownload,
  Link2, LoaderCircle, RefreshCw, ShieldCheck, Sparkles, Video,
  WandSparkles, Play, FileVideo2, Smartphone, Monitor
} from 'lucide-react';
import NotFound from '@/pages/not-found';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import Privacy from '@/pages/privacy';
import Terms from '@/pages/terms';
import HowToDownloadPinterestVideos from '@/pages/how-to-download-pinterest-videos';
import PinterestVideoDownloaderPage from '@/pages/pinterest-video-downloader';
import { PageHead } from '@/components/page-head';
import { SiteFooter } from '@/components/layout';
import { PAGE_META } from '@/lib/seo';
import {
  Route,
  Switch,
  useLocation,
  Link,
  Router as WouterRouter,
} from 'wouter';

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

const HOMEPAGE_FAQS = [
  {
    question: 'Which Pinterest links does Pindrop support?',
    answer:
      'Pindrop supports standard Pinterest Pin URLs (pinterest.com/pin/...) and short links from the app (pin.it/...). Any publicly accessible video Pin will work.',
  },
  {
    question: 'Do I need a Pinterest account?',
    answer:
      'No. Pindrop only needs the public URL of the Pin. There is no sign-in, account, or browser extension involved.',
  },
  {
    question: 'What video quality will I get?',
    answer:
      'We return the best video source available from that Pin. The format and resolution are shown before you save it, so you know what to expect.',
  },
  {
    question: "Why can't some Pinterest videos be downloaded?",
    answer:
      "Some Pins link to videos hosted externally on YouTube or Vimeo rather than on Pinterest's own servers. Pindrop can only resolve videos stored directly on Pinterest's CDN. Image-only Pins and private content are also not supported.",
  },
  {
    question: 'Where does the video go after I download it?',
    answer:
      "Your browser handles the download directly. Pindrop does not create a library or keep a copy for you — the video saves to wherever your browser puts downloads (usually a Downloads folder).",
  },
  {
    question: 'Is Pindrop affiliated with Pinterest?',
    answer:
      'No. Pindrop is an independent tool and is not affiliated with, endorsed by, or connected to Pinterest, Inc. in any way.',
  },
  {
    question: 'Which Pinterest videos can I download?',
    answer:
      'Pindrop can download publicly accessible video Pins. Private boards, login-required content, and image-only Pins are not supported. Only download videos you own, have created, or are otherwise authorized or legally permitted to save.',
  },
];

function Home() {
  const meta = PAGE_META.home;
  const [result, setResult] = useState<ResolveResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const health = useHealthCheck({
    query: { queryKey: getHealthCheckQueryKey(), staleTime: 60_000, retry: 1 },
  });
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
    <div className="noise min-h-[100dvh] overflow-x-hidden flex flex-col">
      <PageHead
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        faqs={HOMEPAGE_FAQS}
      />

      {/* Homepage-specific header (design-forward variant) */}
      <header
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 lg:px-8"
        data-testid="header-main"
        role="banner"
      >
        <a href="/" className="flex items-center gap-3" aria-label="Pindrop home" data-testid="link-home">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-[13px] bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
            <span className="h-3 w-3 rounded-full border-2 border-primary-foreground" />
          </span>
          <span className="text-[15px] font-bold tracking-[-.03em]">
            pin<span className="text-primary">drop</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <Link href="/how-to-download-pinterest-videos" className="hidden transition-colors hover:text-foreground sm:block" data-testid="link-how-it-works">
              How it works
            </Link>
            <Link href="/#faq" className="hidden transition-colors hover:text-foreground sm:block" data-testid="link-faq">
              FAQ
            </Link>
            <span
              className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5"
              data-testid="status-service"
              aria-label={health.isError ? 'Service checking' : 'Service ready'}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  health.isLoading
                    ? 'animate-pulse-dot bg-muted-foreground'
                    : health.isError
                      ? 'bg-destructive'
                      : 'bg-accent'
                }`}
                aria-hidden="true"
              />
              {health.isError ? 'Service checking' : 'Ready to save'}
            </span>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero + Tool ─────────────────────────────────────────────── */}
        <section
          className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20"
          aria-labelledby="hero-heading"
        >
          <div className="animate-rise-in">
            <div className="mb-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[.17em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Pinterest video saver
            </div>

            {/* Primary H1 — exact primary keyword for SEO */}
            <h1
              id="hero-heading"
              className="max-w-[680px] text-[clamp(2.2rem,6.5vw,5.5rem)] font-semibold leading-[.95] tracking-[-.06em] text-foreground break-words"
            >
              Pinterest Video{' '}
              <span className="display-serif font-normal italic text-primary">Downloader</span>
            </h1>

            <p className="mt-5 sm:mt-7 max-w-[460px] text-base sm:text-[17px] leading-7 text-muted-foreground">
              Save Pinterest videos as MP4 files — no login, no app, no detours. Paste your Pin link below and download the video directly to your device.
            </p>

            {/* ── Downloader Form ────────────────────────────────────── */}
            <div className="mt-8 sm:mt-10 max-w-[620px]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(submit)}
                  className="relative"
                  data-testid="form-resolve"
                >
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Pinterest video URL</FormLabel>
                        <div
                          className={`group flex flex-col gap-2 rounded-[20px] border bg-card p-2 shadow-[0_16px_40px_rgba(67,42,35,.08)] transition-all focus-within:border-primary/60 focus-within:shadow-[0_16px_44px_rgba(185,38,75,.13)] sm:flex-row sm:items-center ${
                            form.formState.errors.url
                              ? 'border-destructive/70'
                              : 'border-card-border'
                          }`}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                            <Link2
                              className="h-5 w-5 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <FormControl>
                              <Input
                                {...field}
                                type="url"
                                autoComplete="url"
                                placeholder="Paste your Pinterest link here"
                                className="h-12 border-0 bg-transparent px-0 text-sm sm:text-base shadow-none focus-visible:ring-0"
                                data-testid="input-pinterest-url"
                              />
                            </FormControl>
                          </div>
                          <Button
                            type="submit"
                            disabled={resolver.isPending}
                            className="h-12 w-full sm:w-auto rounded-[14px] bg-primary px-6 font-bold text-primary-foreground shadow-none hover:bg-primary/90"
                            data-testid="button-resolve"
                          >
                            {resolver.isPending ? (
                              <>
                                <LoaderCircle className="h-4 w-4 animate-spin" /> Finding video
                              </>
                            ) : (
                              <>
                                Download video <ArrowDownToLine className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                        <FormDescription className="mt-3 px-1 text-xs text-muted-foreground">
                          Works with standard Pinterest Pin links and pin.it shares.
                        </FormDescription>
                        <FormMessage className="px-1" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              {resolver.isPending && <LoadingCard />}
              {resolver.isError && !resolver.isPending && (
                <ErrorCard
                  message={errorMessage}
                  onRetry={() => form.handleSubmit(submit)()}
                />
              )}
              {result && !resolver.isPending && (
                <ResultCard result={result} copied={copied} onCopy={copyLink} />
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> No account required
              </span>
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4 text-accent" aria-hidden="true" /> MP4 where available
              </span>
              <span className="flex items-center gap-2">
                <CloudDownload className="h-4 w-4 text-accent" aria-hidden="true" /> Saves directly to your device
              </span>
            </div>
          </div>

          {/* Visual panel */}
          <div
            className="relative mx-auto w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[470px] animate-rise-in-delay lg:ml-auto p-2 sm:p-0"
            aria-label="Illustration showing a saved video"
            aria-hidden="true"
          >
            <div className="absolute -right-3 -top-3 h-24 w-24 rounded-full border border-primary/20 bg-primary/10 sm:-right-7 sm:-top-7 sm:h-40 sm:w-40" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border border-accent/20 bg-accent/10 sm:-bottom-8 sm:-left-8 sm:h-32 sm:w-32" />
            <div className="relative aspect-[.82] rotate-[-2deg] sm:rotate-[-3deg] overflow-hidden rounded-[26px] sm:rounded-[34px] border-[6px] sm:border-[10px] border-foreground bg-foreground shadow-[10px_14px_0_hsl(var(--primary)/.22)] sm:shadow-[14px_18px_0_hsl(var(--primary)/.22)]">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,hsl(174_37%_35%)_0%,hsl(186_28%_49%)_38%,hsl(37_73%_73%)_38%,hsl(29_67%_67%)_100%)]" />
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 18% 22%, white 0 1px, transparent 1.5px), radial-gradient(circle at 80% 60%, white 0 1px, transparent 1.5px)',
                  backgroundSize: '39px 39px, 53px 53px',
                }}
              />
              <div className="absolute left-5 top-5 sm:left-7 sm:top-7 rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-foreground">
                Saved for later
              </div>
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                <div className="mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 animate-float items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--foreground))] sm:shadow-[5px_5px_0_hsl(var(--foreground))]">
                  <Play className="ml-1 h-5 w-5 sm:h-7 sm:w-7 fill-current" aria-hidden="true" />
                </div>
                <p className="display-serif text-3xl sm:text-5xl italic leading-[.88] text-card">
                  Small rituals
                  <br />
                  for slow days.
                </p>
                <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-card/30 pt-3 text-[10px] font-bold uppercase tracking-[.14em] text-card/80">
                  <span>pindrop / 04</span>
                  <span>00:17</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 right-0 sm:-bottom-5 sm:right-[-20px] flex items-center gap-2.5 sm:gap-3 rounded-[14px] border border-card-border bg-card px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_10px_28px_rgba(67,42,35,.12)]">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold">Ready to keep</p>
                <p className="mono text-[9px] text-muted-foreground">video.mp4 · 1080p</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="border-y border-border/80 bg-card/45"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="mono mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
                  01 / three steps
                </p>
                <h2 id="how-it-works-heading" className="max-w-[300px] text-4xl font-semibold tracking-[-.06em]">
                  From Pin to{' '}
                  <span className="display-serif italic font-normal">device.</span>
                </h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                <StepCard
                  number="01"
                  icon={<Clipboard />}
                  title="Copy the link"
                  text="Tap share on Pinterest and copy the Pin URL. Both full links and short pin.it links work."
                />
                <StepCard
                  number="02"
                  icon={<WandSparkles />}
                  title="Paste it here"
                  text="We find the clean video file behind the Pin and show you a preview before you commit to downloading."
                />
                <StepCard
                  number="03"
                  icon={<CloudDownload />}
                  title="Save the video"
                  text="Download the MP4 once. It saves directly to your Downloads folder — no cloud, no account, no middleman."
                />
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/how-to-download-pinterest-videos"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                Full step-by-step guide →
              </Link>
            </div>
          </div>
        </section>

        {/* ── What Pindrop supports ───────────────────────────────────── */}
        <section
          aria-labelledby="supports-heading"
          className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20"
        >
          <p className="mono mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
            02 / what works
          </p>
          <h2
            id="supports-heading"
            className="mb-8 max-w-[480px] text-4xl font-semibold tracking-[-.06em]"
          >
            Supported <span className="display-serif italic font-normal">links & formats</span>
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Link2 className="h-5 w-5" />,
                title: 'Pin URLs',
                text: 'Standard pinterest.com/pin/... links copied from any browser or the Pinterest website.',
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: 'pin.it share links',
                text: 'Short links generated when you share a Pin from the Pinterest mobile app.',
              },
              {
                icon: <FileVideo2 className="h-5 w-5" />,
                title: 'MP4 video',
                text: "Most Pinterest videos are stored as MP4 — the most universally supported format across all devices.",
              },
              {
                icon: <Smartphone className="h-5 w-5" />,
                title: 'Mobile browsers',
                text: 'Works in Safari on iPhone, Chrome on Android, and any other mobile browser — no app needed.',
              },
              {
                icon: <Monitor className="h-5 w-5" />,
                title: 'Desktop browsers',
                text: 'Chrome, Firefox, Edge, Safari — all supported. Download and manage your videos on your computer.',
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: 'Public Pins only',
                text: 'Pindrop only works with publicly accessible Pins. Private boards and login-protected content are not supported.',
              },
            ].map(({ icon, title, text }) => (
              <div
                key={title}
                className="rounded-[16px] border border-border bg-card p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                  {icon}
                </div>
                <h3 className="mb-1 text-sm font-bold">{title}</h3>
                <p className="text-xs leading-5 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Privacy ─────────────────────────────────────────────────── */}
        <section
          aria-labelledby="privacy-heading"
          className="border-y border-border/80 bg-card/45"
        >
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mono mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
                  03 / privacy
                </p>
                <h2
                  id="privacy-heading"
                  className="mb-4 text-3xl font-semibold tracking-[-.06em]"
                >
                  Your link, processed{' '}
                  <span className="display-serif italic font-normal text-primary">privately.</span>
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  Pindrop does not store your submitted Pinterest links after processing. It does not create a user account, track your history, or sell your data to anyone. The video streams directly from Pinterest's servers to your browser — Pindrop does not keep a copy.
                </p>
                <div className="mt-5">
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-2 hover:no-underline"
                  >
                    Read the privacy policy →
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🔒', label: 'No account required' },
                  { icon: '🗑️', label: 'Links not stored' },
                  { icon: '📡', label: 'Direct CDN stream' },
                  { icon: '🚫', label: 'No data sold' },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-[14px] border border-border bg-background px-4 py-3"
                  >
                    <span className="text-lg" aria-hidden="true">{icon}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Responsible use ─────────────────────────────────────────── */}
        <section
          aria-labelledby="responsible-use-heading"
          className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16"
        >
          <div className="rounded-[20px] border border-border bg-card p-6 lg:p-8">
            <p className="mono mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
              04 / responsible use
            </p>
            <h2
              id="responsible-use-heading"
              className="mb-3 text-2xl font-semibold tracking-[-.05em]"
            >
              Download what you are authorized to save.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Pindrop processes publicly accessible Pinterest links. You should only download content you own, have created, or are otherwise authorized or legally permitted to save. This tool is a shortcut for your own saves — not a way around someone else's creative rights.
            </p>
            <div className="mt-4">
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                Read the terms of service →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-20"
        >
          <div>
            <p className="mono mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
              05 / the small print
            </p>
            <h2
              id="faq-heading"
              className="max-w-[330px] text-4xl font-semibold tracking-[-.06em]"
            >
              Questions,{' '}
              <span className="display-serif italic font-normal">answered.</span>
            </h2>
            <p className="mt-5 max-w-[300px] text-sm leading-6 text-muted-foreground">
              No hidden steps. Here is exactly what Pindrop does with a link — and what it does not.
            </p>
          </div>
          <Accordion type="single" collapsible className="border-t border-border" data-testid="accordion-faq">
            {HOMEPAGE_FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i + 1}`} className="border-b border-border">
                <AccordionTrigger className="py-5 text-left text-sm font-bold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[620px] pb-5 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ── Internal links / CTA ────────────────────────────────────── */}
        <section
          className="mx-4 sm:mx-5 mb-12 overflow-hidden rounded-[20px] sm:rounded-[24px] bg-foreground p-6 sm:p-10 lg:p-14 text-card lg:mx-auto lg:max-w-6xl"
          aria-label="Links to related pages"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="mono mb-2 sm:mb-3 text-[10px] uppercase tracking-[.18em] text-primary">
                More from Pindrop
              </p>
              <p className="display-serif max-w-[500px] text-2xl sm:text-3xl lg:text-4xl italic leading-tight">
                Less scrolling. More keeping.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:items-end w-full sm:w-auto">
              <Link
                href="/how-to-download-pinterest-videos"
                className="inline-flex w-full justify-between sm:w-fit items-center gap-2 rounded-full border border-card/25 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-card/10 min-h-[44px]"
              >
                <span>How to download Pinterest videos</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/pinterest-video-downloader"
                className="inline-flex w-full justify-between sm:w-fit items-center gap-2 rounded-full border border-card/25 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-card/10 min-h-[44px]"
              >
                <span>Online Pinterest Video Downloader</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex w-full justify-between sm:w-fit items-center gap-2 rounded-full border border-card/25 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-card/10 min-h-[44px]"
              >
                <span>About Pindrop</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function LoadingCard() {
  return (
    <div
      className="mt-4 rounded-[18px] border border-card-border bg-card p-5"
      aria-live="polite"
      data-testid="status-resolving"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-5 h-2 animate-pulse rounded-full bg-muted" />
      <p className="mono mt-4 text-[10px] uppercase tracking-[.14em] text-muted-foreground">
        Looking behind the Pin…
      </p>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="mt-4 flex items-start gap-4 rounded-[18px] border border-destructive/25 bg-destructive/5 p-5"
      role="alert"
      data-testid="status-resolve-error"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <CircleHelp className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">That link needs another look.</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{message}</p>
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          data-testid="button-retry"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Try again
        </button>
      </div>
    </div>
  );
}

function ResultCard({
  result,
  copied,
  onCopy,
}: {
  result: ResolveResponse;
  copied: boolean;
  onCopy: () => void;
}) {
  const { pin, media } = result;
  const bytes = media.size ? `${(media.size / 1024 / 1024).toFixed(1)} MB` : 'Size varies';
  return (
    <div
      className="mt-4 overflow-hidden rounded-[20px] border border-accent/25 bg-card shadow-[0_14px_36px_rgba(67,42,35,.08)]"
      data-testid="card-resolve-result"
    >
      <div className="relative aspect-video overflow-hidden bg-foreground">
        <video
          src={media.download_url}
          controls
          preload="metadata"
          className="h-full w-full object-contain"
          aria-label={pin.title || 'Resolved Pinterest video'}
          data-testid="video-preview"
        />
        <span className="absolute left-3 top-3 rounded-full bg-foreground/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-card backdrop-blur-sm">
          {media.format.toUpperCase()} ready
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold">{pin.title || 'Your Pinterest video'}</p>
            <p className="mono mt-1 text-[10px] uppercase tracking-[.12em] text-muted-foreground">
              {media.quality || 'Best available'} ·{' '}
              {media.width && media.height
                ? `${media.width} × ${media.height}`
                : 'Original size'}{' '}
              · {bytes}
            </p>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href={media.download_url}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[12px] bg-primary px-4 text-sm font-bold text-primary-foreground transition-[transform,background] hover:-translate-y-0.5 hover:bg-primary/90"
            data-testid="button-download"
          >
            <ArrowDownToLine className="h-4 w-4" aria-hidden="true" /> Download video
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] border border-border px-4 text-sm font-bold transition-colors hover:bg-muted"
            data-testid="button-copy-download-link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent" aria-hidden="true" />
            ) : (
              <Clipboard className="h-4 w-4" aria-hidden="true" />
            )}{' '}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between">
        <span className="mono text-[10px] font-bold text-primary">{number}</span>
        <span className="text-accent [&_svg]:h-5 [&_svg]:w-5" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

/* ── Router ──────────────────────────────────────────────────────────────── */

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pinterest-video-downloader" component={PinterestVideoDownloaderPage} />
        <Route path="/how-to-download-pinterest-videos" component={HowToDownloadPinterestVideos} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
