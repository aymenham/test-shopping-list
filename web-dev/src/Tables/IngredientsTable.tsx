import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { Ingredient } from "../Types/Ingredient";
import {
  useMutationIngredientDelete,
  useMutationIngredientUpdate,
} from "../Hooks/Mutation/IngredientsMutation";
import { useQueryFoodTagList } from "../Hooks/Query/FoodTagQuery";
import { ErrorPage } from "../Pages/ErrorPage";
import { Loader } from "../Components/Loader";
import { FOOD_TAG } from "../Types/FoodTag";
import { getInvalidRecipesAfterTagUpdate } from "../Utils/ReceipeVerification";
import { useQueryListRecipe } from "../Hooks/Query/RecipeQuery";
import { InvalidRecipesModal } from "../Modals/InvalidReceipesModal";

export function IngredientTable({
  ingredients,
}: {
  ingredients: Ingredient[];
}): JSX.Element {
  const { mutateAsync: deleteIngredient } = useMutationIngredientDelete();
  const { data: foodTags, status, isLoading } = useQueryFoodTagList();
  const { mutateAsync: updateIngredient } = useMutationIngredientUpdate();
  const { data: receipes } = useQueryListRecipe();
  const [editedTags, setEditedTags] = useState<{
    [key: number]: number | null;
  }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [invalidRecipes, setInvalidRecipes] = useState([]);

  const handleChangeTag = (ingredientId: number, newTagId: number) => {
    setEditedTags((prev) => ({
      ...prev,
      [ingredientId]: newTagId,
    }));
  };

  const handleUpdateTag = async (ingredientId: number) => {
    const selectedTagId = editedTags[ingredientId];

    if (selectedTagId == null) {
      alert("Please select a category");
      return;
    }

    const updatedIngredient: Ingredient | undefined = ingredients.find(
      (ingredient) => ingredient.id === ingredientId
    );

    if (!updatedIngredient) return;

    const IngredientPayloadUpdate: Ingredient = {
      ...updatedIngredient,
      foodTagId: selectedTagId,
    };

    await updateIngredient(IngredientPayloadUpdate);

    if (foodTags && receipes) {
      const result = getInvalidRecipesAfterTagUpdate(
        ingredients,
        receipes,
        foodTags
      );
      if (result.length > 0) {
        setInvalidRecipes(result as any);
        setModalOpen(true);
      }
    }
  };

  const handlerButtonDelete = async (ingredient: Ingredient) => {
    await deleteIngredient(ingredient.id);
  };

  if (status === "error") return <ErrorPage />;
  if (isLoading) return <Loader />;

  return (
    <Box className="tableContainer">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="ingredient table">
          <TableHead>
            <TableRow>
              <TableCell>Ingredient</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Current Tag</TableCell>
              <TableCell align="right">Select Update Tag</TableCell>
              <TableCell align="right">Update</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.price} €</TableCell>
                <TableCell align="right">
                  {foodTags.find((tag: FOOD_TAG) => tag.id === row.foodTagId)
                    ?.name ?? "NO TAG YET"}
                </TableCell>
                <TableCell align="right">
                  <Select
                    size="small"
                    value={editedTags[row.id] ?? ""}
                    displayEmpty
                    onChange={(e) =>
                      handleChangeTag(row.id, Number(e.target.value))
                    }
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="" disabled>
                      Select tag
                    </MenuItem>
                    {foodTags.map((tag: FOOD_TAG) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateTag(row.id)}
                    disabled={editedTags[row.id] == null}
                  >
                    Update
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="error"
                    onClick={() => handlerButtonDelete(row)}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <InvalidRecipesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        invalidRecipes={invalidRecipes}
      />
    </Box>
  );
}
