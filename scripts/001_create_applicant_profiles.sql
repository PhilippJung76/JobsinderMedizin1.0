-- Create applicant_profiles table
create table if not exists public.applicant_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  profession text,
  experience text,
  education text,
  about_me text,
  city text,
  profile_image_url text,
  resume_url text,
  is_profile_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.applicant_profiles enable row level security;

-- RLS Policies
create policy "applicant_profiles_select_own" on public.applicant_profiles 
  for select using (auth.uid() = id);

create policy "applicant_profiles_insert_own" on public.applicant_profiles 
  for insert with check (auth.uid() = id);

create policy "applicant_profiles_update_own" on public.applicant_profiles 
  for update using (auth.uid() = id);

create policy "applicant_profiles_delete_own" on public.applicant_profiles 
  for delete using (auth.uid() = id);

-- Allow employers to view public profiles
create policy "applicant_profiles_select_public" on public.applicant_profiles 
  for select using (is_profile_public = true);

-- Trigger function to auto-create profile on user signup
create or replace function public.handle_new_applicant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.applicant_profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop existing trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_applicant();

-- Create storage bucket for profile images and resumes
insert into storage.buckets (id, name, public) 
values ('applicant-files', 'applicant-files', true)
on conflict (id) do nothing;

-- Storage policies for applicant files
create policy "Users can upload their own files" on storage.objects 
  for insert with check (
    bucket_id = 'applicant-files' and 
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own files" on storage.objects 
  for update using (
    bucket_id = 'applicant-files' and 
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own files" on storage.objects 
  for delete using (
    bucket_id = 'applicant-files' and 
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view applicant files" on storage.objects 
  for select using (bucket_id = 'applicant-files');
