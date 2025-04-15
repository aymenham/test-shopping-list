import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { CardCustom } from "../Components/CardCustom";
import { useMutationIngredientCreate } from "../Hooks/Mutation/IngredientsMutation";
import { OptionsFoodCategoryType } from "../Types/OptionsMultiSelect";
import { useQueryFoodTagList } from "../Hooks/Query/FoodTagQuery";
import { ErrorPage } from "../Pages/ErrorPage";
import { Loader } from "../Components/Loader";

export function CreateIngredientForm(): JSX.Element {
  const { mutateAsync: createIngredient } = useMutationIngredientCreate();
  const { data: foodTags, status, isLoading } = useQueryFoodTagList();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [foodTagId, setfoodTagId] = useState<number | null>(null);

  const resetFields = () => {
    setName("");
    setPrice(0);
    setfoodTagId(null);
  };

  const handlerSubmitNewIngredient = async () => {
    if (
      name === undefined ||
      name === "" ||
      price === undefined ||
      foodTagId === null
    ) {
      alert("Please fill all the fields");
      return;
    }
    await createIngredient({
      name,
      price,
      foodTagId,
    });

    resetFields();
  };

  if (status === "error") {
    return <ErrorPage />;
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div id="create-recipes-form">
      <Box
        display="flex"
        justifyContent="space-between"
        className="MarginTop16Px"
      >
        <CardCustom isSmall>
          <h2>New ingredient</h2>
          <FormControl fullWidth margin="normal">
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name-recipe"
              label="Name of the ingredient"
              variant="outlined"
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="category-select">Category</InputLabel>
            <Select
              value={foodTagId}
              onChange={(e) => {
                const value = Number(e.target.value);

                setfoodTagId(value);
              }}
              label="Category"
              inputProps={{
                name: "category",
                id: "category-select",
              }}
            >
              {foodTags.map((option: OptionsFoodCategoryType) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              value={price}
              onChange={(e) =>
                e.target.value ? setPrice(Number(e.target.value)) : setPrice(0)
              }
              id="name-recipe"
              label="price"
              variant="outlined"
              type="number"
              fullWidth
            />
            <span className="SmallTextExplanation">
              *Keep in mind that the price is for one person. Prices are
              multiplied by the number of people in the recipe.
            </span>
          </FormControl>

          <FormControl margin="normal">
            <Button onClick={handlerSubmitNewIngredient} variant="contained">
              Submit
            </Button>
          </FormControl>
        </CardCustom>
      </Box>
    </div>
  );
}
