# Système de design — Site Cabinet Dentaire

> **Règle d'or :** ne jamais improviser un style. Réutiliser les tokens (couleurs,
> typo, espacements) et les composants définis ici. Cela garantit une cohérence
> parfaite entre des pages construites à des moments différents.
>
> Source de vérité technique : [`tailwind.config.ts`](./tailwind.config.ts) +
> [`src/app/globals.css`](./src/app/globals.css). Composants : `src/components/ui/`.

---

## 1. Philosophie visuelle

Un cabinet dentaire doit inspirer **confiance, propreté et sérénité**, tout en
restant **chaleureux et premium** (pas froid ni clinique-effrayant). Deux ambiances
partagent la même base de couleurs :

| Ambiance | Où | Ressenti | Traits |
|----------|-----|----------|--------|
| **Public** (vitrine) | pages patients | rassurant, chaleureux, premium | espaces généreux, grands titres, ombres douces, coins arrondis, une photo humaine |
| **Admin** (tableau de bord) | espace dentiste | clair, fonctionnel, dense | interface compacte, moins décorative, priorité à la lisibilité des données |

---

## 2. Couleurs

Toujours utiliser les classes Tailwind (`bg-primary-500`, `text-ink-700`…), jamais
de hex en dur dans le JSX.

### Marque — `primary` (bleu-sarcelle apaisant)
Confiance médicale, propreté. **CTA principaux, liens, éléments actifs.**

`50 #EFF9FB` · `100 #D7F0F4` · `200 #B2E1E9` · `300 #82CCD9` · `400 #4FB0C2` ·
**`500 #2E93A9` (marque)** · `600 #24788F` (survol) · `700 #206173` · `800 #1F4F5E` ·
`900 #1D4350` · `950 #0F2A33`

### Secondaire — `sand` (sable chaud)
Chaleur, surfaces douces, fonds de section, boutons secondaires.

`50 #FBF9F5` (fond public) · `100 #F5EFE4` · `200 #ECE0CC` … `900 #5D4634`

### Neutre — `ink` (gris bleuté)
Texte, bordures, icônes, fonds de l'admin.

`50 #F6F8F9` (fond admin) · `100 #ECF0F2` (bordures) · … · `600 #52616A` (texte secondaire) ·
`800 #2C353B` (texte courant) · `900 #1B2226` (titres)

### Accent — `accent` (or doux)
**Avec parcimonie** : étoiles d'avis, petits détails premium. Jamais pour un CTA.

### États sémantiques
Chacun a `-light` (fond), `DEFAULT` (icône/texte), `-dark` (texte sur fond clair).

- `success` — vert (confirmation de RDV)
- `warning` — ambre (alerte douce)
- `error` — rouge (annulation, erreur de formulaire)
- `info` — bleu (information neutre)

### Fonds de page
- Public : `bg-sand-50` (blanc chaud) — défini par défaut sur `<body>`.
- Admin : `bg-ink-50` (gris clair froid) — appliqué par le layout admin.
- Surfaces/cartes : `bg-white`.

---

## 3. Typographie

Polices chargées via `next/font` dans le layout racine (variables CSS) :

- **Corps** : `Inter` → `font-sans` (`var(--font-sans)`)
- **Titres** : `Poppins` → `font-display` (`var(--font-display)`)
- **Arabe** : `Cairo` → `font-arabic`, appliqué automatiquement sur `html[lang="ar"]`.

### Échelle des titres

| Niveau | Classe Tailwind | Usage |
|--------|-----------------|-------|
| Hero | `text-display-lg` | titre d'accroche page d'accueil |
| H1 | `text-display` | titre principal de page |
| H2 | `text-display-sm` | titre de section (via `<SectionHeading>`) |
| H3 | `text-xl` / `text-2xl font-semibold` | titre de carte |
| Corps | `text-base` / `text-lg` | paragraphes (`leading-relaxed`) |
| Petit | `text-sm` | légendes, aides de formulaire |

