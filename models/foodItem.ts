export interface FoodItem {
  id: number
  userId: number
  locationId: number
  name: string
  quantity: number // pg sends decimals as strings, so the db layer converts
  unit: string | null
  expirationDate: string | null // 'YYYY-MM-DD'
  isDish: boolean
  createdAt: string
  updatedAt: string
}

// What the client sends when adding an item.
export type NewFoodItem = Omit<
  FoodItem,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>

// For PATCH (decision 8): any subset of the fields.
export type UpdateFoodItem = Partial<NewFoodItem>
