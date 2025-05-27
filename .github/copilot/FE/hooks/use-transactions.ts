"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { TransactionDto, CreateTransactionDto, UpdateTransactionDto } from "@/types/dto"
import { useToast } from "@/hooks/use-toast"

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTransactions = async () => {
    setLoading(true)
    const response = await apiClient.getAll<TransactionDto>("/transactions")

    if (response.success && response.data) {
      setTransactions(response.data)
      setError(null)
    } else {
      setError(response.error || "Failed to fetch transactions")
      toast({
        title: "Error",
        description: response.error || "Failed to fetch transactions",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const createTransaction = async (data: CreateTransactionDto) => {
    const response = await apiClient.create<TransactionDto>("/transactions", data)

    if (response.success && response.data) {
      setTransactions([...transactions, response.data])
      toast({
        title: "Success",
        description: "Transaction created successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to create transaction",
        variant: "destructive",
      })
      return false
    }
  }

  const updateTransaction = async (id: string, data: UpdateTransactionDto) => {
    const response = await apiClient.update<TransactionDto>("/transactions", id, data)

    if (response.success && response.data) {
      setTransactions(transactions.map((t) => (t.id === id ? response.data! : t)))
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to update transaction",
        variant: "destructive",
      })
      return false
    }
  }

  const deleteTransaction = async (id: string) => {
    const response = await apiClient.delete("/transactions", id)

    if (response.success) {
      setTransactions(transactions.filter((t) => t.id !== id))
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to delete transaction",
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
