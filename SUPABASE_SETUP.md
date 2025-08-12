# Alterino Platform - Supabase Integration Setup Guide

This guide will help you set up the Alterino college project showcase platform with Supabase authentication and database functionality.

## Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project
- Git

## 1. Environment Setup

Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**To get these values:**
1. Go to [Supabase](https://supabase.com)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the Project URL and anon public key

## 2. Database Setup

Execute the SQL script in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `/scripts/01-setup-tables.sql`
4. Click "Run" to create all tables, policies, and triggers

This will create:
- `profiles` table for user information
- `projects` table for project data
- `project_likes` table for like functionality
- `project_bookmarks` table for bookmark functionality
- `project_comments` table for comments
- `project_tags` table for project tags
- Row Level Security (RLS) policies
- Automatic triggers for profile creation and like counting

## 3. Authentication Configuration

The platform is configured to use Supabase Auth with:
- Email/password authentication
- Automatic profile creation on signup
- Protected routes for authenticated users

## 4. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 6. Features Overview

### Authentication System
- **Sign Up**: Create new accounts with email and password
- **Sign In**: Login with existing credentials
- **Auto Profile Creation**: User profiles are automatically created upon registration
- **Protected Routes**: Dashboard and project submission require authentication

### Project Management
- **Submit Projects**: Create new projects with details, tech stack, and media
- **Edit Projects**: Update existing projects (owners only)
- **Delete Projects**: Remove projects (owners only)
- **Project Categories**: Web, AI/ML, Mobile, Game, Hardware, Core, Data Science, Blockchain

### Social Features
- **Like Projects**: Heart projects you appreciate
- **Bookmark Projects**: Save projects for later
- **Share Projects**: Share project links
- **Search & Filter**: Find projects by keywords and categories

### User Dashboard
- **Personal Projects**: View and manage your submitted projects
- **Statistics**: Track likes, views, and engagement
- **Quick Actions**: Edit, delete, or view projects

## 7. File Structure Changes

### Updated Files:
- `/lib/supabase.ts` - Supabase client and TypeScript types
- `/lib/api.ts` - Database API functions (NEW)
- `/contexts/auth-context.tsx` - Real Supabase authentication
- `/app/signin/page.tsx` - Updated sign-in flow
- `/app/signup/page.tsx` - Updated sign-up flow
- `/app/projects/page.tsx` - Real project data with search/filter
- `/app/dashboard/page.tsx` - Personal dashboard with statistics
- `/app/submit-project/page.tsx` - Enhanced project submission with editing
- `/app/page.tsx` - Homepage with real data and interactions
- `/scripts/01-setup-tables.sql` - Complete database schema

### Removed Dependencies:
- Mock data and APIs have been replaced with real Supabase integration

## 8. Testing the Integration

1. **Create an Account**: Go to `/signup` and create a new account
2. **Submit a Project**: Use `/submit-project` to add your first project
3. **Browse Projects**: Visit `/projects` to see all submitted projects
4. **Use Social Features**: Like and bookmark projects
5. **Check Dashboard**: View your projects and statistics at `/dashboard`

## 9. Next Steps

### Optional Enhancements:
1. **Image Upload**: Add Supabase Storage for project thumbnails
2. **Email Verification**: Enable email verification in Supabase Auth settings
3. **Comments System**: Implement the comments feature
4. **Analytics**: Add project view tracking
5. **Notifications**: Implement real-time notifications for likes/comments

### Production Deployment:
1. Deploy to Vercel/Netlify with environment variables
2. Configure custom domain in Supabase Auth settings
3. Set up proper email templates in Supabase Auth
4. Enable RLS policies in production

## 10. Troubleshooting

### Common Issues:

**Authentication not working:**
- Check environment variables are correctly set
- Verify Supabase project URL and anon key
- Ensure RLS policies are enabled

**Database errors:**
- Verify all tables and policies were created
- Check Supabase logs in the dashboard
- Ensure user is authenticated for protected operations

**TypeScript errors:**
- Run `npm install` to ensure all dependencies are installed
- Clear Next.js cache: `rm -rf .next`

## 11. API Reference

### Authentication
- `useAuth()` - Hook for authentication state and functions
- `signIn(email, password)` - Sign in user
- `signUp(email, password, name)` - Create new account
- `signOut()` - Sign out user
- `updateProfile(data)` - Update user profile

### Projects API
- `projectsAPI.getProjects(userId?)` - Get all projects
- `projectsAPI.getUserProjects(userId)` - Get user's projects
- `projectsAPI.createProject(data)` - Create new project
- `projectsAPI.updateProject(id, data)` - Update project
- `projectsAPI.deleteProject(id)` - Delete project
- `projectsAPI.searchProjects(query, category?, userId?)` - Search projects

### Social Features
- `likesAPI.toggleLike(userId, projectId)` - Like/unlike project
- `bookmarksAPI.toggleBookmark(userId, projectId)` - Bookmark/unbookmark
- `bookmarksAPI.getUserBookmarks(userId)` - Get user bookmarks

## Support

For issues or questions:
1. Check the Supabase dashboard for database errors
2. Review the browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure the database schema matches the expected structure

The platform is now fully integrated with Supabase and ready for production use!
