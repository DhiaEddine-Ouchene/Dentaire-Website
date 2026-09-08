'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { mainNav } from '@/config/nav';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Logo } from './logo';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Ombre discrète une fois la page défilée.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ferme le menu mobile à chaque changement de page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-shadow',
        scrolled ? 'border-ink-100 shadow-soft' : 'border-transparent'
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-6 lg:h-20 lg:px-8">
        <Logo />

        {/* Navigation — desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        {/* Actions — desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            href="/retrouver-rendez-vous"
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              pathname === '/retrouver-rendez-vous'
                ? 'bg-primary-50 text-primary-700'
                : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
            )}
          >
            {t('common.manageAppointment')}
          </Link>
          <Link href="/reservation" className={buttonVariants({ variant: 'primary' })}>
            {t('common.bookAppointment')}
          </Link>
        </div>

        {/* Actions — mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('common.closeMenu') : t('common.openMenu')}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-50"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      {open && (
        <div className="animate-fade-in border-t border-ink-100 bg-white lg:hidden">
          <nav className="mx-auto flex w-full max-w-[1320px] flex-col gap-1 px-5 py-4 sm:px-6">
            {mainNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-ink-700 hover:bg-ink-50'
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <Link
              href="/retrouver-rendez-vous"
              className={cn(
                'rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                pathname === '/retrouver-rendez-vous'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-700 hover:bg-ink-50'
              )}
            >
              {t('common.manageAppointment')}
            </Link>
            <Link
              href="/reservation"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'mt-3 w-full' })}
            >
              {t('common.bookAppointment')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
