-- 1. Create a table for user profiles
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'patient'::text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create a table for provider applications
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  specialty text not null,
  experience text not null,
  status text default 'pending'::text, -- pending, approved, rejected
  cv_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Set up Row Level Security (RLS)
-- Enable RLS
alter table public.users enable row level security;
alter table public.applications enable row level security;

-- Policies for users table
-- Allow users to view their own profile
create policy "Users can view their own profile" 
on public.users for select 
using ( auth.uid() = id );

-- Allow users to update their own profile
create policy "Users can update their own profile" 
on public.users for update 
using ( auth.uid() = id );

-- Allow admins to read all users (Assuming admin uses the sahacare@gmail.com bypass in code, or has an admin role)
create policy "Admins can view all users"
on public.users for select
using ( (select role from public.users where id = auth.uid()) = 'admin' );

-- Policies for applications table
-- Allow users to insert their own applications
create policy "Users can create their own applications"
on public.applications for insert
with check ( auth.uid() = user_id );

-- Allow users to read their own applications
create policy "Users can view their own applications"
on public.applications for select
using ( auth.uid() = user_id );

-- Allow admins to read all applications
create policy "Admins can view all applications"
on public.applications for select
using ( (select role from public.users where id = auth.uid()) = 'admin' );

-- 4. Trigger to automatically create a profile in public.users when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
