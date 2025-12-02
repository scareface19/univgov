# Guide d'Installation - UniGov

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure ([Télécharger](https://nodejs.org/))
- **MongoDB** (local ou compte MongoDB Atlas)

## 🚀 Installation Rapide

### 1. Installation des dépendances

```bash
npm install --legacy-peer-deps
```

### 2. Configuration MongoDB

#### Option A : MongoDB Local

1. **Installer MongoDB** sur votre machine
   - Windows : [Télécharger MongoDB](https://www.mongodb.com/try/download/community)
   - Mac : `brew install mongodb-community`
   - Linux : Suivez la [documentation officielle](https://docs.mongodb.com/manual/installation/)

2. **Démarrer MongoDB**
   ```bash
   # Windows (en tant qu'administrateur)
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   # ou
   sudo systemctl start mongod
   ```

3. **Vérifier que MongoDB fonctionne**
   ```bash
   # Ouvrir le shell MongoDB
   mongosh
   
   # Vous devriez voir : "Connected to MongoDB"
   ```

#### Option B : MongoDB Atlas (Cloud - Gratuit)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un cluster gratuit (M0)
3. Configurez un utilisateur de base de données
4. Autorisez votre adresse IP (ou 0.0.0.0/0 pour le développement)
5. Copiez votre URI de connexion

### 3. Configuration de l'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/unigov-university

# Pour MongoDB Atlas, utilisez :
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unigov-university?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-cle-secrete-au-moins-32-caracteres-aleatoires

# Application Configuration
NODE_ENV=development
```

**Important** : Pour générer une clé secrète sécurisée, utilisez :
```bash
# Générer une clé aléatoire
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Lancement de l'Application

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

## 🔧 Résolution des Problèmes

### Erreur : "Cannot connect to MongoDB"

**Solution 1** : Vérifiez que MongoDB est démarré
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb-community
```

**Solution 2** : Vérifiez votre URI dans `.env.local`
- Pour MongoDB local : `mongodb://localhost:27017/unigov-university`
- Pour MongoDB Atlas : Vérifiez que votre IP est autorisée

### Erreur : "Module not found"

```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules
npm install --legacy-peer-deps
```

### Erreur : Port 3000 déjà utilisé

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Erreur React Hooks

Si vous voyez des erreurs liées aux hooks React :
```bash
# Vérifiez les versions
npm list react react-dom

# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📊 Initialisation de la Base de Données

Au premier lancement, la base de données sera créée automatiquement.

Pour créer un utilisateur admin initial :

```bash
# Ouvrir MongoDB Shell
mongosh unigov-university

# Créer un admin
db.users.insertOne({
  email: "admin@unigov.dz",
  password: "$2a$10$YourHashedPasswordHere", // Utilisez bcrypt pour hasher
  firstName: "Admin",
  lastName: "UniGov",
  role: "admin",
  digitalId: "DID-ADMIN-001",
  createdAt: new Date(),
  updatedAt: new Date(),
  permissions: ["all"],
  isActive: true
})
```

## 🌐 Accès à l'Application

Une fois lancée, vous pouvez accéder à :

- **Page d'accueil** : http://localhost:3000
- **Connexion** : http://localhost:3000/auth/signin
- **Inscription** : http://localhost:3000/auth/register
- **Dashboard** : http://localhost:3000/dashboard (après connexion)

## 📱 Structure des Comptes

Trois types de comptes disponibles :

1. **Étudiant** (`student`)
   - Accès aux services étudiants
   - Inscription aux cours
   - Consultation des notes

2. **Professeur** (`professor`)
   - Gestion des cours
   - Saisie des notes
   - Communication avec les étudiants

3. **Personnel/Admin** (`staff`/`admin`)
   - Accès complet à toutes les fonctionnalités
   - Gestion des utilisateurs
   - Analyses et rapports

## 🔐 Sécurité

Pour la production :

1. **Changez NEXTAUTH_SECRET** avec une valeur sécurisée
2. **Utilisez MongoDB Atlas** avec authentification
3. **Configurez HTTPS**
4. **Limitez les adresses IP autorisées**
5. **Activez les logs de sécurité**

## 📞 Support

En cas de problème :

1. Vérifiez les logs dans le terminal
2. Consultez le fichier `README.md`
3. Contactez : support@unigov.dz

---

**UniGov** - Plateforme Universitaire Intelligente 🎓
