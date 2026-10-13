const fs = require('fs');
const path = require('path');

// 1. Path configurations
const codeKivoDir = 'd:/ideawork/code-kivo';
const sidebarFilePath = path.join(codeKivoDir, 'src/data/sidebar.ts');

if (!fs.existsSync(sidebarFilePath)) {
  console.error('code-kivo sidebar.ts not found at:', sidebarFilePath);
  process.exit(1);
}

// 2. Extract sidebarData from sidebar.ts
const content = fs.readFileSync(sidebarFilePath, 'utf8');
const catMatch = content.match(/export const sidebarData: ToolCategory\[\] = (\[[\s\S]*?\]);\s*\n\s*export function/);

if (!catMatch) {
  console.error('Failed to match sidebarData in sidebar.ts');
  process.exit(1);
}

let raw = catMatch[1].replace(/icon:\s*icons\.[a-zA-Z0-9_]+/g, "icon: ''");
const categories = eval(raw);

const categoryIcons = {
  'JSON & Data': '🗂️',
  'Encoding & Number Base': '🔄',
  'HTTP & API': '🌐',
  'System & Security': '🛡️',
  'Web & CSS': '🎨',
  'Text & Typography': '📝',
  'Regular Expressions': '🎯',
  'Database & SQL': '💾'
};

const categoryDescriptions = {
  'JSON & Data': 'Format, validate, query, convert JSON to CSV and generate TypeScript types.',
  'Encoding & Number Base': 'Base64, URL percent-encoding, Hex, Binary, Octal and Number base conversion.',
  'HTTP & API': 'JWT decoding and verification, cURL command generator, HTTP status codes and URL inspection.',
  'System & Security': 'UUID v4/v7 generators, cryptographic hashes (MD5, SHA-256), Unix timestamps and cron expressions.',
  'Web & CSS': 'Modern CSS generators (box shadows, gradients, flexbox), color models, HTML/CSS formatters and JS minifiers.',
  'Text & Typography': 'Case conversion, side-by-side text diff, character & word frequency analysis, and Markdown rendering.',
  'Regular Expressions': 'Interactive regex testing with real-time match highlighting, syntax breakdown and pattern composition.',
  'Database & SQL': 'SQL query formatting, minification, and visual SQL query builder.'
};

let totalTools = 0;
categories.forEach(cat => {
  totalTools += cat.items.length;
});

const baseUrl = 'https://codekivo.com';

// 3. Build README.md
let md = `<div align="center">

# 🛠️ Awesome Developer Tools

**The Official Curated Directory of Free, High-Performance Online Developer Utilities by [CodeKivo](https://codekivo.com).**  
*A comprehensive collection of 30+ browser-native, privacy-conscious utilities for web developers, backend engineers, DevOps professionals, and data analysts.*

[![CodeKivo Official](https://img.shields.io/badge/Official%20Site-codekivo.com-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://codekivo.com)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-success?style=for-the-badge&logo=shield)](https://codekivo.com)
[![Total Utilities](https://img.shields.io/badge/Total%20Tools-${totalTools}%20Utilities-blue?style=for-the-badge)](https://codekivo.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[🌐 Explore All Tools](https://codekivo.com) • [⚡ Why CodeKivo?](#-why-codekivo-developer-tools) • [🗂️ Categories](#-quick-navigation--categories) • [🌐 Multilingual](#-multilingual-access) • [🤝 Contributing](#-contributing)

</div>

---

## 📑 Quick Navigation & Categories

All tools are engineered with modern web standards, executing calculations directly in your browser. Sensitive payloads—such as API keys, JWT tokens, customer data, and SQL queries—never leave your local device.

`;

categories.forEach(cat => {
  const icon = categoryIcons[cat.name] || '🔧';
  const desc = categoryDescriptions[cat.name] || '';
  const catUrl = `${baseUrl}${cat.path}`;
  md += `- [${icon} **${cat.name}** (${cat.items.length} Tools)](${catUrl}) — ${desc}\n`;
});

