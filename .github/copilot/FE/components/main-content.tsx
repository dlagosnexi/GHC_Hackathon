"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)

    if (paths.length === 0) {
      return [{ label: "Dashboard", href: "/", current: true }]
    }

    return [
      { label: "Dashboard", href: "/", current: false },
      ...paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`
        const isLast = index === paths.length - 1
        return {
          label: path.charAt(0).toUpperCase() + path.slice(1),
          href,
          current: isLast,
        }
      }),
    ]
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <SidebarInset className="p-0">
      <div className="flex flex-col h-full">
        <header className="border-b p-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={crumb.href}>
                  {index === 0 ? (
                    <BreadcrumbLink href={crumb.href}>
                      <Home className="h-4 w-4 mr-1" />
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : crumb.current ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  )}
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarInset>
  )
}
