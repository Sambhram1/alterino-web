import { supabase } from './supabase'
import type { Database, Profile, Project, ProjectComment } from './supabase'

// Projects API
export const projectsAPI = {
  // Get all projects with profiles and user interaction status
  async getProjects(userId?: string): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error

    // If user is authenticated, check likes and bookmarks
    if (userId && data) {
      const projectIds = data.map(p => p.id)
      
      const [likesResult, bookmarksResult] = await Promise.all([
        supabase
          .from('project_likes')
          .select('project_id')
          .eq('user_id', userId)
          .in('project_id', projectIds),
        supabase
          .from('project_bookmarks')
          .select('project_id')
          .eq('user_id', userId)
          .in('project_id', projectIds)
      ])

      const likedProjectIds = new Set(likesResult.data?.map(l => l.project_id) || [])
      const bookmarkedProjectIds = new Set(bookmarksResult.data?.map(b => b.project_id) || [])

      return data.map(project => ({
        ...project,
        is_liked: likedProjectIds.has(project.id),
        is_bookmarked: bookmarkedProjectIds.has(project.id)
      }))
    }

    return data || []
  },

  // Get projects by user
  async getUserProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get project by ID
  async getProject(id: string, userId?: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url,
          github_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (userId && data) {
      const [likesResult, bookmarksResult] = await Promise.all([
        supabase
          .from('project_likes')
          .select('id')
          .eq('user_id', userId)
          .eq('project_id', id)
          .single(),
        supabase
          .from('project_bookmarks')
          .select('id')
          .eq('user_id', userId)
          .eq('project_id', id)
          .single()
      ])

      return {
        ...data,
        is_liked: !likesResult.error,
        is_bookmarked: !bookmarksResult.error
      }
    }

    return data
  },

  // Create project
  async createProject(projectData: Database['public']['Tables']['projects']['Insert']): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  // Update project
  async updateProject(id: string, projectData: Database['public']['Tables']['projects']['Update']): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...projectData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Search projects
  async searchProjects(query: string, category?: string, userId?: string): Promise<Project[]> {
    let dbQuery = supabase
      .from('projects')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)

    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    dbQuery = dbQuery.order('created_at', { ascending: false })

    const { data, error } = await dbQuery

    if (error) throw error

    // Add user interaction status if authenticated
    if (userId && data) {
      const projectIds = data.map(p => p.id)
      
      const [likesResult, bookmarksResult] = await Promise.all([
        supabase
          .from('project_likes')
          .select('project_id')
          .eq('user_id', userId)
          .in('project_id', projectIds),
        supabase
          .from('project_bookmarks')
          .select('project_id')
          .eq('user_id', userId)
          .in('project_id', projectIds)
      ])

      const likedProjectIds = new Set(likesResult.data?.map(l => l.project_id) || [])
      const bookmarkedProjectIds = new Set(bookmarksResult.data?.map(b => b.project_id) || [])

      return data.map(project => ({
        ...project,
        is_liked: likedProjectIds.has(project.id),
        is_bookmarked: bookmarkedProjectIds.has(project.id)
      }))
    }

    return data || []
  }
}

// Likes API
export const likesAPI = {
  async toggleLike(userId: string, projectId: string): Promise<boolean> {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('project_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('project_likes')
        .delete()
        .eq('user_id', userId)
        .eq('project_id', projectId)

      if (error) throw error
      return false
    } else {
      // Like
      const { error } = await supabase
        .from('project_likes')
        .insert({ user_id: userId, project_id: projectId })

      if (error) throw error
      return true
    }
  }
}

// Bookmarks API
export const bookmarksAPI = {
  async toggleBookmark(userId: string, projectId: string): Promise<boolean> {
    // Check if already bookmarked
    const { data: existingBookmark } = await supabase
      .from('project_bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single()

    if (existingBookmark) {
      // Remove bookmark
      const { error } = await supabase
        .from('project_bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('project_id', projectId)

      if (error) throw error
      return false
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('project_bookmarks')
        .insert({ user_id: userId, project_id: projectId })

      if (error) throw error
      return true
    }
  },

  async getUserBookmarks(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('project_bookmarks')
      .select(`
        projects (
          *,
          profiles:user_id (
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(bookmark => (bookmark as any).projects as Project).filter(Boolean) || []
  }
}

// Comments API
export const commentsAPI = {
  async getProjectComments(projectId: string): Promise<ProjectComment[]> {
    const { data, error } = await supabase
      .from('project_comments')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createComment(userId: string, projectId: string, content: string): Promise<ProjectComment> {
    const { data, error } = await supabase
      .from('project_comments')
      .insert({
        user_id: userId,
        project_id: projectId,
        content
      })
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateComment(commentId: string, content: string): Promise<ProjectComment> {
    const { data, error } = await supabase
      .from('project_comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('project_comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error
  }
}

// Profiles API
export const profilesAPI = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(userId: string, profileData: Database['public']['Tables']['profiles']['Update']): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...profileData, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  async createProfile(profileData: Database['public']['Tables']['profiles']['Insert']): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select('*')
      .single()

    if (error) throw error
    return data
  }
}
