/**
 * Script pour créer un compte démo
 * Usage: node scripts/create-demo.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Utiliser l'URI complète ou construire depuis les variables d'environnement
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  // Si MONGODB_URI n'est pas défini, essayer de construire depuis les composants
  const host = process.env.MONGODB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT || '27017';
  MONGODB_URI = `mongodb://${host}:${port}`;
}
const DB_NAME = 'hidab-university';

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

async function createDemo() {
  log('═══════════════════════════════════════', colors.blue);
  log('   🎭 Création d\'un compte Démo', colors.blue);
  log('═══════════════════════════════════════\n', colors.blue);

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    log('✅ Connecté à MongoDB', colors.green);

    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    // Données du compte démo
    const demoEmail = 'demo@unigov.dz';
    
    // Vérifier si le compte démo existe déjà
    const existingDemo = await usersCollection.findOne({ email: demoEmail });
    
    if (existingDemo) {
      log(`⚠️  Un compte démo existe déjà avec l'email: ${demoEmail}`, colors.yellow);
      log('   Suppression de l\'ancien compte...', colors.yellow);
      await usersCollection.deleteOne({ email: demoEmail });
    }

    // Créer le nouveau compte démo
    const password = 'demo123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    const digitalId = `DID-DEMO-${Date.now()}`;

    const demoUser = {
      email: demoEmail,
      password: hashedPassword,
      role: 'student',
      firstName: 'Demo',
      lastName: 'Utilisateur',
      digitalId,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: ['library', 'cafeteria', 'transport', 'sports', 'health'],
      isActive: true,
    };

    const result = await usersCollection.insertOne(demoUser);
    
    // Vérifier que le compte a bien été créé
    const createdUser = await usersCollection.findOne({ email: demoEmail });
    if (!createdUser) {
      throw new Error('Le compte n\'a pas pu être créé');
    }

    // Vérifier que le mot de passe fonctionne
    const passwordCheck = await bcrypt.compare(password, createdUser.password);
    if (!passwordCheck) {
      throw new Error('Le mot de passe hashé ne correspond pas');
    }
    
    log('\n✅ Compte démo créé avec succès!', colors.green);
    log('\n📋 Informations du compte:', colors.blue);
    log(`   Email: ${demoEmail}`);
    log(`   Mot de passe: ${password}`);
    log(`   Digital ID: ${digitalId}`);
    log(`   Rôle: ${demoUser.role}`);
    log(`   ID MongoDB: ${result.insertedId}`);
    log(`   ✅ Vérification du mot de passe: OK`, colors.green);
    
    log('\n🔗 Connectez-vous sur:', colors.blue);
    log('   http://localhost:3000/auth/signin\n');
    log('💡 Utilisez le bouton "Se connecter avec le compte démo" ou:', colors.yellow);
    log(`   Email: ${demoEmail}`);
    log(`   Mot de passe: ${password}\n`);
    log('✨ Le compte démo est maintenant prêt à être utilisé!', colors.green);

  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, colors.red);
    log('\n💡 Assurez-vous que:', colors.yellow);
    log('   1. MongoDB est en cours d\'exécution');
    log('   2. Le fichier .env.local est configuré correctement');
    log('   3. La variable MONGODB_URI est définie dans .env.local');
    log('\n📝 Exemple de configuration .env.local:', colors.blue);
    log('   MONGODB_URI=mongodb://localhost:27017');
    log('   NEXTAUTH_SECRET=votre_secret_key');
    log('   NEXTAUTH_URL=http://localhost:3000');
    process.exit(1);
  } finally {
    await client.close();
  }
}

createDemo();

