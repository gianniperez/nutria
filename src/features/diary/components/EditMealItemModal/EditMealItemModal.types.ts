import type { LoggedFoodItem, MealType } from "../../types";

export interface EditMealItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType | null;
  mealTitle: string;
  item: LoggedFoodItem | null;
  onSaveQuantity: (
    mealType: MealType,
    itemId: string,
    newQuantity: number
  ) => Promise<void>;
}
