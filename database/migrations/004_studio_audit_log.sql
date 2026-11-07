-- Keep an append-only record of administrative and instructor actions.
CREATE TABLE IF NOT EXISTS public.studio_audit_log (
  id bigserial PRIMARY KEY,
  actor_user_id uuid,
  actor_email text NOT NULL,
  action text NOT NULL CHECK (length(action) BETWEEN 1 AND 80),
  entity_type text NOT NULL CHECK (length(entity_type) BETWEEN 1 AND 80),
  entity_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS studio_audit_log_created_at_idx
  ON public.studio_audit_log (created_at DESC);

CREATE INDEX IF NOT EXISTS studio_audit_log_entity_idx
  ON public.studio_audit_log (entity_type, entity_id, created_at DESC);
