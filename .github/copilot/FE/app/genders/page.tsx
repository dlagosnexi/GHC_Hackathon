"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Plus, Search, Edit, Trash } from "lucide-react"

const initialGenders = [
  {
    id: "1",
    name: "Male",
    description: "Identifies as male",
    customerCount: 15,
  },
  {
    id: "2",
    name: "Female",
    description: "Identifies as female",
    customerCount: 12,
  },
  {
    id: "3",
    name: "Other",
    description: "Identifies as non-binary or other gender",
    customerCount: 5,
  },
]

export default function GendersPage() {
  const [genders, setGenders] = useState(initialGenders)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [currentGender, setCurrentGender] = useState({
    id: "",
    name: "",
    description: "",
    customerCount: 0,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredGenders = genders.filter(
    (gender) =>
      gender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gender.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddGender = () => {
    setCurrentGender({
      id: "",
      name: "",
      description: "",
      customerCount: 0,
    })
    setOpenDialog(true)
  }

  const handleEditGender = (gender: typeof currentGender) => {
    setCurrentGender(gender)
    setOpenDialog(true)
  }

  const handleDeleteGender = (id: string) => {
    setGenders(genders.filter((gender) => gender.id !== id))
  }

  const handleSaveGender = () => {
    if (currentGender.id) {
      // Update existing gender
      setGenders(genders.map((gender) => (gender.id === currentGender.id ? currentGender : gender)))
    } else {
      // Add new gender
      const newGender = {
        ...currentGender,
        id: Math.random().toString(36).substr(2, 9),
        customerCount: 0,
      }
      setGenders([...genders, newGender])
    }
    setOpenDialog(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Genders</h1>
        <Button onClick={handleAddGender}>
          <Plus className="mr-2 h-4 w-4" />
          Add Gender
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search genders..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGenders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No genders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredGenders.map((gender) => (
                  <TableRow key={gender.id}>
                    <TableCell className="font-medium">{gender.name}</TableCell>
                    <TableCell>{gender.description}</TableCell>
                    <TableCell>{gender.customerCount}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditGender(gender)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteGender(gender.id)}>
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
            <DialogTitle>{currentGender.id ? "Edit Gender" : "Add Gender"}</DialogTitle>
            <DialogDescription>
              {currentGender.id ? "Make changes to the gender here." : "Add a new gender to your system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentGender.name}
                onChange={(e) =>
                  setCurrentGender({
                    ...currentGender,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={currentGender.description}
                onChange={(e) =>
                  setCurrentGender({
                    ...currentGender,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGender}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
