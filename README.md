# TaskManager-JSProject | Groupe 14 - BIN 2

Ce code utilise les modules express, jsonwebtoken et sequelize pour créer une application web qui gère des tâches, des utilisateurs et des projets.
Il utilise Express pour créer un serveur web et définir des routes pour manipuler les tâches, les utilisateurs et les projets.
Il utilise Sequelize pour définir les modèles de données pour les tâches, les utilisateurs et les projets, et pour les associer entre eux.
Il utilise jsonwebtoken pour vérifier les jetons JWT pour s'assurer que l'utilisateur est authentifié pour accéder aux routes protégées.

**Les principales fonctionnalités de projet incluent :**

- Connexion à une base de données en utilisant les informations de connexion dans la section database

- Définir les modèles de données pour les tâches, les utilisateurs et les projets en utilisant Sequelize.

- Définir les relations entre les modèles de données pour les tâches, les utilisateurs et les projets.

- Utilisation d'un middleware pour vérifier le jeton JWT dans chaque requête pour s'assurer que l'utilisateur est authentifié.

- Définir les routes pour créer, mettre à jour et récupérer les tâches, les utilisateurs et les projets.

- Les routes pour créer, mettre à jour et récupérer les tâches, les utilisateurs et les projets nécessitent une authentification pour être protégées.

- Validation des droits pour faire certaines opération (seul l'admin peut créer des tâches et des projets)

