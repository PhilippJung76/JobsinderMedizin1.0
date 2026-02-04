-- Create jobs table with approval workflow
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT,
  job_type TEXT CHECK (job_type IN ('Vollzeit', 'Teilzeit', 'Minijob', 'Freelance', 'Ausbildung', 'Praktikum')),
  salary_min INTEGER,
  salary_max INTEGER,
  requirements TEXT,
  benefits TEXT,
  is_featured BOOLEAN DEFAULT false,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Companies can view their own jobs (any status)
CREATE POLICY "companies_select_own_jobs" ON public.jobs
  FOR SELECT USING (company_id = auth.uid());

-- Companies can insert their own jobs
CREATE POLICY "companies_insert_own_jobs" ON public.jobs
  FOR INSERT WITH CHECK (company_id = auth.uid());

-- Companies can update their own jobs (resets approval status)
CREATE POLICY "companies_update_own_jobs" ON public.jobs
  FOR UPDATE USING (company_id = auth.uid());

-- Companies can delete their own jobs
CREATE POLICY "companies_delete_own_jobs" ON public.jobs
  FOR DELETE USING (company_id = auth.uid());

-- Public can only view approved jobs
CREATE POLICY "public_view_approved_jobs" ON public.jobs
  FOR SELECT USING (approval_status = 'approved');

-- Admins can view all jobs
CREATE POLICY "admins_view_all_jobs" ON public.jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Admins can update any job (for approval)
CREATE POLICY "admins_update_all_jobs" ON public.jobs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- Function to reset approval status when job is updated by company
CREATE OR REPLACE FUNCTION public.reset_job_approval_on_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only reset if the updater is the company (not an admin)
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()) THEN
    -- Reset approval status to pending if significant fields changed
    IF OLD.title IS DISTINCT FROM NEW.title 
       OR OLD.description IS DISTINCT FROM NEW.description
       OR OLD.category IS DISTINCT FROM NEW.category
       OR OLD.requirements IS DISTINCT FROM NEW.requirements THEN
      NEW.approval_status := 'pending';
      NEW.approved_at := NULL;
      NEW.approved_by := NULL;
      NEW.rejection_reason := NULL;
    END IF;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Trigger to reset approval on job update
DROP TRIGGER IF EXISTS reset_job_approval ON public.jobs;
CREATE TRIGGER reset_job_approval
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.reset_job_approval_on_update();

-- Function to notify admin when new job is posted
CREATE OR REPLACE FUNCTION public.notify_admin_on_new_job()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_email TEXT;
  company_name TEXT;
BEGIN
  -- Get admin email
  SELECT email INTO admin_email FROM public.admin_users LIMIT 1;
  
  -- Get company name
  SELECT cp.company_name INTO company_name 
  FROM public.company_profiles cp 
  WHERE cp.id = NEW.company_id;
  
  IF admin_email IS NOT NULL THEN
    INSERT INTO public.notification_logs (recipient_email, notification_type, subject, related_user_id, metadata)
    VALUES (
      admin_email,
      'new_job',
      'Neue Stellenanzeige zur Freigabe: ' || NEW.title,
      NEW.company_id,
      jsonb_build_object('job_id', NEW.id, 'job_title', NEW.title, 'company_name', company_name)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for new job notification
DROP TRIGGER IF EXISTS notify_on_new_job ON public.jobs;
CREATE TRIGGER notify_on_new_job
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_new_job();
