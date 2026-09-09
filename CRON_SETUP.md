# Configuration des rappels automatiques avec un service cron externe

Le plan gratuit de Vercel (Hobby) ne permet qu'un seul cron par jour. Pour envoyer des rappels toutes les 15 minutes (rappels 2h avant le RDV), nous utilisons un service cron externe gratuit comme **cron-job.org**.

## 📋 Prérequis

1. Un compte sur [cron-job.org](https://cron-job.org) (gratuit)
2. Votre site déployé sur Vercel (ou autre hébergeur)
3. Une variable d'environnement `CRON_SECRET` configurée

## 🔐 Étape 1 : Générer et configurer le secret

### Générer un secret sécurisé

```bash
# Avec OpenSSL (Linux/Mac)
openssl rand -base64 32

# Avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Résultat exemple : xK9mP2vL8nQ4wR7tY6uH3jF5gB1aD0cE9sZ4xW7vK2n=
```

### Ajouter à Vercel

1. Ouvrez votre projet sur [vercel.com](https://vercel.com)
2. Allez dans **Settings** → **Environment Variables**
3. Ajoutez une nouvelle variable :
   - **Name** : `CRON_SECRET`
   - **Value** : Le secret généré ci-dessus
   - **Environments** : Cochez `Production`, `Preview`, et `Development`
4. Cliquez sur **Save**
5. **Redéployez** votre application pour que la variable soit prise en compte

### Ajouter en local (développement)

Créez ou modifiez votre fichier `.env.local` :

```bash
CRON_SECRET=xK9mP2vL8nQ4wR7tY6uH3jF5gB1aD0cE9sZ4xW7vK2n=
```

## ⏰ Étape 2 : Configurer cron-job.org

### 2.1 Créer un compte

1. Allez sur [cron-job.org](https://cron-job.org)
2. Cliquez sur **Sign Up** et créez un compte gratuit
3. Confirmez votre email

### 2.2 Configurer le rappel 2h avant (toutes les 15 minutes)

1. Dans votre dashboard cron-job.org, cliquez sur **Create cronjob**
2. Remplissez le formulaire :

   **Title** : `Rappels 2h avant - Cabinet Dentaire`

   **Address (URL)** :
   ```
   https://votre-site.vercel.app/api/cron/reminder-2h
   ```

   **Schedule** : Sélectionnez **Every 15 minutes**
   - Ou configurez manuellement : `*/15 * * * *`

   **Request method** : `GET`

   **Custom request headers** : Cliquez sur **Add header**
   - **Name** : `x-cron-secret`
   - **Value** : Collez votre `CRON_SECRET` (le même que dans Vercel)

   **Enabled** : Cochez la case

3. Cliquez sur **Create cronjob**

### 2.3 Configurer le rappel 24h avant (une fois par jour)

1. Créez un nouveau cronjob
2. Remplissez le formulaire :

   **Title** : `Rappels 24h avant - Cabinet Dentaire`

   **Address (URL)** :
   ```
   https://votre-site.vercel.app/api/cron/reminder-24h
   ```

   **Schedule** : Sélectionnez **Once a day** à 9h00 (heure locale)
   - Ou configurez manuellement : `0 9 * * *`

   **Request method** : `GET`

   **Custom request headers** : Cliquez sur **Add header**
   - **Name** : `x-cron-secret`
   - **Value** : Collez votre `CRON_SECRET`

   **Enabled** : Cochez la case

3. Cliquez sur **Create cronjob**

## ✅ Étape 3 : Tester les routes

### Test manuel avec curl

```bash
# Testez la route 2h (remplacez YOUR_SECRET et YOUR_DOMAIN)
curl -X GET https://votre-site.vercel.app/api/cron/reminder-2h \
  -H "x-cron-secret: xK9mP2vL8nQ4wR7tY6uH3jF5gB1aD0cE9sZ4xW7vK2n="

# Réponse attendue (si tout fonctionne) :
# {"success":true,"count":0,"message":"2h reminders prepared for 0 appointments"}

# Test avec un secret incorrect (doit retourner 401)
curl -X GET https://votre-site.vercel.app/api/cron/reminder-2h \
  -H "x-cron-secret: wrong-secret"

# Réponse attendue :
# {"error":"Unauthorized"}
```

### Tester depuis cron-job.org

1. Allez dans votre dashboard cron-job.org
2. Trouvez votre cronjob dans la liste
3. Cliquez sur le bouton **▶ Execute now** (triangle de lecture)
4. Vérifiez les logs :
   - **Status code** : Doit être `200`
   - **Response** : Doit afficher `{"success":true,...}`

## 📊 Monitoring

### Logs Vercel

1. Ouvrez votre projet sur Vercel
2. Allez dans **Logs** ou **Deployments** → **Functions**
3. Filtrez par `/api/cron/reminder-`
4. Vous verrez les exécutions et leur sortie console

### Logs cron-job.org

1. Dans votre dashboard cron-job.org
2. Cliquez sur un cronjob
3. Allez dans l'onglet **History**
4. Vous verrez l'historique complet des exécutions

## 🔒 Sécurité

### ⚠️ Important

- **Ne commitez JAMAIS** le secret dans Git
- Gardez `CRON_SECRET` dans `.env.local` (en local) et dans les variables d'environnement Vercel (en production)
- Le secret doit avoir au moins 32 caractères
- Changez le secret immédiatement si vous pensez qu'il a été compromis

### Rotation du secret

Si vous devez changer le secret :

1. Générez un nouveau secret
2. Mettez à jour la variable dans Vercel
3. Redéployez l'application
4. Mettez à jour les headers dans cron-job.org pour les deux cronjobs
5. Testez que tout fonctionne

## 🆘 Dépannage

### Erreur 401 Unauthorized

- Vérifiez que le header `x-cron-secret` est bien configuré dans cron-job.org
- Vérifiez que `CRON_SECRET` est bien défini dans Vercel
- Assurez-vous que les deux valeurs correspondent exactement (pas d'espace avant/après)
- Redéployez après avoir ajouté/modifié la variable d'environnement

### Erreur 500 CRON_SECRET not configured

- La variable `CRON_SECRET` n'est pas définie dans Vercel
- Ajoutez-la dans les variables d'environnement
- Redéployez l'application

### Les rappels ne sont pas envoyés

1. Vérifiez que les cronjobs sont activés (**Enabled**) sur cron-job.org
2. Vérifiez l'historique des exécutions (status code 200 ?)
3. Consultez les logs Vercel pour voir si la route est appelée
4. Vérifiez que `RESEND_API_KEY` est configuré (pour les emails)
5. Vérifiez la logique d'envoi dans `/src/lib/email.ts`

### Test en local

```bash
# Démarrez le serveur local
npm run dev

# Dans un autre terminal, testez la route
curl -X GET http://localhost:3000/api/cron/reminder-2h \
  -H "x-cron-secret: votre_secret_local"
```

## 📝 Notes

- Le plan gratuit de cron-job.org permet jusqu'à 3 cronjobs avec une fréquence minimale de 1 minute
- Les rappels 2h sont envoyés toutes les 15 minutes pour couvrir tous les rendez-vous
- Les rappels 24h sont envoyés une fois par jour à 9h (heure que vous pouvez ajuster)
- Vous pouvez ajuster les horaires et fréquences selon vos besoins

## 🔄 Alternatives à cron-job.org

D'autres services gratuits similaires :

- **EasyCron** ([easycron.com](https://www.easycron.com)) - 1 cronjob gratuit
- **Uptime Robot** ([uptimerobot.com](https://uptimerobot.com)) - Monitoring + cron
- **GitHub Actions** - Workflows schedulés (nécessite un repo GitHub)

Tous fonctionnent avec le même système de header `x-cron-secret`.
