import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';

interface LayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: LayoutProps) {
  return (
    <div className="noise flex min-h-[100dvh] flex-col overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SiteHeader() {
  const [location] = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/how-to-download-pinterest-videos', label: 'How It Works' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm" role="banner">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5 lg:px-8">
        {/* Logo */}
        <Link href="/" aria-label="Pindrop home" className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[12px] bg-primary text-primary-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-primary-foreground" />
          </span>
          <span className="text-sm sm:text-[15px] font-bold tracking-[-.03em]">
            pin<span className="text-primary">drop</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1 sm:gap-2">
            {/* On small mobile (<640px), keep nav compact to prevent 320px overflow */}
            {navLinks.map((link) => (
              <li key={link.href} className={link.href === '/' ? 'hidden sm:block' : 'hidden md:block'}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    location === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-current={location === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="hidden sm:block md:hidden">
              <Link
                href="/how-to-download-pinterest-videos"
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Guide
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="inline-flex min-h-[36px] sm:min-h-[38px] items-center gap-1.5 rounded-[10px] bg-primary px-3 sm:px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <span className="hidden sm:inline">Download video</span>
                <span className="sm:hidden">Download</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  const footerLinks = [
    { href: '/about', label: 'About' },
    { href: '/how-to-download-pinterest-videos', label: 'How It Works' },
    { href: '/pinterest-video-downloader', label: 'Downloader' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ];

  return (
    <footer className="border-t border-border/60 bg-card/40" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div>
            <Link href="/" className="text-sm font-bold text-foreground">
              pindrop<span className="text-primary">.</span>
            </Link>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Free Pinterest video downloader. Not affiliated with Pinterest, Inc.
            </p>
          </div>

          {/* Links with touch-accessible tap targets */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground/60">
          © {year} Pindrop. Only download videos you are authorized to save. Pindrop is independent software, not an official Pinterest product.
        </p>
      </div>
    </footer>
  );
}

/** Breadcrumb display component for inner pages */
interface BreadcrumbProps {
  items: readonly { readonly name: string; readonly url: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.url} className="flex items-center gap-1.5 min-w-0">
            {index > 0 && <span aria-hidden="true" className="text-muted-foreground/40">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
                {item.name}
              </span>
            ) : (
              <Link href={item.url} className="hover:text-foreground hover:underline shrink-0">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
