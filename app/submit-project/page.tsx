"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { projectsAPI } from "@/lib/api"
import { Loader2, X, Plus, Upload, Eye, AlertCircle, CheckCircle, Github, ExternalLink } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

const categories = [
  { value: "Web", label: "Web Development" },
  { value: "AI/ML", label: "AI/ML" },
  { value: "Mobile", label: "Mobile Development" },
  { value: "Core", label: "Core Engineering" },
  { value: "Game", label: "Game Development" },
  { value: "Hardware", label: "Hardware" },
  { value: "Data Science", label: "Data Science" },
  { value: "Blockchain", label: "Blockchain" },
]

export default function SubmitProjectPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [imagePreviewLoading, setImagePreviewLoading] = useState(false)
  const [imagePreviewError, setImagePreviewError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
      setIsEditing(true)
      setEditingProjectId(editId)
      loadProjectForEdit(editId)
    }
  }, [searchParams])

  const loadProjectForEdit = async (projectId: string) => {
    try {
      const project = await projectsAPI.getProject(projectId, user?.id)
      if (project && project.user_id === user?.id) {
        setTitle(project.title)
        setDescription(project.description || "")
        setCategory(project.category || "")
        setThumbnailUrl(project.thumbnail_url || "")
        setGithubUrl(project.github_url || "")
        setDemoUrl(project.demo_url || "")
        setTechStack(project.tech_stack || [])
      } else {
        toast.error("Project not found or access denied")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error loading project:", error)
      toast.error("Failed to load project")
      router.push("/dashboard")
    }
  }

  const addTechStack = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTechStack = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  const handleTechStackKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechStack()
    }
  }

  const isValidImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes("placeholder.svg") || url.includes("unsplash.com")
  }

  const handleThumbnailChange = (url: string) => {
    setThumbnailUrl(url)
    setImagePreviewError(false)
    if (url && isValidImageUrl(url)) {
      setImagePreviewLoading(true)
    }
  }

  const handleImageLoad = () => {
    setImagePreviewLoading(false)
  }

  const handleImageError = () => {
    setImagePreviewLoading(false)
    setImagePreviewError(true)
  }

  const validateForm = () => {
    if (!title.trim()) {
      setError("Project title is required")
      return false
    }
    if (!category) {
      setError("Please select a category")
      return false
    }
    if (githubUrl && !githubUrl.includes('github.com')) {
      setError("Please enter a valid GitHub URL")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const projectData = {
        title: title.trim(),
        description: description.trim() || null,
        category,
        thumbnail_url: thumbnailUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        tech_stack: techStack.length > 0 ? techStack : null,
        user_id: user.id,
      }

      if (isEditing && editingProjectId) {
        await projectsAPI.updateProject(editingProjectId, projectData)
        toast.success("Project updated successfully!")
      } else {
        await projectsAPI.createProject(projectData)
        toast.success("Project submitted successfully!")
      }

      setSuccess(true)

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      console.error("Error submitting project:", err)
      setError(err.message || "Failed to submit project")
      toast.error(isEditing ? "Failed to update project" : "Failed to submit project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {isEditing ? "Edit Your Project" : "Submit Your Project"}
            </h1>
            <p className="text-gray-400 text-lg">
              {isEditing 
                ? "Update your project information"
                : "Share your amazing project with the Alterino community"
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-700 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Upload className="w-6 h-6 mr-2 text-indigo-400" />
                    Project Details
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill in the information about your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {success ? (
                    <Alert className="bg-green-900/50 border-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-200">
                        Project {isEditing ? "updated" : "submitted"} successfully! Redirecting to dashboard...
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <Alert className="bg-red-900/50 border-red-700">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-red-200">{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-300 font-medium">
                          Project Title *
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-500"
                          placeholder="Enter your project title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300 font-medium">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className="bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-500 resize-none"
                          placeholder="Describe your project, its features, and what makes it special..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-300 font-medium">
                          Category *
                        </Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:border-gray-500 focus:border-indigo-500 transition-all duration-200">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-gray-700">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="githubUrl" className="text-gray-300 font-medium flex items-center">
                            <Github className="w-4 h-4 mr-1" />
                            GitHub URL
                          </Label>
                          <Input
                            id="githubUrl"
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-500"
                            placeholder="https://github.com/username/repo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="demoUrl" className="text-gray-300 font-medium flex items-center">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Demo URL
                          </Label>
                          <Input
                            id="demoUrl"
                            type="url"
                            value={demoUrl}
                            onChange={(e) => setDemoUrl(e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-500"
                            placeholder="https://your-project-demo.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="thumbnail" className="text-gray-300 font-medium">
                          Thumbnail URL (Optional)
                        </Label>
                        <Input
                          id="thumbnail"
                          type="url"
                          value={thumbnailUrl}
                          onChange={(e) => handleThumbnailChange(e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-500"
                          placeholder="https://example.com/image.jpg or try: /placeholder.svg?height=200&width=300&text=My+Project"
                        />
                        <p className="text-xs text-gray-500">Add a thumbnail image to make your project stand out</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300 font-medium">Tech Stack</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 hover:border-gray-500"
                            placeholder="Add technology (e.g., React, Python)"
                            onKeyPress={handleTechStackKeyPress}
                          />
                          <Button
                            type="button"
                            onClick={addTechStack}
                            size="icon"
                            variant="outline"
                            className="border-gray-600 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all duration-200 bg-transparent"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {techStack.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeTechStack(tech)}
                                className="ml-2 hover:text-red-400 transition-colors duration-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isEditing ? "Updating Project..." : "Submitting Project..."}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {isEditing ? "Update Project" : "Submit Project"}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/50 border-gray-700 shadow-2xl sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-cyan-400" />
                    Live Preview
                  </CardTitle>
                  <CardDescription className="text-gray-400">See how your project will appear</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Thumbnail Preview */}
                  <div className="relative">
                    {thumbnailUrl && isValidImageUrl(thumbnailUrl) ? (
                      <div className="relative">
                        {imagePreviewLoading && (
                          <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                          </div>
                        )}
                        <Image
                          src={thumbnailUrl || "/placeholder.svg"}
                          alt="Project thumbnail"
                          width={300}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                        {imagePreviewError && (
                          <div className="absolute inset-0 bg-red-900/20 border border-red-700 rounded-lg flex items-center justify-center">
                            <p className="text-red-400 text-sm">Failed to load image</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg border border-gray-700 flex items-center justify-center">
                        <div className="text-gray-500 text-2xl">📁</div>
                      </div>
                    )}
                  </div>

                  {/* Project Info Preview */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate">{title || "Project Title"}</h3>
                      {category && (
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300 mt-1">
                          {category}
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-3">
                      {description || "Project description will appear here..."}
                    </p>

                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {techStack.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {tech}
                          </Badge>
                        ))}
                        {techStack.length > 4 && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            +{techStack.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Links Preview */}
                    {(githubUrl || demoUrl) && (
                      <div className="flex gap-2 pt-2">
                        {githubUrl && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            <Github className="w-3 h-3 mr-1" />
                            GitHub
                          </Badge>
                        )}
                        {demoUrl && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Demo
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
