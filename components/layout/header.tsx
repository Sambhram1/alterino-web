"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, FolderPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import toast from "react-hot-toast"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    toast.success("Signed out successfully")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0D1117]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Alterino
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
            Projects
          </Link>
          {user && (
            <Link href="/submit-project" className="text-gray-300 hover:text-white transition-colors">
              Submit Project
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-gray-300">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700">
                <DropdownMenuItem asChild>
                  <Link href="/submit-project" className="flex items-center space-x-2">
                    <FolderPlus className="w-4 h-4" />
                    <span>Submit Project</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center space-x-2 text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                <Link href="/signup">Join Club</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1117] border-t border-gray-800 p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
              Projects
            </Link>
            {user && (
              <Link href="/submit-project" className="text-gray-300 hover:text-white transition-colors">
                Submit Project
              </Link>
            )}
            <div className="flex flex-col space-y-2 pt-4">
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-red-600 text-red-400 bg-transparent"
                >
                  Sign Out ({user.name})
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl">
                    <Link href="/signup">Join Club</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
