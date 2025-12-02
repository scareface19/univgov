/**
 * Script de diagnostic complet pour le compte démo
 * Usage: node scripts/test-demo-auth.js
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
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testDemoAuth() {
  log('═══════════════════════════════════════', colors.blue);
  log('   🔍 Diagnostic Complet - Compte Démo', colors.blue);
  log('═══════════════════════════════════════\n', colors.blue);

  const client = new MongoClient(MONGODB_URI);
  const demoEmail = 'demo@unigov.dz';
  const demoPassword = 'demo123456';

  try {
    // 1. Test de connexion MongoDB
    log('1️⃣  Test de connexion MongoDB...', colors.cyan);
    await client.connect();
    log('   ✅ Connecté à MongoDB', colors.green);
    
    const db = client.db(DB_NAME);
    log(`   ✅ Base de données "${DB_NAME}" accessible`, colors.green);

    // 2. Vérifier la collection users
    log('\n2️⃣  Vérification de la collection users...', colors.cyan);
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    log(`   ✅ Collection "users" existe (${userCount} utilisateur(s))`, colors.green);

    // 3. Rechercher le compte démo
    log('\n3️⃣  Recherche du compte démo...', colors.cyan);
    const user = await usersCollection.findOne({ email: demoEmail });
    
    if (!user) {
      log(`   ❌ Compte non trouvé: ${demoEmail}`, colors.red);
      log(`\n💡 Solution: Exécutez "npm run create-demo"`, colors.yellow);
      return;
    }
    
    log(`   ✅ Compte trouvé: ${demoEmail}`, colors.green);

    // 4. Vérifier tous les champs requis
    log('\n4️⃣  Vérification des champs requis...', colors.cyan);
    const requiredFields = {
      email: user.email,
      password: user.password ? '✅ Présent' : '❌ Manquant',
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      digitalId: user.digitalId,
      isActive: user.isActive,
      permissions: user.permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    let hasErrors = false;
    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === '❌ Manquant') {
        log(`   ❌ ${field}: Manquant`, colors.red);
        hasErrors = true;
      } else {
        log(`   ✅ ${field}: ${typeof value === 'object' ? JSON.stringify(value) : value}`, colors.green);
      }
    }

    if (hasErrors) {
      log('\n❌ Des champs requis sont manquants!', colors.red);
      return;
    }

    // 5. Vérifier isActive
    log('\n5️⃣  Vérification du statut du compte...', colors.cyan);
    if (!user.isActive) {
      log('   ❌ Le compte est INACTIF', colors.red);
      log('   💡 Solution: Le compte doit être actif pour se connecter', colors.yellow);
      return;
    }
    log('   ✅ Le compte est ACTIF', colors.green);

    // 6. Vérifier le mot de passe
    log('\n6️⃣  Vérification du mot de passe...', colors.cyan);
    if (!user.password) {
      log('   ❌ Aucun mot de passe trouvé dans la base de données', colors.red);
      return;
    }

    log(`   📝 Mot de passe hashé: ${user.password.substring(0, 20)}...`, colors.blue);
    const isPasswordValid = await bcrypt.compare(demoPassword, user.password);
    
    if (!isPasswordValid) {
      log('   ❌ Le mot de passe ne correspond PAS', colors.red);
      log('   💡 Solution: Recréez le compte avec "npm run create-demo"', colors.yellow);
      return;
    }
    log('   ✅ Le mot de passe est CORRECT', colors.green);

    // 7. Test de simulation d'authentification NextAuth
    log('\n7️⃣  Simulation de l\'authentification NextAuth...', colors.cyan);
    
    // Simuler exactement ce que fait NextAuth
    const testCredentials = {
      email: demoEmail,
      password: demoPassword,
    };

    if (!testCredentials.email || !testCredentials.password) {
      log('   ❌ Credentials manquants', colors.red);
      return;
    }

    const testUser = await usersCollection.findOne({ email: testCredentials.email });
    if (!testUser) {
      log('   ❌ Utilisateur non trouvé lors de la simulation', colors.red);
      return;
    }

    if (!testUser.isActive) {
      log('   ❌ Compte inactif lors de la simulation', colors.red);
      return;
    }

    if (!testUser.password) {
      log('   ❌ Pas de mot de passe lors de la simulation', colors.red);
      return;
    }

    const testPasswordValid = await bcrypt.compare(testCredentials.password, testUser.password);
    if (!testPasswordValid) {
      log('   ❌ Mot de passe invalide lors de la simulation', colors.red);
      return;
    }

    log('   ✅ Simulation d\'authentification RÉUSSIE', colors.green);

    // 8. Résumé final
    log('\n═══════════════════════════════════════', colors.green);
    log('   ✅ DIAGNOSTIC COMPLET - TOUT EST OK', colors.green);
    log('═══════════════════════════════════════\n', colors.green);
    
    log('📋 Résumé du compte démo:', colors.blue);
    log(`   Email: ${demoEmail}`);
    log(`   Mot de passe: ${demoPassword}`);
    log(`   Rôle: ${user.role}`);
    log(`   Digital ID: ${user.digitalId}`);
    log(`   Actif: ${user.isActive ? 'Oui' : 'Non'}`);
    log(`   Permissions: ${user.permissions?.join(', ') || 'Aucune'}`);
    log(`   Créé le: ${user.createdAt}`);
    log(`   Modifié le: ${user.updatedAt}\n`);

    log('💡 Si l\'authentification échoue toujours:', colors.yellow);
    log('   1. Vérifiez que NEXTAUTH_SECRET est défini dans .env.local');
    log('   2. Vérifiez que NEXTAUTH_URL est défini dans .env.local');
    log('   3. Redémarrez le serveur Next.js (npm run dev)');
    log('   4. Videz le cache du navigateur');
    log('   5. Vérifiez la console du navigateur pour les erreurs\n');

  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, colors.red);
    log(`\n💡 Vérifications:`, colors.yellow);
    log(`   1. MongoDB est en cours d'exécution`);
    log(`   2. MONGODB_URI est correct dans .env.local`);
    log(`   3. La base de données "${DB_NAME}" existe`);
    log(`   4. Vous avez les permissions nécessaires\n`);
    console.error(error);
  } finally {
    await client.close();
  }
}

testDemoAuth();

