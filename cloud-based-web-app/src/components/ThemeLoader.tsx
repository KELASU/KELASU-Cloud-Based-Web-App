'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { colorblindPalettes, type ThemeColors } from '@/lib/types';

export function ThemeLoader() {
  useEffect(() => {
    const root = document.documentElement;

    const savedIsColorblind = Cookies.get('isColorblindMode') === 'true';
    const savedType = Cookies.get('colorblindType');

    let finalColors: ThemeColors | null = null;

    if (savedIsColorblind && savedType && colorblindPalettes[savedType]) {
      finalColors = colorblindPalettes[savedType];
      root.dataset.colorblindMode = 'true';
    } else {
      const savedColors = Cookies.get('customTheme');
      if (savedColors) {
        finalColors = JSON.parse(savedColors);
      }
      root.dataset.colorblindMode = 'false';
    }

    if (finalColors) {
      root.style.setProperty('--primary', finalColors.primary);
      root.style.setProperty('--accent', finalColors.accent);
      root.style.setProperty('--destructive', finalColors.destructive);
    }

  }, []);

  return null;
}