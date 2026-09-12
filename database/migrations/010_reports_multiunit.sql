-- Migration 010: Relatórios Executivos & Multiunidades (Filiais)
-- JR FISIOTERAPIA 1.0

-- Create units table
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  phone VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add unit_id references to appointments, receivables, expenses
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL;
ALTER TABLE public.receivables ADD COLUMN IF NOT EXISTS unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL;

-- Create index for fast filtering by unit
CREATE INDEX IF NOT EXISTS idx_units_tenant ON public.units(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_unit ON public.appointments(unit_id);
CREATE INDEX IF NOT EXISTS idx_receivables_unit ON public.receivables(unit_id);
CREATE INDEX IF NOT EXISTS idx_expenses_unit ON public.expenses(unit_id);
