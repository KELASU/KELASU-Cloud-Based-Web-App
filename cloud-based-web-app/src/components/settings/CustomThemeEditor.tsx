'use client';

import { useState, useEffect } from 'react';
import { type ThemeColors } from '@/lib/types';
import Cookies from 'js-cookie'; 

export function CustomThemeEditor() {
  const [customColors, setCustomColors] = useState<ThemeColors>({
    primary: '#FA812F',
    accent: '#FAB12F',
    destructive: '#DD0303',
  });

  useEffect(() => {
    const savedColors = Cookies.get('customTheme');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.colorblindMode === 'true') return;

    document.documentElement.style.setProperty('--primary', customColors.primary);
    document.documentElement.style.setProperty('--accent', customColors.accent);
    document.documentElement.style.setProperty('--destructive', customColors.destructive);

    Cookies.set('customTheme', JSON.stringify(customColors), { expires: 365, path: '/' });
  }, [customColors]);

  const handleColorChange = (color: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [color]: value }));
  };

  return (
    <div className="p-4 border border-[var(--primary)]/30 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Custom Theme</h2>
      <p className="text-sm mb-4">
        Choose your own colors for the application theme. These will be overridden if Colorblind Mode is active.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ColorPicker label="Primary Color" color={customColors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
        <ColorPicker label="Accent Color" color={customColors.accent} onChange={(e) => handleColorChange('accent', e.target.value)} />
        <ColorPicker label="Destructive Color" color={customColors.destructive} onChange={(e) => handleColorChange('destructive', e.target.value)} />
      </div>
    </div>
  );
}

const ColorPicker = ({ label, color, onChange }: { label: string; color: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <div className="flex items-center gap-2 p-2 border border-[var(--primary)]/50 rounded-md">
      <input type="color" value={color} onChange={onChange} className="w-8 h-8 rounded" />
      <span className="font-mono text-sm">{color.toUpperCase()}</span>
    </div>
  </div>
);