export type Project = {
  id: string
  title: string
  description: string
  category: string
  tech_stack: string[]
  thumbnail_url: string | null
  created_at: string
  profiles: {
    name: string
  }
}

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "StudyBuddy AI",
    description:
      "AI-powered study planner that creates personalized schedules and tracks learning progress with machine learning algorithms.",
    category: "AI/ML",
    tech_stack: ["Python", "TensorFlow", "React", "Flask", "PostgreSQL"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=StudyBuddy+AI",
    created_at: "2024-01-15T10:30:00Z",
    profiles: { name: "Arjun Patel" },
  },
  {
    id: "2",
    title: "CampusConnect",
    description:
      "Social networking platform connecting students across different clubs and organizations with real-time messaging.",
    category: "Web",
    tech_stack: ["React", "Node.js", "MongoDB", "Socket.io", "Express"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=CampusConnect",
    created_at: "2024-01-12T14:20:00Z",
    profiles: { name: "Priya Sharma" },
  },
  {
    id: "3",
    title: "AttendanceAI",
    description:
      "Face recognition-based attendance system using computer vision to automatically mark student attendance.",
    category: "AI/ML",
    tech_stack: ["Python", "OpenCV", "TensorFlow", "Django", "SQLite"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=AttendanceAI",
    created_at: "2024-01-10T09:15:00Z",
    profiles: { name: "Rohit Kumar" },
  },
  {
    id: "4",
    title: "GameForge 2D",
    description:
      "2D game development framework with visual scripting tools and physics engine for indie game developers.",
    category: "Game",
    tech_stack: ["C#", "Unity", "Visual Scripting", "Box2D"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=GameForge+2D",
    created_at: "2024-01-08T16:45:00Z",
    profiles: { name: "Sneha Reddy" },
  },
  {
    id: "5",
    title: "SmartDorm IoT",
    description: "IoT-based dorm automation system with ML-powered energy optimization and smart device control.",
    category: "Hardware",
    tech_stack: ["Arduino", "Python", "IoT", "Machine Learning", "MQTT"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=SmartDorm+IoT",
    created_at: "2024-01-05T11:30:00Z",
    profiles: { name: "Vikram Singh" },
  },
  {
    id: "6",
    title: "CampusMarket",
    description:
      "C2C marketplace for college students to buy, sell, and exchange textbooks, electronics, and other items.",
    category: "Web",
    tech_stack: ["React Native", "Firebase", "Stripe", "Node.js", "Express"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=CampusMarket",
    created_at: "2024-01-03T13:20:00Z",
    profiles: { name: "Ananya Gupta" },
  },
  {
    id: "7",
    title: "BridgeCAD",
    description: "Structural analysis software for bridge design with finite element analysis and 3D visualization.",
    category: "Core",
    tech_stack: ["C++", "OpenGL", "Qt", "MATLAB", "FEA"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=BridgeCAD",
    created_at: "2024-01-01T08:00:00Z",
    profiles: { name: "Rajesh Mehta" },
  },
  {
    id: "8",
    title: "EcoTracker",
    description: "Mobile app for tracking personal carbon footprint with gamification and community challenges.",
    category: "Web",
    tech_stack: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    thumbnail_url: "/placeholder.svg?height=200&width=300&text=EcoTracker",
    created_at: "2023-12-28T15:10:00Z",
    profiles: { name: "Maya Patel" },
  },
]

// Mock API functions
export const mockAPI = {
  getProjects: async (): Promise<Project[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockProjects
  },

  submitProject: async (projectData: any): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate random success/failure for demo
    if (Math.random() > 0.1) {
      // 90% success rate
      return { success: true }
    } else {
      return { success: false, error: "Network error occurred. Please try again." }
    }
  },
}
