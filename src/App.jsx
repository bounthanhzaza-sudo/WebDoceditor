import React, { useState, useEffect } from 'react';
import { DocStore } from './store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WordCanvas } from './components/WordCanvas';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginModal } from './components/LoginModal';

export function App() {
  const [store, setStore] = useState(() => DocStore.loadStore());
  const [activeDocId, setActiveDocId] = useState(() => store.documents[0]?.id || null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('DOCEDITOR_USER');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(() => !currentUser);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('DOCEDITOR_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('DOCEDITOR_USER');
    }
  }, [currentUser]);

  useEffect(() => {
    DocStore.fetchFromBackend().then(backendStore => {
      if (backendStore) {
        setStore(backendStore);
        if (!activeDocId && backendStore.documents[0]) {
          setActiveDocId(backendStore.documents[0].id);
        }
      }
    });
  }, []);

  useEffect(() => {
    DocStore.syncToBackend(store);
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

  const handleReset = async () => {
    const fresh = await DocStore.resetBackend();
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

  const handleImportSingleFile = (fileDocData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      slug: `imported-${Date.now()}`,
      title: fileDocData.title || 'Imported Document',
      category: store.categories[0] || 'Getting Started',
      order: 1,
      badge: fileDocData.badge || 'Imported',
      badgeColor: fileDocData.badgeColor || 'blue',
      description: fileDocData.description || 'Imported file attachment',
      readTime: '2 min read',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: currentUser?.name || 'User',
      content: fileDocData.content || '<p>Imported content</p>'
    };

    setStore(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
    setActiveDocId(newDoc.id);
    alert(`File "${newDoc.title}" imported successfully as a new document!`);
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
        onImportSingleFile={handleImportSingleFile}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
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

      <LoginModal
        isOpen={isLoginModalOpen || !currentUser}
        onClose={() => {
          if (currentUser) {
            setIsLoginModalOpen(false);
          } else {
            alert('Please sign in or register to access DocEditor.');
          }
        }}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}
