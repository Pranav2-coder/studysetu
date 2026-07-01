-- ==============================================================================
-- STUDYSETU / EDUFINDER SUPABASE SCHEMA
-- Run this entire script in your Supabase SQL Editor to set up your project.
-- ==============================================================================

-- 1. Create Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    class TEXT,
    subject TEXT,
    area TEXT,
    budget TEXT,
    institute_id TEXT,
    institute_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Institutes Table
CREATE TABLE IF NOT EXISTS public.institutes (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    subjects TEXT[] DEFAULT '{}',
    classes_covered TEXT[] DEFAULT '{}',
    area TEXT,
    address TEXT,
    fees TEXT,
    fees_value NUMERIC DEFAULT 0,
    timings TEXT,
    experience TEXT,
    expertise TEXT,
    phone TEXT,
    whatsapp TEXT,
    cover_image TEXT,
    images TEXT[] DEFAULT '{}',
    students_enrolled NUMERIC DEFAULT 0,
    facilities TEXT[] DEFAULT '{}',
    faculty JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Keep existing projects in sync when this script is run again.
ALTER TABLE public.institutes
    ADD COLUMN IF NOT EXISTS expertise TEXT,
    ADD COLUMN IF NOT EXISTS students_enrolled NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS facilities TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS faculty JSONB DEFAULT '[]'::jsonb;

-- 4. Create Institute Analytics Table
CREATE TABLE IF NOT EXISTS public.institute_analytics (
    institute_id TEXT PRIMARY KEY REFERENCES public.institutes(id) ON DELETE CASCADE,
    views NUMERIC DEFAULT 0,
    whatsapp_clicks NUMERIC DEFAULT 0,
    call_clicks NUMERIC DEFAULT 0,
    qr_scans NUMERIC DEFAULT 0
);

-- ==============================================================================
-- CONFIGURE ROW LEVEL SECURITY (RLS) FOR DATABASE TABLES
-- Since the application uses the anonymous key from the frontend, we need to 
-- allow anonymous inserts and selects.
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institute_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for Inquiries (Allow anon insert, deny read unless authenticated)
DROP POLICY IF EXISTS "Allow public insert to inquiries" ON public.inquiries;
CREATE POLICY "Allow public insert to inquiries" ON public.inquiries FOR INSERT TO anon WITH CHECK (true);

-- Policies for Contacts (Allow anon insert, deny read unless authenticated)
DROP POLICY IF EXISTS "Allow public insert to contacts" ON public.contacts;
CREATE POLICY "Allow public insert to contacts" ON public.contacts FOR INSERT TO anon WITH CHECK (true);

-- Policies for Institutes (Allow anon select, insert, update, delete)
DROP POLICY IF EXISTS "Allow public select on institutes" ON public.institutes;
CREATE POLICY "Allow public select on institutes" ON public.institutes FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow public insert on institutes" ON public.institutes;
CREATE POLICY "Allow public insert on institutes" ON public.institutes FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on institutes" ON public.institutes;
CREATE POLICY "Allow public update on institutes" ON public.institutes FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Allow public delete on institutes" ON public.institutes;
CREATE POLICY "Allow public delete on institutes" ON public.institutes FOR DELETE TO anon USING (true);

-- Policies for Analytics (Allow anon select, insert, update, delete)
DROP POLICY IF EXISTS "Allow public select on analytics" ON public.institute_analytics;
CREATE POLICY "Allow public select on analytics" ON public.institute_analytics FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow public insert on analytics" ON public.institute_analytics;
CREATE POLICY "Allow public insert on analytics" ON public.institute_analytics FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on analytics" ON public.institute_analytics;
CREATE POLICY "Allow public update on analytics" ON public.institute_analytics FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Allow public delete on analytics" ON public.institute_analytics;
CREATE POLICY "Allow public delete on analytics" ON public.institute_analytics FOR DELETE TO anon USING (true);


-- ==============================================================================
-- CONFIGURE STORAGE BUCKET FOR IMAGES
-- ==============================================================================

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tuition-images', 'tuition-images', true)
ON CONFLICT (id) DO NOTHING;


-- Allow anonymous uploads to the 'tuition-images' bucket
DROP POLICY IF EXISTS "Allow public uploads to tuition-images" ON storage.objects;
CREATE POLICY "Allow public uploads to tuition-images"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'tuition-images');

-- Allow public viewing of files in the 'tuition-images' bucket
DROP POLICY IF EXISTS "Allow public view of tuition-images" ON storage.objects;
CREATE POLICY "Allow public view of tuition-images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'tuition-images');

-- Allow public updates/deletes in the 'tuition-images' bucket (for admin panel)
DROP POLICY IF EXISTS "Allow public update to tuition-images" ON storage.objects;
CREATE POLICY "Allow public update to tuition-images"
ON storage.objects FOR UPDATE TO anon
USING (bucket_id = 'tuition-images');

DROP POLICY IF EXISTS "Allow public delete from tuition-images" ON storage.objects;
CREATE POLICY "Allow public delete from tuition-images"
ON storage.objects FOR DELETE TO anon
USING (bucket_id = 'tuition-images');
