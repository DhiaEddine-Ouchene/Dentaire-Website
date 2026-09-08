# Configuration Google My Business - Avis

Ce guide explique comment configurer l'intégration Google My Business pour rediriger automatiquement les patients vers Google Reviews après l'approbation de leur avis.

## 🎯 Fonctionnalité

Lorsqu'un admin approuve un avis dans `/admin/avis`, le système :
1. ✅ Publie l'avis sur le site web
2. 📧 Envoie un email au patient (si email disponible)
3. 🔗 Inclut un lien direct vers Google Reviews

## 📋 Étapes de configuration

### 1. Obtenir votre Google Place ID

Votre **Google Place ID** identifie votre cabinet sur Google Maps/Business.

**Méthode 1 - Via Google Place ID Finder** (Recommandée)
1. Allez sur https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
2. Recherchez votre cabinet dentaire
3. Copiez le **Place ID** (format: `ChIJ...`)

**Méthode 2 - Via l'URL de votre fiche Google**
1. Ouvrez votre fiche Google Business
2. L'URL contient votre Place ID après `1s0x...`
3. Ou utilisez: https://placekey.io/ pour le trouver

### 2. Ajouter le Place ID dans les variables d'environnement

Ajoutez dans votre fichier `.env` (ou `.env.local`) :

```bash
# Google My Business Configuration
GOOGLE_PLACE_ID=ChIJxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Important** : Remplacez `ChIJxxxxxxxxxxxxxxxxxxxxxxxx` par votre véritable Place ID.

### 3. Configurer l'envoi d'emails (Optionnel mais recommandé)

Pour envoyer automatiquement des invitations par email, configurez un service d'emailing.

#### Option A : Resend (Recommandé - Simple et moderne)

1. Créez un compte sur https://resend.com
2. Obtenez votre API Key
3. Installez le package :
   ```bash
   npm install resend
   ```
4. Ajoutez dans `.env` :
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. Décommentez le code dans `src/app/[locale]/(admin)/admin/avis/actions.ts` :
   ```typescript
   // Cherchez la section marquée "TODO: Intégrer avec votre service d'email"
   // et décommentez le code Resend
   ```

#### Option B : SendGrid / Mailgun / Autre

Adaptez le code dans `actions.ts` selon votre service d'emailing préféré.

### 4. Tester l'intégration

1. Allez sur votre site en tant que visiteur
2. Soumettez un avis de test
3. Connectez-vous à l'admin `/admin/avis`
4. Approuvez l'avis
5. Vérifiez dans la console les logs :
   ```
   ✓ Invitation Google Review envoyée avec succès
   Google Review URL pour patient@email.com : https://...
   ```

### 5. Lien Google Review direct

Le lien généré a ce format :
```
https://search.google.com/local/writereview?placeid=VOTRE_PLACE_ID
```

Vous pouvez aussi l'utiliser manuellement pour diriger des patients vers Google Reviews.

## 📧 Template d'email

Voici le template d'email envoyé automatiquement (personnalisable dans `actions.ts`) :

```
Objet : Merci pour votre avis ! Partagez-le sur Google

Bonjour [Nom du patient],

Nous avons bien reçu votre avis et vous en remercions.

Si vous le souhaitez, vous pouvez également partager votre expérience 
sur Google pour aider d'autres patients :

[Bouton : Laisser un avis sur Google]

Merci de votre confiance !

L'équipe du Cabinet Dentaire
```

## 🔧 Personnalisation avancée

### Modifier le contenu de l'email

Éditez le fichier :
```
src/app/[locale]/(admin)/admin/avis/actions.ts
```

Cherchez la fonction `sendGoogleReviewInvitation()` et modifiez le HTML de l'email.

### Ajouter d'autres plateformes

Vous pouvez ajouter des liens vers d'autres plateformes d'avis :
- Facebook Reviews
- Doctolib
- PagesJaunes
- etc.

## ❓ FAQ

**Q : Les avis sont-ils automatiquement publiés sur Google ?**
R : Non. Le système envoie uniquement une invitation au patient. C'est lui qui décide de laisser un avis sur Google.

**Q : Puis-je forcer la publication sur Google ?**
R : Non, Google ne permet pas la publication automatique d'avis pour éviter les abus. Seul le patient peut laisser un avis directement sur Google.

**Q : Dois-je configurer l'email obligatoirement ?**
R : Non, mais c'est fortement recommandé pour maximiser les avis Google. Sans email, le lien sera juste loggé dans la console.

**Q : Comment voir les avis Google de mon cabinet ?**
R : Connectez-vous à votre Google Business Profile : https://business.google.com

## 🚀 Prochaines étapes

1. ✅ Configurez votre GOOGLE_PLACE_ID
2. ✅ Testez avec un avis de démonstration
3. ✅ Configurez l'envoi d'emails (optionnel)
4. ✅ Personnalisez le template d'email à votre marque
5. ✅ Encouragez vos patients satisfaits à laisser des avis !

## 📞 Support

Pour toute question sur la configuration, consultez :
- [Documentation Google Place ID](https://developers.google.com/maps/documentation/places/web-service/place-id)
- [Documentation Resend](https://resend.com/docs)
- Les commentaires dans le code source
