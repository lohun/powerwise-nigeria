-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  business_name TEXT,
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  address TEXT NOT NULL,
  estimated_load_kw NUMERIC NOT NULL,
  daily_usage_hours NUMERIC NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('Residential', 'Commercial', 'Industrial')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  primary_solution TEXT NOT NULL,
  system_capacity_kw NUMERIC NOT NULL,
  solar_panels_count INTEGER,
  battery_capacity_kwh NUMERIC,
  inverter_size_kw NUMERIC,
  equipment_cost_ngn NUMERIC NOT NULL,
  installation_cost_ngn NUMERIC NOT NULL,
  total_cost_ngn NUMERIC NOT NULL,
  monthly_operating_cost NUMERIC NOT NULL,
  roi_months INTEGER,
  products_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_recommendations_client_id ON public.recommendations(client_id);
CREATE INDEX idx_recommendations_generated_at ON public.recommendations(generated_at DESC);

-- Enable RLS (but allow public access for MVP without auth)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (MVP without auth)
CREATE POLICY "Allow public read access to clients"
  ON public.clients FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to clients"
  ON public.clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to recommendations"
  ON public.recommendations FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to recommendations"
  ON public.recommendations FOR INSERT
  WITH CHECK (true);