-- Expand studio operations: client records, payments, waitlist and capacity-safe reservations.
ALTER TABLE public.studio_clients
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS plan_name text,
  ADD COLUMN IF NOT EXISTS plan_monthly_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS plan_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS next_payment_date date;

DO $$ BEGIN
  ALTER TABLE public.studio_clients
    ADD CONSTRAINT studio_clients_plan_status_check
    CHECK (plan_status IN ('active', 'paused', 'ended'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.studio_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.studio_clients(id) ON DELETE RESTRICT,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  due_date date NOT NULL,
  paid_at timestamptz,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  method text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'paid' AND paid_at IS NOT NULL) OR (status <> 'paid' AND paid_at IS NULL))
);
CREATE INDEX IF NOT EXISTS studio_payments_client_due_idx
  ON public.studio_payments (client_id, due_date DESC);
CREATE INDEX IF NOT EXISTS studio_payments_status_due_idx
  ON public.studio_payments (status, due_date);

DROP TRIGGER IF EXISTS studio_payments_set_updated_at ON public.studio_payments;
CREATE TRIGGER studio_payments_set_updated_at
  BEFORE UPDATE ON public.studio_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.class_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_session_id uuid NOT NULL REFERENCES public.class_sessions(id) ON DELETE RESTRICT,
  client_id uuid NOT NULL REFERENCES public.studio_clients(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'offered', 'converted', 'cancelled')),
  queued_at timestamptz NOT NULL DEFAULT now(),
  offered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'offered' AND offered_at IS NOT NULL) OR status <> 'offered')
);
CREATE UNIQUE INDEX IF NOT EXISTS class_waitlist_active_pair_uq
  ON public.class_waitlist (class_session_id, client_id)
  WHERE status IN ('waiting', 'offered');
CREATE INDEX IF NOT EXISTS class_waitlist_fifo_idx
  ON public.class_waitlist (class_session_id, queued_at)
  WHERE status = 'waiting';
DROP TRIGGER IF EXISTS class_waitlist_set_updated_at ON public.class_waitlist;
CREATE TRIGGER class_waitlist_set_updated_at
  BEFORE UPDATE ON public.class_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- A pending offer holds a vacancy until staff converts or cancels it.
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
    RAISE EXCEPTION 'Unsupported booking source' USING ERRCODE = '22023';
  END IF;
  IF p_source_booking_ref IS NOT NULL THEN
    SELECT id INTO v_booking_id FROM public.class_bookings
    WHERE source = p_source AND source_booking_ref = p_source_booking_ref;
    IF v_booking_id IS NOT NULL THEN RETURN v_booking_id; END IF;
  END IF;
  SELECT capacity, status INTO v_capacity, v_session_status
  FROM public.class_sessions WHERE id = p_class_session_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Class session not found' USING ERRCODE = 'P0002'; END IF;
  IF v_session_status <> 'scheduled' THEN RAISE EXCEPTION 'Class session is not open for booking' USING ERRCODE = '55000'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.studio_clients WHERE id = p_client_id AND status = 'active') THEN
    RAISE EXCEPTION 'Active client not found' USING ERRCODE = 'P0002';
  END IF;
  SELECT
    (SELECT count(*) FROM public.class_bookings
     WHERE class_session_id = p_class_session_id AND status IN ('confirmed', 'attended', 'no_show'))
    +
    (SELECT count(*) FROM public.class_waitlist
     WHERE class_session_id = p_class_session_id AND status = 'offered')
  INTO v_active_count;
  IF v_active_count >= v_capacity THEN RAISE EXCEPTION 'Class session is full' USING ERRCODE = '23514'; END IF;
  INSERT INTO public.class_bookings (class_session_id, client_id, source, source_booking_ref)
  VALUES (p_class_session_id, p_client_id, p_source, p_source_booking_ref)
  RETURNING id INTO v_booking_id;
  RETURN v_booking_id;
END;
$$;
