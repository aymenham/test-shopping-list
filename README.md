# Test Application de Gestion de Recettes Aimene Hamidechi GOFLYNT

Ce projet est une démonstration d’une application de gestion de recettes, répondant à 4 points précis demandés. Il comprend un backend et un frontend séparés, avec des fonctionnalités claires, des améliorations ciblées et des corrections de bugs bien identifiées.

## Critique de l'Architecture

### Backend

#### Points Positifs

- Bonne séparation des responsabilités (Controllers, Services, Entities)
- Utilisation de TypeORM pour l'abstraction de la base de données

#### Points à Améliorer

- Structure monolithique
- Absence de système de validation
- Documentation API manquante
- Séparation front/back sans structure claire de partage
- Pas de types partagés entre front et back
- Duplication potentielle de code et de logique métier
- Difficulté de maintenir la cohérence des versions des dépendances
- Risque de conflits lors des mises à jour
- Absence de standards partagés

#### Solution Proposée

- Implémenter une architecture Monorepo pour:
  - Partager du code entre front et back
  - Maintenir une cohérence dans les versions
  - Standardiser les pratiques
- Ajouter un système de validation (ex: class-validator)
- Implémenter une gestion centralisée des erreurs
- Ajouter une documentation API (Swagger)

### Frontend

#### Points Positifs

- Utilisation de React Query pour la gestion du cache
- Bonne séparation des hooks de mutation

#### Points à Améliorer

- Manque de séparation des responsabilités
- Risque de duplication de code
- Mélange des différentes logiques métier
- Manque validation des champs

#### Solution Proposée

- Implémenter une architecture modulaire:
  - Organisation claire avec modules autonomes
  - Meilleure séparation des responsabilités
  - Composants réutilisables par module
  - système de validation de champs avec (react-hook-form)
  - Logique métier encapsulée
  - Tests plus simples à organiser

## Mauvaises Pratiques Identifiées et Solutions

### Backend

```typescript
// Problème : Types 'any' dans le controller
public static async list(req: any, res: any, next: any)

// Solution : Utiliser des types Express.js appropriés
import { Request, Response, NextFunction } from 'express';
public static async list(
  req: Request,
  res: Response,
  next: NextFunction
)
```

```typescript
// Problème : Messages d'erreur console.log et réponse 500 générique
catch (err) {
  console.error("[IngredientController.list] Error listing recipes", err);
  res.send(500);
}

// Solution : Meilleure gestion d'erreurs
catch (error) {
  next(new ApiError({
    status: 500,
    message: "Erreur lors de la récupération des ingrédients",
    error
  }));
}
```

```typescript
// Problème : Pas de gestion de configuration d'environnement
app.listen(5432, () => {
  console.log(`Server started`);
});

// Solution :
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
```

### Frontend

```typescript
// Problème : Typage incomplet des réponses API
useMutation<any, unknown, { name: string; price: number }>;

// Solution : Définir des interfaces précises
interface Ingredient {
  id: number;
  name: string;
  price: number;
}

useMutation<Ingredient, Error, CreateIngredientDto>;
```

```typescript
// Problème : Pas de gestion d'erreur côté client
return useMutation([Requests.createIngredient], async ({ name, price }) => {
  return await axios.post(`/ingredient/create`, { name, price });
});

// Solution : Ajouter la gestion d'erreurs
return useMutation([Requests.createIngredient], async ({ name, price }) => {
  try {
    const response = await axios.post(`/ingredient/create`, { name, price });
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la création de l'ingrédient");
  }
});
```

## Corrections de Bugs

### Bug sur la page ingrédient

Lors de la création d'un ingrédient, la fonction `onSuccess` invalidait la clé `Requests.listRecipe` au lieu de `Requests.listIngredient`. Résultat : la liste des ingrédients n'était pas mise à jour après l'ajout.

**Solution**: Remplacement de `Requests.listRecipe` par la bonne clé `Requests.listIngredient`.

## Fonctionnalités Ajoutées

### Système de tags pour les ingrédients

#### Backend

1. **Création de la table `FOOD_TAG`**

   - Nouvelle table via migration
   - Tags de base: `"légumes"`, `"protéine"`, `"féculent"`

2. **Lien avec la table `INGREDIENT`**

   - Ajout d'un champ `food_tag_id` (clé étrangère) dans `INGREDIENT`
   - Assure l'intégrité des données

3. **Module `FOOD_TAG`**
   - Routes (ex: `/food-tag/list`)
   - Controller et service dédiés

#### Frontend

1. **Formulaire de création d'ingrédient**

   - Menu déroulant pour sélectionner un tag
   - Récupération des tags via API (`useQuery`)

2. **Transmission du `food_tag_id`**
   - Envoi de l'ID du tag lors de la création d'un ingrédient

### Règles de validation de recette

Des règles métier ont été ajoutées pour garantir la cohérence des recettes:

- 0 ou 1 protéine par recette
- 1 seul féculent
- Nombre illimité de légumes
- Un ingrédient de type protéine ne peut être utilisé que dans une seule recette à la fois

Lorsqu'un tag d'ingrédient est modifié, un message d'alerte s'affiche dans un module lors
de la mise à jour d'un tag d'un ingrédient

Ces règles sont gérées dans `utils/ReceipeVerification.ts`, permettant une extension simple pour de futures règles.
