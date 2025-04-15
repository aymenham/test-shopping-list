import { response, Router } from "express";
import { IngredientController } from "../Controllers/IngredientController";
import { RecipeController } from "../Controllers/RecipeController";
import { ShoppingListController } from "../Controllers/ShoppingListController";
import { FoodTagController } from "../Controllers/FoodTagController";

// GLOBAL ROUTER
const routes = Router();

// RECIPES
const recipeRouter = Router();
recipeRouter.get("/list", RecipeController.list);
recipeRouter.post("/create", RecipeController.create);
recipeRouter.put("/update", RecipeController.update);
recipeRouter.delete("/delete/:id", RecipeController.delete);

// INGREDIENTS
const ingredientRouter = Router();
ingredientRouter.get("/list", IngredientController.list);
ingredientRouter.post("/create", IngredientController.create);
ingredientRouter.put("/update/:id", IngredientController.update);
ingredientRouter.delete("/delete/:id", IngredientController.delete);

// SHOPPING LIST
const shoppingListRouter = Router();
shoppingListRouter.get("/list/:id", ShoppingListController.getOne);
shoppingListRouter.get("/list", ShoppingListController.list);
shoppingListRouter.post("/create", ShoppingListController.create);
shoppingListRouter.put("/update", ShoppingListController.update);
shoppingListRouter.delete("/delete/:id", ShoppingListController.delete);

// FOOD TAGS

const foodTagRouter = Router();
foodTagRouter.get("/list", FoodTagController.list);
foodTagRouter.post("/create", FoodTagController.create);
foodTagRouter.put("/update", FoodTagController.update);
foodTagRouter.delete("/delete/:id", FoodTagController.delete);

// BINDS
routes.use("/recipe", recipeRouter);
routes.use("/ingredient", ingredientRouter);
routes.use("/shopping-list", shoppingListRouter);
routes.use("/food-tags", foodTagRouter);
export default routes;
