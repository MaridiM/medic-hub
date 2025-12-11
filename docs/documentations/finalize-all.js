#!/usr/bin/env node

/**
 * Finalize MedicHub Documentation
 *
 * - Creates all remaining module docs
 * - Generates FULL-DOCUMENTATION.md
 * - Creates Russian translation structure
 * - Generates summary report
 */

const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  enDir: path.join(__dirname, 'en'),
  ruDir: path.join(__dirname, 'ru'),
  modulesDir: path.join(__dirname, 'en/11-MODULES')
};

// Module templates
const MODULES = [
  { name: 'dashboard', title: 'Dashboard Module', desc: 'Main application dashboard with statistics and charts' },
  { name: 'organization', title: 'Organization Module', desc: 'Organization management and team administration' },
  { name: 'settings', title: 'Settings Module', desc: 'User profile and application settings' },
  { name: 'security', title: 'Security Module', desc: 'Rate limiting, account lockout, and security monitoring' },
  { name: 'notification', title: 'Notification Module', desc: 'Email and SMS notification dispatch' }
];

async function createModuleDocs() {
  console.log('Creating module documentation...\n');

  await fs.mkdir(CONFIG.modulesDir, { recursive: true });

  for (const module of MODULES) {
    const content = `# ${module.title} Documentation

## Version: v0.0.1 (2025.12.11)

---

## Overview

${module.desc}

### Key Features
[Auto-generated - to be completed with specific features]

### Module Structure
\`\`\`
modules/${module.name}/
├── services/
├── resolvers/
├── dtos/
├── models/
└── __tests__/
\`\`\`

### API Endpoints
[GraphQL queries and mutations]

### Data Models
[Prisma models used]

### Implementation Details
For full code implementation, see:
- [Backend Code Reference](../../10-CODE-REFERENCE/backend/modules/${module.name}/)
- [Frontend Code Reference](../../10-CODE-REFERENCE/frontend/modules/${module.name}/)

---

*Auto-generated module documentation - v0.0.1 (2025.12.11)*
`;

    const filePath = path.join(CONFIG.modulesDir, `${module.name}.md`);
    await fs.writeFile(filePath, content);
    console.log(`✓ ${module.name}.md created`);
  }

  console.log('\n✓ All module documentation created');
}

async function createFullDocumentation() {
  console.log('\nCreating FULL-DOCUMENTATION.md...\n');

  let fullDoc = `# MedicHub - Complete Technical Documentation

**Version**: v0.0.1
**Date**: 2025.12.11
**Status**: Initial Release

---

## Table of Contents

1. [Index and Navigation](#index-and-navigation)
2. [Architecture](#architecture)
3. [Backend API](#backend-api)
4. [Frontend Application](#frontend-application)
5. [Design System](#design-system)
6. [Database Schema](#database-schema)
7. [GraphQL API](#graphql-api)
8. [Security](#security)
9. [Deployment](#deployment)
10. [Environment Variables](#environment-variables)
11. [Modules](#modules)
12. [Code Reference](#code-reference)

---

`;

  // Read and combine all core docs
  const docs = [
    '00-INDEX.md',
    '01-ARCHITECTURE.md',
    '02-BACKEND-API.md',
    '03-FRONTEND.md',
    '04-DESIGN-SYSTEM.md',
    '05-DATABASE-SCHEMA.md',
    '06-GRAPHQL-API.md',
    '07-SECURITY.md',
    '08-DEPLOYMENT.md',
    '09-ENVIRONMENT.md'
  ];

  for (const doc of docs) {
    try {
      const content = await fs.readFile(path.join(CONFIG.enDir, doc), 'utf8');
      fullDoc += `\n\n---\n\n# ${doc.replace('.md', '').replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase()}\n\n`;
      fullDoc += content;
      console.log(`✓ Added ${doc}`);
    } catch (error) {
      console.log(`  ⚠ Skipped ${doc} (not found)`);
    }
  }

  // Add module documentation section
  fullDoc += `\n\n---\n\n# MODULE DOCUMENTATION\n\n`;
  const moduleFiles = await fs.readdir(CONFIG.modulesDir);
  for (const file of moduleFiles) {
    if (file.endsWith('.md')) {
      const content = await fs.readFile(path.join(CONFIG.modulesDir, file), 'utf8');
      fullDoc += `\n\n---\n\n${content}`;
      console.log(`✓ Added module: ${file}`);
    }
  }

  // Add code reference info
  fullDoc += `\n\n---\n\n# CODE REFERENCE\n\n`;
  fullDoc += `Complete source code documentation is available in:\n\n`;
  fullDoc += `- [Backend Code Reference](./10-CODE-REFERENCE/backend/)\n`;
  fullDoc += `- [Frontend Code Reference](./10-CODE-REFERENCE/frontend/)\n\n`;
  fullDoc += `Total documented files: 400+\n\n`;

  // Write full documentation
  await fs.writeFile(path.join(CONFIG.enDir, 'FULL-DOCUMENTATION.md'), fullDoc);
  console.log('\n✓ FULL-DOCUMENTATION.md created');

  // Get file size
  const stats = await fs.stat(path.join(CONFIG.enDir, 'FULL-DOCUMENTATION.md'));
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`  Size: ${sizeMB} MB`);
}

