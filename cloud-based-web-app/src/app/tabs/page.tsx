'use client'; 

import { useState, useEffect } from 'react';

type Tab = {
  id: number;
  header: string;
  content: string;
};

// Define the default tabs for the initial server render
const defaultTabs: Tab[] = [
  { id: 1, header: 'Step 1', content: '1. Install VSCode\n2. Install Node' },
  { id: 2, header: 'Step 2', content: 'Your content here...' },
];

export default function TabsPage() {
  const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // NEW: State to manage the generated tabs' header text
  const [headerText, setHeaderText] = useState('Generated Tabs');

  // Safely loads saved tabs on the client side
  useEffect(() => {
    const savedTabs = localStorage.getItem('savedTabs');
    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      setSelectedTabId(parsedTabs[0]?.id || null);
    } else {
      setSelectedTabId(defaultTabs[0]?.id || null);
    }
  }, []);

  // Saves tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedTabs', JSON.stringify(tabs));
  }, [tabs]);

  // Generates the HTML code whenever the tabs or header text change
  useEffect(() => {
    const generateTabsCode = (tabData: Tab[], title: string) => {
      if (tabData.length === 0) return '';
      
      const tabButtons = tabData.map((tab, index) => 
        `\t\t<button style="padding: 10px; border: 1px solid #ccc; background-color: #f1f1f1;" onclick="openTab(this, 'tab${index}')">${tab.header}</button>`
      ).join('\n');

      const tabContents = tabData.map((tab, index) => 
        `\t\t<div id="tab${index}" style="display: none; padding: 10px; border: 1px solid #ccc; border-top: none;">
\t\t\t<p style="white-space: pre-wrap;">${tab.content}</p> 
\t\t</div>`
      ).join('\n');
      
      const finalCode = `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <h2>${title}</h2>
    <div>
${tabButtons}
    </div>
${tabContents}
    <script>
      function openTab(btn, tabName) {
        let i, tabcontent, tablinks;
        tabcontent = document.querySelectorAll('[id^="tab"]');
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.querySelectorAll('button[onclick^="openTab"]');
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].style.backgroundColor = "#f1f1f1";
        }
        document.getElementById(tabName).style.display = "block";
        btn.style.backgroundColor = "#ddd";
      }
      document.querySelector('button[onclick^="openTab"]').click();
    <\/script>
  </body>
</html>`;
      
      return finalCode;
    };
    
    setGeneratedCode(generateTabsCode(tabs, headerText));
  }, [tabs, headerText]); // Added headerText to dependency array

  const handleTabChange = (id: number, field: 'header' | 'content', value: string) => {
    setTabs(currentTabs => 
      currentTabs.map(tab => (tab.id === id ? { ...tab, [field]: value } : tab))
    );
  };

  const addTab = () => {
    if (tabs.length >= 15) {
      alert("You can create a maximum of 15 tabs.");
      return;
    }
    const newTab: Tab = { id: Date.now(), header: `New Tab ${tabs.length + 1}`, content: '' };
    setTabs(currentTabs => [...currentTabs, newTab]);
    setSelectedTabId(newTab.id);
  };
  
  const removeTab = (idToDelete: number) => {
    const newTabs = tabs.filter(tab => tab.id !== idToDelete);
    setTabs(newTabs);
    if (selectedTabId === idToDelete) {
      setSelectedTabId(newTabs[0]?.id || null);
    }
  };

  const handleCopyCode = () => { navigator.clipboard.writeText(generatedCode); alert('Code copied to clipboard!'); };
  const handleDownloadHtml = () => { const blob = new Blob([generatedCode],{type:'text/html'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='tabs.html'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); };

  const selectedTab = tabs.find(tab => tab.id === selectedTabId);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tabs Creator</h2>
      </div>

      <div className="mb-6 max-w-md">
        <label htmlFor="header-text" className="block font-semibold mb-2">Generated Page Header</label>
        <input
          id="header-text"
          type="text"
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          className="w-full p-2 border border-[var(--primary)]/50 rounded bg-[var(--background)]"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="w-1/3">
            <h3 className="font-semibold mb-2 flex justify-between items-center">
              Tabs Headers <button onClick={addTab} className="text-lg text-[var(--accent)] hover:scale-125 transition-transform">[+]</button>
            </h3>
            <div className="border border-[var(--primary)]/50 rounded p-2 space-y-2">
              {tabs.map(tab => (
                <div key={tab.id} className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={tab.header}
                    onClick={() => setSelectedTabId(tab.id)}
                    onChange={(e) => handleTabChange(tab.id, 'header', e.target.value)}
                    className={`w-full p-2 border rounded cursor-pointer transition-colors ${selectedTabId === tab.id ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background)] hover:bg-[var(--primary)]/20'}`}
                  />
                  <button onClick={() => removeTab(tab.id)} className="text-[var(--destructive)] font-bold text-lg hover:scale-125 transition-transform">[-]</button>
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
                className="w-full h-48 p-2 border border-[var(--primary)]/50 rounded bg-[var(--background)]"
                placeholder="Content of the selected tab will be editable here..."
              />
            ) : (
              <div className="w-full h-48 p-2 border rounded bg-gray-50 flex items-center justify-center text-gray-400">
                <p>Select or create a tab to edit</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex gap-2 mb-2">
            <button onClick={handleCopyCode} className="px-4 py-1 border border-[var(--accent)] rounded hover:bg-[var(--accent)]/20 transition-colors">
              Output Code
            </button>
            <button onClick={handleDownloadHtml} className="px-4 py-1 border border-[var(--accent)] rounded hover:bg-[var(--accent)]/20 transition-colors">
              Output Html
            </button>
          </div>
          <pre className="p-2 border border-[var(--primary)]/50 rounded bg-gray-800 text-gray-100 overflow-auto h-[500px]">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </main>
  );
}