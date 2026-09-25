-- ====================================================================
-- SKRIP DATABASE SUPABASE: PJOK SDI SAIQ AL-HIKMAH
-- Jalankan seluruh script ini di Supabase SQL Editor:
-- ====================================================================

-- 1. Penambahan Kolom Opsional (jika belum ada)
ALTER TABLE IF EXISTS public.assessments ADD COLUMN IF NOT EXISTS class_name text;
ALTER TABLE IF EXISTS public.questions ADD COLUMN IF NOT EXISTS points numeric DEFAULT 10;
ALTER TABLE IF EXISTS public.sessions ADD COLUMN IF NOT EXISTS total_correct integer DEFAULT 0;
ALTER TABLE IF EXISTS public.sessions ADD COLUMN IF NOT EXISTS total_incorrect integer DEFAULT 0;
ALTER TABLE IF EXISTS public.answers ADD COLUMN IF NOT EXISTS is_correct boolean;
ALTER TABLE IF EXISTS public.answers ADD COLUMN IF NOT EXISTS points numeric DEFAULT 0;

-- 2. View Submissions (alias untuk kompatibilitas nama submissions <-> sessions)
CREATE OR REPLACE VIEW public.submissions AS SELECT * FROM public.sessions;

-- 3. Indeks Performa untuk Relasi Antar Tabel
CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON public.questions (assessment_id);
CREATE INDEX IF NOT EXISTS idx_tokens_assessment_id ON public.tokens (assessment_id);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON public.tokens (token);
CREATE INDEX IF NOT EXISTS idx_sessions_assessment_id ON public.sessions (assessment_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions (token);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON public.answers (session_id);

-- 4. Matikan RLS (Row Level Security) atau gunakan Permissive Policy
ALTER TABLE IF EXISTS public.assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.answers DISABLE ROW LEVEL SECURITY;

-- 5. Policy Permissive (Jaga-jaga jika Supabase Security Advisor mewajibkan RLS aktif)
DROP POLICY IF EXISTS "Allow all on assessments" ON public.assessments;
CREATE POLICY "Allow all on assessments" ON public.assessments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on questions" ON public.questions;
CREATE POLICY "Allow all on questions" ON public.questions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on tokens" ON public.tokens;
CREATE POLICY "Allow all on tokens" ON public.tokens FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on sessions" ON public.sessions;
CREATE POLICY "Allow all on sessions" ON public.sessions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on answers" ON public.answers;
CREATE POLICY "Allow all on answers" ON public.answers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. Hak Akses Lengkap ke role anon dan authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.submissions TO anon, authenticated, service_role;
