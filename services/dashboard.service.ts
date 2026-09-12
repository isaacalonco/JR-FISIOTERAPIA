import { createClient } from "@/lib/supabase/server";

export interface DashboardKPIs {
  totalPatients: number;
  totalProfessionals: number;
  totalServices: number;
  totalAppointments: number;
}

export async function getDashboardKPIs(tenantId: string): Promise<DashboardKPIs> {
  const supabase = await createClient();

  const [patientsRes, profsRes, servicesRes, apptsRes] = await Promise.all([
    supabase.from("patients").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("professionals").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
  ]);

  return {
    totalPatients: patientsRes.count || 0,
    totalProfessionals: profsRes.count || 0,
    totalServices: servicesRes.count || 0,
    totalAppointments: apptsRes.count || 0,
  };
}
