"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { projectsAPI, likesAPI, bookmarksAPI } from "@/lib/api"
import type { Project } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import {
  FolderOpen,
  Award,
  GitBranch,
  UserPlus,
  FileText,
  Bell,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const projectFilters = ["All", "Web", "AI/ML", "Mobile", "Game", "Hardware", "Core", "Data Science", "Blockchain"]

  useEffect(() => {
    fetchProjects()
  }, [user])

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.getProjects(user?.id)
      // Show featured projects or latest 6 projects on homepage
      const featuredProjects = data.filter(p => p.featured).slice(0, 6)
      setProjects(featuredProjects.length > 0 ? featuredProjects : data.slice(0, 6))
    } catch (error) {
      console.error("Error fetching projects:", error)
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
          url: window.location.href + "projects/" + project.id
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href + "projects/" + project.id)
      toast.success("Project URL copied to clipboard!")
    }
  }

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter)

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-blue-950/20 to-indigo-950/30"></div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              Showcase Your College Projects
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Alterino is your club's home for project portfolios, recognition, and real tech exposure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  <Link href="/submit-project">Submit Your Project</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  <Link href="/signup">Join Club</Link>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 hover:bg-gray-800/50 rounded-xl bg-transparent"
              >
                <Link href="/projects">Explore Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-gray-900/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Alterino?</h2>
            <p className="text-gray-400 text-lg">Everything you need to showcase and discover amazing projects</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <FolderOpen className="w-8 h-8 text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" />
                <CardTitle>📂 Project Showcase</CardTitle>
                <CardDescription className="text-gray-400">
                  Display your projects with rich media, GitHub integration, and detailed documentation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <Award className="w-8 h-8 text-green-400 mb-2 group-hover:text-green-300 transition-colors" />
                <CardTitle>🏅 Community Recognition</CardTitle>
                <CardDescription className="text-gray-400">
                  Get likes, bookmarks, and recognition for your contributions within the club community
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <GitBranch className="w-8 h-8 text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors" />
                <CardTitle>🔗 GitHub Integration</CardTitle>
                <CardDescription className="text-gray-400">
                  Seamlessly connect your GitHub repositories and showcase your code with live demos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <UserPlus className="w-8 h-8 text-purple-400 mb-2 group-hover:text-purple-300 transition-colors" />
                <CardTitle>🤝 Networking</CardTitle>
                <CardDescription className="text-gray-400">
                  Connect with like-minded collaborators and find team members for your next project
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <FileText className="w-8 h-8 text-orange-400 mb-2 group-hover:text-orange-300 transition-colors" />
                <CardTitle>💼 Portfolio Building</CardTitle>
                <CardDescription className="text-gray-400">
                  Build a comprehensive portfolio that showcases your technical skills and project experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <Bell className="w-8 h-8 text-pink-400 mb-2 group-hover:text-pink-300 transition-colors" />
                <CardTitle>� Real-time Engagement</CardTitle>
                <CardDescription className="text-gray-400">
                  Track project views, likes, and feedback to understand what resonates with the community
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-400 text-lg">Discover amazing projects built by our club members</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {projectFilters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white"
                    : "border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center text-gray-400">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-gray-400">
              {activeFilter === "All"
                ? "No projects yet. Be the first to submit!"
                : `No ${activeFilter} projects found.`}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-gray-900/50 border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={project.thumbnail_url || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
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
                            className="text-indigo-400 hover:text-indigo-300 p-1"
                            onClick={() => window.open(project.demo_url!, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-gray-300 p-1"
                          onClick={() => window.location.href = `/projects/${project.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-xl bg-transparent"
            >
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gray-900/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              Ready to Showcase Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join Alterino and connect with driven students, mentors, and builders in our thriving tech community.
            </p>
            {user ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 rounded-xl"
              >
                <Link href="/submit-project">Submit Your Project</Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 rounded-xl"
              >
                <Link href="/signup">Join Our Club</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
