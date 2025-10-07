'use client';

import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header() {
  const LTUID = "22586517";

  const [activePath, setActivePath] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const lastPath = Cookies.get('lastActivePath') || '/';
    setActivePath(lastPath);
  }, []);

  useEffect(() => {
    Cookies.set('lastActivePath', pathname, { expires: 7 });
    setActivePath(pathname);
  }, [pathname]);

  return (
    <header className="border-b-4 border-[var(--primary)]/80">
      <div className="mx-auto flex justify-center items-center relative p-2">
        <h1 className="text-2xl font-bold">LaTrobe University LMS</h1>
        <div className="font-mono text-sm absolute right-4">{LTUID}</div>
      </div>
      <div className="mx-auto flex justify-between items-center p-2 border-t-4 border-[var(--primary)]/80">
        <nav>
          <ul className="flex gap-4 items-center">
            <li className="pr-4 border-r border-[var(--primary)]">
              <Link href="/" className={activePath === '/' ? 'font-bold text-[var(--primary)]' : ''}>Tabs</Link>
            </li>
            <li className="pr-4 border-r border-[var(--primary)]">
              <Link href="#" className={activePath === '/' ? 'font-bold text-[var(--primary)]' : ''}>Pre-lab Questions</Link>
            </li>
            <li className="pr-4 border-r border-[var(--primary)]">
              <Link href="/escape-room" className={activePath === '/' ? 'font-bold text-[var(--primary)]' : ''}>Escape Room</Link>
            </li>
            <li>
              <Link href="/coding-race" className={activePath === '/' ? 'font-bold text-[var(--primary)]' : ''}>Coding Races</Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link href="/about" className={activePath === '/about' ? 'font-bold text-[var(--primary)]' : ''}>About</Link>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-[var(--text-color)]"></span>
            <span className="block w-6 h-0.5 bg-[var(--text-color)]"></span>
            <span className="block w-6 h-0.5 bg-[var(--text-color)]"></span>
          </div>
        </div>
      </div>
    </header>
  );
}