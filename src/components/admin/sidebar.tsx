'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  Users,
  Clock,
  Image,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ToothMark } from '@/components/public/logo';

const navItems = [
  { key: 'appointments', href: '/admin', icon: CalendarDays },
  { key: 'patients', href: '/admin/patients', icon: Users },
  { key: 'motifs', href: '/admin/motifs', icon: Clock },
  { key: 'gallery', href: '/admin/galerie', icon: Image },
  { key: 'reviews', href: '/admin/avis', icon: Star },
  { key: 'stats', href: '/admin/statistiques', icon: BarChart3 },
  { key: 'settings', href: '/admin/parametres', icon: Settings }
] as const;

import { signOut } from '@/app/[locale]/(admin)/admin/actions';

export function Sidebar({ onSignOut }: { onSignOut?: () => void }) {
  const t = useTranslations('admin.nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      signOut();
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin' || pathname.endsWith('/admin');
    }
    return pathname.includes(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lifted md:hidden"
        aria-label={t('openMenu')}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 z-50 flex w-64 flex-col border-e border-ink-100 bg-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-soft">
              <ToothMark className="h-5 w-5" />
            </span>
            <span className="font-semibold text-ink-900">{t('brand')}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden"
            aria-label={t('closeMenu')}
          >
            <X className="h-6 w-6 text-ink-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-ink-100 p-4">
          <Button
            variant="ghost"
            size="md"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            {t('signOut')}
          </Button>
        </div>
      </aside>
    </>
  );
}
