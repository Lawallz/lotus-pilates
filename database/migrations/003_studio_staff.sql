-- Instructor account mapping for role-scoped access to the studio agenda.
CREATE TABLE IF NOT EXISTS public.studio_staff (
  user_id uuid PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'instructor' CHECK (role = 'instructor'),
  instructor_name text NOT NULL CHECK (length(trim(instructor_name)) BETWEEN 2 AND 160),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS studio_staff_set_updated_at ON public.studio_staff;
CREATE TRIGGER studio_staff_set_updated_at
  BEFORE UPDATE ON public.studio_staff
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
