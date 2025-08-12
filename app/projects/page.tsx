"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { projectsAPI, likesAPI, bookmarksAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Project } from "@/lib/supabase"
import { ExternalLink, Heart, Bookmark, Share2, Search } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

const CATEGORIES = [
  "All",
  "AI/ML",
  "Web",
  "Mobile",
  "Game",
  "Hardware",
  "Core",
  "Data Science",
  "Blockchain"
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [user, searchQuery, selectedCategory])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      let data: Project[]
      
      if (searchQuery || selectedCategory !== "All") {
        data = await projectsAPI.searchProjects(
          searchQuery,
          selectedCategory === "All" ? undefined : selectedCategory,
          user?.id
        )
      } else {
        data = await projectsAPI.getProjects(user?.id)
      }
      
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (projectId: string) => {
    if (!user) {
      toast.error("Please sign in to like projects")
      return
    }

    try {
      const isLiked = await likesAPI.toggleLike(user.id, projectId)
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              is_liked: isLiked,
              likes_count: isLiked ? project.likes_count + 1 : project.likes_count - 1
            }
          : project
      ))
      
      toast.success(isLiked ? "Project liked!" : "Project unliked!")
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    }
  }

  const handleBookmark = async (projectId: string) => {
    if (!user) {
      toast.error("Please sign in to bookmark projects")
      return
    }

    try {
      const isBookmarked = await bookmarksAPI.toggleBookmark(user.id, projectId)
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, is_bookmarked: isBookmarked }
          : project
      ))
      
      toast.success(isBookmarked ? "Project bookmarked!" : "Bookmark removed!")
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast.error("Failed to update bookmark")
    }
  }

  const handleShare = async (project: Project) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description || "",
          url: window.location.href + "/" + project.id
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href + "/" + project.id)
      toast.success("Project URL copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">Loading projects...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">All Projects</h1>
          <p className="text-gray-400 text-lg mb-6">Discover amazing projects built by our community</p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-indigo-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No projects found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden"
              >
                <div className="relative">
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                      <div className="text-gray-500 text-4xl">📁</div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={`w-8 h-8 bg-black/50 hover:bg-black/70 text-white ${
                        project.is_liked ? 'text-red-500' : ''
                      }`}
                      onClick={() => handleLike(project.id)}
                    >
                      <Heart className={`w-4 h-4 ${project.is_liked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={`w-8 h-8 bg-black/50 hover:bg-black/70 text-white ${
                        project.is_bookmarked ? 'text-yellow-500' : ''
                      }`}
                      onClick={() => handleBookmark(project.id)}
                    >
                      <Bookmark className={`w-4 h-4 ${project.is_bookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => handleShare(project)}
                    >
                      <Share2 className="w-4 h-4" />
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
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      <div className="font-medium text-gray-300">
                        {project.profiles?.name || 'Unknown User'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {project.demo_url && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-indigo-400 hover:text-indigo-300"
                          onClick={() => window.open(project.demo_url!, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      {project.github_url && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-gray-300"
                          onClick={() => window.open(project.github_url!, '_blank')}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      )}
                    </div>
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
