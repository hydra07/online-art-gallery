'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, Crown, FolderOpen, Image, Upload, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelKey: string;
  section?: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('artist_layout');
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();

  // Check if user is artist
  const isArtist = useMemo(() => {
    return session?.user?.role?.includes('artist') || false;
  }, [session]);

  // Handle unauthorized access immediately when session is loaded
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    } else if (status === 'authenticated' && !isArtist) {
      router.push('/403');
    }
  }, [status, isArtist, router]);

  const navItems: NavItem[] = useMemo(
    () => [
      { section: 'main_section', href: '/artists', icon: BarChart, labelKey: 'dashboard' },
      { section: 'content_section', href: '/artists/upload', icon: Upload, labelKey: 'upload_artwork' },
      { section: 'content_section', href: '/artists/manage', icon: Image, labelKey: 'manage_artworks' },
      { section: 'content_section', href: '/artists/collections', icon: FolderOpen, labelKey: 'collections' },
      { section: 'account_section', href: '/artists/premium', icon: Crown, labelKey: 'premium' },
      { section: 'account_section', href: '/artists/settings', icon: Settings, labelKey: 'settings' }
    ],
    []
  );

  const isPathActive = useCallback(
    (itemPath: string) => {
      const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '');
      const normalizedPath = pathWithoutLocale || '/';
      return normalizedPath === itemPath;
    },
    [pathname]
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setSidebarOpen(width >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const NavLink = ({ item, mobile = false }: { item: NavItem; mobile?: boolean }) => {
    const isActive = isPathActive(item.href);
    return (
      <div className="relative w-full">
        <Link
          href={item.href}
          className={`
            flex items-center gap-3 relative 
            ${mobile ? 'p-2 rounded-full w-12 h-12 justify-center' : 'px-4 py-2.5 rounded-md w-full'}
            ${isActive
              ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal blossom-700 dark:text-teal-300 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 font-medium'
            }
            transition-all duration-200 ease-in-out
          `}
        >
          <item.icon
            className={`${mobile ? 'h-6 w-6' : 'h-5 w-5'} ${
              isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
            } transition-colors duration-200`}
          />
          {!mobile && (
            <span className="truncate transition-opacity duration-200">
              {t(item.labelKey)}
            </span>
          )}
          {isActive && (
            <motion.div
              layoutId={mobile ? 'mobileActiveIndicator' : 'desktopActiveIndicator'}
              className={mobile
                ? 'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1.5 bg-teal-500 rounded-t-full'
                : 'absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-teal-500'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </Link>
      </div>
    );
  };

  const groupedNavItems = useMemo(() => {
    const grouped: Record<string, NavItem[]> = {};
    navItems.forEach(item => {
      const section = item.section || 'other';
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(item);
    });
    return grouped;
  }, [navItems]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Show loading state for ANY status except authenticated + artist
  if (status === 'loading' || (status === 'authenticated' && !isArtist) || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-teal-500 dark:border-t-teal-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {isMobile && (
        <button
          className="fixed top-24 left-4 z-30 p-2 rounded-full bg-teal-500 text-white shadow-lg"
          onClick={toggleSidebar}
          aria-label={t('toggle_menu')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}
      {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />}
      {(sidebarOpen || !isMobile) && (
        <aside className={`${isMobile ? 'fixed inset-y-0 left-0 pt-20' : 'sticky top-[80px] self-start h-[calc(100vh-80px)]'} w-64 bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700 z-30 flex-shrink-0 transition-all duration-300`}>
          <div className="flex flex-col h-full">
            {isMobile && (
              <div className="py-4 px-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">{t('art_manager')}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('artist_portal')}</p>
                  </div>
                </div>
              </div>
            )}
            {!isMobile && (
              <div className="py-5 px-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">{t('art_manager')}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('artist_portal')}</p>
                  </div>
                </div>
              </div>
            )}
            <nav className="flex-1 py-5 overflow-y-auto">
              {Object.entries(groupedNavItems).map(([sectionKey, items]) => (
                <div key={sectionKey} className="mb-6">
                  <h3 className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 px-6 mb-3">{t(sectionKey)}</h3>
                  <div className="space-y-1 px-3">
                    {items.map(item => <NavLink key={item.href} item={item} />)}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>
      )}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-20">
          <div className="flex justify-around items-center py-2">
            {navItems.slice(0, 5).map(item => <NavLink key={item.href} item={item} mobile />)}
          </div>
        </div>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}