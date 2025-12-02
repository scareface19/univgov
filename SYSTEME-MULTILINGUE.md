# 🌍 Système Multilingue UniGov

## ✨ Nouveau : Switcher de Langue Intégré

### 🎯 Fonctionnement

**Au lieu d'afficher FR + AR partout**, l'interface affiche maintenant **UNE SEULE langue à la fois** avec un **switcher élégant** pour basculer.

---

## 🔄 Le Switcher de Langue

### Localisation
Le switcher apparaît :
- ✅ **Page d'accueil** - En haut à droite dans le header
- ✅ **Navigation sidebar** - En haut sous le logo
- ✅ **Chatbot** - Dans l'interface du chatbot

### Design
```
┌─────────────────┐
│ 🌐 [FR] [عربي]  │
└─────────────────┘
```

- **Français actif** → Bouton bleu-violet
- **Arabe actif** → Bouton bleu-violet  
- **Non actif** → Gris clair

### Comportement
- **Clic** → Change la langue instantanément
- **Direction** → Automatique (LTR pour FR, RTL pour AR)
- **Police** → Cairo pour arabe, Inter pour français
- **Persistance** → Se souvient du choix pendant la session

---

## 🎨 Impact sur l'Interface

### Avant (Ancien Système)
```tsx
// Affichait les deux langues
<p>Services Étudiants</p>
<p dir="rtl">الخدمات الطلابية</p>
```

### Après (Nouveau Système)
```tsx
// Affiche UNE SEULE langue selon le choix
{t("Services Étudiants", "الخدمات الطلابية")}

// Résultat:
// FR sélectionné → "Services Étudiants"
// AR sélectionné → "الخدمات الطلابية"
```

---

## 💻 Utilisation pour les Développeurs

### 1. Hook useLanguage

```tsx
import { useLanguage } from "@/lib/language-context";

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t("Bonjour", "مرحبا")}</h1>
      <p>Langue actuelle: {language}</p>
    </div>
  );
}
```

### 2. Fonction t() - Traduction

```tsx
// Syntaxe
t(texte_français, texte_arabe)

// Exemples
t("Tableau de Bord", "لوحة القيادة")
t("Services Étudiants", "الخدمات الطلابية")
t("Messagerie", "المراسلة")
t("Budget", "الميزانية")
```

### 3. Direction Automatique

Le contexte applique automatiquement:
- `dir="ltr"` quand langue = FR
- `dir="rtl"` quand langue = AR
- `font-cairo` quand langue = AR

---

## 📱 Pages Mises à Jour

### ✅ Navigation (Sidebar)
- Switcher intégré en haut
- Tous les items de menu utilisent `t()`
- Une seule langue affichée
- Sections expand/collapse

### ✅ Page d'Accueil
- Switcher dans header
- Tous les textes traduisibles
- Titre, description, boutons
- Features avec `t()`

### ✅ Chatbot Widget
- Switcher intégré (FR/AR/EN)
- Messages traduits
- Interface adaptée

---

## 🎯 Avantages

### 1. Interface Plus Claire
- ❌ **Avant** : Texte doublé partout (encombrant)
- ✅ **Après** : Une seule langue (épuré)

### 2. UX Améliorée
- Switcher visible et accessible
- Changement instantané
- Pas de rechargement page
- Choix persistant

### 3. Flexibilité
- Facile d'ajouter d'autres langues
- Code plus maintenable
- Traductions centralisées

### 4. Performance
- Moins de texte rendu
- DOM plus léger
- Meilleur SEO

---

## 🔧 Architecture Technique

### Context Provider

```tsx
// lib/language-context.tsx
- Stocke la langue active
- Fournit la fonction t()
- Gère dir et font automatiquement
```

### Switcher Component

```tsx
// components/language-switcher.tsx
- Boutons FR / AR
- Style moderne avec dégradés
- Utilise le context
```

### Navigation

```tsx
// components/dashboard-nav-v2.tsx
- Importe useLanguage
- Utilise t() partout
- Sections en une seule langue
```

---

## 📊 Exemples d'Utilisation

### Menu Navigation

```tsx
// Section title
{t("Communication Participative", "التواصل التشاركي")}

// Menu items
{t("Messagerie", "المراسلة")}
{t("Forums & Débats", "المنتديات والنقاشات")}
{t("Boîte à Suggestions", "صندوق الاقتراحات")}
```

### Page Content

```tsx
// Titre de page
<h1>{t("Tableau de Bord", "لوحة القيادة")}</h1>

// Description
<p>{t(
  "Vue d'ensemble de votre plateforme",
  "نظرة عامة على منصتك"
)}</p>

// Boutons
<Button>{t("Enregistrer", "حفظ")}</Button>
```

### Badges et Labels

```tsx
<Badge>{t("Actif", "نشط")}</Badge>
<Badge>{t("En cours", "قيد التنفيذ")}</Badge>
<Badge>{t("Validé", "تم التحقق")}</Badge>
```

---

## 🌐 Langues Supportées

### Actuellement
- ✅ **Français** (FR)
- ✅ **العربية** (AR)

### Facile d'Ajouter
- 🔜 **English** (EN)
- 🔜 **Español** (ES)
- 🔜 Autres...

### Comment Ajouter une Langue

```tsx
// 1. Modifier le type Language
type Language = 'fr' | 'ar' | 'en';

// 2. Ajouter au switcher
<button onClick={() => setLanguage('en')}>EN</button>

// 3. Utiliser t() avec 3 paramètres
t("Bonjour", "مرحبا", "Hello")
```

---

## 🎨 Design du Switcher

### Apparence
```
┌──────────────────────┐
│ 🌐  [FR]  [عربي]    │
└──────────────────────┘
```

### États
- **Actif** : Fond dégradé bleu-violet + texte blanc
- **Inactif** : Fond gris + texte gris
- **Hover** : Fond gris foncé

### Responsive
- Desktop : Texte complet
- Mobile : Codes courts (FR/AR)

---

## ✅ Pages avec Switcher

1. ✅ Page d'accueil (`/`)
2. ✅ Navigation sidebar (toutes les pages du dashboard)
3. ✅ Chatbot widget

---

## 📝 Guide Rapide

### Pour Changer de Langue

**Option 1 : Via le Switcher**
- Cliquez sur FR ou عربي
- Changement instantané

**Option 2 : Via le Code**
```tsx
const { setLanguage } = useLanguage();
setLanguage('ar'); // Passer en arabe
setLanguage('fr'); // Passer en français
```

### Pour Traduire du Texte

```tsx
const { t } = useLanguage();

// Simple
{t("Bonjour", "مرحبا")}

// Dans JSX
<h1>{t("Titre", "عنوان")}</h1>

// Dans props
placeholder={t("Rechercher...", "بحث...")}
```

---

## 🚀 Résultat Final

**Interface Épurée :**
- Une seule langue affichée
- Switcher discret et accessible
- Changement fluide
- Direction auto (RTL/LTR)
- Police auto (Cairo pour AR)

**Navigation Claire :**
```
Avant:
├─ Communication Participative
   └─ التواصل التشاركي

Après (FR):
├─ Communication Participative

Après (AR):
├─ التواصل التشاركي
```

---

## 🎉 Avantages

✅ **Interface plus propre**
✅ **Meilleure lisibilité**
✅ **UX moderne**
✅ **Facile à étendre**
✅ **Code maintenable**
✅ **Performance optimale**

---

**UniGov** - Interface Multilingue Moderne et Élégante 🌍✨
