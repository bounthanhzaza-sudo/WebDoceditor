const STORE_KEY = 'DOCEDITOR_STORE_V1';

export const DEFAULT_CATEGORIES = [
  'Getting Started',
  'Course Management',
  'API & Integrations',
  'Advanced Customization'
];

export const DEFAULT_DOCUMENTS = [
  {
    id: 'doc-welcome',
    slug: 'welcome-to-doceditor',
    title: 'Welcome to DocEditor',
    category: 'Getting Started',
    order: 1,
    badge: 'Overview',
    badgeColor: 'blue',
    description: 'A comprehensive guide to navigating and using DocEditor for your dynamic documentation needs.',
    readTime: '3 min read',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-05T09:00:00Z',
    author: 'DocEditor Team',
    content: `
      <h2>Introduction</h2>
      <p>Welcome to <strong>DocEditor</strong>, your modern workspace for creating, managing, and organizing beautiful technical documentation and course guides.</p>
      
      <h2>Core Features</h2>
      <ul>
        <li><strong>Interactive Editor:</strong> Seamlessly create and edit documents with rich HTML and code snippet support.</li>
        <li><strong>Category Organization:</strong> Group your documents logically by category and subtopics.</li>
        <li><strong>JSON Import & Export:</strong> Easily backup your entire documentation workspace or migrate between systems.</li>
        <li><strong>Lightning Fast Search:</strong> Instantly filter documents and categories as you type.</li>
      </ul>

      <h2>Quick Start</h2>
      <p>Use the sidebar to select existing documentation or click <strong>New Document</strong> to draft a new guide.</p>
    `
  },
  {
    id: 'doc-course-studio',
    slug: 'course-studio-overview',
    title: 'Course Studio & Curriculum Planning',
    category: 'Course Management',
    order: 1,
    badge: 'Guide',
    badgeColor: 'emerald',
    description: 'Step-by-step instructions for structuring course catalogs and managing lesson modules.',
    readTime: '5 min read',
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-05T09:15:00Z',
    author: 'Curriculum Lead',
    content: `
      <h2>Course Structuring</h2>
      <p>Organize your educational materials into clean, sequential modules. DocEditor allows instructors to outline lessons, attach resources, and preview student views.</p>

      <h2>Step 1: Course Details</h2>
      <p>Supply the core information for your course catalog entry:</p>
      <ul>
        <li><strong>Title:</strong> A clear, descriptive course name.</li>
        <li><strong>Category:</strong> Primary subject area (e.g. Design, Engineering, Business).</li>
        <li><strong>Difficulty:</strong> Beginner, Intermediate, or Advanced.</li>
      </ul>

      <h2>Step 2: Structuring Modules</h2>
      <p>Add thematic chapters and attach text guides, video tutorials, or downloadable resource files.</p>
    `
  },
  {
    id: 'doc-api-keys',
    slug: 'api-webhooks',
    title: 'API Keys and Webhooks',
    category: 'API & Integrations',
    order: 1,
    badge: 'Developer',
    badgeColor: 'purple',
    description: 'Integrate enrollments and sync learning metrics using REST endpoints.',
    readTime: '4 min read',
    createdAt: '2026-10-03T11:00:00Z',
    updatedAt: '2026-10-05T08:35:00Z',
    author: 'Developer Relations',
    content: `
      <h2>REST API Overview</h2>
      <p>Use bearer token authentication to query user progress and automate student enrollments.</p>

      <div class="code-block">
        <div class="code-header">
          <span>bash</span>
          <button class="copy-button" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">Copy</button>
        </div>
        <pre><code>curl -X POST https://api.doceditor.io/v1/enrollments \\
  -H "Authorization: Bearer sec_live_0984712048" \\
  -H "Content-Type: application/json" \\
  -d '{
    "studentEmail": "alex.rivers@company.com",
    "sendWelcomeEmail": true
  }'</code></pre>
      </div>
    `
  }
];

export const DocStore = {
  loadStore() {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.documents) && Array.isArray(parsed.categories)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse localStorage data, falling back to defaults', err);
    }
    const initial = {
      version: '2.0.0',
      siteTitle: 'DocEditor',
      categories: DEFAULT_CATEGORIES,
      documents: DEFAULT_DOCUMENTS
    };
    this.saveStore(initial);
    return initial;
  },

  saveStore(store) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  },

  resetToDefault() {
    const initial = {
      version: '2.0.0',
      siteTitle: 'DocEditor',
      categories: DEFAULT_CATEGORIES,
      documents: DEFAULT_DOCUMENTS
    };
    this.saveStore(initial);
    return initial;
  },

  exportJSON(store) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `doceditor-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  },

  parseImportedJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.documents) && Array.isArray(parsed.categories)) {
        return {
          version: parsed.version || '2.0.0',
          siteTitle: parsed.siteTitle || 'DocEditor',
          categories: parsed.categories,
          documents: parsed.documents
        };
      }
    } catch (err) {
      console.error('Invalid JSON file format', err);
    }
    return null;
  }
};