md += `\n---\n\n## 🗂️ Complete Tool Directory by Category\n\n`;

categories.forEach((cat, index) => {
  const icon = categoryIcons[cat.name] || '🔧';
  const catUrl = `${baseUrl}${cat.path}`;
  md += `### ${index + 1}. ${icon} [${cat.name}](${catUrl})\n\n`;
  md += `> 📂 **Category Landing Hub**: [${catUrl}](${catUrl})\n\n`;
  md += `| Tool Name | Description | Direct Access |\n`;
  md += `| :--- | :--- | :--- |\n`;

  cat.items.forEach(tool => {
    const toolUrl = `${baseUrl}${tool.path}`;
    md += `| **[${tool.name}](${toolUrl})** | ${tool.description} | [Launch ${tool.name} ↗](${toolUrl}) |\n`;
  });

  md += `\n---\n\n`;
});

md += `## 🌐 Multilingual Access

CodeKivo provides localized interfaces and native workflows across multiple languages:

| Language | Regional Code | Official Hub URL |
| :--- | :---: | :--- |
| **English** | \`EN\` | [https://codekivo.com/](https://codekivo.com/) |
| **简体中文** | \`ZH\` | [https://codekivo.com/zh/](https://codekivo.com/zh/) |
| **Español** | \`ES\` | [https://codekivo.com/es/](https://codekivo.com/es/) |

---

## ⚡ Why CodeKivo Developer Tools?

Modern software engineering demands speed, reliability, and utmost data security:

1. **🛡️ 100% In-Browser Privacy**: All operations (JSON validation, JWT token decoding, hash calculations, regex parsing) are executed locally inside your client sandbox. No telemetry on your source code or customer data.
2. **⚡ Instant Response Time**: Zero round-trip network delays. Instant live preview and reactive transformations as you type.
3. **💎 Clean, Ad-Free & Modern Interface**: High-contrast dark mode support, ergonomic keyboard shortcuts, copy-to-clipboard conveniences, and distraction-free layouts.
4. **🚀 Production-Ready Utilities**: Designed for daily engineering workflows—from debugging production APIs and inspecting JWT claims to building complex SQL clauses and generating UUIDs.

---

## 🤝 Contributing

Suggestions, bug reports, and new tool requests are always welcome!

1. Fork this repository.
2. Create your feature branch (\`git checkout -b feature/new-tool\`).
3. Commit your changes (\`git commit -m 'Add new developer utility'\`).
4. Push to the branch (\`git push origin feature/new-tool\`).
5. Open a Pull Request.

---

## 📄 License

This directory repository is distributed under the [MIT License](LICENSE).  
Copyright (c) 2026 [CodeKivo](https://codekivo.com).
`;

fs.writeFileSync(path.join(__dirname, '../README.md'), md, 'utf8');

