'use client'; 

import { useState, useEffect } from 'react';

type Tab = {
  id: number;
  header: string;
  content: string;
};

// RENAMED: The component is now called TabsPage
export default function TabsPage() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, header: 'Step 1', content: '1. Install VSCode\n2. Install Node' },
    { id: 2, header: 'Step 2', content: 'Your content here...' },
  ]);

  const [selectedTabId, setSelectedTabId] = useState<number | null>(tabs[0]?.id || null);
  
  const [generatedCode, setGeneratedCode] = useState('');

  // REMOVED: The useEffect for redirection is gone from this file.

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
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tabs.html';
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedTab = tabs.find(tab => tab.id === selectedTabId);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tabs</h2>
      </div>

      <div className="flex gap-8">
        <div className="w-1/2 flex gap-4">
          <div className="w-1/3">
            <h3 className="font-semibold mb-2 flex justify-between items-center">
              Tabs Headers <button onClick={addTab} className="text-lg hover:scale-125 transition-transform">[+]</button>
            </h3>
            <div className="border rounded p-2 space-y-2">
              {tabs.map(tab => (
                <input 
                  key={tab.id}
                  type="text"
                  value={tab.header}
                  onClick={() => setSelectedTabId(tab.id)}
                  onChange={(e) => handleTabChange(tab.id, 'header', e.target.value)}
                  className={`w-full p-2 border rounded cursor-pointer transition-colors ${selectedTabId === tab.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="w-2/3">
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            {selectedTab ? (
              <textarea 
                value={selectedTab.content}
                onChange={(e) => handleTabChange(tab.id, 'content', e.target.value)}
                className="w-full h-48 p-2 border rounded"
                placeholder="Content of the selected tab will be editable here..."
              />
            ) : (
              <div className="w-full h-48 p-2 border rounded bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400">Select a tab to edit</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <div className="flex gap-2 mb-2">
            <button onClick={handleCopyCode} className="px-4 py-1 border rounded">
              Output Code
            </button>
            <button onClick={handleDownloadHtml} className="px-4 py-1 border rounded">
              Output Html
            </button>
          </div>
          <pre className="p-2 border rounded bg-gray-800 text-white overflow-auto h-[500px]">
            <code>
              {generatedCode}
            </code>
          </pre>
        </div>
      </div>
    </main>
  );
}