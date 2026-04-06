-- CyberPenDef Supabase Schema & RLS Policies
-- Execute this script in your Supabase SQL Editor

-- 1. Inquiries Table
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    audience_category TEXT,
    service_category TEXT,
    message TEXT NOT NULL,
    claim_free_consultation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Note: We intentionally do NOT create an INSERT policy for 'anon' here. 
-- The Edge Function will handle the insert using a secure service role key 
-- AFTER verifying the Cloudflare Turnstile token. This prevents direct DB spam.


-- 2. Service Tickets (Client Portal)
CREATE TABLE public.service_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    report_url TEXT, -- Link to secure storage if needed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can only view their own tickets
CREATE POLICY "Clients can view own tickets" 
ON public.service_tickets 
FOR SELECT 
USING (auth.uid() = client_id);


-- 3. Testimonials Table
CREATE TABLE public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    service_used TEXT,
    quote TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read approved testimonials
CREATE POLICY "Public can read approved testimonials" 
ON public.testimonials 
FOR SELECT 
USING (approved = true);

-- Policy: Authenticated Admins can manage testimonials (Requires admin role setup later if needed, otherwise use Supabase Dashboard)
