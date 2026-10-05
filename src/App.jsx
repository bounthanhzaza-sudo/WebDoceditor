import React, { useState, useEffect } from 'react';
import { DocStore } from './store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WordCanvas } from './components/WordCanvas';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { SettingsModal } from './components/SettingsModal';

export function App() {
  const [store, setStore] = useState(() => DocStore.loadStore());
  const [activeDocId, setActiveDocId] = useState(() => store.documents[0]?.id || null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    DocStore.saveStore(store);
  }, [store]);

  const activeDoc = store.documents.find(d => d.id === activeDocId) || store.documents[0] || null;

  // Document Handlers
  const handleUpdateDoc = (updatedDoc) => {
    setStore(prev => {
      const updatedDocs = prev.documents.map(d => d.id === updatedDoc.id ? updatedDoc : d);
      return { ...prev, documents: updatedDocs };
    });
  };

  const handleNewDocInCategory = (category) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      slug: `untitled-${Date.now()}`,
      title: 'Untitled Document',
      category: category || store.categories[0],
      order: 1,
      badge: 'Draft',
      badgeColor: 'blue',
      description: 'New document',
      readTime: '1 min read',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'User',
      content: '<p>Start writing your document here...</p>'
    };

    setStore(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
    setActiveDocId(newDoc.id);
  };

  const handleDeleteDoc = (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    setStore(prev => {
      const updatedDocs = prev.documents.filter(d => d.id !== id);
      return { ...prev, documents: updatedDocs };
    });
    if (activeDocId === id) {
      setStore(prev => {
        const remaining = prev.documents;
        setActiveDocId(remaining[0]?.id || null);
        return prev;
      });
    }
  };

  // Category Handlers
  const handleAddCategory = (catName) => {
    if (store.categories.includes(catName)) return;
    setStore(prev => ({
      ...prev,
      categories: [...prev.categories, catName]
    }));
  };

  const handleDeleteCategory = (catName) => {
    if (store.categories.length <= 1) {
      alert('You must have at least one category.');
      return;
    }
    if (!window.confirm(`Delete category "${catName}"? Documents in this category will be moved.`)) return;
    
    const fallbackCat = store.categories.find(c => c !== catName);
    setStore(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== catName),
      documents: prev.documents.map(d => d.category === catName ? { ...d, category: fallbackCat } : d)
    }));
  };

  // Settings Handlers
  const handleUpdateTitle = (newTitle) => {
    setStore(prev => ({ ...prev, siteTitle: newTitle }));
  };

  const handleReset = () => {
    const fresh = DocStore.resetToDefault();
    setStore(fresh);
    setActiveDocId(fresh.documents[0]?.id || null);
  };

  // Export / Import
  const handleExport = () => {
    DocStore.exportJSON(store);
  };

  const handleImport = (jsonString) => {
    const imported = DocStore.parseImportedJSON(jsonString);
    if (imported) {
      setStore(imported);
      setActiveDocId(imported.documents[0]?.id || null);
      alert('Workspace imported successfully!');
    } else {
      alert('Failed to import JSON file.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 font-sans">
      <Header
        siteTitle={store.siteTitle}
        onNewDoc={() => handleNewDocInCategory(store.categories[0])}
        onManageCategories={() => setIsCategoryModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          categories={store.categories}
          documents={store.documents}
          activeDocId={activeDocId}
          onSelectDoc={setActiveDocId}
          onNewDocInCategory={handleNewDocInCategory}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <WordCanvas
          doc={activeDoc}
          onUpdateDoc={handleUpdateDoc}
          onDeleteDoc={handleDeleteDoc}
          categories={store.categories}
        />
      </div>

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={store.categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        siteTitle={store.siteTitle}
        onUpdateTitle={handleUpdateTitle}
        onReset={handleReset}
      />
    </div>
  );
}
