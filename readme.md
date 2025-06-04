# GeniArtHub – Présentation du projet

GeniArtHub est un site web de vente d’œuvres d’art. Il permet aux utilisateurs de découvrir, choisir, et commander des œuvres au format numérique ou physique, via une interface simple et interactive.

---

## Fonctionnalités principales

1. **Afficher toutes les œuvres**  
   La page d’accueil affiche dynamiquement toutes les œuvres disponibles, récupérées depuis un serveur backend Node.js.

2. **Détail d’une œuvre**  
   En cliquant sur une œuvre, on voit son titre, description, prix, formats disponibles et on peut choisir la quantité à commander.

3. **Gestion du panier**  
   Ajouter, modifier ou supprimer des œuvres dans le panier sans recharger la page. Le panier affiche image, titre, format, quantité, prix unitaire et total.

4. **Passer commande**  
   Formulaire de commande avec validation des champs (nom, prénom, adresse, ville, email). Validation en temps réel sans rechargement.

5. **Confirmation de commande**  
   Affichage du numéro de commande envoyé par le serveur, puis réinitialisation du panier et du formulaire.

---

## Architecture technique

- **Backend Node.js / Express**  
  Fournit les données des œuvres via une API REST et gère la réception des commandes.

- **Stockage local (`localStorage`)**  
  Le panier est sauvegardé localement, sans stocker les prix pour des raisons de sécurité.

- **Interactivité sans rechargement**  
  Les modifications du panier et du formulaire utilisent JavaScript pour une expérience fluide.

---

## Pages du site

- **Accueil** : liste des œuvres  
- **Détail œuvre** : infos détaillées + choix format et quantité  
- **Panier** : liste des articles + formulaire de commande  
- **Confirmation** : affichage du numéro de commande

---

## API exposée

| Méthode | Endpoint                      | Description                        |
|---------|-------------------------------|----------------------------------|
| GET     | /api/products/                | Liste de toutes les œuvres       |
| GET     | /api/products/{product-id}   | Détail d’une œuvre spécifique    |
| POST    | /api/products/order           | Validation d’une commande         |

---

## Lancement du serveur backend

1. Aller dans le dossier `back`  
2. Exécuter `npm install` (première fois uniquement)  
3. Lancer le serveur avec la commande `node server`  

---

## Remarques importantes

- La quantité maximale par produit est limitée à 100.  
- Les formats des œuvres sont identifiés par leur taille (pas d’ID distincts).  
- Le panier est stocké sous forme de tableau dans le `localStorage` sans duplication des produits.  
- Validation stricte des données du formulaire avant envoi.  

