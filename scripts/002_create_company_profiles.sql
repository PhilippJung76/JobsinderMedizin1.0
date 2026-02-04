-- Create company profiles table
create table if not exists public.company_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  contact_person text,
  email text,
  phone text,
  website text,
  street text,
  postal_code text,
  city text,
  about text,
  logo_url text,
  is_profile_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.company_profiles enable row level security;

-- Create RLS policies for company profiles
create policy "company_profiles_select_own" on public.company_profiles
  for select using (auth.uid() = id);

create policy "company_profiles_insert_own" on public.company_profiles
  for insert with check (auth.uid() = id);

create policy "company_profiles_update_own" on public.company_profiles
  for update using (auth.uid() = id);

create policy "company_profiles_delete_own" on public.company_profiles
  for delete using (auth.uid() = id);

-- Allow public to view public company profiles (for job listings)
create policy "company_profiles_select_public" on public.company_profiles
  for select using (is_profile_public = true);

-- Create trigger to auto-create company profile on signup
create or replace function public.handle_new_company()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only create company profile if user_type is 'company'
  if new.raw_user_meta_data ->> 'user_type' = 'company' then
    insert into public.company_profiles (id, company_name, email)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'company_name', null),
      new.email
    )
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

-- Create trigger for company signup
drop trigger if exists on_auth_company_created on auth.users;

create trigger on_auth_company_created
  after insert on auth.users
  for each row
  execute function public.handle_new_company();

-- Create storage bucket for company logos if not exists
insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

-- Storage policies for company logos
create policy "company_logos_select" on storage.objects
  for select using (bucket_id = 'company-logos');

create policy "company_logos_insert" on storage.objects
  for insert with check (
    bucket_id = 'company-logos' 
    and auth.uid() is not null
  );

create policy "company_logos_update" on storage.objects
  for update using (
    bucket_id = 'company-logos' 
    and auth.uid() is not null
  );

create policy "company_logos_delete" on storage.objects
  for delete using (
    bucket_id = 'company-logos' 
    and auth.uid() is not null
  );
