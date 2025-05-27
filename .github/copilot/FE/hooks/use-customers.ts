"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { CustomerDto, CreateCustomerDto, UpdateCustomerDto } from "@/types/dto"
import { useToast } from "@/hooks/use-toast"

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCustomers = async () => {
    setLoading(true)
    const response = await apiClient.getAll<CustomerDto>("/customers")

    if (response.success && response.data) {
      setCustomers(response.data)
      setError(null)
    } else {
      setError(response.error || "Failed to fetch customers")
      toast({
        title: "Error",
        description: response.error || "Failed to fetch customers",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const createCustomer = async (data: CreateCustomerDto) => {
    const response = await apiClient.create<CustomerDto>("/customers", data)

    if (response.success && response.data) {
      setCustomers([...customers, response.data])
      toast({
        title: "Success",
        description: "Customer created successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to create customer",
        variant: "destructive",
      })
      return false
    }
  }

  const updateCustomer = async (id: string, data: UpdateCustomerDto) => {
    const response = await apiClient.update<CustomerDto>("/customers", id, data)

    if (response.success && response.data) {
      setCustomers(customers.map((c) => (c.id === id ? response.data! : c)))
      toast({
        title: "Success",
        description: "Customer updated successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to update customer",
        variant: "destructive",
      })
      return false
    }
  }

  const deleteCustomer = async (id: string) => {
    const response = await apiClient.delete("/customers", id)

    if (response.success) {
      setCustomers(customers.filter((c) => c.id !== id))
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to delete customer",
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