async function createRussianStructure() {
  console.log('\nCreating Russian documentation structure...\n');

  await fs.mkdir(CONFIG.ruDir, { recursive: true });
  await fs.mkdir(path.join(CONFIG.ruDir, '10-CODE-REFERENCE'), { recursive: true });
  await fs.mkdir(path.join(CONFIG.ruDir, '11-MODULES'), { recursive: true });

  // Create README in Russian folder
  const readme = `# MedicHub - Техническая Документация (Русская Версия)

## Версия: v0.0.1 (2025.12.11)

---

## Примечание

Полная русская версия документации находится в процессе перевода.

Пока вы можете использовать:
- **Английскую версию**: [../en/](../en/)
- **Диаграммы**: [../diagrams/](../diagrams/) (универсальны для всех языков)

---

## Структура Документации

Когда перевод будет завершен, здесь будут доступны:
- 00-INDEX.md - Оглавление
- 01-ARCHITECTURE.md - Архитектура
- 02-BACKEND-API.md - Backend API
- 03-FRONTEND.md - Frontend приложение
- 04-DESIGN-SYSTEM.md - Дизайн-система
- 05-DATABASE-SCHEMA.md - Схема базы данных
- 06-GRAPHQL-API.md - GraphQL API
- 07-SECURITY.md - Безопасность
- 08-DEPLOYMENT.md - Развертывание
- 09-ENVIRONMENT.md - Переменные окружения
- 10-CODE-REFERENCE/ - Справочник кода
- 11-MODULES/ - Документация модулей
- FULL-DOCUMENTATION.md - Полная документация

---

*Авто-сгенерированная документация - Версия 0.0.1 (2025.12.11)*
`;

  await fs.writeFile(path.join(CONFIG.ruDir, 'README.md'), readme);
  console.log('✓ Russian README.md created');
}

async function generateSummaryReport() {
  console.log('\n' + '='.repeat(60));
  console.log('DOCUMENTATION GENERATION SUMMARY');
  console.log('='.repeat(60) + '\n');

  // Count files
  const countFiles = async (dir) => {
    let count = 0;
    try {
      const files = await fs.readdir(dir, { recursive: true });
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = await fs.stat(fullPath);
        if (stats.isFile() && file.endsWith('.md')) {
          count++;
        }
      }
    } catch (e) {
      // Directory might not exist
    }
    return count;
  };

  const enFileCount = await countFiles(CONFIG.enDir);
  const ruFileCount = await countFiles(CONFIG.ruDir);
  const diagramCount = (await fs.readdir(path.join(__dirname, 'diagrams'))).filter(f => f.endsWith('.mmd')).length;

  console.log('✓ Documentation Structure Created\n');
  console.log(`English Documentation:`);
  console.log(`  - Core files: 10`);
  console.log(`  - Module docs: ${MODULES.length + 1}`);  // +1 for auth.md
  console.log(`  - Code reference: ${enFileCount - 11 - MODULES.length - 1}`);
  console.log(`  - Total files: ${enFileCount}\n`);

  console.log(`Russian Documentation:`);
  console.log(`  - Structure created: Yes`);
  console.log(`  - Translation status: Pending\n`);

  console.log(`Diagrams:`);
  console.log(`  - Mermaid diagrams: ${diagramCount}\n`);

  console.log(`Generators:`);
  console.log(`  - generate-docs.js: CODE-REFERENCE generator`);
  console.log(`  - complete-generation.js: Core docs generator`);
  console.log(`  - finalize-all.js: Final assembly\n`);

  console.log('Output Directories:');
  console.log(`  - English: ${CONFIG.enDir}`);
  console.log(`  - Russian: ${CONFIG.ruDir}`);
  console.log(`  - Diagrams: ${path.join(__dirname, 'diagrams')}\n`);

  console.log('✓ Documentation generation complete!');
  console.log('\n' + '='.repeat(60));
}

async function main() {
  try {
    await createModuleDocs();
    await createFullDocumentation();
    await createRussianStructure();
    await generateSummaryReport();
  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
