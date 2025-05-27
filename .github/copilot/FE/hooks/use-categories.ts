"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { CategoryDto } from "@/types/dto"
import { useToast } from "@/hooks/use-toast"

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCategories = async () => {
    setLoading(true)
    const response = await apiClient.getAll<CategoryDto>("/categories")

    if (response.success && response.data) {
      setCategories(response.data)
      setError(null)
    } else {
      setError(response.error || "Failed to fetch categories")
    }
    setLoading(false)
  }

  const createCategory = async (data: Omit<CategoryDto, "id">) => {
    const response = await apiClient.create<CategoryDto>("/categories", data)

    if (response.success && response.data) {
      setCategories([...categories, response.data])
      toast({
        title: "Success",
        description: "Category created successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to create category",
        variant: "destructive",
      })
      return false
    }
  }

  const updateCategory = async (id: string, data: CategoryDto) => {
    const response = await apiClient.update<CategoryDto>("/categories", id, data)

    if (response.success && response.data) {
      setCategories(categories.map((c) => (c.id === id ? response.data! : c)))
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to update category",
        variant: "destructive",
      })
      return false
    }
  }

  const deleteCategory = async (id: string) => {
    const response = await apiClient.delete("/categories", id)

    if (response.success) {
      setCategories(categories.filter((c) => c.id !== id))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      return true
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to delete category",
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
