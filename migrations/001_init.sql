CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE application_status AS ENUM (
  'draft',
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'ghosted',
  'withdrawn'
);

CREATE TYPE compensation_type AS ENUM (
  'salary',
  'hourly'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email TEXT,
  name TEXT,
  avatar_url TEXT,

  -- App preferences (agent + UI controlled)
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size_bytes INTEGER,

  -- R2 storage
  r2_key TEXT NOT NULL UNIQUE,
  r2_bucket TEXT,

  -- AI metadata
  parsed_text TEXT,
  ai_summary TEXT,
  ai_tags TEXT[] NOT NULL DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Job info
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT,
  job_url TEXT,
  job_description TEXT,

  -- Compensation
  compensation_type compensation_type,
  pay_min INTEGER,
  pay_max INTEGER,
  currency TEXT DEFAULT 'USD',

  -- Status
  status application_status NOT NULL DEFAULT 'draft',
  status_changed_at TIMESTAMPTZ,

  -- AI-generated fields
  ai_labels TEXT[] NOT NULL DEFAULT '{}',
  ai_match_score NUMERIC(5,2), -- 0–100
  ai_notes TEXT,
  ai_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Resume linkage
  resume_used_id UUID REFERENCES resumes(id),

  -- Source of application
  source TEXT NOT NULL DEFAULT 'manual', -- manual | ai | imported | referral

  -- Timestamps
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  color TEXT,
  source TEXT NOT NULL DEFAULT 'user', -- user | ai

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, name)
);

CREATE TABLE application_labels (
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,

  PRIMARY KEY (application_id, label_id)
);

CREATE TABLE application_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL,
  -- examples:
  -- status_changed, interview_scheduled, note_added, offer_received

  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NOT NULL DEFAULT 'user', -- user | ai | system

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Applications
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_company ON applications(company);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);

-- Events
CREATE INDEX idx_application_events_app ON application_events(application_id);
CREATE INDEX idx_application_events_type ON application_events(event_type);

-- Labels
CREATE INDEX idx_labels_user ON labels(user_id);