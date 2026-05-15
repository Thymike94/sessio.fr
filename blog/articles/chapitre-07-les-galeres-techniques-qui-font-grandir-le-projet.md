# Chapitre 07 — Les galères techniques qui font grandir le projet

Il y a une image assez fausse de la création d’une app.

On imagine parfois une progression propre : idée, design, code, lancement.

En réalité, c’est beaucoup plus chaotique.

Tu avances, puis un truc casse. Tu corriges, puis un autre problème apparaît. Tu règles une configuration, puis tu découvres qu’elle ne marche pas dans un autre environnement.

Sessio n’a pas échappé à ça.

## Firebase : puissant, mais pas sans friction

Firebase m’a permis d’aller vite.

Authentification, Firestore, Storage, Functions, Hosting : c’est énorme pour un projet indépendant.

Mais chaque brique a ses règles.

Il faut configurer les domaines autorisés, les règles Firestore, les index, les fonctions, les secrets, les APIs Google Cloud, les versions Node, les déploiements.

Un message d’erreur peut parfois cacher trois sujets différents : une API pas activée, une permission manquante, une version obsolète, ou une configuration mal placée.

C’est frustrant, mais ça force à comprendre ce que tu utilises.

## Les domaines et la connexion

Un autre sujet a été la connexion entre les domaines.

Quand tu as sessio.fr, app.sessio.fr, l’hébergement Firebase, le web, les redirections, l’authentification Google, tu dois t’assurer que tout communique bien.

Un utilisateur ne doit pas avoir à comprendre l’infrastructure.

Il clique, il se connecte, ça marche.

Sauf que pour arriver à ce “ça marche”, il faut parfois régler des détails minuscules.

Et ces détails minuscules sont exactement ceux qui peuvent donner une impression non professionnelle si tu les rates.

## Les paiements et les environnements

Les paiements ont aussi leur lot de pièges.

Entre Google Play, Stripe, les modes test, les comptes de test, les produits, les webhooks, les redirections après checkout, il y a beaucoup de points de rupture.

Un paiement peut fonctionner techniquement, mais ne pas mettre à jour le bon statut.

Un checkout peut s’ouvrir, mais revenir au mauvais endroit.

Un compte peut être considéré comme test alors que tu pensais être en production.

Ce sont des galères très concrètes, parce qu’elles touchent directement la confiance.

Quand quelqu’un paye, tout doit être clair.

## iOS : une étape à part

iOS a été encore une autre étape.

Le build, les certificats, le compte développeur, App Store Connect, Transporter, l’IPA : tout ça te rappelle que publier une app Apple demande un vrai parcours.

Au moment où j’écris ces lignes, l’IPA de Sessio a pu être générée, mais il faut encore que tout soit propre côté App Store Connect et compte développeur pour aller au bout de l’envoi.

C’est typiquement le genre d’étape où tu as l’impression d’être presque arrivé, puis tu découvres qu’il manque encore une case administrative ou technique.

## Les bugs utilisateurs

Et puis il y a les bugs remontés par les utilisateurs.

C’est parfois vexant, mais c’est surtout précieux.

Un bug de chrono de récupération qui ne défile pas correctement quand l’utilisateur quitte l’app pendant la séance, par exemple, ce n’est pas un détail.

C’est une vraie situation d’usage.

Ça rappelle que l’app doit fonctionner dans la vie réelle, pas seulement dans un test idéal où tu restes sagement sur le même écran.

## Ce que ces galères changent

Chaque galère technique oblige à rendre le projet plus solide.

Tu comprends mieux ton architecture.

Tu ajoutes des diagnostics.

Tu fais plus attention aux plateformes.

Tu évites de casser ce qui marche.

Tu apprends à faire des patchs plus propres.

Tu documentes mieux.

Sur le moment, ce n’est pas agréable. Mais avec du recul, ce sont ces problèmes qui transforment une idée en vraie app.

Un produit solide, ce n’est pas un produit qui n’a jamais eu de bug.

C’est un produit dont les bugs sont trouvés, compris, corrigés, et qui devient meilleur à chaque fois.
