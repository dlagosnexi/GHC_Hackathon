"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"

const transactions = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: 85.75,
    date: "2025-05-25",
    category: "Food & Dining",
    customer: "John Doe",
  },
  {
    id: "2",
    description: "Monthly Rent",
    amount: 1200.0,
    date: "2025-05-01",
    category: "Housing",
    customer: "Jane Smith",
  },
  {
    id: "3",
    description: "Gas Station",
    amount: 45.5,
    date: "2025-05-23",
    category: "Transportation",
    customer: "John Doe",
  },
  {
    id: "4",
    description: "Netflix Subscription",
    amount: 15.99,
    date: "2025-05-15",
    category: "Entertainment",
    customer: "Jane Smith",
  },
  {
    id: "5",
    description: "Electricity Bill",
    amount: 95.2,
    date: "2025-05-10",
    category: "Utilities",
    customer: "John Doe",
  },
]

export function RecentTransactions() {
  const [data, setData] = useState(transactions)

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.description}</TableCell>
            <TableCell>
              <Badge variant={getCategoryColor(transaction.category) as any}>{transaction.category}</Badge>
            </TableCell>
            <TableCell>{transaction.customer}</TableCell>
            <TableCell>{formatDate(transaction.date)}</TableCell>
            <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
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
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
