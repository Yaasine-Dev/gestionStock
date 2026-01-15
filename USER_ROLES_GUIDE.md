# 📋 SYSTÈME DE GESTION DE STOCK - GUIDE DES RÔLES UTILISATEURS

## 🎯 Vue d'ensemble

Le système de gestion de stock comprend **3 rôles utilisateurs** avec des permissions différentes :

1. **👤 EMPLOYEE (Employé)** - Accès limité en lecture et opérations de base
2. **👔 MANAGER (Gestionnaire)** - Accès étendu avec gestion opérationnelle
3. **👑 ADMIN (Administrateur)** - Accès complet au système

---

## 👤 EMPLOYEE (Employé)

### ✅ Ce que l'employé PEUT faire :

#### 📊 **Dashboard**
- ✅ Accéder à son tableau de bord personnel (`/dashboard/employee`)
- ✅ Voir les statistiques de base :
  - Total des produits
  - Stock total
  - Produits en stock faible
  - Produits en rupture de stock
- ✅ Visualiser 3 graphiques :
  - Top 10 produits par stock (graphique à barres horizontal)
  - Répartition du stock (graphique circulaire)
  - Tendance du stock sur 7 jours (graphique linéaire)
- ✅ Voir la liste des produits récents avec leur statut

#### 📦 **Produits**
- ✅ Voir la liste complète des produits
- ✅ Rechercher des produits par nom, SKU ou catégorie
- ✅ Filtrer les produits par catégorie
- ✅ Voir les détails de chaque produit :
  - Nom, prix, quantité en stock
  - SKU, description
  - Catégorie et fournisseur
  - Image du produit
- ✅ Exporter la liste des produits

#### 🏷️ **Catégories**
- ✅ Voir la liste des catégories
- ✅ Voir le nombre de produits par catégorie
- ✅ Voir la quantité totale et la valeur du stock par catégorie
- ✅ Rechercher des catégories

#### 📦 **Stock**
- ✅ Accéder au tableau de bord stock
- ✅ Voir l'inventaire complet avec :
  - Produits et leurs niveaux de stock
  - Statuts (rupture, faible, normal, élevé)
  - Emplacements
- ✅ Rechercher dans l'inventaire
- ✅ Filtrer par statut de stock
- ✅ Voir les mouvements de stock (onglet Mouvements)
- ✅ Consulter les analyses et graphiques (onglet Analyses) :
  - Tendance du stock sur 7 jours
  - Stock par catégorie
  - Évolution de la valeur du stock sur 6 mois
- ✅ Ajuster les niveaux de stock (ajouter/retirer)

#### 👤 **Profil**
- ✅ Voir son profil personnel
- ✅ Modifier ses informations (nom, email)
- ✅ Changer son mot de passe
- ✅ Se déconnecter

### ❌ Ce que l'employé NE PEUT PAS faire :

- ❌ Créer, modifier ou supprimer des produits
- ❌ Créer, modifier ou supprimer des catégories
- ❌ Accéder aux fournisseurs
- ❌ Accéder aux commandes
- ❌ Gérer les utilisateurs
- ❌ Accéder aux dashboards Admin ou Manager
- ❌ Supprimer des mouvements de stock

---

## 👔 MANAGER (Gestionnaire)

### ✅ Ce que le manager PEUT faire :

**Tout ce que l'employé peut faire, PLUS :**

#### 📊 **Dashboard**
- ✅ Accéder au tableau de bord Manager (`/dashboard/manager`)
- ✅ Voir des statistiques avancées :
  - Stock total
  - Nombre de commandes
  - Commandes en attente
  - Commandes complétées
- ✅ Visualiser 3 graphiques :
  - Produits par catégorie (graphique à barres)
  - État des commandes (graphique circulaire)
  - Tendance du stock sur 7 jours (graphique linéaire)

#### 📦 **Produits**
- ✅ **Créer** de nouveaux produits
- ✅ **Modifier** les produits existants :
  - Nom, prix, quantité
  - SKU, description
  - Catégorie, fournisseur
  - Image
- ✅ Gérer l'inventaire complet

#### 🏷️ **Catégories**
- ✅ **Créer** de nouvelles catégories
- ✅ **Modifier** les catégories existantes
- ✅ Gérer toutes les catégories

