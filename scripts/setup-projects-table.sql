-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (if not exists)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  email text,
  created_at timestamp default current_timestamp
);

-- Create projects table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  title text not null,
  description text,
  tech_stack text[],
  category text, -- Web, AI/ML, Core, Game, Hardware
  thumbnail_url text,
  created_at timestamp default current_timestamp
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table projects enable row level security;

-- Create policies for profiles
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

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
