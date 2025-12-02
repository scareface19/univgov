# 🔐 Configuration des Variables d'Environnement

## 📋 Génération Rapide

### Pour Production

```bash
# Générer automatiquement .env.production avec une clé secrète
npm run generate-env

# Ou créer manuellement
cp env.example .env.production
```

Puis éditez `.env.production` et configurez :
- `MONGODB_URI` : votre URI MongoDB
- `NEXTAUTH_URL` : votre URL de production
- `NEXTAUTH_SECRET` : sera généré automatiquement

### Pour Développement Local

```bash
# Créer .env.local avec les valeurs par défaut
npm run generate-env -- --local

# Ou créer manuellement
cp env.example .env.local
```

Puis modifiez `.env.local` si nécessaire.

## 📝 Variables Requises

### Obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/hidab-university` |
| `NEXTAUTH_URL` | URL de base de l'application | `https://votre-domaine.com` |
| `NEXTAUTH_SECRET` | Clé secrète pour JWT (min 32 chars) | Généré automatiquement |
| `NODE_ENV` | Environnement | `production` ou `development` |

## 🔑 Générer NEXTAUTH_SECRET

### Méthode 1: Script npm (Recommandé)
```bash
npm run generate-env
```

### Méthode 2: OpenSSL
```bash
openssl rand -base64 32
```

### Méthode 3: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📦 Fichiers

- **`env.example`** : Template avec toutes les variables (peut être commité)
- **`.env.local`** : Variables pour développement local (ignoré par Git)
- **`.env.production`** : Variables pour production (ignoré par Git)

## ⚠️ Sécurité

1. **Ne jamais commiter** les fichiers `.env*`
2. **Utiliser des secrets différents** pour chaque environnement
3. **Régénérer les secrets** en cas de compromission
4. **Utiliser HTTPS** en production
5. **Restreindre l'accès MongoDB** par IP

## 🚀 Déploiement

### Vercel
Ajoutez les variables dans: Settings → Environment Variables

### Docker
```bash
docker run -e MONGODB_URI=... -e NEXTAUTH_URL=... ...
```

### Serveur VPS
Copiez `.env.production` sur le serveur avec les valeurs de production.

## 📖 Documentation Complète

Voir `GUIDE-ENV-PRODUCTION.md` pour plus de détails.

