'use client';

import { useState, useEffect } from 'react';

type ThemeColors = {
  primary: string;
  accent: string;
  destructive: string;
};

const colorblindPalettes: { [key: string]: ThemeColors } = {
  protanopia: { primary: '#56B4E9', accent: '#0072B2', destructive: '#D55E00' },
  deuteranopia: { primary: '#F0E442', accent: '#009E73', destructive: '#CC79A7' },
  tritanopia: { primary: '#FFB000', accent: '#000000', destructive: '#E69F00' },
};

export default function SettingsPage() {

  const [customColors, setCustomColors] = useState<ThemeColors>({
    primary: '#FA812F',
    accent: '#FAB12F',
    destructive: '#DD0303',
  });

  const [isColorblindMode, setIsColorblindMode] = useState(false);
  const [colorblindType, setColorblindType] = useState('protanopia');

  useEffect(() => {
    const root = document.documentElement;
    let finalColors = customColors;

    if (isColorblindMode) {
      finalColors = colorblindPalettes[colorblindType];
    }

    root.style.setProperty('--primary', finalColors.primary);
    root.style.setProperty('--accent', finalColors.accent);
    root.style.setProperty('--destructive', finalColors.destructive);
  }, [customColors, isColorblindMode, colorblindType]);

  const handleColorChange = (color: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [color]: value }));
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-8 max-w-2xl">
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
      </div>
    </main>
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

const ToggleSwitch = ({ id, checked, onChange }: { id: string; checked: boolean; onChange: () => void; }) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
  </label>
);