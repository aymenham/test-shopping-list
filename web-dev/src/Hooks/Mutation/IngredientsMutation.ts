import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import axios from "../../Utils/axios";
import { Requests } from "../QueriesAndMutationList";
import { Ingredient } from "../../Types/Ingredient";

export const useMutationIngredientCreate = (): UseMutationResult<
  any,
  unknown,
  { name: string; price: number; foodTagId: number | null }
> => {
  const clientQuery = useQueryClient();

  return useMutation(
    [Requests.createIngredient],
    async ({
      name,
      price,
      foodTagId,
    }: {
      name: string;
      price: number;
      foodTagId: number | null;
    }) => {
      return await axios.post(`/ingredient/create`, {
        name,
        price,
        foodTagId,
      });
    },
    {
      onSuccess: () => {
        clientQuery.invalidateQueries(Requests.listIngredient);
      },
    }
  );
};

export const useMutationIngredientDelete = (): UseMutationResult<
  any,
  unknown,
  number
> => {
  const clientQuery = useQueryClient();

  return useMutation(
    [Requests.deleteIngredient],
    async (id: number) => {
      return await axios.delete(`/ingredient/delete/${id}`);
    },
    {
      onSuccess: () => {
        clientQuery.invalidateQueries(Requests.listIngredient);
      },
    }
  );
};

export const useMutationIngredientUpdate = (): UseMutationResult<
  any,
  unknown,
  Ingredient
> => {
  const clientQuery = useQueryClient();

  return useMutation(
    [Requests.updateIngredient],
    async ({ id, name, price, foodTagId }: Ingredient) => {
      return await axios.put(`/ingredient/update/${id}`, {
        name,
        price,
        foodTagId,
      });
    },
    {
      onSuccess: () => {
        clientQuery.invalidateQueries(Requests.listIngredient);
      },
    }
  );
};
