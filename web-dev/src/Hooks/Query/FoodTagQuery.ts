import { useQuery, UseQueryResult } from "react-query";
import axios from "../../Utils/axios";
import { Requests } from "../QueriesAndMutationList";
import { FOOD_TAG } from "../../Types/FoodTag";

export const useQueryFoodTagList = (): UseQueryResult<any, unknown> => {
  return useQuery([Requests.listFoodTag], async () => {
    const { data } = await axios.get<{ data: Partial<FOOD_TAG> }>(
      "/food-tags/list"
    );
    return data ?? [];
  });
};
