-- ====================================================================
-- SCRIPT LENGKAP: DISABLE RLS & PERMISSIIVE POLICIES SUPABASE
-- Jalankan seluruh script ini di Supabase SQL Editor untuk membuka akses CRUD:
-- ====================================================================

-- 1. Matikan RLS (Row Level Security) untuk semua tabel
ALTER TABLE IF EXISTS public.assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.answers DISABLE ROW LEVEL SECURITY;

-- 2. Buat Policy Permissive (Jaga-jaga jika Supabase Security Advisor mewajibkan RLS aktif)
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

-- 3. Berikan hak akses penuh ke role anon dan authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
