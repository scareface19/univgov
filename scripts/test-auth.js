/**
 * Script de test pour l'authentification UniGov
 * Usage: node scripts/test-auth.js
 */

const API_URL = 'http://localhost:3000';

// Couleurs pour le terminal
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

// Test de création de compte
async function testRegister() {
  log('\n🔧 Test 1: Création de compte...', colors.blue);
  
  const testUser = {
    firstName: 'Ahmed',
    lastName: 'Benali',
    email: `test.${Date.now()}@unigov.dz`,
    password: 'test123456',
    role: 'student',
  };

  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (response.ok) {
      log('✅ Compte créé avec succès!', colors.green);
      log(`   Email: ${testUser.email}`);
      log(`   Digital ID: ${data.digitalId}`);
      return { ...testUser, id: data.id, digitalId: data.digitalId };
    } else {
      log(`❌ Erreur: ${data.error}`, colors.red);
      return null;
    }
  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, colors.red);
    return null;
  }
}

// Test de connexion
async function testLogin(email, password) {
  log('\n🔐 Test 2: Connexion...', colors.blue);

  try {
    const response = await fetch(`${API_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        redirect: false,
      }),
    });

    if (response.ok) {
      log('✅ Connexion réussie!', colors.green);
      return true;
    } else {
      log('❌ Échec de connexion', colors.red);
      return false;
    }
  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, colors.red);
    return false;
  }
}

// Test de récupération des utilisateurs
async function testGetUsers() {
  log('\n👥 Test 3: Récupération des utilisateurs...', colors.blue);

  try {
    const response = await fetch(`${API_URL}/api/users`);
    const users = await response.json();

    if (response.ok) {
      log(`✅ ${users.length} utilisateur(s) trouvé(s)`, colors.green);
      return true;
    } else {
      log('❌ Erreur lors de la récupération', colors.red);
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, colors.red);
    return false;
  }
}

// Exécution des tests
async function runTests() {
  log('═══════════════════════════════════════', colors.blue);
  log('   🧪 Tests d\'Authentification UniGov', colors.blue);
  log('═══════════════════════════════════════', colors.blue);

  // Test 1: Création de compte
  const user = await testRegister();
  
  if (!user) {
    log('\n⚠️  Les tests ont échoué. Vérifiez que:', colors.yellow);
    log('   1. Le serveur Next.js est démarré (npm run dev)');
    log('   2. MongoDB est en cours d\'exécution');
    log('   3. Le fichier .env.local est configuré');
    return;
  }

  // Attendre un peu avant le test de connexion
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 2: Connexion
  await testLogin(user.email, user.password);

  // Test 3: Récupération des utilisateurs
  await testGetUsers();

  log('\n═══════════════════════════════════════', colors.blue);
  log('   ✅ Tous les tests sont terminés!', colors.green);
  log('═══════════════════════════════════════', colors.blue);
  
  log('\n📝 Informations de test:', colors.blue);
  log(`   Email: ${user.email}`);
  log(`   Password: ${user.password}`);
  log('\n💡 Utilisez ces identifiants pour vous connecter sur:');
  log(`   ${API_URL}/auth/signin`);
}

// Vérifier que le serveur est accessible
async function checkServer() {
  try {
    const response = await fetch(API_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Point d'entrée
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('❌ Le serveur n\'est pas accessible!', colors.red);
    log('   Assurez-vous que le serveur Next.js est démarré:', colors.yellow);
    log('   npm run dev\n');
    process.exit(1);
  }

  await runTests();
})();
