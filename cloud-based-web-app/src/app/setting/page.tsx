import { CustomThemeEditor } from '@/components/settings/CustomThemeEditor';
import { AccessibilitySettings } from '@/components/settings/AccessibilitySettings';

export default function SettingsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-8 max-w-2xl">
        <CustomThemeEditor />
        <AccessibilitySettings />
      </div>
    </main>
  );
}