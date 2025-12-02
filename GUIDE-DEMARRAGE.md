# 🚀 Guide de Démarrage Rapide - UniGov

## ✅ Installation Complète en 5 Minutes

### Étape 1: Vérifier les Prérequis

```bash
# Vérifier Node.js (doit être version 18+)
node --version

# Vérifier npm
npm --version
```

### Étape 2: Installer MongoDB

#### Option A: MongoDB Local (Recommandé pour le développement)

**Windows:**
1. Téléchargez depuis https://www.mongodb.com/try/download/community
2. Installez avec les options par défaut
3. Démarrez le service:
   ```bash
   net start MongoDB
   ```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud Gratuit)

1. Créez un compte sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit (M0)
3. Configurez un utilisateur et autorisez votre IP
4. Copiez votre URI de connexion

### Étape 3: Installer les Dépendances

```bash
npm install --legacy-peer-deps
```

### Étape 4: Configurer l'Environnement

Le fichier `.env.local` a déjà été créé avec les valeurs par défaut.

**Si vous utilisez MongoDB Atlas**, modifiez le fichier `.env.local`:
```env
MONGODB_URI=mongodb+srv://votre-utilisateur:mot-de-passe@cluster.mongodb.net/unigov-university
```

### Étape 5: Créer un Compte Administrateur

```bash
npm run create-admin
```

Cela créera un compte admin avec:
- 📧 Email: `admin@unigov.dz`
- 🔑 Mot de passe: `admin123456`

### Étape 6: Lancer l'Application

```bash
npm run dev
```

L'application sera accessible sur: **http://localhost:3000** 🎉

---

## 🧪 Tester le Système

Pour vérifier que tout fonctionne:

```bash
npm run test-auth
```

Ce script va:
1. ✅ Créer un compte de test
2. ✅ Tester la connexion
3. ✅ Vérifier l'API
4. 📝 Vous donner les identifiants de test

---

## 🔐 Se Connecter

### Avec le compte Admin:

1. Ouvrez http://localhost:3000/auth/signin
2. Email: `admin@unigov.dz`
3. Mot de passe: `admin123456`

### Créer un nouveau compte:

1. Ouvrez http://localhost:3000/auth/register
2. Remplissez le formulaire
3. Choisissez votre rôle (Étudiant, Professeur, Personnel)
4. Cliquez sur "Créer mon compte"

---

## 🎓 Types de Comptes

### 👨‍🎓 Étudiant (student)
Accès à:
- Identité numérique
- Services étudiants
- Inscription aux cours
- Consultation des notes
- Bibliothèque et cafétéria

### 👨‍🏫 Professeur (professor)
Accès à:
- Tout ce que les étudiants ont +
- Gestion des cours
- Saisie des notes
- Gestion des présences

### 💼 Personnel (staff)
Accès à:
- Administration
- Gestion financière
- Gestion des partenariats
- Bibliothèque et cafétéria

### 👑 Administrateur (admin)
Accès complet à toutes les fonctionnalités

---

## 📱 Navigation de l'Application

Après connexion, vous aurez accès à:

### Page d'Accueil
- Présentation de la plateforme
- Statistiques générales

### Dashboard
- Vue d'ensemble personnalisée selon votre rôle
- Dernières annonces
- Actions rapides

### Modules Principaux

1. **Identité Numérique** (`/digital-id`)
   - Carte d'identité digitale avec QR Code
   - Gestion des permissions d'accès

2. **Services Étudiants** (`/student-services`)
   - Inscription aux cours
   - Consultation des notes
   - Téléchargement de documents
   - Prise de rendez-vous

3. **Analyses Académiques** (`/analytics`)
   - Tableaux de bord
   - Statistiques de performance
   - Analyses prédictives

4. **Gestion Financière** (`/finance`)
   - Paiements en ligne
   - Suivi des budgets
   - Rapports financiers

5. **Partenariats** (`/partnerships`)
   - Offres de stages
   - Projets collaboratifs
   - Opportunités d'emploi

6. **Communauté** (`/community`)
   - Publications et discussions
   - Annonces universitaires
   - Réseau social interne

---

## 🐛 Problèmes Courants

### Le serveur ne démarre pas

```bash
# Vérifiez que le port 3000 n'est pas utilisé
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -ti:3000
```

### Erreur de connexion à MongoDB

```bash
# Vérifiez que MongoDB est démarré
mongosh

# Devrait afficher: "Connected to MongoDB"
```

Si ça ne fonctionne pas:
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Erreur "Module not found"

```bash
# Nettoyez et réinstallez
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Page blanche après connexion

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs
3. Essayez de vider le cache (Ctrl+Shift+R)

---

## 🔄 Commandes Utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Créer un compte admin
npm run create-admin

# Tester l'authentification
npm run test-auth

# Vérifier les erreurs de code
npm run lint

# Compiler pour la production
npm run build

# Démarrer en mode production
npm start
```

---

## 📊 Accès à MongoDB

Pour voir vos données directement:

```bash
# Ouvrir le shell MongoDB
mongosh unigov-university

# Voir tous les utilisateurs
db.users.find().pretty()

# Compter les utilisateurs
db.users.countDocuments()

# Voir les cours
db.courses.find().pretty()
```

---

## 🎯 Prochaines Étapes

1. ✅ Connectez-vous avec le compte admin
2. ✅ Explorez les différents modules
3. ✅ Créez des comptes de test pour chaque rôle
4. ✅ Testez les fonctionnalités

---

## 💡 Conseils

- **Développement**: Utilisez le compte admin pour tester toutes les fonctionnalités
- **Production**: Changez TOUS les mots de passe par défaut
- **Sécurité**: Activez HTTPS en production
- **Performance**: Utilisez MongoDB Atlas pour une meilleure évolutivité

---

## 📞 Besoin d'Aide?

- 📖 Documentation complète: Consultez `README.md`
- 🔧 Scripts: Consultez `scripts/README.md`
- 📧 Support: support@unigov.dz

---

**UniGov** - Transformez votre université avec l'innovation digitale 🎓✨
