'use client';

import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header() {
  const LTUID = "22586517";
  const [activePath, setActivePath] = useState('');
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastPath = Cookies.get('lastActivePath') || '/tabs';
    setActivePath(lastPath);
  }, []);

  useEffect(() => {
    if (pathname && pathname !== '/') {
      Cookies.set('lastActivePath', pathname, { expires: 365, path: '/' });
      setActivePath(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="border-b-4 border-[var(--primary)]/35">
      <div className="mx-auto flex justify-center items-center relative p-2">
        <h1 className="text-2xl font-bold">LaTrobe University LMS</h1>
        <div className="font-mono text-sm absolute right-4">{LTUID}</div>
      </div>

      <div className="mx-auto flex justify-between items-center p-2 border-t-4 border-[var(--primary)]/35">
        <nav>
          <ul className="flex gap-4 items-center">
            <li className="pr-4 border-r border-gray-400">
              <Link href="/tabs" className={activePath === '/tabs' ? 'font-bold text-[var(--primary)]' : ''}>Tabs</Link>
            </li>
            <li className="pr-4 border-r border-gray-400">
              <Link href="#">Pre-lab Questions</Link>
            </li>
            <li className="pr-4 border-r border-gray-400">
              <Link href="/escape-room" className={activePath === '/escape-room' ? 'font-bold text-[var(--primary)]' : ''}>Escape Room</Link>
            </li>
            <li>
              <Link href="/coding-race" className={activePath === '/coding-race' ? 'font-bold text-[var(--primary)]' : ''}>Coding Races</Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link href="/about" className={activePath === '/about' ? 'font-bold text-[var(--primary)]' : ''}>About</Link>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="space-y-1 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-[var(--primary)]"></span>
              <span className="block w-6 h-0.5 bg-[var(--primary)]"></span>
              <span className="block w-6 h-0.5 bg-[var(--primary)]"></span>
            </button>

            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--background)] border border-[var(--primary)]/20 rounded-md shadow-lg z-10">
                <ul>
                  <li>
                    <a href="setting" className="block px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--primary)]/20">
                      Settings
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}