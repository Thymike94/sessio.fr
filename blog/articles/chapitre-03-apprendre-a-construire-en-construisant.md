# Chapitre 03 — Apprendre à construire en construisant

Je ne suis pas parti avec une équipe de développeurs, un CTO, un designer produit, un budget énorme et un planning parfait.

Sessio s’est construit beaucoup plus simplement que ça : en avançant, en testant, en cassant parfois, en corrigeant, et en essayant de comprendre pourquoi ça cassait.

C’est une partie du projet que je trouve importante à raconter, parce qu’on voit souvent le résultat final d’une app, mais beaucoup moins les heures passées à comprendre pourquoi un bouton ne fait rien, pourquoi un build échoue, ou pourquoi une fonctionnalité marche sur Android mais pas sur le web.

## Le choix technique

Sessio est parti sur Flutter avec Firebase derrière.

Flutter parce que l’objectif était d’avoir une app capable de vivre sur plusieurs plateformes : Android, iOS, web/PWA.

Firebase parce que ça permettait d’avoir rapidement l’essentiel : authentification, base de données, stockage, fonctions cloud, hébergement, notifications, et tout ce qui fait qu’une app moderne peut tourner sans devoir construire une infrastructure complète dès le départ.

Sur le papier, c’est propre.

Dans la vraie vie, chaque choix technique amène ses propres galères.

## Le moment où tu comprends que “multi-plateforme” ne veut pas dire “magique”

Une app peut être écrite avec Flutter et viser Android, iOS et le web. Mais ça ne veut pas dire que tout marche pareil partout.

Un exemple simple : la gestion des images.

Sur mobile, tu peux avoir tendance à manipuler des fichiers avec des chemins locaux. Sur le web, ce n’est pas la même logique. Il faut lire des bytes, envoyer des données autrement, gérer les métadonnées.

Ce genre de détail a l’air technique, mais en réalité, ça change beaucoup de choses. Une fonctionnalité qui semble simple — ajouter une image de profil, une couverture de programme, une image de post — peut devenir un vrai sujet si tu veux que ça marche proprement partout.

C’est là que tu apprends que “ça marche sur mon téléphone” n’est pas suffisant.

## Les refontes qui font peur

Il y a aussi eu des moments où il fallait toucher à des écrans importants.

Le dashboard, par exemple. L’écran d’accueil d’une app, ce n’est pas juste une page jolie. C’est l’endroit où l’utilisateur comprend ce qu’il peut faire, où il lance sa séance, où il voit sa progression, où il revient naturellement.

J’ai voulu le rendre plus propre, plus premium, plus clair. Mais à chaque refonte, il y a une peur : casser un comportement existant.

Même chose pour l’écran de séance.

C’est le cœur de Sessio. Le truc qu’il ne faut pas casser. Tu peux améliorer l’interface, rendre le haut plus propre, rendre la validation des séries plus fluide, ajouter une meilleure barre, mais tu ne peux pas te permettre de perdre la logique qui permet de suivre la séance.

C’est une leçon constante : **améliorer sans détruire.**

## Les bugs qui te rappellent que le réel décide

Il y a les bugs que tu vois toi-même.

Et il y a ceux qu’un utilisateur te remonte.

Quand quelqu’un teste ton app et te dit “là, ça ne marche pas”, ce n’est pas agréable, mais c’est précieux. Ça veut dire que ton projet n’est plus juste dans ta tête. Quelqu’un l’utilise assez pour voir les défauts.

Un bug peut être frustrant, mais il donne aussi une direction très concrète : voilà ce qu’il faut corriger pour que l’expérience devienne plus fiable.

C’est comme ça qu’un produit progresse. Pas seulement avec des grandes idées, mais avec des petits problèmes réglés les uns après les autres.

## Le vrai apprentissage

Ce que Sessio m’a appris, c’est que construire une app, ce n’est pas juste écrire du code.

C’est prendre des décisions.

C’est accepter de revenir en arrière.

C’est comprendre qu’un détail d’interface peut changer l’usage.

C’est gérer la technique, le produit, le design, le marketing, les stores, le site, les paiements, les bugs, les retours utilisateurs.

Et quand tu es seul ou presque, tout arrive dans la même journée.

Tu peux passer d’un problème Firebase à une phrase de page d’accueil, d’un bug iOS à une décision de pricing, d’une icône PWA à un écran de séance.

C’est fatigant, mais c’est aussi ce qui rend le projet concret.

Sessio avance parce que chaque problème réglé devient une brique de plus. Pas parce que tout était clair dès le départ.
