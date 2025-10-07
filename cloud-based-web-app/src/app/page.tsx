'use client'; 

import { useState, useEffect } from 'react';
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

// Define a type for a single tab
type Tab = {
  id: number;
  header: string;
  content: string;
};

export default function HomePage() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, header: 'Step 1', content: '1. Install VSCode\n2. Install Node' },
    { id: 2, header: 'Step 2', content: 'Your content here...' },
  ]);

  const [selectedTabId, setSelectedTabId] = useState<number | null>(tabs[0]?.id || null);

  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    const generateTabsCode = (tabData: Tab[]): string => {
      const tabButtons = tabData.map((tab, index) => 
        `\t\t<button class="tab-button" onclick="openTab(event, 'tab${index}')">${tab.header}</button>`
      ).join('\n');

      const tabContents = tabData.map((tab, index) => 
        `\t\t<div id="tab${index}" class="tab-content">
\t\t\t<p>${tab.content.replace(/\n/g, '\n\t\t\t\t')}</p>
\t\t</div>`
      ).join('\n');
      
      const finalCode = `<!DOCTYPE html>
<html>
<head>
\t<title>Tabs</title>
\t<style>
\t\t.tab-content { display: none; padding: 10px; border: 1px solid #ccc; border-top: none; }
\t\t.tab-button { padding: 10px; border: 1px solid #ccc; background-color: #f1f1f1; }
\t\t.tab-button.active { background-color: #ddd; }
\t</style>
</head>
<body>
\t<h2>Generated Tabs</h2>
\t<div class="tab-container">
${tabButtons}
\t</div>
${tabContents}
\t<script>
\t\tfunction openTab(evt, tabName) {
\t\t\tlet i, tabcontent, tablinks;
\t\t\ttabcontent = document.getElementsByClassName("tab-content");
\t\t\tfor (i = 0; i < tabcontent.length; i++) {
\t\t\t\ttabcontent[i].style.display = "none";
\t\t\t}
\t\t\ttablinks = document.getElementsByClassName("tab-button");
\t\t\tfor (i = 0; i < tablinks.length; i++) {
\t\t\t\ttablinks[i].className = tablinks[i].className.replace(" active", "");
\t\t\t}
\t\t\tdocument.getElementById(tabName).style.display = "block";
\t\t\tevt.currentTarget.className += " active";
\t\t}
\t\tdocument.querySelector(".tab-button").click();
\t<\/script>
</body>
</html>`;
      
      return finalCode;
    };
    
    setGeneratedCode(generateTabsCode(tabs));
  }, [tabs]); 

  const handleTabChange = (id: number, field: 'header' | 'content', value: string) => {
    setTabs(currentTabs => 
      currentTabs.map(tab => {
        if (tab.id === id) {
          return { ...tab, [field]: value }; 
        }
        return tab;
      })
    );
  };

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now(),
      header: `New Tab ${tabs.length + 1}`,
      content: '',
    };
    setTabs(currentTabs => [...currentTabs, newTab]);
    setSelectedTabId(newTab.id);
    const newTab: Tab = {
      id: Date.now(),
      header: `New Tab ${tabs.length + 1}`,
      content: '',
    };
    setTabs(currentTabs => [...currentTabs, newTab]);
    setSelectedTabId(newTab.id);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
  };

  const selectedTab = tabs.find(tab => tab.id === selectedTabId);

  return (
    <main className="p-8 bg-background text-text-color dark:bg-dark-background dark:text-dark-text-color">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tabs</h2>
        <div>
        <ThemeSwitcher />
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-1/2 flex gap-4">
          <div className="w-1/3">
            <h3 className="font-semibold mb-2 flex justify-between items-center">
              Tabs Headers
              <button onClick={addTab} className="text-lg text-accent dark:text-dark-accent hover:scale-125 transition-transform">[+]</button>
            </h3>
            <div className="border border-primary/50 dark:border-dark-primary/50 rounded p-2 space-y-1">
              {tabs.map(tab => (
                <div 
                  key={tab.id}
                  onClick={() => setSelectedTabId(tab.id)}
                  className={`p-2 border rounded cursor-pointer transition-colors
                    ${selectedTabId === tab.id 
                      ? 'bg-primary/80 text-white dark:bg-dark-primary/80 dark:text-dark-text-color' 
                      : 'hover:bg-primary/20 dark:hover:bg-dark-primary/20'}`
                  }
                >
                  {tab.header}
                </div>
              ))}
            </div>
          </div>

          <div className="w-2/3">
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            {selectedTab ? (
              <textarea 
                value={selectedTab.content}
                onChange={(e) => handleTabChange(selectedTab.id, 'content', e.target.value)}
                className="w-full h-48 p-2 border border-primary/50 dark:border-dark-primary/50 rounded bg-background dark:bg-dark-background"
                placeholder="Content of the selected tab will be editable here..."
              />
            ) : (
              <p>Select a tab to edit its content.</p>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <button onClick={handleCopyCode} className="px-4 py-1 border border-accent dark:border-dark-accent rounded mb-2 hover:bg-accent/20 dark:hover:bg-dark-accent/20 transition-colors">Output</button>
          <pre className="p-2 border border-primary/50 dark:border-dark-primary/50 rounded bg-text-color text-background dark:bg-dark-text-color dark:text-dark-background overflow-auto h-[500px]">
            <code>
              {generatedCode}
            </code>
          </pre>
        </div>
      </div>
    </main>
  );
}