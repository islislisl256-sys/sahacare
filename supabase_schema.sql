-- ==========================================
-- منصة "صحتي" (SahaCare) - Supabase Schema
-- ==========================================

-- Enable PostGIS for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'patient', -- 'patient', 'provider', 'admin'
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Providers can be viewed by anyone" ON public.users FOR SELECT USING (role = 'provider');

-- 2. Provider Profiles Table
CREATE TABLE IF NOT EXISTS public.provider_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  bio TEXT,
  work_area TEXT,
  default_travel_cost DECIMAL(10, 2) DEFAULT 0,
  day_off TEXT,
  subscription_plan TEXT DEFAULT 'basic',
  university_degree_url TEXT,
  license_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for provider_profiles
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provider profiles are viewable by everyone" ON public.provider_profiles FOR SELECT USING (true);
CREATE POLICY "Providers can update their own profile" ON public.provider_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Providers can insert their own profile" ON public.provider_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Service Requests Table (Created by patients)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2),
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_geom GEOMETRY(Point, 4326),
  address_text TEXT,
  prescription_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to automatically update location_geom based on lat/lng
CREATE OR REPLACE FUNCTION update_location_geom()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location_lng IS NOT NULL AND NEW.location_lat IS NOT NULL THEN
    NEW.location_geom := ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_request_geom
BEFORE INSERT OR UPDATE ON public.service_requests
FOR EACH ROW EXECUTE FUNCTION update_location_geom();


-- Enable RLS for service_requests
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their own requests" ON public.service_requests FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update their own requests" ON public.service_requests FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Providers can view pending requests" ON public.service_requests FOR SELECT USING (status = 'pending');

-- 4. Offers Table (Providers bidding on requests)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.provider_profiles(user_id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers can view their own offers" ON public.offers FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Providers can insert offers" ON public.offers FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Patients can view offers for their requests" ON public.offers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.service_requests sr WHERE sr.id = request_id AND sr.patient_id = auth.uid())
);

-- 5. Appointments Table (When an offer is accepted)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.provider_profiles(user_id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.offers(id),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Providers can view their appointments" ON public.appointments FOR SELECT USING (auth.uid() = provider_id);


-- 6. Medical Records (Reports uploaded by provider after treatment)
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.provider_profiles(user_id) ON DELETE CASCADE,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view their records" ON public.medical_records FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Providers can view records they created" ON public.medical_records FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Providers can insert records" ON public.medical_records FOR INSERT WITH CHECK (auth.uid() = provider_id);


-- ==========================================
-- Supabase Storage Setup (Buckets)
-- ==========================================
-- Note: Run these in the SQL editor to create buckets if not done via UI

-- Create bucket for medical prescriptions
INSERT INTO storage.buckets (id, name, public) VALUES ('prescriptions', 'prescriptions', true) ON CONFLICT DO NOTHING;
-- Create bucket for provider verification documents
INSERT INTO storage.buckets (id, name, public) VALUES ('provider-docs', 'provider-docs', false) ON CONFLICT DO NOTHING;
-- Create bucket for medical records/reports
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-reports', 'medical-reports', true) ON CONFLICT DO NOTHING;

-- Storage Policies
-- Prescriptions bucket policies
CREATE POLICY "Anyone can view prescriptions" ON storage.objects FOR SELECT USING (bucket_id = 'prescriptions');
CREATE POLICY "Authenticated users can upload prescriptions" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'prescriptions' AND auth.role() = 'authenticated');

-- Medical reports bucket policies
CREATE POLICY "Anyone can view reports" ON storage.objects FOR SELECT USING (bucket_id = 'medical-reports');
CREATE POLICY "Providers can upload reports" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'medical-reports' AND auth.role() = 'authenticated');

-- ==========================================
-- Triggers for User Creation
-- ==========================================
-- Automatically create an entry in public.users when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  
  -- If role is provider, also create a basic provider profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'patient') = 'provider' THEN
    INSERT INTO public.provider_profiles (user_id, specialty)
    VALUES (NEW.id, 'General');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
