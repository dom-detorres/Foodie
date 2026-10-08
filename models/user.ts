export interface User {
  id: number
  authId: string // the Firebase UID
  email: string
  warningDays: number // orange warning (default 5)
  urgentDays: number // red warning (default 2)
  createdAt: string // ISO timestamp text, since it travels as JSON
}

// To create a user we only need these two. The database fills in the rest.
export type NewUser = Pick<User, 'authId' | 'email'>
