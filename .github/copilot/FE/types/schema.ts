// Types for the application

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  categoryId: string
  userId: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface TransactionFormData {
  description: string
  amount: number
  date: string
  categoryId: string
  notes?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
}
