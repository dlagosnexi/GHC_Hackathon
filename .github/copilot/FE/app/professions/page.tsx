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

const initialProfessions = [
  {
    id: "1",
    name: "Software Engineer",
    description: "Develops software applications and systems",
    customerCount: 8,
  },
  {
    id: "2",
    name: "Marketing Manager",
    description: "Manages marketing campaigns and strategies",
    customerCount: 5,
  },
  {
    id: "3",
    name: "Accountant",
    description: "Manages financial records and transactions",
    customerCount: 7,
  },
  {
    id: "4",
    name: "Teacher",
    description: "Educates students in various subjects",
    customerCount: 4,
  },
  {
    id: "5",
    name: "Doctor",
    description: "Provides medical care and treatment",
    customerCount: 6,
  },
]

export default function ProfessionsPage() {
  const [professions, setProfessions] = useState(initialProfessions)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [currentProfession, setCurrentProfession] = useState({
    id: "",
    name: "",
    description: "",
    customerCount: 0,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredProfessions = professions.filter(
    (profession) =>
      profession.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profession.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProfession = () => {
    setCurrentProfession({
      id: "",
      name: "",
      description: "",
      customerCount: 0,
    })
    setOpenDialog(true)
  }

  const handleEditProfession = (profession: typeof currentProfession) => {
    setCurrentProfession(profession)
    setOpenDialog(true)
  }

  const handleDeleteProfession = (id: string) => {
    setProfessions(professions.filter((profession) => profession.id !== id))
  }

  const handleSaveProfession = () => {
    if (currentProfession.id) {
      // Update existing profession
      setProfessions(
        professions.map((profession) => (profession.id === currentProfession.id ? currentProfession : profession)),
      )
    } else {
      // Add new profession
      const newProfession = {
        ...currentProfession,
        id: Math.random().toString(36).substr(2, 9),
        customerCount: 0,
      }
      setProfessions([...professions, newProfession])
    }
    setOpenDialog(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Professions</h1>
        <Button onClick={handleAddProfession}>
          <Plus className="mr-2 h-4 w-4" />
          Add Profession
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search professions..."
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
              {filteredProfessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No professions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfessions.map((profession) => (
                  <TableRow key={profession.id}>
                    <TableCell className="font-medium">{profession.name}</TableCell>
                    <TableCell>{profession.description}</TableCell>
                    <TableCell>{profession.customerCount}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditProfession(profession)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProfession(profession.id)}
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
            <DialogTitle>{currentProfession.id ? "Edit Profession" : "Add Profession"}</DialogTitle>
            <DialogDescription>
              {currentProfession.id ? "Make changes to the profession here." : "Add a new profession to your system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentProfession.name}
                onChange={(e) =>
                  setCurrentProfession({
                    ...currentProfession,
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
                value={currentProfession.description}
                onChange={(e) =>
                  setCurrentProfession({
                    ...currentProfession,
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
            <Button onClick={handleSaveProfession}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
