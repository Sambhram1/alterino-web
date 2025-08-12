"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { projectsAPI } from "@/lib/api"
import type { Project } from "@/lib/supabase"
import { Plus, Edit, Trash2, ExternalLink, Heart, Bookmark } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalLikes: 0,
    totalBookmarks: 0
  })
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/signin")
      return
    }

    fetchProjects()
  }, [user, router])

  const fetchProjects = async () => {
    if (!user) return

    try {
      const data = await projectsAPI.getUserProjects(user.id)
      setProjects(data)
      
      // Calculate stats
      const totalLikes = data.reduce((sum, project) => sum + (project.likes_count || 0), 0)
      setStats({
        totalProjects: data.length,
        totalLikes: totalLikes,
        totalBookmarks: 0 // TODO: Add bookmark count from API
      })
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await projectsAPI.deleteProject(projectId)
      setProjects(projects.filter((p) => p.id !== projectId))
      toast.success("Project deleted successfully")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
            <p className="text-gray-400">Manage your projects and track your contributions</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-xl"
          >
            <Link href="/submit-project">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                </div>
                <div className="bg-indigo-500/20 p-3 rounded-full">
                  <Plus className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Likes</p>
                  <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Profile Views</p>
                  <p className="text-2xl font-bold text-white">-</p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <Bookmark className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading your projects...</div>
        ) : projects.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-700 text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p>Start showcasing your work by submitting your first project!</p>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl"
              >
                <Link href="/submit-project">Submit Your First Project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 group"
              >
                <div className="relative">
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-700 rounded-t-lg flex items-center justify-center">
                      <div className="text-gray-500 text-4xl">📁</div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => router.push(`/submit-project?edit=${project.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 bg-black/50 hover:bg-red-600 text-white"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {project.likes_count > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current text-red-500" />
                      {project.likes_count}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {project.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech_stack?.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack && project.tech_stack.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        +{project.tech_stack.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-indigo-400 hover:text-indigo-300 p-0"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      View Details <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                    {project.demo_url && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400"
                        onClick={() => window.open(project.demo_url!, '_blank')}
                      >
                        Live Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
