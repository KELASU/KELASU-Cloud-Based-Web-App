'use client'; 

import { useState, useEffect } from 'react';

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

  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    const generateTabsCode = (tabData: Tab[]): string => {
      const tabButtons = tabData.map((tab, index) => 
        `<button class="tab-button" style="padding: 10px; border: 1px solid #ccc;" onclick="openTab(event, 'tab${index}')">${tab.header}</button>`
      ).join('');

      const tabContents = tabData.map((tab, index) => 
        `<div id="tab${index}" class="tab-content" style="display: none; padding: 10px; border: 1px solid #ccc; border-top: none;">
          <p>${tab.content.replace(/\n/g, '<br>')}</p>
        </div>`
      ).join('');

      const finalCode = `<!DOCTYPE html><html><head><title>Tabs</title></head><body><h2>Tabs</h2><div class="tab-container">${tabButtons}</div>${tabContents}<script>function openTab(evt, tabName){var i,tabcontent,tablinks;tabcontent=document.getElementsByClassName("tab-content");for(i=0;i<tabcontent.length;i++){tabcontent[i].style.display="none";}tablinks=document.getElementsByClassName("tab-button");for(i=0;i<tablinks.length;i++){tablinks[i].style.backgroundColor="";}document.getElementById(tabName).style.display="block";evt.currentTarget.style.backgroundColor="#ddd";}document.getElementsByClassName("tab-button")[0].click();<\/script></body></html>`;
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
    console.log('Adding a new tab...');
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
  };
  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tabs</h2>
        <div>
          <span>Dark Mode Switch</span>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-1/2 flex gap-4">
          <div className="w-1/3">
            <h3 className="font-semibold mb-2">Tabs Headers: [+]</h3>
            <div className="border rounded p-2 space-y-1">
              {tabs.map(tab => (
                <div key={tab.id} className="p-2 border rounded cursor-pointer hover:bg-gray-100">
                  {tab.header}
                </div>
              ))}
            </div>
          </div>

          <div className="w-2/3">
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            <textarea 
              className="w-full h-48 p-2 border rounded"
              placeholder="Content of the selected tab will be editable here..."
            />
          </div>
        </div>

        <div className="w-1/2">
          <button className="px-4 py-1 border rounded mb-2">Output</button>
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