#### 🏢 **Fournisseurs**
- ✅ **Accéder** à la liste des fournisseurs
- ✅ **Voir** les détails des fournisseurs :
  - Nom, téléphone, email
  - Nombre de produits fournis
- ✅ **Créer** de nouveaux fournisseurs
- ✅ **Modifier** les fournisseurs existants
- ✅ Rechercher et filtrer les fournisseurs

#### 🛒 **Commandes**
- ✅ **Accéder** au module de commandes
- ✅ **Voir** toutes les commandes :
  - Référence, fournisseur
  - Date, montant total
  - Statut (en attente, confirmée, livrée, annulée)
- ✅ **Créer** de nouvelles commandes
- ✅ **Modifier** les commandes existantes
- ✅ **Changer** le statut des commandes
- ✅ Rechercher et filtrer les commandes

#### 📦 **Stock**
- ✅ **Ajuster** les niveaux de stock
- ✅ **Modifier** les mouvements de stock
- ✅ Gérer les emplacements

#### 👥 **Utilisateurs**
- ✅ **Voir** la liste de tous les utilisateurs
- ✅ Consulter les profils des employés

### ❌ Ce que le manager NE PEUT PAS faire :

- ❌ **Supprimer** des produits
- ❌ **Supprimer** des catégories
- ❌ **Supprimer** des fournisseurs
- ❌ **Supprimer** des commandes
- ❌ **Créer** de nouveaux utilisateurs
- ❌ **Modifier** les rôles des utilisateurs
- ❌ **Supprimer** des utilisateurs
- ❌ Accéder au dashboard Admin
- ❌ Gérer les paramètres système

---

## 👑 ADMIN (Administrateur)

### ✅ Ce que l'admin PEUT faire :

**Tout ce que le manager peut faire, PLUS :**

#### 📊 **Dashboard**
- ✅ Accéder au tableau de bord Admin (`/dashboard/admin`)
- ✅ Voir toutes les statistiques système :
  - Total des produits
  - Total des utilisateurs
  - Stock total
  - Total des commandes
- ✅ Visualiser 3 graphiques :
  - Produits par catégorie (graphique à barres)
  - Commandes par statut (graphique circulaire)
  - Tendance du stock sur 7 jours (graphique linéaire)
- ✅ Voir les alertes de stock faible avec détails

#### 📦 **Produits**
- ✅ **SUPPRIMER** des produits
- ✅ Contrôle total sur l'inventaire

#### 🏷️ **Catégories**
- ✅ **SUPPRIMER** des catégories
- ✅ Gestion complète des catégories

#### 🏢 **Fournisseurs**
- ✅ **SUPPRIMER** des fournisseurs
- ✅ Gestion complète des fournisseurs

#### 🛒 **Commandes**
- ✅ **SUPPRIMER** des commandes
- ✅ Gestion complète des commandes

#### 👥 **Gestion des Utilisateurs**
- ✅ **Accéder** au module de gestion des utilisateurs
- ✅ **Voir** tous les utilisateurs du système
- ✅ **Créer** de nouveaux utilisateurs :
  - Définir nom, email, mot de passe
  - Assigner un rôle (ADMIN, MANAGER, EMPLOYEE)
- ✅ **Modifier** les utilisateurs existants :
  - Changer le nom, email
  - Modifier le rôle
  - Réinitialiser le mot de passe
- ✅ **SUPPRIMER** des utilisateurs
- ✅ Rechercher et filtrer les utilisateurs

#### 📦 **Stock**
- ✅ **Supprimer** des mouvements de stock
- ✅ Corriger les erreurs de stock
- ✅ Accès complet à l'historique

#### ⚙️ **Système**
- ✅ Accès à toutes les fonctionnalités
- ✅ Contrôle total du système
- ✅ Gestion des permissions

### ✅ Permissions exclusives ADMIN :

- ✅ Supprimer n'importe quelle donnée
- ✅ Gérer les utilisateurs et leurs rôles
- ✅ Accéder à tous les dashboards
- ✅ Corriger les incohérences de données
- ✅ Exporter toutes les données
- ✅ Configurer le système

---

## 📊 Tableau Récapitulatif des Permissions

