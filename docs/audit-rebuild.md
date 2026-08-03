# Audit initial — Rebuild conversion et SEO

## Décision d’architecture

Cette livraison utilise du HTML/CSS/JavaScript statique sans étape de compilation.

Raison :

- le dépôt actuel sert directement des fichiers statiques ;
- les pages App Store Connect (`/contact/` et `/confidentialite/`) ne doivent pas subir d’interruption ;
- l’utilisateur veut pouvoir extraire le ZIP dans sa branche et pousser immédiatement ;
- aucune configuration d’hébergement n’a encore été identifiée pour garantir le déploiement d’un build Astro.

Une migration Astro reste possible dans un second lot après identification formelle de l’hébergeur et de sa commande de build.

## Points corrigés

- proposition de valeur plus précise ;
- boutons iPhone et Android officiels ;
- détection simple de plateforme ;
- parcours avant / pendant / après ;
- pages produit et SEO ;
- contenus essentiels présents dans le HTML ;
- canonical, Open Graph, sitemap, robots ;
- navigation et focus accessibles ;
- sticky CTA mobile fermable ;
- analytics configurable et désactivé par défaut ;
- séparation guides / journal de bord ;
- page suppression de compte ;
- absence de faux avis ou chiffres inventés.

## Limites connues

- les vraies captures produit ne sont pas disponibles dans cette livraison ;
- le blog conserve temporairement son lecteur historique à query string ;
- les prix Pro ne sont pas dupliqués sur le site ;
- les pages légales doivent être relues juridiquement ;
- Lighthouse doit être exécuté après déploiement sur l’hébergement réel.