// 4. Build index.html
let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Awesome Developer Tools - Free Online Developer Utilities Directory</title>
  <meta name="description" content="A curated directory of free, privacy-first developer utilities by CodeKivo. JSON formatters, JWT decoders, Base64 tools, UUID generators, SQL builders, and CSS helpers.">
  <link rel="canonical" href="https://codekivo.com">
  <meta property="og:title" content="Awesome Developer Tools - Curated Directory">
  <meta property="og:description" content="30+ free, fast, in-browser developer utilities. 100% private and client-side.">
  <meta property="og:url" content="https://codekivo.com">
  <meta property="og:type" content="website">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --card-hover-bg: #1f2937;
      --card-border: #1e293b;
      --card-border-hover: #6366f1;
      --text-main: #f9fafb;
      --text-muted: #9ca3af;
      --accent: #818cf8;
      --accent-gradient: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
      --badge-bg: #312e81;
      --badge-text: #c7d2fe;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.6;
      padding: 2rem 1rem 4rem;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      padding: 4rem 1rem 2.5rem;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 3rem;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: var(--badge-bg);
      color: var(--badge-text);
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    h1 {
      font-size: 2.85rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.lead {
      font-size: 1.2rem;
      color: var(--text-muted);
      max-width: 760px;
      margin: 0 auto 2rem;
    }
    .header-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn-main {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 2rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      font-weight: 700;
      border-radius: 9999px;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);
    }
    .btn-main:hover {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.45);
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.75rem;
      background: #1f2937;
      color: #e5e7eb;
      font-weight: 600;
      border-radius: 9999px;
      text-decoration: none;
      border: 1px solid #374151;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background: #374151;
      color: #ffffff;
      transform: translateY(-2px);
    }
    .quick-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .quick-stats span strong {
      color: #fff;
    }
    .category-section {
      margin-bottom: 3rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #ffffff;
    }
    .section-link {
      color: var(--accent);
      font-size: 0.875rem;
      text-decoration: none;
      font-weight: 600;
    }
    .section-link:hover {
      text-decoration: underline;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 1.25rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .card:hover {
      background: var(--card-hover-bg);
      border-color: var(--card-border-hover);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
    .card h3 {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }
    .card p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      flex-grow: 1;
      line-height: 1.5;
    }
    .card a.tool-btn {
      color: var(--accent);
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      transition: gap 0.2s ease;
    }
    .card a.tool-btn:hover {
      gap: 0.5rem;
      text-decoration: underline;
    }
    footer {
      text-align: center;
      padding: 3rem 1rem 1rem;
      color: var(--text-muted);
      font-size: 0.875rem;
      border-top: 1px solid var(--card-border);
      margin-top: 4rem;
    }
    footer a {
      color: var(--accent);
      text-decoration: none;
    }
    footer a:hover {
      text-decoration: underline;
    }
    .footer-links {
      margin-bottom: 1rem;
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">Open Source Developer Directory</span>
      <h1>Awesome Developer Tools</h1>
      <p class="lead">A curated, privacy-first directory of 30+ browser-native engineering utilities. Zero server uploads, lightning fast, free forever.</p>
      <div class="header-actions">
        <a href="https://codekivo.com" class="btn-main" target="_blank" rel="noopener">Explore on CodeKivo &rarr;</a>
        <a href="https://github.com" class="btn-secondary" target="_blank" rel="noopener">Star on GitHub ⭐</a>
      </div>
      <div class="quick-stats">
        <span>📦 <strong>${totalTools}</strong> Utilities</span>
        <span>🛡️ <strong>100%</strong> In-Browser Execution</span>
        <span>⚡ <strong>0ms</strong> Upload Latency</span>
      </div>
    </header>
`;

categories.forEach(cat => {
  const icon = categoryIcons[cat.name] || '🔧';
  const catUrl = `${baseUrl}${cat.path}`;
  html += `
    <!-- ${cat.name} -->
    <section class="category-section">
      <div class="section-header">
        <h2 class="section-title">${icon} ${cat.name}</h2>
        <a href="${catUrl}" class="section-link" target="_blank" rel="noopener">Browse Hub &rarr;</a>
      </div>
      <div class="grid">`;

  cat.items.forEach(tool => {
    const toolUrl = `${baseUrl}${tool.path}`;
    html += `
        <div class="card">
          <h3>${tool.name}</h3>
          <p>${tool.description}</p>
          <a href="${toolUrl}" class="tool-btn" target="_blank" rel="noopener">Launch Tool &rarr;</a>
        </div>`;
  });

  html += `
      </div>
    </section>
`;
});

html += `
    <footer>
      <div class="footer-links">
        <a href="https://codekivo.com" target="_blank" rel="noopener">CodeKivo Hub</a>
        <a href="https://codekivo.com/zh/" target="_blank" rel="noopener">简体中文</a>
        <a href="https://codekivo.com/es/" target="_blank" rel="noopener">Español</a>
      </div>
      <p>Curated and maintained with ❤️ for developers worldwide &bull; Distributed under the MIT License.</p>
    </footer>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../index.html'), html, 'utf8');

console.log(`Successfully generated README.md and index.html with ${totalTools} tools across ${categories.length} categories.`);
