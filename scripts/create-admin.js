/**
 * Script pour créer un compte administrateur
 * Usage: node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unigov-university';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function createAdmin() {
  log('═══════════════════════════════════════', colors.blue);
  log('   👑 Création d\'un compte Admin', colors.blue);
  log('═══════════════════════════════════════\n', colors.blue);

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    log('✅ Connecté à MongoDB', colors.green);

    const db = client.db();
    const usersCollection = db.collection('users');

    // Données de l'admin
    const adminEmail = 'admin@unigov.dz';
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      log(`⚠️  Un compte admin existe déjà avec l'email: ${adminEmail}`, colors.yellow);
      log('   Suppression de l\'ancien compte...', colors.yellow);
      await usersCollection.deleteOne({ email: adminEmail });
    }

    // Créer le nouveau compte admin
    const password = 'admin123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    const digitalId = `DID-ADMIN-${Date.now()}`;

    const admin = {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'UniGov',
      digitalId,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: ['all'],
      isActive: true,
    };

    const result = await usersCollection.insertOne(admin);
    
    log('\n✅ Compte administrateur créé avec succès!', colors.green);
    log('\n📋 Informations du compte:', colors.blue);
    log(`   Email: ${adminEmail}`);
    log(`   Mot de passe: ${password}`);
    log(`   Digital ID: ${digitalId}`);
    log(`   ID MongoDB: ${result.insertedId}`);
    
    log('\n⚠️  IMPORTANT:', colors.yellow);
    log('   Changez le mot de passe après la première connexion!');
    log('\n🔗 Connectez-vous sur:', colors.blue);
    log('   http://localhost:3000/auth/signin\n');

  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, colors.red);
    log('\n💡 Assurez-vous que:', colors.yellow);
    log('   1. MongoDB est en cours d\'exécution');
    log('   2. Le fichier .env.local est configuré correctement');
  } finally {
    await client.close();
  }
}

createAdmin();
