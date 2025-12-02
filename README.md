# UniGov - Plateforme Universitaire Intelligente

Une plateforme complète et moderne pour la gestion intelligente des établissements universitaires, développée avec Next.js, Tailwind CSS, NextAuth, shadcn/ui et MongoDB.

## 🎯 Vue d'Ensemble

UniGov est une solution innovante qui digitalise et optimise la gestion universitaire à travers 7 modules principaux :

### 📋 Modules Principaux

#### 🧩 1. Identité Numérique (Digital ID)
- Carte d'identité digitale unifiée pour étudiants, professeurs et personnel
- Système d'authentification unique (SSO)
- Gestion des permissions d'accès aux services (bibliothèque, restaurant, résidence, transport)
- QR Code pour accès rapide

#### 🎓 2. Services Étudiants
- Inscription aux cours en ligne
- Consultation des notes et relevés
- Téléchargement de documents administratifs
- Prise de rendez-vous en ligne
- Chatbot d'assistance

#### 🧠 3. Analyse Académique
- Tableaux de bord analytiques en temps réel
- Analyse prédictive des performances
- Identification des étudiants à risque
- Recommandations d'accompagnement basées sur l'IA

#### 💰 4. Gestion Financière
- Suivi des revenus et dépenses
- Paiements en ligne
- Gestion des budgets par département
- Indicateurs de performance (KPIs)

#### 🤝 5. Partenariats & Innovation
- Plateforme de collaboration avec le secteur économique
- Offres de stages et d'emplois
- Projets de recherche collaboratifs
- Gestion des partenariats

#### 🏛️ 6. Tableau de Bord de Gouvernance
- Indicateurs en temps réel
- Rapports pour la direction
- Vue consolidée des performances
- Aide à la décision

#### 🌐 7. Communauté Universitaire
- Réseau social interne
- Publications et discussions
- Annonces et actualités
- Partage de connaissances

## 🚀 Technologies

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB (driver natif, sans Mongoose)
- **Language**: TypeScript
- **Icons**: Lucide React

## 📦 Installation

### Prérequis
- Node.js 18+ 
- MongoDB (local ou cloud)

### Étapes d'installation

1. Cloner le repository
```bash
git clone <repository-url>
cd Hidab
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hidab-university

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Application Configuration
NODE_ENV=development
```

4. Lancer le serveur de développement
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🗄️ Structure de la Base de Données

### Collections MongoDB

- **users**: Utilisateurs (étudiants, professeurs, personnel)
- **students**: Données spécifiques aux étudiants
- **professors**: Données spécifiques aux professeurs
- **staff**: Données spécifiques au personnel
- **courses**: Cours disponibles
- **enrollments**: Inscriptions aux cours
- **grades**: Notes et évaluations
- **payments**: Paiements et transactions
- **appointments**: Rendez-vous
- **announcements**: Annonces et communications
- **financial_records**: Enregistrements financiers
- **partnerships**: Partenariats
- **internships**: Stages et opportunités
- **community_posts**: Publications communautaires
- **analytics**: Données analytiques

## 🎨 Architecture

```
Hidab/
├── app/                          # Routes Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth routes
│   │   ├── users/                # Gestion utilisateurs
│   │   ├── courses/              # Gestion cours
│   │   ├── enrollments/          # Inscriptions
│   │   ├── payments/             # Paiements
│   │   ├── appointments/         # Rendez-vous
│   │   ├── announcements/        # Annonces
│   │   ├── partnerships/         # Partenariats
│   │   ├── internships/          # Stages
│   │   ├── community/            # Communauté
│   │   └── analytics/            # Analyses
│   ├── auth/                     # Pages d'authentification
│   ├── dashboard/                # Tableau de bord principal
│   ├── digital-id/               # Identité numérique
│   ├── student-services/         # Services étudiants
│   ├── analytics/                # Analyses académiques
│   ├── partnerships/             # Partenariats
│   ├── community/                # Communauté
│   └── page.tsx                  # Page d'accueil
├── components/                   # Composants React
│   ├── ui/                       # Composants shadcn/ui
│   └── dashboard-nav.tsx         # Navigation dashboard
├── lib/                          # Utilitaires et configurations
│   ├── mongodb.ts                # Configuration MongoDB
│   ├── auth.ts                   # Configuration NextAuth
│   ├── types.ts                  # Types TypeScript
│   └── utils.ts                  # Fonctions utilitaires
└── types/                        # Déclarations de types
```

## 🔐 Authentification

Le système utilise NextAuth.js avec :
- Authentification par credentials (email/password)
- Sessions JWT
- Gestion des rôles (student, professor, staff, admin)
- Permissions granulaires par service

### Rôles utilisateurs

- **Student** (étudiant): Accès aux services étudiants
- **Professor** (professeur): Gestion des cours et notes
- **Staff** (personnel): Gestion administrative
- **Admin** (administrateur): Accès complet

## 🌍 Internationalisation

L'application supporte :
- Français (FR)
- Arabe (AR)

Les interfaces affichent les informations dans les deux langues pour une meilleure accessibilité.

## 🔧 API Routes

### Authentification
- `POST /api/auth/signin` - Connexion
- `POST /api/auth/signout` - Déconnexion

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur

### Cours
- `GET /api/courses` - Liste des cours
- `POST /api/courses` - Créer un cours

### Inscriptions
- `GET /api/enrollments` - Liste des inscriptions
- `POST /api/enrollments` - S'inscrire à un cours

### Paiements
- `GET /api/payments` - Liste des paiements
- `POST /api/payments` - Créer un paiement

### Analyses
- `GET /api/analytics?type={academic|financial|engagement}` - Obtenir les analyses

## 🎯 Fonctionnalités Clés

### Pour les Étudiants
✅ Identité numérique avec QR Code
✅ Inscription en ligne aux cours
✅ Consultation des notes en temps réel
✅ Téléchargement de documents
✅ Prise de rendez-vous
✅ Accès aux opportunités de stages
✅ Participation à la communauté

### Pour les Professeurs
✅ Gestion des cours
✅ Saisie des notes
✅ Communication avec les étudiants
✅ Partage de ressources

### Pour l'Administration
✅ Vue d'ensemble complète
✅ Analyses et rapports
✅ Gestion financière
✅ Suivi des performances
✅ Gestion des partenariats

## 📊 Tableaux de Bord

- **Dashboard Principal**: Vue d'ensemble globale
- **Analytics**: Analyses détaillées et prédictives
- **Finance**: Suivi financier en temps réel
- **Partenariats**: Gestion des collaborations
- **Communauté**: Interactions sociales

## 🔜 Roadmap

- [ ] Notifications push en temps réel
- [ ] Application mobile (React Native)
- [ ] Intégration avec systèmes existants
- [ ] Module de visioconférence intégré
- [ ] Système de badges et gamification
- [ ] API publique pour intégrations tierces

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 👥 Support

Pour toute question ou assistance :
- Email: support@unigov.dz
- Documentation: [docs.unigov.dz](https://docs.unigov.dz)

---

**UniGov** - Transformez votre université avec l'innovation digitale 🎓✨
