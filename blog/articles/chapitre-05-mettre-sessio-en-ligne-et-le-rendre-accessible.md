# Chapitre 05 — Mettre Sessio en ligne et le rendre accessible

Créer une app dans son coin, c’est déjà un gros morceau.

Mais il y a un moment où il faut sortir du mode “projet” et commencer à penser “accès réel”.

Comment les gens trouvent Sessio ?

Comment ils l’ouvrent ?

Comment ils l’installent ?

Est-ce que ça marche sur Android ? Sur iPhone ? Sur le web ?

C’est là que le projet devient plus concret, mais aussi plus complexe.

## Le rôle de sessio.fr

Le domaine sessio.fr est devenu une pièce importante du projet.

Ce n’est pas juste une adresse. C’est la porte d’entrée.

Le site doit expliquer rapidement ce qu’est Sessio : une app française de musculation, créée par un pratiquant pour les pratiquants, gratuite sur l’essentiel, sans pub, avec une logique de suivi simple.

Il doit aussi rassurer.

Quand quelqu’un tombe sur une app indépendante, il doit comprendre que ce n’est pas un truc abandonné ou bricolé à moitié. Il doit sentir qu’il y a une vraie intention derrière.

## Le web et la PWA

Je voulais que Sessio puisse exister aussi sur le web.

Pas seulement comme une vitrine, mais comme une vraie app utilisable depuis un navigateur, avec la possibilité de l’installer sur l’écran d’accueil, notamment sur iPhone.

C’est un choix important, parce que sur iOS, l’accès à l’App Store demande plus d’étapes, plus de validations, plus de contraintes. La PWA permet de rendre l’app disponible plus vite, sans attendre que tout le parcours Apple soit terminé.

Mais là aussi, ce n’est pas magique.

Il faut gérer les domaines, les redirections, les fichiers de configuration, les icônes, le manifest, le comportement mobile, les liens entre sessio.fr et app.sessio.fr.

Un détail mal réglé peut casser une connexion ou créer une expérience bizarre.

## Android, iOS, web : trois mondes à respecter

Android a ses propres règles.

Google Play a ses propres tests, ses histoires de comptes de test, de modes de paiement, de production, de validation.

Le web a ses propres contraintes : navigateur, stockage, responsive, compatibilité.

iOS a encore un autre niveau : certificats, compte développeur Apple, App Store Connect, build, IPA, Transporter.

Quand tu regardes ça de l’extérieur, tu peux croire qu’une app est “prête” quand le code fonctionne.

En réalité, le code qui fonctionne est seulement une partie du chemin.

Il faut ensuite que l’app puisse être distribuée correctement.

## Le moment où l’app devient réelle

Il y a une différence psychologique entre “j’ai un projet sur mon ordinateur” et “quelqu’un peut aller sur sessio.fr et tester”.

Le deuxième cas te met face au réel.

Ton message doit être clair.

Ton bouton doit marcher.

Ton onboarding doit être compréhensible.

Ton app doit charger.

Ton système d’authentification doit suivre.

Tes pages doivent donner envie.

Et si quelqu’un ouvre sur téléphone, tout doit rester propre.

C’est à ce moment-là que tu vois que le produit, ce n’est pas seulement l’app. C’est tout le chemin autour de l’app.

## Pourquoi le blog arrive maintenant

Ce blog fait partie de cette logique.

Je ne veux pas seulement avoir une page qui dit “voici Sessio”.

Je veux aussi raconter comment le projet se construit.

Parce qu’une app indépendante a une force que les grosses apps n’ont pas toujours : on peut voir la personne derrière.

On peut comprendre les choix.

On peut suivre l’évolution.

On peut voir les galères et les améliorations.

Pour moi, c’est cohérent avec Sessio : une app créée par un pratiquant, pas par une structure froide qui balance une landing page et disparaît.

Rendre Sessio accessible, ce n’est donc pas seulement mettre l’app en ligne. C’est aussi rendre le projet lisible.
