-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  email text,
  github_url text,
  avatar_url text,
  bio text,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

-- Create projects table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  title text not null,
  description text,
  tech_stack text[],
  category text,
  thumbnail_url text,
  github_url text,
  demo_url text,
  featured boolean default false,
  likes_count integer default 0,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

-- Create project_likes table
create table if not exists project_likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  created_at timestamp default current_timestamp,
  unique(user_id, project_id)
);

-- Create project_bookmarks table
create table if not exists project_bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  created_at timestamp default current_timestamp,
  unique(user_id, project_id)
);

-- Create project_comments table
create table if not exists project_comments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  content text not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

-- Create project_tags table
create table if not exists project_tags (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  tag text not null,
  created_at timestamp default current_timestamp
);

-- Create indexes for better performance
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_projects_category on projects(category);
create index if not exists idx_projects_featured on projects(featured);
create index if not exists idx_project_likes_user_id on project_likes(user_id);
create index if not exists idx_project_likes_project_id on project_likes(project_id);
create index if not exists idx_project_bookmarks_user_id on project_bookmarks(user_id);
create index if not exists idx_project_comments_project_id on project_comments(project_id);
create index if not exists idx_project_tags_project_id on project_tags(project_id);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_likes enable row level security;
alter table project_bookmarks enable row level security;
alter table project_comments enable row level security;
alter table project_tags enable row level security;

-- Create policies for profiles
create policy "Users can view all profiles" on profiles
  for select using (true);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- Create policies for projects
create policy "Anyone can view projects" on projects
  for select using (true);

create policy "Users can insert their own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

-- Create policies for project_likes
create policy "Anyone can view project likes" on project_likes
  for select using (true);

create policy "Users can like projects" on project_likes
  for insert with check (auth.uid() = user_id);

create policy "Users can unlike their own likes" on project_likes
  for delete using (auth.uid() = user_id);

-- Create policies for project_bookmarks
create policy "Users can view their own bookmarks" on project_bookmarks
  for select using (auth.uid() = user_id);

create policy "Users can bookmark projects" on project_bookmarks
  for insert with check (auth.uid() = user_id);

create policy "Users can remove their own bookmarks" on project_bookmarks
  for delete using (auth.uid() = user_id);

-- Create policies for project_comments
create policy "Anyone can view comments" on project_comments
  for select using (true);

create policy "Users can insert their own comments" on project_comments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments" on project_comments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own comments" on project_comments
  for delete using (auth.uid() = user_id);

-- Create policies for project_tags
create policy "Anyone can view project tags" on project_tags
  for select using (true);

create policy "Project owners can manage tags" on project_tags
  for all using (
    exists (
      select 1 from projects 
      where projects.id = project_tags.project_id 
      and projects.user_id = auth.uid()
    )
  );

-- Create function to automatically update likes_count
create or replace function update_project_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update projects 
    set likes_count = likes_count + 1 
    where id = NEW.project_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update projects 
    set likes_count = likes_count - 1 
    where id = OLD.project_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Create trigger for likes count
drop trigger if exists trigger_update_project_likes_count on project_likes;
create trigger trigger_update_project_likes_count
  after insert or delete on project_likes
  for each row execute function update_project_likes_count();

-- Create function to handle profile creation
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for automatic profile creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = current_timestamp;
  return NEW;
end;
$$ language plpgsql;

-- Create triggers for updated_at
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

drop trigger if exists update_projects_updated_at on projects;
create trigger update_projects_updated_at
  before update on projects
  for each row execute function update_updated_at_column();

drop trigger if exists update_project_comments_updated_at on project_comments;
create trigger update_project_comments_updated_at
  before update on project_comments
  for each row execute function update_updated_at_column();
