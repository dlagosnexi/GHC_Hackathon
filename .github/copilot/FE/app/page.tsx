"use client"

import { useState, useEffect } from "react"
import { TransactionTable } from "@/components/transaction-table"
import { TransactionForm } from "@/components/transaction-form"
import { UserHeader } from "@/components/user-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Transaction, Category, TransactionFormData } from "@/types/schema"

// Single user ID - would typically come from authentication
const USER_ID = "user-123"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)
  const { toast } = useToast()

  // Fetch user's transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<Transaction[]>(`/users/${USER_ID}/transactions`)
      setTransactions(response.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<Category[]>("/categories")
      setCategories(response.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [])

  const handleAddTransaction = () => {
    setCurrentTransaction(null)
    setIsFormOpen(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await apiClient.delete(`/transactions/${id}`)
      setTransactions(transactions.filter((t) => t.id !== id))
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  const handleSaveTransaction = async (data: TransactionFormData) => {
    try {
      if (currentTransaction) {
        // Update existing transaction
        const response = await apiClient.put<Transaction>(`/transactions/${currentTransaction.id}`, {
          ...data,
          userId: USER_ID,
        })
        setTransactions(transactions.map((t) => (t.id === currentTransaction.id ? response.data! : t)))
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        })
      } else {
        // Create new transaction
        const response = await apiClient.post<Transaction>("/transactions", {
          ...data,
          userId: USER_ID,
        })
        setTransactions([...transactions, response.data!])
        toast({
          title: "Success",
          description: "Transaction added successfully",
        })
      }
      setIsFormOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <UserHeader userId={USER_ID} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={handleAddTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="highest">Highest Amount</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <TransactionTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions}
              categories={categories}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          )}
        </TabsContent>

        <TabsContent value="recent">
          {isLoading ? (
            <TransactionTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)}
              categories={categories}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          )}
        </TabsContent>

        <TabsContent value="highest">
          {isLoading ? (
            <TransactionTableSkeleton />
          ) : (
            <TransactionTable
              transactions={transactions
                .slice()
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)}
              categories={categories}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          )}
        </TabsContent>
      </Tabs>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTransaction}
        transaction={currentTransaction}
        categories={categories}
      />
    </div>
  )
}

function TransactionTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-1/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/3" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
