"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash, Download, Filter } from "lucide-react"
import { useTransactions } from "@/hooks/use-transactions"
import { useCustomers } from "@/hooks/use-customers"
import { useCategories } from "@/hooks/use-categories"
import type { TransactionDto } from "@/types/dto"

const categoriesList = ["Food & Dining", "Housing", "Transportation", "Entertainment", "Utilities", "Healthcare"]

const customersList = ["John Doe", "Jane Smith"]

export default function TransactionsPage() {
  const { transactions, loading, createTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const { customers } = useCustomers()
  const { categories } = useCategories()
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<Partial<TransactionDto>>({})

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      "Food & Dining": "green",
      Housing: "blue",
      Transportation: "yellow",
      Entertainment: "purple",
      Utilities: "orange",
      Healthcare: "red",
    }

    return categories[category] || "default"
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredData = (transactions || []).filter(
    (transaction) =>
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTransaction = () => {
    setCurrentTransaction({
      id: "",
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
      customerId: "",
    })
    setOpenDialog(true)
  }

  const handleEditTransaction = (transaction: TransactionDto) => {
    setCurrentTransaction(transaction)
    setOpenDialog(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id)
  }

  const handleSaveTransaction = async () => {
    if (currentTransaction.id) {
      // Update existing transaction
      const success = await updateTransaction(currentTransaction.id, {
        id: currentTransaction.id,
        description: currentTransaction.description || "",
        amount: currentTransaction.amount || 0,
        date: currentTransaction.date || "",
        categoryId: currentTransaction.categoryId || "",
        customerId: currentTransaction.customerId || "",
      })
      if (success) setOpenDialog(false)
    } else {
      // Add new transaction
      const success = await createTransaction({
        description: currentTransaction.description || "",
        amount: currentTransaction.amount || 0,
        date: currentTransaction.date || "",
        categoryId: currentTransaction.categoryId || "",
        customerId: currentTransaction.customerId || "",
      })
      if (success) setOpenDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Button onClick={handleAddTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant={getCategoryColor(transaction.category?.name || "") as any}>
                        {transaction.category?.name || transaction.categoryId}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.customer?.name || transaction.customerId}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.amount || 0)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteTransaction(transaction.id || "")}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentTransaction.id ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
            <DialogDescription>
              {currentTransaction.id
                ? "Make changes to the transaction here."
                : "Add a new transaction to your expenses."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={currentTransaction.description}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={currentTransaction.amount}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    amount: Number.parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={currentTransaction.date}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    date: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={currentTransaction.categoryId}
                onValueChange={(value) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    categoryId: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Select
                value={currentTransaction.customerId}
                onValueChange={(value) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    customerId: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTransaction}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
