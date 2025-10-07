'use client';

import { useState, useEffect } from 'react';
import { type ThemeColors, colorblindPalettes } from '@/lib/types';
import Cookies from 'js-cookie';

export function AccessibilitySettings() {
  const [isColorblindMode, setIsColorblindMode] = useState(false);
  const [colorblindType, setColorblindType] = useState('protanopia');

  useEffect(() => {
    const savedIsColorblind = Cookies.get('isColorblindMode') === 'true';
    const savedType = Cookies.get('colorblindType');

    setIsColorblindMode(savedIsColorblind);
    if (savedType) {
      setColorblindType(savedType);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.colorblindMode = isColorblindMode.toString();

    if (isColorblindMode) {
      const finalColors = colorblindPalettes[colorblindType];
      root.style.setProperty('--primary', finalColors.primary);
      root.style.setProperty('--accent', finalColors.accent);
      root.style.setProperty('--destructive', finalColors.destructive);
    }

    Cookies.set('isColorblindMode', isColorblindMode.toString(), { expires: 365, path: '/' });
    Cookies.set('colorblindType', colorblindType, { expires: 365, path: '/' });

  }, [isColorblindMode, colorblindType]);

  return (
    <div className="p-4 border border-[var(--primary)]/30 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Accessibility</h2>
      <div className="flex items-center justify-between">
        <label htmlFor="colorblind-toggle" className="font-medium">Colorblind Mode</label>
        <ToggleSwitch id="colorblind-toggle" checked={isColorblindMode} onChange={() => setIsColorblindMode(!isColorblindMode)} />
      </div>
      
      {isColorblindMode && (
        <div className="mt-4 pt-4 border-t border-[var(--primary)]/20">
          <label htmlFor="colorblind-type" className="block text-sm font-medium mb-2">
            Select Colorblind Type:
          </label>
          <select
            id="colorblind-type"
            value={colorblindType}
            onChange={(e) => setColorblindType(e.target.value)}
            className="w-full p-2 border border-[var(--primary)]/50 rounded bg-[var(--background)]"
          >
            <option value="protanopia">Protanopia (Red-Green)</option>
            <option value="deuteranopia">Deuteranopia (Red-Green)</option>
            <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
          </select>
        </div>
      )}
    </div>
  );
}

const ToggleSwitch = ({ id, checked, onChange }: { id: string; checked: boolean; onChange: () => void; }) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
  </label>
);