#!/usr/bin/env node

/**
 * Script pour générer un fichier .env.production
 * Usage: node scripts/generate-env.js
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Générer une clé secrète aléatoire
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

// Template pour .env.production
const envTemplate = `# ==========================================
# Configuration Environment Variables - PRODUCTION
# UniGov Platform
# Généré le: ${new Date().toISOString()}
# ==========================================
# ⚠️  ATTENTION: Ce fichier contient des informations sensibles
# Ne commitez JAMAIS ce fichier dans Git
# ==========================================

# ==========================================
# MongoDB Configuration
# ==========================================
# Remplacez par votre URI MongoDB Atlas ou local sécurisée
# Format Atlas: mongodb+srv://username:password@cluster.mongodb.net/hidab-university?retryWrites=true&w=majority
# Format Local: mongodb://localhost:27017/hidab-university
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hidab-university?retryWrites=true&w=majority

# ==========================================
# NextAuth.js Configuration
# ==========================================
# URL complète de votre application en production
NEXTAUTH_URL=https://votre-domaine.com

# Clé secrète générée automatiquement (minimum 32 caractères)
# Vous pouvez régénérer avec: node scripts/generate-env.js
NEXTAUTH_SECRET=${generateSecret(32)}

# ==========================================
# Application Configuration
# ==========================================
NODE_ENV=production
`;

// Template pour .env.local (développement)
const envLocalTemplate = `# ==========================================
# Configuration Environment Variables - DEVELOPMENT
# UniGov Platform
# Généré le: ${new Date().toISOString()}
# ==========================================

# ==========================================
# MongoDB Configuration
# ==========================================
# MongoDB Local par défaut
MONGODB_URI=mongodb://localhost:27017/hidab-university

# Pour MongoDB Atlas, décommentez et remplacez:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hidab-university?retryWrites=true&w=majority

# ==========================================
# NextAuth.js Configuration
# ==========================================
NEXTAUTH_URL=http://localhost:3000

# Clé secrète pour le développement (générée automatiquement)
NEXTAUTH_SECRET=${generateSecret(32)}

# ==========================================
# Application Configuration
# ==========================================
NODE_ENV=development
`;

// Créer les fichiers
const rootDir = path.resolve(__dirname, '..');
const envProdPath = path.join(rootDir, '.env.production');
const envLocalPath = path.join(rootDir, '.env.local');

// Vérifier si les fichiers existent déjà
const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

function createEnvFile(filePath, content, fileType) {
  if (fs.existsSync(filePath) && !force) {
    console.log(`⚠️  Le fichier ${fileType} existe déjà.`);
    console.log(`   Utilisez --force pour le remplacer.`);
    return false;
  }

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fichier ${fileType} créé avec succès: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la création de ${fileType}:`, error.message);
    return false;
  }
}

console.log('🚀 Génération des fichiers d\'environnement...\n');

// Créer .env.production
console.log('📝 Création de .env.production...');
createEnvFile(envProdPath, envTemplate, '.env.production');

console.log('');

// Créer .env.local si demandé
if (args.includes('--local')) {
  console.log('📝 Création de .env.local...');
  createEnvFile(envLocalPath, envLocalTemplate, '.env.local');
}

console.log('\n📋 Prochaines étapes:');
console.log('1. Éditez .env.production et configurez:');
console.log('   - MONGODB_URI avec votre URI MongoDB');
console.log('   - NEXTAUTH_URL avec votre domaine de production');
console.log('2. Pour le développement local, créez .env.local avec:');
console.log('   node scripts/generate-env.js --local');
console.log('\n⚠️  N\'oubliez pas:');
console.log('   - Ne commitez JAMAIS les fichiers .env* dans Git');
console.log('   - Utilisez des secrets différents en production');
console.log('   - Vérifiez que .env* est dans .gitignore');

