/**
 * Script pour vérifier le compte démo
 * Usage: node scripts/verify-demo.js
 */

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Utiliser l'URI complète ou construire depuis les variables d'environnement
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
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

async function verifyDemo() {
  log('═══════════════════════════════════════', colors.blue);
  log('   🔍 Vérification du compte Démo', colors.blue);
  log('═══════════════════════════════════════\n', colors.blue);

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    log('✅ Connecté à MongoDB', colors.green);

    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    const demoEmail = 'demo@unigov.dz';
    const demoPassword = 'demo123456';

    // Vérifier si le compte existe
    const user = await usersCollection.findOne({ email: demoEmail });
    
    if (!user) {
      log(`\n❌ Le compte démo n'existe pas!`, colors.red);
      log(`\n💡 Exécutez: npm run create-demo`, colors.yellow);
      return;
    }

    log(`\n✅ Compte trouvé: ${demoEmail}`, colors.green);
    log(`\n📋 Informations du compte:`, colors.blue);
    log(`   Email: ${user.email}`);
    log(`   Nom: ${user.firstName} ${user.lastName}`);
    log(`   Rôle: ${user.role}`);
    log(`   Digital ID: ${user.digitalId}`);
    log(`   Actif: ${user.isActive ? 'Oui' : 'Non'}`);
    log(`   Permissions: ${user.permissions?.join(', ') || 'Aucune'}`);

    // Vérifier le mot de passe
    if (!user.password) {
      log(`\n❌ Le compte n'a pas de mot de passe!`, colors.red);
      return;
    }

    const isPasswordValid = await bcrypt.compare(demoPassword, user.password);
    
    if (isPasswordValid) {
      log(`\n✅ Mot de passe vérifié: CORRECT`, colors.green);
      log(`\n🎉 Le compte démo est prêt à être utilisé!`, colors.green);
      log(`\n📝 Identifiants:`, colors.blue);
      log(`   Email: ${demoEmail}`);
      log(`   Mot de passe: ${demoPassword}\n`);
    } else {
      log(`\n❌ Mot de passe vérifié: INCORRECT`, colors.red);
      log(`\n💡 Le mot de passe dans la base de données ne correspond pas.`, colors.yellow);
      log(`   Exécutez: npm run create-demo pour recréer le compte\n`, colors.yellow);
    }

  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, colors.red);
    log(`\n💡 Assurez-vous que:`, colors.yellow);
    log(`   1. MongoDB est en cours d'exécution`);
    log(`   2. Le fichier .env.local est configuré correctement`);
    log(`   3. La base de données "${DB_NAME}" existe\n`);
  } finally {
    await client.close();
  }
}

verifyDemo();

