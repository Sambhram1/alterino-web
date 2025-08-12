import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          github_url: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          github_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          github_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          tech_stack: string[] | null
          category: string | null
          thumbnail_url: string | null
          github_url: string | null
          demo_url: string | null
          featured: boolean
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          tech_stack?: string[] | null
          category?: string | null
          thumbnail_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          featured?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          tech_stack?: string[] | null
          category?: string | null
          thumbnail_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          featured?: boolean
          likes_count?: number
          updated_at?: string
        }
      }
      project_likes: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
        }
      }
      project_bookmarks: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
        }
      }
      project_comments: {
        Row: {
          id: string
          user_id: string
          project_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          updated_at?: string
        }
      }
      project_tags: {
        Row: {
          id: string
          project_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          tag?: string
        }
      }
    }
  }
}

// Type definitions for the application
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles?: Profile | null
  is_liked?: boolean
  is_bookmarked?: boolean
}
export type ProjectLike = Database['public']['Tables']['project_likes']['Row']
export type ProjectBookmark = Database['public']['Tables']['project_bookmarks']['Row']
export type ProjectComment = Database['public']['Tables']['project_comments']['Row'] & {
  profiles?: Profile | null
}
export type ProjectTag = Database['public']['Tables']['project_tags']['Row']
