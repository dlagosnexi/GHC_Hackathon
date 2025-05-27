// DTOs matching .NET backend models

export interface TransactionDto {
  id: string
  description: string
  amount: number
  date: string // ISO date string from .NET
  categoryId: string
  customerId: string
  createdAt?: string
  updatedAt?: string
  // Navigation properties that might come from .NET
  category?: CategoryDto
  customer?: CustomerDto
}

export interface CustomerDto {
  id: string
  name: string
  email: string
  phone: string
  genderId: string
  professionId: string
  totalSpent?: number
  transactionCount?: number
  createdAt?: string
  updatedAt?: string
  // Navigation properties
  gender?: GenderDto
  profession?: ProfessionDto
  transactions?: TransactionDto[]
}

export interface CategoryDto {
  id: string
  name: string
  description: string
  color: string
  transactionCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface ProfessionDto {
  id: string
  name: string
  description: string
  customerCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface GenderDto {
  id: string
  name: string
  description: string
  customerCount?: number
  createdAt?: string
  updatedAt?: string
}

// Create/Update DTOs (without navigation properties)
export interface CreateTransactionDto {
  description: string
  amount: number
  date: string
  categoryId: string
  customerId: string
}

export interface UpdateTransactionDto extends CreateTransactionDto {
  id: string
}

export interface CreateCustomerDto {
  name: string
  email: string
  phone: string
  genderId: string
  professionId: string
}

export interface UpdateCustomerDto extends CreateCustomerDto {
  id: string
}
