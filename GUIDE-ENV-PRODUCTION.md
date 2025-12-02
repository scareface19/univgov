# 🔐 Guide Configuration Environnement - Production

## 📋 Fichiers Environnement

Ce projet utilise plusieurs fichiers pour gérer les variables d'environnement :

- **`.env.example`** : Template avec toutes les variables nécessaires (peut être commité)
- **`.env.local`** : Variables pour le développement local (NE PAS commiter)
- **`.env.production`** : Variables pour la production (NE PAS commiter)

## 🚀 Configuration Rapide pour Production

### 1. Copier le template

```bash
# Copier le fichier exemple
cp .env.example .env.production
```

### 2. Configurer MongoDB

#### Option A: MongoDB Atlas (Recommandé)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster (M0 gratuit ou payant pour production)
3. Configurez un utilisateur avec mot de passe fort
4. Ajoutez votre IP dans "Network Access" (ou 0.0.0.0/0 temporairement)
5. Cliquez sur "Connect" → "Connect your application"
6. Copiez l'URI de connexion

**Format de l'URI :**
```
mongodb+srv://username:password@cluster.mongodb.net/hidab-university?retryWrites=true&w=majority
```

#### Option B: MongoDB Local

```env
MONGODB_URI=mongodb://localhost:27017/hidab-university
```

### 3. Configurer NextAuth

#### URL de l'application

```env
# Pour production
NEXTAUTH_URL=https://votre-domaine.com

# Pour staging
NEXTAUTH_URL=https://staging.votre-domaine.com
```

#### Générer NEXTAUTH_SECRET

**Méthode 1: OpenSSL**
```bash
openssl rand -base64 32
```

**Méthode 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Méthode 3: En ligne**
- Visitez: https://generate-secret.vercel.app/32
- Copiez la clé générée

Exemple de clé générée :
```
Xk9pL2mN4qR7sT8uV1wX3yZ5aB6cD8eF0gH2iJ4kL6mN8oP0
```

### 4. Exemple de fichier .env.production complet

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://admin:VotreMotDePasse123@cluster0.xxxxx.mongodb.net/hidab-university?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=https://unigov.university.dz
NEXTAUTH_SECRET=Xk9pL2mN4qR7sT8uV1wX3yZ5aB6cD8eF0gH2iJ4kL6mN8oP0

# Application Configuration
NODE_ENV=production
```

## 🔒 Sécurité en Production

### ✅ Bonnes Pratiques

1. **Ne jamais commiter les fichiers .env**
   - Vérifiez que `.env*` est dans `.gitignore`
   - Utilisez `.env.example` pour documenter les variables

2. **Utiliser des secrets forts**
   - `NEXTAUTH_SECRET` : minimum 32 caractères aléatoires
   - Mots de passe MongoDB : complexe avec majuscules, minuscules, chiffres, symboles

3. **Restreindre l'accès MongoDB**
   - En production, limitez les IP autorisées
   - Utilisez un utilisateur avec permissions minimales
   - Activez l'authentification SSL/TLS

4. **HTTPS obligatoire**
   - Utilisez toujours HTTPS en production
   - Configurez SSL/TLS avec Let's Encrypt (gratuit)

5. **Variables sensibles**
   - Stockez les secrets dans un gestionnaire de secrets (AWS Secrets Manager, Vercel Environment Variables, etc.)
   - Ne les exposez jamais dans le code ou les logs

## 🌐 Déploiement sur différentes plateformes

### Vercel

1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez chaque variable :
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NODE_ENV=production`
4. Déployez ou redéployez

### Netlify

1. Site settings → Build & deploy → Environment
2. Ajoutez les variables d'environnement
3. Redéployez

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NODE_ENV=production
    env_file:
      - .env.production
```

### Serveur VPS (Ubuntu/Debian)

1. Créez le fichier `.env.production` sur le serveur
2. Configurez avec les valeurs de production
3. Utilisez `pm2` ou `systemd` pour gérer le processus

```bash
# Exemple avec PM2
pm2 start npm --name "unigov" -- start
pm2 startup
pm2 save
```

## ✅ Checklist Production

- [ ] MongoDB configuré et accessible
- [ ] `NEXTAUTH_URL` pointe vers votre domaine de production
- [ ] `NEXTAUTH_SECRET` généré et unique
- [ ] `NODE_ENV=production` défini
- [ ] HTTPS activé sur le domaine
- [ ] Fichiers `.env*` dans `.gitignore`
- [ ] Backup MongoDB configuré
- [ ] Monitoring et logs configurés
- [ ] Tests effectués en environnement de staging

## 🔧 Dépannage

### Erreur: "Invalid/Missing environment variable: MONGODB_URI"
- Vérifiez que la variable est définie
- Vérifiez le format de l'URI MongoDB
- Testez la connexion MongoDB

### Erreur: "NextAuth Secret not found"
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Vérifiez qu'il fait au moins 32 caractères
- Régénérez si nécessaire

### Erreur de connexion MongoDB
- Vérifiez que l'IP est autorisée dans MongoDB Atlas
- Vérifiez les identifiants (username/password)
- Vérifiez que le cluster est actif

## 📞 Support

Pour plus d'aide, consultez :
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

