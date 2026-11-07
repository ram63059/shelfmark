-- Shelfmark Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database tables.

-- Cached scan results (keyed by domain, 24h TTL managed by application)
CREATE TABLE IF NOT EXISTS scans (
  id BIGSERIAL PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  report_json JSONB NOT NULL,
  product_count INTEGER NOT NULL DEFAULT 0,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scans_domain ON scans (domain);
CREATE INDEX idx_scans_scanned_at ON scans (scanned_at);

-- Waitlist emails
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_waitlist_email ON waitlist (email);

-- Rate limiting: scan events per IP
CREATE TABLE IF NOT EXISTS scan_events (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scan_events_ip_created ON scan_events (ip, created_at);

-- Generic event tracking (replaces third-party analytics)
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_name ON events (event_name);
CREATE INDEX idx_events_created ON events (created_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and reads for the app
-- (since we're using the anon key from a server-side API route)
CREATE POLICY "Allow anonymous read scans" ON scans FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert scans" ON scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update scans" ON scans FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous insert waitlist" ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous read waitlist" ON waitlist FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert scan_events" ON scan_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous read scan_events" ON scan_events FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert events" ON events FOR INSERT WITH CHECK (true);
