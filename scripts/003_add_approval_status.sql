-- Add approval status to applicant_profiles
ALTER TABLE public.applicant_profiles
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add approval status to company_profiles  
ALTER TABLE public.company_profiles
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create admin_users table to track who can approve
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin_users table
CREATE POLICY "admins_select_own" ON public.admin_users 
  FOR SELECT USING (auth.uid() = id);

-- Create notification_logs table to track sent emails
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  related_user_id UUID,
  metadata JSONB
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view notification logs (we'll handle this via service role)
CREATE POLICY "admins_view_notifications" ON public.notification_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Update RLS policies: Only show approved profiles publicly
-- Drop existing select policies first
DROP POLICY IF EXISTS "profiles_select_own" ON public.applicant_profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.company_profiles;

-- Applicants can see their own profile regardless of status
CREATE POLICY "applicants_select_own" ON public.applicant_profiles 
  FOR SELECT USING (auth.uid() = id);

-- Companies can see their own profile regardless of status
CREATE POLICY "companies_select_own" ON public.company_profiles 
  FOR SELECT USING (auth.uid() = id);

-- Public can only see approved applicant profiles (for employer browsing)
CREATE POLICY "public_view_approved_applicants" ON public.applicant_profiles
  FOR SELECT USING (approval_status = 'approved' AND is_profile_public = true);

-- Public can only see approved company profiles
CREATE POLICY "public_view_approved_companies" ON public.company_profiles
  FOR SELECT USING (approval_status = 'approved');

-- Admin policies for viewing all profiles
CREATE POLICY "admins_view_all_applicants" ON public.applicant_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "admins_view_all_companies" ON public.company_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Admin policies for updating approval status
CREATE POLICY "admins_update_applicants" ON public.applicant_profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "admins_update_companies" ON public.company_profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );
