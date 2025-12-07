# Jan-Ken-Pon

Ce projet propose une implémentation interactive du jeu Pierre–Feuille–Ciseaux utilisant React, TypeScript et Vite.
L’application inclut trois modes de jeu, une interface animée et une gestion simple des effets sonores.

## Fonctionnalités
- Trois modes : Joueur vs Joueur, Joueur vs Ordinateur, Ordinateur vs Ordinateur
- Personnalisation des noms de joueurs
- Animation de révélation synchronisée
- Score automatique (victoire à 5 points)
- Effets sonores (clic, révélation, victoire)
- Interface responsive

## Installation et exécution

# Vérification de la version Node.js (recommandé : 18+)
```
node -v
```

# Clonage du dépôt
```
git clone https://github.com/zakaroff-aviiator/rps-react.git
```

# Accès au répertoire du projet
```
cd rps-react
```

# Installation des dépendances
```
npm install
```

# Lancement en mode développement
```
npm run dev
```

# Construction du build de production (optionnel)
```
npm run build
```

# Prévisualisation du build (optionnel)
```
npm run preview
```

# Création du dossier des sons (si nécessaire)
```
mkdir -p public/sounds
```

# Les fichiers suivants doivent être ajoutés dans public/sounds :
```
   click.mp3
   reveal.mp3
   win.mp3
```

# En cas d’erreur d'installation
```
   rm -rf node_modules
   npm install
```

## Structure du projet

```
src/
  components/
    Game.tsx
    PlayerPanel.tsx
    Scoreboard.tsx
    ChoiceButton.tsx
    BackgroundFX.tsx
    LogoJanKenPon.tsx
  utils/
    gameLogic.ts
  types/
    game.ts
public/
  sounds/
```

## Notes
- L’animation de révélation utilise une temporisation synchronisée (900 ms)
- La logique du jeu est centralisée dans utils/gameLogic.ts
- Les fichiers audio doivent exister localement pour éviter les erreurs

## Licence
MIT
