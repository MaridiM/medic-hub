#!/usr/bin/env node

/**
 * MedicHub Documentation Generator
 *
 * This script automatically generates comprehensive documentation
 * for the entire MedicHub project including:
 * - Full code reference for all files
 * - Module documentation
 * - Combined FULL-DOCUMENTATION.md
 *
 * Usage: node generate-docs.js
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  projectRoot: path.join(__dirname, '../../'),
  docsRoot: __dirname,
  backendRoot: path.join(__dirname, '../../apps/api/src'),
  frontendRoot: path.join(__dirname, '../../apps/web/src'),
  outputDirs: {
    en: path.join(__dirname, 'en'),
    ru: path.join(__dirname, 'ru')
  }
};

// File extensions to document
const EXTENSIONS = {
  backend: ['.ts', '.js'],
  frontend: ['.tsx', '.ts', '.js', '.jsx'],
  config: ['.json', '.yml', '.yaml', '.env.example']
};

/**
 * Get all files recursively from a directory
 */
async function getAllFiles(dir, extensions, baseDir = dir) {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules, .next, dist, etc.
      if (entry.name === 'node_modules' ||
          entry.name === '.next' ||
          entry.name === 'dist' ||
          entry.name === '__generated__' ||
          entry.name === '.git') {
        continue;
      }

      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath, extensions, baseDir);
        files.push(...subFiles);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        const relativePath = path.relative(baseDir, fullPath);
        files.push({
          fullPath,
          relativePath,
          name: entry.name,
          ext: path.extname(entry.name)
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return files;
}

/**
 * Read file content
 */
async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return '';
  }
}

/**
 * Generate markdown documentation for a code file
 */
function generateCodeDoc(file, content, category) {
  const ext = file.ext.substring(1); // Remove leading dot
  const lang = ext === 'tsx' ? 'typescript' : ext === 'ts' ? 'typescript' : ext;

  return `# File: ${file.relativePath}

## Location
\`${file.fullPath.replace(/\\/g, '/')}\`

## Category
${category}

## File Type
${ext.toUpperCase()} (${file.name})

## Size
${content.length} characters, ${content.split('\n').length} lines

## Full Code

\`\`\`${lang}
${content}
\`\`\`

## Description

This file is part of the MedicHub ${category === 'Backend' ? 'API (NestJS)' : 'Frontend (Next.js)'} application.

### File Purpose
[Auto-generated documentation - please review and update]

### Key Exports
[Auto-detected from code analysis]

### Dependencies
[Auto-detected from imports]

---

*Auto-generated documentation - Last updated: ${new Date().toISOString()}*
`;
}

/**
 * Generate backend code reference
 */
async function generateBackendCodeReference() {
  console.log('Generating backend code reference...');

  const files = await getAllFiles(CONFIG.backendRoot, EXTENSIONS.backend, CONFIG.backendRoot);
  const outputDir = path.join(CONFIG.outputDirs.en, '10-CODE-REFERENCE', 'backend');

  await fs.mkdir(outputDir, { recursive: true });

  let index = '# Backend Code Reference\n\n';
  index += '## Table of Contents\n\n';

  for (const file of files) {
    const content = await readFile(file.fullPath);
    const doc = generateCodeDoc(file, content, 'Backend');

    // Create directory structure
    const docPath = path.join(outputDir, file.relativePath + '.md');
    await fs.mkdir(path.dirname(docPath), { recursive: true });
    await fs.writeFile(docPath, doc);

    index += `- [${file.relativePath}](./${file.relativePath}.md)\n`;

    console.log(`  ✓ ${file.relativePath}`);
  }

  await fs.writeFile(path.join(outputDir, 'INDEX.md'), index);

  console.log(`✓ Backend code reference generated (${files.length} files)`);
  return files.length;
}

/**
 * Generate frontend code reference
 */
async function generateFrontendCodeReference() {
  console.log('Generating frontend code reference...');

  const files = await getAllFiles(CONFIG.frontendRoot, EXTENSIONS.frontend, CONFIG.frontendRoot);
  const outputDir = path.join(CONFIG.outputDirs.en, '10-CODE-REFERENCE', 'frontend');

  await fs.mkdir(outputDir, { recursive: true });

  let index = '# Frontend Code Reference\n\n';
  index += '## Table of Contents\n\n';

  for (const file of files) {
    const content = await readFile(file.fullPath);
    const doc = generateCodeDoc(file, content, 'Frontend');

    // Create directory structure
    const docPath = path.join(outputDir, file.relativePath + '.md');
    await fs.mkdir(path.dirname(docPath), { recursive: true });
    await fs.writeFile(docPath, doc);

    index += `- [${file.relativePath}](./${file.relativePath}.md)\n`;

    console.log(`  ✓ ${file.relativePath}`);
  }

  await fs.writeFile(path.join(outputDir, 'INDEX.md'), index);

  console.log(`✓ Frontend code reference generated (${files.length} files)`);
  return files.length;
}

/**
 * Combine all documentation into one file
 */
async function generateFullDocumentation() {
  console.log('Generating FULL-DOCUMENTATION.md...');

  const docsDir = CONFIG.outputDirs.en;
  let fullDoc = '';

  // Add header
  fullDoc += `# MedicHub - Complete Technical Documentation

**Version**: v0.0.1 (2025.12.11)

---

`;

  // Combine all core docs (00-09)
  const coreFiles = [
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

  for (const file of coreFiles) {
    const filePath = path.join(docsDir, file);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      fullDoc += `\n\n---\n\n${content}\n`;
      console.log(`  ✓ Added ${file}`);
    } catch (error) {
      console.log(`  ⚠ Skipped ${file} (not found)`);
    }
  }

  // Write full documentation
  await fs.writeFile(path.join(docsDir, 'FULL-DOCUMENTATION.md'), fullDoc);

  console.log('✓ FULL-DOCUMENTATION.md generated');
}

/**
 * Main execution
 */
async function main() {
  console.log('MedicHub Documentation Generator');
  console.log('=================================\n');

  try {
    const startTime = Date.now();

    // Generate code references
    const backendCount = await generateBackendCodeReference();
    const frontendCount = await generateFrontendCodeReference();

    // Generate combined documentation
    await generateFullDocumentation();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n✓ Documentation generation complete!');
    console.log(`  - Backend files: ${backendCount}`);
    console.log(`  - Frontend files: ${frontendCount}`);
    console.log(`  - Total files: ${backendCount + frontendCount}`);
    console.log(`  - Duration: ${duration}s`);
    console.log(`\nOutput directory: ${CONFIG.outputDirs.en}`);

  } catch (error) {
    console.error('\n✗ Error generating documentation:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, generateBackendCodeReference, generateFrontendCodeReference };
