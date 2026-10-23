import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Document from './models/Document.js';
import Settings from './models/Settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doceditor';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Default seed data matching frontend store
const DEFAULT_CATEGORIES = [
  'Getting Started',
  'Course Management',
  'API & Integrations',
  'Advanced Customization'
];

const DEFAULT_DOCUMENTS = [
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

// Connect to MongoDB & Seed if empty
async function seedDatabase() {
  try {
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        key: 'main_settings',
        version: '2.0.0',
        siteTitle: 'DocEditor',
        categories: DEFAULT_CATEGORIES
      });
      console.log('Default settings seeded.');
    }

    const docCount = await Document.countDocuments();
    if (docCount === 0) {
      await Document.insertMany(DEFAULT_DOCUMENTS);
      console.log('Default documents seeded.');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`DocEditor backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes

// 1. Get full store (settings + documents)
app.get('/api/store', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'main_settings' }) || {
      version: '2.0.0',
      siteTitle: 'DocEditor',
      categories: DEFAULT_CATEGORIES
    };
    const documents = await Document.find().sort({ order: 1, createdAt: -1 });

    res.json({
      version: settings.version,
      siteTitle: settings.siteTitle,
      categories: settings.categories,
      documents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Save/Sync full store
app.post('/api/store', async (req, res) => {
  try {
    const { version, siteTitle, categories, documents } = req.body;

    // Update settings
    await Settings.findOneAndUpdate(
      { key: 'main_settings' },
      { version: version || '2.0.0', siteTitle: siteTitle || 'DocEditor', categories: categories || DEFAULT_CATEGORIES },
      { upsert: true, new: true }
    );

    // Sync documents (replace or upsert)
    if (Array.isArray(documents)) {
      // Clear and insert or upsert. Upserting is safer:
      for (const doc of documents) {
        await Document.findOneAndUpdate(
          { id: doc.id },
          doc,
          { upsert: true, new: true }
        );
      }
      // Optional: remove docs not in payload if needed, or keep
    }

    const updatedSettings = await Settings.findOne({ key: 'main_settings' });
    const updatedDocs = await Document.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      store: {
        version: updatedSettings.version,
        siteTitle: updatedSettings.siteTitle,
        categories: updatedSettings.categories,
        documents: updatedDocs
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Reset to default
app.post('/api/reset', async (req, res) => {
  try {
    await Settings.findOneAndUpdate(
      { key: 'main_settings' },
      { version: '2.0.0', siteTitle: 'DocEditor', categories: DEFAULT_CATEGORIES },
      { upsert: true, new: true }
    );

    await Document.deleteMany({});
    await Document.insertMany(DEFAULT_DOCUMENTS);

    const settings = await Settings.findOne({ key: 'main_settings' });
    const documents = await Document.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      store: {
        version: settings.version,
        siteTitle: settings.siteTitle,
        categories: settings.categories,
        documents
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
