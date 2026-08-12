# Budget Manager

Budget Manager est une application mobile Android de gestion de finances personnelles développée avec React Native et Expo. Elle permet de suivre ses dépenses quotidiennes, de structurer son budget par catégories, d'analyser ses habitudes financières via des statistiques et de recevoir des avertissements lorsque les limites budgétaires sont atteintes. 

> **Note :** Ce projet a été développé dans un cadre d'apprentissage personnel, dans le but d'acquérir de l'expérience pratique et d'explorer de nouvelles technologies mobiles.

---

## Fonctionnalités Principales

### 1. Gestion des Dépenses

* **Saisie des transactions :** Enregistrement rapide d'une dépense avec montant, date, catégorie associée et note descriptive.
* **Historique complet :** Consultation, recherche et filtrage de l'ensemble des dépenses passées.

### 2. Gestion des Catégories et Limites Budgétaires

* **Opérations CRUD :** Création, lecture, modification et suppression des catégories personnalisées.
* **Plafonds mensuels :** Définition d'un montant limite mensuel pour chaque catégorie afin d'anticiper les dépassements.

### 3. Statistiques et Analyses

* **Répartition visuelle :** Graphiques et indicateurs permettant de visualiser la répartition des dépenses par catégorie.
* **Suivi budgétaire :** Calcul en temps réel du pourcentage du budget consommé par rapport aux plafonds fixés.

### 4. Alertes et Notifications

* **Avertissements automatiques :** Envoi d'une notification lorsque le cumul des dépenses d'une catégorie atteint ou dépasse sa limite mensuelle.

---

## Prérequis et Compatibilité

### Pour les Utilisateurs

* **Système d'exploitation :** Android 8.0 (Oreo) ou version supérieure.
* **Stockage :** Minimum 50 Mo d'espace libre.
* **Base de données :** Stockage 100% local (SQLite), aucune connexion Internet requise pour le fonctionnement.

### Pour les Développeurs

* **Node.js :** Version 18.0.0 ou supérieure.
* **Gestionnaire de paquets :** npm ou yarn.
* **Framework :** Expo SDK 56.
* **Environnement de test :** Émulateur Android (Android Studio) ou appareil physique avec Expo Go / Development Build.

---

## Installation et Exécution en Développement

1. **Cloner le dépôt Git :**
```bash
git clone https://github.com/ItokianaIZ07/BudgetManager.git
cd BudgetManager

```


2. **Installer les dépendances :**
```bash
npm install

```


3. **Lancer le serveur de développement Expo :**
```bash
npx expo start

```


4. **Exécuter l'application :**
* Appuyez sur `a` dans le terminal pour lancer l'application sur un émulateur Android connecté.
* Scannez le code QR affiché avec l'application Expo Go sur un appareil Android physique.



---

## Architecture Technique

* **Framework Mobile :** React Native avec Expo Router (File-based Routing).
* **Base de Données :** SQLite via `expo-sqlite` (gestion de la persistance locale et requêtes optimisées).
* **Gestion d'État :** Zustand.
* **Thématisation & Composants :** React Native Paper / Tailwind CSS (NativeWind).
* **Notifications :** `expo-notifications`.

---

## Compilation de la Version Release (APK)

Pour générer un fichier d'installation APK localement sans passer par les serveurs cloud :

```bash
npx expo prebuild
cd android
./gradlew assembleRelease

```

Le fichier compilé se trouvera dans le dossier :
`android/app/build/outputs/apk/release/app-release.apk`
