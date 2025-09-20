'use client'; // This is a client component because it's interactive

import { useState } from 'react';

// Define a type for a single tab for TypeScript
type Tab = {
  id: number;
  header: string;
  content: string;
};

export default function HomePage() {
  // State to hold the array of tabs
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, header: 'Step 1', content: '1. Install VSCode' },
    { id: 2, header: 'Step 2', content: '2. Install Chrome' },
  ]);

  // We will add more logic here...

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Tabs Component Generator</h1>
      <div className="flex gap-8 mt-4">
        <div className="w-1/2">
          <h2>Tab Configuration</h2>
          {tabs.map((tab, index) => (
            <div key={tab.id} className="mb-4 p-2 border rounded">
              <label>Tab {index + 1} Header</label>
              <input
                type="text"
                value={tab.header}
                className="w-full p-1 border rounded"
              />

              <label className="mt-2">Tab {index + 1} Content</label>
              <textarea
                value={tab.content}
                className="w-full p-1 border rounded"
              />
            </div>
          ))}
        </div>
        <div className="w-1/2">
        </div>
      </div>
    </main>
  );
}
