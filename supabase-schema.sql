-- ==============================================================================
-- AAPLI SOCIETY - SUPABASE DATABASE SCHEMA
-- Project ID: hywzqdaknoogcbdzsxcn
-- Endpoint: https://hywzqdaknoogcbdzsxcn.supabase.co
-- 
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/hywzqdaknoogcbdzsxcn
-- 2. Go to "SQL Editor" on the left navigation bar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- 4. All tables, Row Level Security (RLS) policies, and seed data will be created!
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (User Accounts: Residents & Secretary Management Committee)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'secretary')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '+1 (555) 019-2834',
  unit TEXT,
  society_name TEXT DEFAULT 'Maple Heights Housing Society',
  designation TEXT DEFAULT 'Resident',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ISSUES TABLE (Civic Grievances & Maintenance Complaints)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Potholes', 'Streetlights', 'Water Supply', 'Garbage & Waste',
    'Electrical', 'Security', 'Elevator', 'Parks & Gardens', 'Drainage', 'Other'
  )),
  society_name TEXT DEFAULT 'Maple Heights Housing Society',
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Resolved')) DEFAULT 'Pending',
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
  date TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  photo_url TEXT,
  reporter_name TEXT NOT NULL,
  reporter_unit TEXT,
  assigned_department TEXT,
  upvotes INTEGER DEFAULT 0,
  map_coords JSONB DEFAULT '{"x": 50, "y": 50}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TIMELINE_EVENTS TABLE (Issue Audit Progression History)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id TEXT NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  label TEXT NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. ISSUE_COMMENTS TABLE (Threaded Discussions on Complaints)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.issue_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id TEXT NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  date TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. NOTICES TABLE (Emergency Alerts & Official Circulars)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Maintenance', 'Emergency', 'Meeting', 'Security')),
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. FACILITIES TABLE (Amenities: Swimming Pool, Gym, Clubhouse, Tennis)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Open', 'Maintenance', 'Booked')) DEFAULT 'Open',
  hours TEXT NOT NULL,
  booking_fee TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. DUES_TRANSACTIONS TABLE (Maintenance Fee Payments & Receipt Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dues_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id TEXT NOT NULL,
  resident_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 180.00,
  period TEXT DEFAULT 'Q3 2026',
  status TEXT NOT NULL DEFAULT 'PAID',
  receipt_no TEXT NOT NULL,
  payment_method TEXT DEFAULT 'Card / UPI / NetBanking',
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_created ON public.issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_issue ON public.timeline_events(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_issue ON public.issue_comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_notices_date ON public.notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dues_unit ON public.dues_transactions(unit);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configure access control for anonymous and authenticated access.
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dues_transactions ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone (public anon & authenticated)
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert to profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to issues" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Allow public insert to issues" ON public.issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to issues" ON public.issues FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to issues" ON public.issues FOR DELETE USING (true);

CREATE POLICY "Allow public read access to timeline_events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert to timeline_events" ON public.timeline_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to issue_comments" ON public.issue_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert to issue_comments" ON public.issue_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert to notices" ON public.notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to notices" ON public.notices FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Allow public update to facilities" ON public.facilities FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to dues_transactions" ON public.dues_transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to dues_transactions" ON public.dues_transactions FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC AUTH TRIGGER (Optional: When users sign up via Supabase Auth)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, name, role, unit, designation)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'member'),
    COALESCE(new.raw_user_meta_data->>'unit', 'Tower B - Flat 402'),
    COALESCE(new.raw_user_meta_data->>'designation', 'Resident')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- SEED DATA (Populate Initial Society Data for Maple Heights / Aapli Society)
-- ==============================================================================

-- 1. Insert Initial Profiles
INSERT INTO public.profiles (role, name, email, phone, unit, designation, avatar_url)
VALUES
  ('member', 'Alex Morgan', 'alex.morgan@mapleheights.org', '+1 (555) 019-2834', 'Tower B - Flat 402', 'Resident Flat Owner', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'),
  ('secretary', 'Arthur Sterling', 'secretary@mapleheights.org', '+1 (555) 012-9481', 'Tower A - Flat 101', 'Hon. General Secretary', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80')
ON CONFLICT DO NOTHING;

-- 2. Insert Initial Facilities
INSERT INTO public.facilities (id, name, status, hours, booking_fee)
VALUES
  ('fac_pool', 'Swimming Pool & Deck', 'Open', '6:00 AM – 9:00 PM', 'Included in Dues'),
  ('fac_gym', 'Fitness Center & Gym', 'Open', '5:30 AM – 10:30 PM', 'Included in Dues'),
  ('fac_club', 'Clubhouse & Banquet Hall', 'Booked', '10:00 AM – 11:00 PM', '$45 / Event'),
  ('fac_tennis', 'Tennis & Pickleball Court', 'Maintenance', '7:00 AM – 8:00 PM', 'Free Reservation')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  hours = EXCLUDED.hours;

-- 3. Insert Initial Society Notices
INSERT INTO public.notices (id, title, content, category, date, author, urgent)
VALUES
  (
    'notice-1',
    'Quarterly Overhead Water Tank Cleaning',
    'Main water supply to Tower A and Tower B will be shut off between 1:00 PM and 5:00 PM this Thursday for semi-annual tank sanitization. Please store potable water in advance.',
    'Maintenance',
    'Today, 10:15 AM',
    'Estate Management Committee',
    true
  ),
  (
    'notice-2',
    'Annual General Body Meeting (AGM) Scheduled',
    'The Annual General Meeting will take place in the Main Clubhouse Banquet Hall on Sunday, September 20 at 10:00 AM. Financial balance sheets and vendor contracts will be audited.',
    'Meeting',
    'Yesterday',
    'Arthur Sterling (Hon. Secretary)',
    false
  ),
  (
    'notice-3',
    'Mandatory Guest Parking RFID Sticker Audit',
    'All resident secondary vehicles parked in Basement 2 must collect updated 2026 RFID tags from the guard desk to avoid automated wheel clamping starting next Monday.',
    'Security',
    '3 days ago',
    'Chief Security Officer',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Initial Issues
INSERT INTO public.issues (
  id, title, category, society_name, address, description, status, priority,
  date, timestamp, photo_url, reporter_name, reporter_unit, assigned_department,
  upvotes, map_coords
)
VALUES
  (
    'ISSUE-101',
    'Tower B Passenger Elevator #2 Jerking & Halting',
    'Elevator',
    'Maple Heights Housing Society',
    'Tower B, Core Lobby (Floors 6-12)',
    'Elevator #2 produces loud metal scraping sounds when passing floor 8 and stopped for 4 minutes with passengers inside this morning. Emergency intercom responded slowly.',
    'In Progress',
    'Urgent',
    'Today, 9:20 AM',
    1788770000000,
    'https://images.unsplash.com/photo-1579705745811-a32bef7856a3?auto=format&fit=crop&w=800&q=80',
    'Alex Morgan',
    'Tower B - Flat 402',
    'Otis Elevators AMC Team',
    14,
    '{"x": 62, "y": 38}'::jsonb
  ),
  (
    'ISSUE-102',
    'Low Pressure & Murky Water from Master Tap Line',
    'Water Supply',
    'Maple Heights Housing Society',
    'Tower B, Flat 402 Master Bathroom',
    'Water pressure dropped drastically over the last 48 hours and shows brown sediment particles. Neighbor in 401 reports similar turbidity in early morning supply.',
    'Pending',
    'High',
    'Yesterday, 4:10 PM',
    1788680000000,
    'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
    'Alex Morgan',
    'Tower B - Flat 402',
    'Estate Plumbing AMC',
    8,
    '{"x": 68, "y": 42}'::jsonb
  ),
  (
    'ISSUE-103',
    'Flickering High-Mast Perimeter Floodlight near Gate 2',
    'Electrical',
    'Maple Heights Housing Society',
    'East Boundary Wall & Gate 2 Driveway',
    'The 150W LED perimeter floodlight is strobing violently at night, creating a security dark spot for incoming vehicles and pedestrians using the jogging trail.',
    'Resolved',
    'Low',
    'Sep 2, 2026',
    1788500000000,
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    'Vikram Mehta',
    'Tower A - Flat 204',
    'Facilities Electrical Team',
    5,
    '{"x": 22, "y": 78}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Timeline Events
INSERT INTO public.timeline_events (issue_id, status, label, date, note)
VALUES
  ('ISSUE-101', 'Submitted', 'Grievance Reported by Resident', 'Today, 9:20 AM', 'Reported with urgent priority flag and audio report.'),
  ('ISSUE-101', 'Assigned', 'Assigned to Otis AMC Technician', 'Today, 10:05 AM', 'Work order #OT-8821 dispatched to resident technician Manoj K.'),
  ('ISSUE-101', 'In Progress', 'Field Inspection Started', 'Today, 11:30 AM', 'Traction motor and governor cable currently being tested on floor 8.'),
  ('ISSUE-102', 'Submitted', 'Complaint Filed', 'Yesterday, 4:10 PM', 'Awaiting committee plumbing inspection slot.'),
  ('ISSUE-103', 'Submitted', 'Grievance Logged', 'Sep 2, 2026', 'Reported by resident walking on perimeter path.'),
  ('ISSUE-103', 'Assigned', 'Assigned to In-House Electrician', 'Sep 3, 2026', 'Assigned to Duty Staff Ramesh.'),
  ('ISSUE-103', 'Resolved', 'LED Driver & Fuse Replaced', 'Sep 4, 2026', 'Faulty 150W driver replaced with IP67 outdoor ballast. Light verified operational.')
ON CONFLICT DO NOTHING;

-- 6. Insert Initial Comments
INSERT INTO public.issue_comments (issue_id, author, text, date, is_staff)
VALUES
  ('ISSUE-101', 'Arthur Sterling (Hon. Secretary)', 'Otis engineer has arrived at the machine room. Lift #2 is temporarily shut down to prevent motor damage.', 'Today, 10:15 AM', true),
  ('ISSUE-101', 'Alex Morgan', 'Thank you Arthur. Please ensure elevator #1 remains on priority service for elderly residents on upper floors.', 'Today, 10:30 AM', false),
  ('ISSUE-103', 'Facilities Desk', 'Work completed and signed off by estate supervisor.', 'Sep 4, 2026', true)
ON CONFLICT DO NOTHING;

-- 7. Insert Initial Dues Transaction
INSERT INTO public.dues_transactions (resident_id, resident_name, unit, amount, period, status, receipt_no)
VALUES
  ('demo-member-1', 'Alex Morgan', 'Tower B - Flat 402', 180.00, 'Q3 2026', 'PAID', 'REC-2026-Q3-0941')
ON CONFLICT DO NOTHING;

-- Done!
