# Sessio — Rebuild conversion et SEO

Cette archive est conçue pour être extraite **dans le dépôt local `sessio.fr` déjà positionné sur la branche `feat/rebuild-conversion-seo`**.

Elle ne contient pas le dossier `.git` et ne touche pas à `main`.

## Important avant extraction

Le ZIP ne contient volontairement pas les anciens fichiers détaillés du lecteur de blog :

- `blog/article.html`
- `blog/assets/`
- `blog/articles/`

Comme tu extrais l’archive **par-dessus ton clone existant**, ces fichiers restent présents. Ne supprime pas le dépôt avant de copier les fichiers.

## Installation locale

```powershell
cd C:\Users\thoma\Sessio\sessio.fr
git switch feat/rebuild-conversion-seo
git pull origin feat/rebuild-conversion-seo
```

Extrais ensuite le contenu du dossier `sessio-rebuild-conversion-seo` à la racine du dépôt en acceptant le remplacement des fichiers.

## Tester le site

```powershell
python -m http.server 8080
```

Ouvre ensuite :

```text
http://localhost:8080
```

## Contrôles rapides

- Accueil : `/`
- Téléchargement : `/telecharger/`
- Contact : `/contact/`
- Confidentialité : `/confidentialite/`
- Suppression du compte : `/suppression-compte/`
- Blog : `/blog/`

Teste aussi les deux liens officiels :

- App Store : https://apps.apple.com/fr/app/sessio-carnet-de-musculation/id6769478512
- Google Play : https://play.google.com/store/apps/details?id=com.tymike94.sessio

## Pousser sur la branche

```powershell
git status -sb
git add .
git commit -m "feat(site): rebuild conversion and SEO experience"
git push origin feat/rebuild-conversion-seo
```

## Ne pas fusionner immédiatement

Avant fusion dans `main` :

1. remplacer l’illustration fonctionnelle du hero par de vraies captures ;
2. vérifier l’hébergement et les redirections ;
3. relire les pages légales ;
4. tester les anciens articles du blog ;
5. lancer Lighthouse sur une URL de prévisualisation ;
6. vérifier le site sur iPhone et Android.

Voir :

- `docs/audit-rebuild.md`
- `docs/captures-a-produire.md`
- `docs/calendrier-editorial.md`
