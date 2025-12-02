#!/usr/bin/env node

/**
 * Script pour vérifier que tous les fichiers nécessaires sont présents
 * avant le build
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'components/dashboard-nav.tsx',
  'components/ui/card.tsx',
  'components/ui/tabs.tsx',
  'components/ui/button.tsx',
  'components/ui/badge.tsx',
  'components/ui/input.tsx',
  'components/ui/label.tsx',
  'lib/utils.ts',
  'lib/mongodb.ts',
  'lib/auth.ts',
  'lib/types.ts',
];

console.log('🔍 Vérification des fichiers nécessaires...\n');

let allFilesExist = true;
const missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    missingFiles.push(file);
    allFilesExist = false;
  }
});

console.log('');

if (allFilesExist) {
  console.log('✅ Tous les fichiers nécessaires sont présents!');
  process.exit(0);
} else {
  console.error('❌ Fichiers manquants:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  console.error('\n⚠️  Le build va échouer si ces fichiers ne sont pas présents.');
  process.exit(1);
}

