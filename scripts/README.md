# Scripts UniGov

## 📜 Scripts Disponibles

### 1. Créer un Compte Admin

Crée un compte administrateur avec tous les privilèges :

```bash
node scripts/create-admin.js
```

**Identifiants par défaut:**
- Email: `admin@unigov.dz`
- Mot de passe: `admin123456`

⚠️ **Changez le mot de passe après la première connexion!**

---

### 2. Tester l'Authentification

Teste automatiquement le système d'inscription et de connexion :

```bash
node scripts/test-auth.js
```

Ce script :
- ✅ Crée un compte de test
- ✅ Teste la connexion
- ✅ Récupère les utilisateurs
- 📝 Affiche les identifiants de test

---

## 🔧 Prérequis

Avant d'exécuter les scripts :

1. **MongoDB doit être démarré**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   ```

2. **Le fichier `.env.local` doit être configuré**
   ```env
   MONGODB_URI=mongodb://localhost:27017/unigov-university
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=votre-cle-secrete
   ```

3. **Les dépendances doivent être installées**
   ```bash
   npm install --legacy-peer-deps
   ```

---

## 🚀 Workflow Recommandé

### Pour démarrer rapidement :

```bash
# 1. Démarrer MongoDB
net start MongoDB

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Créer un admin
node scripts/create-admin.js

# 4. Démarrer le serveur
npm run dev

# 5. (Optionnel) Tester l'authentification
node scripts/test-auth.js
```

### Connexion

Accédez à : http://localhost:3000/auth/signin

---

## 📊 Rôles Disponibles

| Rôle | Description | Permissions par Défaut |
|------|-------------|------------------------|
| **student** | Étudiant | library, cafeteria, courses, grades |
| **professor** | Professeur | library, cafeteria, courses, grades, course_management |
| **staff** | Personnel | library, cafeteria, administration |
| **admin** | Administrateur | all |

---

## 🐛 Dépannage

### Erreur: "Cannot connect to MongoDB"

```bash
# Vérifiez que MongoDB est démarré
mongosh

# Devrait afficher: "Connected to MongoDB"
```

### Erreur: "MONGODB_URI not found"

Assurez-vous que le fichier `.env.local` existe avec :
```env
MONGODB_URI=mongodb://localhost:27017/unigov-university
```

### Script ne trouve pas les modules

```bash
# Réinstallez les dépendances
rm -rf node_modules
npm install --legacy-peer-deps
```

---

## 💡 Conseils

- **En développement**: Utilisez les scripts pour créer rapidement des comptes de test
- **En production**: Changez TOUS les mots de passe par défaut
- **Sécurité**: Ne commitez jamais le fichier `.env.local` dans Git

---

**UniGov** - Plateforme Universitaire Intelligente 🎓