Poids : titres `600/700`, corps `400`, accent `500/600`. Les `h1–h4` reçoivent
`font-display` automatiquement (voir `globals.css`).

---

## 4. Mise en page, espacements, breakpoints

- **Conteneur** : `<Container>` (max‑largeur 1320px, marges responsives). Ne pas
  recréer de wrapper à la main.
- **Sections** : `<Section tone="…">` applique un rythme vertical
  (`py-16 → py-24`) et un fond (`default`/`muted`/`warm`/`primary`).
- **Échelle d'espacement** : échelle Tailwind par défaut (multiples de 4px).
  Gouttières usuelles : `gap-6` / `gap-8`. Espacement inter‑sections : géré par `<Section>`.

### Breakpoints (mobile‑first)
| Nom | Largeur | Cible |
|-----|---------|-------|
| _(base)_ | `< 768px` | **mobile** |
| `md` | `≥ 768px` | **tablette** |
| `lg` | `≥ 1024px` | **desktop** |
| `xl` | `≥ 1200px` | grand écran |

Écrire d'abord le style mobile, puis surcharger avec `md:`/`lg:`.

---

## 5. Rayons & ombres

- **Rayons** : boutons `rounded-full` · champs `rounded-2xl` · cartes `rounded-3xl`.
  Extra : `rounded-4xl` (2rem) pour les grands blocs.
- **Ombres** (douces, jamais dures) : `shadow-soft` (éléments) · `shadow-card`
  (cartes) · `shadow-lifted` (survol/modale) · `shadow-focus` (anneau de focus).

---

## 6. Composants réutilisables (`src/components/ui`)

Importer depuis `@/components/ui`.

### Bouton — `<Button variant size>`
Variantes : `primary` (CTA plein), `secondary` (sable), `outline`, `ghost` (texte
seul), `danger`. Tailles : `sm` / `md` / `lg`.
Pour styliser un `<Link>` comme un bouton : `className={buttonVariants({ variant })}`.

### Carte — `<Card>` + `<CardBody>` / `<CardTitle>` / `<CardDescription>`
`interactive` ajoute l'élévation au survol (cartes cliquables).

### Badge — `<Badge variant>`
Étiquette d'état : `neutral` / `primary` / `success` / `warning` / `error` / `info`.
Ex. statut de RDV : Confirmé → `success`, En attente → `warning`, Annulé → `error`.

### Champs — `<Input>` / `<Textarea>` / `<Label>`
Libellé + champ + message d'aide/erreur intégrés. Focus et état d'erreur cohérents.

### Structure — `<Container>` / `<Section>` / `<SectionHeading>`
Base de toute mise en page. `<SectionHeading eyebrow title description centered>`.

> La **navbar** publique et la **sidebar** admin sont spécifiées aux PROMPTS 3 et 11
> et s'appuient sur ces tokens.

---

## 7. Animations

Transitions courtes et douces (`duration-200/300`). Utilitaires prêts :
`animate-fade-in`, `animate-fade-in-up`, `animate-scale-in`.
Respect de `prefers-reduced-motion` (désactivées automatiquement).

---

## 8. RTL (arabe)

- `dir="rtl"` posé sur `<html>` par le layout → **toute** la mise en page s'inverse
  (utiliser les propriétés logiques : `ps-*`/`pe-*`, `ms-*`/`me-*`, `text-start`).
- Icônes directionnelles (flèches, chevrons) : ajouter la classe `.rtl-flip`.
- Police arabe et interligne gérés automatiquement (`globals.css`).

---

## 9. Accessibilité

- Contraste texte suffisant (`ink-700/800` sur fond clair).
- `:focus-visible` toujours visible (anneau `primary`).
- Cibles tactiles ≥ 44px (boutons `md`/`lg` : hauteur 44/52px).
- Tout texte passe par next-intl (aucun texte en dur).
