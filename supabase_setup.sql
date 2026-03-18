-- Run this in Supabase SQL Editor (https://app.supabase.com → SQL Editor)

-- 1. Click counts table
CREATE TABLE click_counts (
  project_id TEXT PRIMARY KEY,
  count      INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE click_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON click_counts FOR SELECT USING (true);
CREATE POLICY "public insert" ON click_counts FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON click_counts FOR UPDATE USING (true);

-- 2. Comments table
CREATE TABLE comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  text       TEXT        NOT NULL CHECK (char_length(text) <= 300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON comments FOR SELECT USING (true);
CREATE POLICY "public insert" ON comments FOR INSERT WITH CHECK (true);

-- 3. Atomic click increment function (prevents race conditions)
CREATE OR REPLACE FUNCTION increment_click(p_project_id TEXT)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO click_counts (project_id, count)
  VALUES (p_project_id, 1)
  ON CONFLICT (project_id)
  DO UPDATE SET count = click_counts.count + 1;
END;
$$;
