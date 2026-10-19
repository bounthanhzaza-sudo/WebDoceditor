# DocEditor 📝

**DocEditor** is a modern, feature-rich web-based document editing and management application built with **React 19**, **Vite**, and **Tailwind CSS**. It provides a sleek user interface equipped with robust category management, document persistence, rich text capabilities, and customizable workspace settings.

---

## ✨ Features

- **Document Management**: Create, edit, organize, and delete documents with real-time state updates.
- **Category System**: Organize documents into custom categories with detailed management.
- **Rich Text & Canvas Editing**: Write and format content with a clean, distraction-free writing canvas (`WordCanvas`).
- **Local Persistence**: Automatically saves documents, categories, and settings to browser `localStorage`.
- **Customizable Workspace**: Personalize site titles, themes, and workspace preferences.
- **Responsive Design**: Modern UI crafted with Tailwind CSS and Lucide icons, fully responsive across all devices.

---

## 📖 How to Use DocEditor

### 1. Navigating Documents & Categories
- **Sidebar**: The left sidebar organizes your documents by **Categories** (e.g., *Getting Started*, *Guides*, *API Reference*).
- **Search**: Use the search bar at the top of the sidebar to instantly filter documents by title, description, or category.
- **Selecting a Document**: Click on any document in the sidebar to open and view/edit it in the main canvas.

### 2. Creating & Deleting Documents
- **Adding a Document**: Click the `+` icon next to any category name in the sidebar to create a new document in that category.
- **Deleting a Document**: Open the document options/menu and select delete to remove a document.

### 3. Editing Content
- **Writing Canvas**: Click into the document workspace (`WordCanvas`) to edit titles, metadata (badges, read time, authors), and rich text content.
- **Auto-Save**: All changes are automatically persisted to your browser's local storage in real-time.

### 4. Managing Categories & Settings
- **Manage Categories**: Open the Category Manager modal from the top header to add new categories or remove old ones.
- **Settings**: Adjust workspace preferences, application title, and export/reset options through the Settings modal.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 (Functional components with Hooks)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage (`DocStore`)

---

## 🚀 Getting Started (Developers)

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Running Locally

1. Navigate to the project directory:
   ```bash
   cd C:\Users\ction\Desktop\DocEditor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Build for Production

```bash
npm run build
```

---

## 📄 License

This project is open-source and available under the ISC License.