| Fonctionnalité | Employee | Manager | Admin |
|----------------|----------|---------|-------|
| **Dashboard Personnel** | ✅ | ✅ | ✅ |
| **Voir Produits** | ✅ | ✅ | ✅ |
| **Créer Produits** | ❌ | ✅ | ✅ |
| **Modifier Produits** | ❌ | ✅ | ✅ |
| **Supprimer Produits** | ❌ | ❌ | ✅ |
| **Voir Catégories** | ✅ | ✅ | ✅ |
| **Gérer Catégories** | ❌ | ✅ | ✅ |
| **Supprimer Catégories** | ❌ | ❌ | ✅ |
| **Voir Fournisseurs** | ❌ | ✅ | ✅ |
| **Gérer Fournisseurs** | ❌ | ✅ | ✅ |
| **Supprimer Fournisseurs** | ❌ | ❌ | ✅ |
| **Voir Commandes** | ❌ | ✅ | ✅ |
| **Gérer Commandes** | ❌ | ✅ | ✅ |
| **Supprimer Commandes** | ❌ | ❌ | ✅ |
| **Voir Stock** | ✅ | ✅ | ✅ |
| **Ajuster Stock** | ✅ | ✅ | ✅ |
| **Supprimer Mouvements** | ❌ | ❌ | ✅ |
| **Voir Utilisateurs** | ❌ | ✅ (liste) | ✅ |
| **Gérer Utilisateurs** | ❌ | ❌ | ✅ |
| **Modifier Profil** | ✅ (soi) | ✅ (soi) | ✅ (tous) |
| **Changer Mot de Passe** | ✅ (soi) | ✅ (soi) | ✅ (tous) |

---

## 🔐 Sécurité et Contrôle d'Accès

### Frontend (Interface)
- Routes protégées par rôle
- Boutons conditionnels selon les permissions
- Redirection automatique si accès non autorisé

### Backend (API)
- Vérification des rôles sur chaque endpoint
- Header `x-user-id` pour identifier l'utilisateur
- Erreur 403 si accès interdit

---

## 🎨 Navigation par Rôle

### Menu EMPLOYEE
- 🏠 Dashboard Employee
- 📦 Produits (lecture seule)
- 🏷️ Catégories (lecture seule)
- 📊 Stock (lecture + ajustement)
- 👤 Profil

### Menu MANAGER
- 🏠 Dashboard Manager
- 📦 Produits (CRUD sans suppression)
- 🏷️ Catégories (CRUD sans suppression)
- 🏢 Fournisseurs (CRUD sans suppression)
- 🛒 Commandes (CRUD sans suppression)
- 📊 Stock (gestion complète)
- 👥 Utilisateurs (lecture seule)
- 👤 Profil

### Menu ADMIN
- 🏠 Dashboard Admin
- 📦 Produits (CRUD complet)
- 🏷️ Catégories (CRUD complet)
- 🏢 Fournisseurs (CRUD complet)
- 🛒 Commandes (CRUD complet)
- 📊 Stock (CRUD complet)
- 👥 Utilisateurs (CRUD complet)
- 👤 Profil

---

## 📝 Notes Importantes

1. **Tous les utilisateurs** peuvent modifier leur propre profil et changer leur mot de passe
2. **Seul l'ADMIN** peut créer de nouveaux utilisateurs
3. **Seul l'ADMIN** peut supprimer des données
4. **Les MANAGERS** ont un accès opérationnel complet mais ne peuvent pas supprimer
5. **Les EMPLOYEES** ont un accès en lecture avec possibilité d'ajuster le stock

---

## 🚀 Cas d'Usage Typiques

### Employé (Magasinier)
- Consulte le stock disponible
- Ajuste les quantités après réception/expédition
- Vérifie les produits en stock faible
- Consulte les informations produits

### Manager (Chef d'Équipe)
- Crée et modifie les produits
- Gère les commandes fournisseurs
- Supervise les niveaux de stock
- Ajoute de nouveaux fournisseurs
- Consulte les rapports et statistiques

### Admin (Directeur/IT)
- Gère tous les utilisateurs du système
- Corrige les erreurs de données
- Supprime les données obsolètes
- Configure le système
- Accède à toutes les fonctionnalités

---

**Version:** 1.0  
**Dernière mise à jour:** 2024
