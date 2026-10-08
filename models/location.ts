export type LocationKind = 'pantry' | 'fridge' | 'freezer'

export interface StorageLocation {
  id: number
  userId: number
  name: string
  kind: LocationKind
  createdAt: string
}

// What the client sends. The server adds userId from the verified token.
export type NewStorageLocation = Omit<
  StorageLocation,
  'id' | 'userId' | 'createdAt'
>
