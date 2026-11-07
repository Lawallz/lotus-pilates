-- 001_initial_studio_management.sql
-- Lotus Pilates: initial data model for staff-managed clients, classes and bookings.
-- Access must go through an authenticated server/API; never expose database credentials in the browser.

CREATE TABLE IF NOT EXISTS public.studio_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (length(trim(full_name)) BETWEEN 2 AND 160),
  email text,
  phone text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS studio_clients_email_lower_uq
  ON public.studio_clients (lower(email))
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS studio_clients_name_idx
  ON public.studio_clients (lower(full_name));

CREATE TABLE IF NOT EXISTS public.class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 2 AND 120),
  instructor_name text NOT NULL CHECK (length(trim(instructor_name)) BETWEEN 2 AND 160),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  capacity smallint NOT NULL CHECK (capacity BETWEEN 1 AND 100),
  status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS class_sessions_starts_at_idx
  ON public.class_sessions (starts_at)
  WHERE status = 'scheduled';

CREATE TABLE IF NOT EXISTS public.class_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_session_id uuid NOT NULL
    REFERENCES public.class_sessions(id) ON DELETE RESTRICT,
  client_id uuid NOT NULL
    REFERENCES public.studio_clients(id) ON DELETE RESTRICT,
  source text NOT NULL DEFAULT 'direct'
    CHECK (source IN ('direct', 'wellhub', 'totalpass', 'classpass')),
  source_booking_ref text,
  status text NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
  booked_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (status = 'cancelled' AND cancelled_at IS NOT NULL)
    OR (status <> 'cancelled' AND cancelled_at IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS class_bookings_active_client_session_uq
  ON public.class_bookings (class_session_id, client_id)
  WHERE status IN ('confirmed', 'attended', 'no_show');

CREATE UNIQUE INDEX IF NOT EXISTS class_bookings_external_ref_uq
  ON public.class_bookings (source, source_booking_ref)
  WHERE source_booking_ref IS NOT NULL;

CREATE INDEX IF NOT EXISTS class_bookings_session_status_idx
  ON public.class_bookings (class_session_id, status);

CREATE INDEX IF NOT EXISTS class_bookings_client_booked_idx
  ON public.class_bookings (client_id, booked_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER studio_clients_set_updated_at
  BEFORE UPDATE ON public.studio_clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER class_sessions_set_updated_at
  BEFORE UPDATE ON public.class_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER class_bookings_set_updated_at
  BEFORE UPDATE ON public.class_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Serialize bookings per class so concurrent requests cannot exceed capacity.
CREATE OR REPLACE FUNCTION public.reserve_class_session(
  p_client_id uuid,
  p_class_session_id uuid,
  p_source text DEFAULT 'direct',
  p_source_booking_ref text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_capacity smallint;
  v_session_status text;
  v_booking_id uuid;
  v_active_count integer;
BEGIN
  IF p_source NOT IN ('direct', 'wellhub', 'totalpass', 'classpass') THEN
    RAISE EXCEPTION 'Unsupported booking source'
      USING ERRCODE = '22023';
  END IF;

  IF p_source_booking_ref IS NOT NULL THEN
    SELECT id INTO v_booking_id
    FROM public.class_bookings
    WHERE source = p_source
      AND source_booking_ref = p_source_booking_ref;

    IF v_booking_id IS NOT NULL THEN
      RETURN v_booking_id;
    END IF;
  END IF;

  SELECT capacity, status
    INTO v_capacity, v_session_status
  FROM public.class_sessions
  WHERE id = p_class_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Class session not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF v_session_status <> 'scheduled' THEN
    RAISE EXCEPTION 'Class session is not open for booking'
      USING ERRCODE = '55000';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.studio_clients
    WHERE id = p_client_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Active client not found'
      USING ERRCODE = 'P0002';
  END IF;

  SELECT count(*) INTO v_active_count
  FROM public.class_bookings
  WHERE class_session_id = p_class_session_id
    AND status IN ('confirmed', 'attended', 'no_show');

  IF v_active_count >= v_capacity THEN
    RAISE EXCEPTION 'Class session is full'
      USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.class_bookings (
    class_session_id, client_id, source, source_booking_ref
  )
  VALUES (
    p_class_session_id, p_client_id, p_source, p_source_booking_ref
  )
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$;
