# 🚀 Guide de Lancement — Cabinet Dentaire Website

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- ✅ **Node.js** (v18 ou supérieur) - [Télécharger](https://nodejs.org/)
- ✅ **Git** - [Télécharger](https://git-scm.com/)
- ✅ Un compte **Supabase** (gratuit) - [S'inscrire](https://supabase.com/)

---

## 📋 Étape 1 : Configurer Supabase

### 1.1 Créer un nouveau projet Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquez sur **"New Project"**
3. Remplissez :
   - **Name** : `cabinet-dentaire` (ou votre choix)
   - **Database Password** : choisissez un mot de passe fort (notez-le !)
   - **Region** : choisissez le plus proche (ex: Frankfurt)
4. Cliquez sur **"Create new project"**
5. Attendez ~2 minutes que le projet soit créé

### 1.2 Récupérer les identifiants Supabase

Une fois le projet créé :

1. Dans la sidebar, allez dans **Settings** → **API**
2. Notez ces 3 valeurs (vous en aurez besoin) :

   ```
   Project URL        : https://xxxxx.supabase.co
   anon/public key    : eyJhbGc...
   service_role key   : eyJhbGc... (cliquez sur "Reveal" pour voir)
   ```

3. Dans **Settings** → **Database**, notez :
   - **Connection String** (pooler) → pour `DATABASE_URL`
   - **Connection String** (direct) → pour `DIRECT_URL`

   Format des URLs :
   ```
   Pooler: postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   Direct: postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.compute.internal:5432/postgres
   ```

---

## 📦 Étape 2 : Installation du Projet

### 2.1 Ouvrir le terminal dans le projet

```bash
cd "C:\Users\ASUS\Desktop\Dentaire website"
```

### 2.2 Installer les dépendances

```bash
npm install
```

⏱️ Cela prendra 1-2 minutes.

---

## 🔧 Étape 3 : Configuration de l'Environnement

### 3.1 Créer le fichier .env

```bash
cp .env.example .env
```

Ou créez manuellement un fichier `.env` à la racine du projet.

### 3.2 Remplir le fichier .env

Ouvrez le fichier `.env` et remplissez avec vos valeurs Supabase :

```env
# ─────────────────────────────────────────────
#  Base de données (Supabase Postgres)
# ─────────────────────────────────────────────
# URL poolée (pgBouncer) — utilisée par l'application
DATABASE_URL="postgresql://postgres.xxxxx:[VOTRE_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# URL directe — utilisée par les migrations Prisma
DIRECT_URL="postgresql://postgres.xxxxx:[VOTRE_PASSWORD]@aws-0-eu-central-1.compute.internal:5432/postgres"

# ─────────────────────────────────────────────
#  Supabase (Auth + Storage)
# ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# ─────────────────────────────────────────────
#  Divers
# ─────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Optionnel (pour sécuriser les cron jobs)
CRON_SECRET="votre-secret-aleatoire-ici"
```

**⚠️ Important** : Remplacez `[VOTRE_PASSWORD]` par le mot de passe de votre base de données Supabase !

---

## 🗄️ Étape 4 : Initialiser la Base de Données

### 4.1 Générer le client Prisma

```bash
npm run db:generate
```

### 4.2 Créer les tables dans Supabase

```bash
npm run db:push
```

✅ Vous devriez voir : `✔ Generated Prisma Client` et `✔ Database schema created`

### 4.3 (Optionnel) Ajouter des données de démonstration

```bash
npm run db:seed
```

Cela va créer :
- 6 motifs de consultation (Consultation générale, Détartrage, etc.)
- Quelques rendez-vous de test
- Un cabinet de démonstration

---

## 🔐 Étape 5 : Créer un Compte Admin

### Option A : Via Supabase Dashboard (Recommandé)

1. Allez dans votre projet Supabase
2. Dans la sidebar : **Authentication** → **Users**
3. Cliquez sur **"Add user"** → **"Create new user"**
4. Remplissez :
   - **Email** : votre email (ex: `admin@cabinet.dz`)
   - **Password** : choisissez un mot de passe
   - Cochez **"Auto Confirm User"**
5. Cliquez sur **"Create user"**

### Option B : Via l'Interface du Site (après lancement)

Vous pourrez vous inscrire via `/admin/login` après avoir lancé le projet.

---

## 🚀 Étape 6 : Lancer le Projet

### 6.1 Démarrer le serveur de développement

```bash
npm run dev
```

✅ Vous devriez voir :

```
▲ Next.js 15.5.25
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

### 6.2 Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur :

**🌐 Site Public** : [http://localhost:3000](http://localhost:3000)

**🔐 Espace Admin** : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🧪 Tester le Projet

### Pages à Tester :

#### Site Public
1. **Accueil** : `http://localhost:3000`
2. **Services** : `http://localhost:3000/services`
3. **Galerie** : `http://localhost:3000/galerie`
4. **À propos** : `http://localhost:3000/a-propos`
5. **FAQ** : `http://localhost:3000/faq`
6. **Contact** : `http://localhost:3000/contact`
7. **Réservation** : `http://localhost:3000/reservation`

#### Espace Admin (après connexion)
1. **Dashboard + Calendrier** : `http://localhost:3000/admin`
2. **Gestion Motifs** : `http://localhost:3000/admin/motifs`
3. **Statistiques** : `http://localhost:3000/admin/statistiques`

#### Multilingue
- **Français** : `http://localhost:3000` (par défaut)
- **Arabe** : `http://localhost:3000/ar`
- **Anglais** : `http://localhost:3000/en`

### Tester le Flux de Réservation

1. Allez sur la page d'accueil
2. Cliquez sur **"Prendre rendez-vous"**
3. Suivez les 4 étapes :
   - Choisir un motif
   - Sélectionner une date et un créneau
   - Remplir vos coordonnées
   - Confirmer (vous recevrez un lien d'annulation)

### Tester l'Admin

1. Connectez-vous sur `/admin/login` avec vos identifiants Supabase
2. Créez un rendez-vous manuel (patient qui a appelé)
3. Ajoutez un nouveau motif de consultation
4. Consultez les statistiques

---

## 🧪 Lancer les Tests

```bash
npm test
```

✅ 24 tests devraient passer (logique de réservation)

---

## 📱 Tester le Responsive

### Dans Chrome/Edge :
1. Ouvrez l'application (F12 ou Ctrl+Shift+I)
2. Cliquez sur l'icône mobile (Ctrl+Shift+M)
3. Testez différentes tailles :
   - **Mobile** : 375px (iPhone)
   - **Tablette** : 768px (iPad)
   - **Desktop** : 1920px

### Tester le Mode RTL Arabe :
1. Allez sur `http://localhost:3000/ar`
2. Vérifiez que tout s'inverse (navigation, textes, formulaires)

---

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev              # Lancer en dev mode (port 3000)

# Build
npm run build            # Build production
npm start                # Lancer le build production

# Base de données
npm run db:generate      # Générer Prisma client
npm run db:push          # Pusher le schema (dev)
npm run db:migrate       # Créer une migration (prod)
npm run db:seed          # Ajouter des données de test

# Tests
npm test                 # Lancer les tests
npm run test:watch       # Tests en mode watch

# Linting
npm run lint             # Vérifier le code
```

---

## ❌ Résolution des Problèmes Courants

### Erreur : "Cannot connect to database"

**Cause** : URL de connexion incorrecte ou base de données non accessible.

**Solution** :
1. Vérifiez que votre projet Supabase est bien actif
2. Vérifiez que les URLs dans `.env` sont correctes
3. Vérifiez que le password dans l'URL est correct (pas d'espaces)
4. Essayez de vous connecter à Supabase via leur dashboard

### Erreur : "Prisma Client not generated"

**Solution** :
```bash
npm run db:generate
```

### Erreur : "Module not found"

**Solution** :
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 déjà utilisé

**Solution** :
```bash
# Changer le port
PORT=3001 npm run dev
```

Ou tuer le processus sur le port 3000 :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erreur d'authentification Admin

**Solution** :
1. Vérifiez que l'utilisateur existe dans Supabase (Authentication → Users)
2. Vérifiez que les clés Supabase dans `.env` sont correctes
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

---

## 📚 Structure des URLs

```
Public (Site Vitrine)
├── /                          → Accueil
├── /services                  → Liste des services
├── /services/[slug]           → Détail d'un service
├── /galerie                   → Galerie avant/après
├── /a-propos                  → À propos
├── /faq                       → FAQ
├── /contact                   → Contact
└── /reservation               → Prise de rendez-vous

Admin (Espace Praticien)
├── /admin/login               → Connexion
├── /admin                     → Dashboard + Calendrier
├── /admin/motifs              → Gestion des motifs
├── /admin/statistiques        → Statistiques
└── /admin/parametres          → Paramètres (à venir)

Multilingue
├── /                          → Français (défaut)
├── /ar                        → Arabe
└── /en                        → Anglais
```

---

## 🎯 Checklist de Lancement

Avant de considérer le projet comme fonctionnel, vérifiez :

- [ ] ✅ `npm install` terminé sans erreur
- [ ] ✅ `.env` créé et rempli avec les bonnes valeurs
- [ ] ✅ `npm run db:push` a créé les tables
- [ ] ✅ Compte admin créé dans Supabase
- [ ] ✅ `npm run dev` démarre sans erreur
- [ ] ✅ Page d'accueil s'affiche sur http://localhost:3000
- [ ] ✅ Connexion admin fonctionne sur `/admin/login`
- [ ] ✅ Flux de réservation fonctionne (4 étapes)
- [ ] ✅ Calendrier admin affiche les rendez-vous
- [ ] ✅ Changement de langue fonctionne (FR/AR/EN)
- [ ] ✅ Mode RTL arabe s'inverse correctement
- [ ] ✅ Tests passent : `npm test`

---

## 🚀 Prochaines Étapes

Une fois le projet lancé localement, vous pouvez :

1. **Personnaliser le contenu** : modifier les services, ajouter de vraies photos
2. **Configurer les emails** : intégrer Resend ou SendGrid pour les confirmations
3. **Déployer sur Vercel** : [Guide de déploiement](./DEPLOYMENT.md)
4. **Configurer un domaine** : acheter et configurer votre nom de domaine
5. **Activer les rappels** : configurer les cron jobs sur Vercel

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans le terminal (erreurs détaillées)
2. Consultez la documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)
3. Vérifiez que toutes les variables d'environnement sont correctes
4. Assurez-vous que votre projet Supabase est actif

---

**✅ Voilà ! Votre Cabinet Dentaire website devrait maintenant tourner sur http://localhost:3000 !** 🎉
