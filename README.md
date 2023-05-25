# Sujet de programmation fonctionnelle

La page du sujet :

https://www.labri.fr/perso/renault/working/teaching/projets/2022-23-S6-Js-Tower.php

La page sur thor :

https://thor.enseirb-matmeca.fr/ruby/projects/projetss6-tower/overview

# Liste des paquetages disponibles

* commander
* jest
* ts-jest
* @types/node
* @types/jest
* typescript
* eslint
* parcel
* @typescript-eslint/parser
* @typescript-eslint/eslint-plugin

Toute mise dans le dépôt de fichiers dans le répertoire `node_modules`
sera traité avec la sévérité la plus brute.

# README

Ce fichier contient des instructions pour compiler, tester et exécuter l'application.

## Commandes

- `make build` : Compile le code TypeScript en JavaScript
- `make run` : Exécute l'application en mode console
- `make test` : Lance les tests unitaires et génère un rapport de couverture
- `make eslint` : Analyse le code avec ESLint pour détecter les erreurs et les avertissements
- `make pdf` : Compile le rapport en format PDF et l'affiche avec Evince
- `make clean` : Supprime les fichiers temporaires

Pour exécuter l'application, utilisez la commande `make run`. Pour générer le rapport en format PDF, utilisez la commande `make pdf`. Pour lancer les tests, utilisez la commande `make test`. Pour compiler le code TypeScript en JavaScript, utilisez la commande `make build`. Pour nettoyer les fichiers temporaires, utilisez la commande `make clean`.
