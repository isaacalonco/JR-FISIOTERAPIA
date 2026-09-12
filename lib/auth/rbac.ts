import { createClient } from "@/lib/supabase/server";
import { SessionContext, UserProfile, UserRole } from "@/types/auth.types";
import { redirect } from "next/navigation";

/**
 * Obtém a sessão estendida do usuário atual com perfil, papéis e permissões RBAC.
 * Se o usuário estiver autenticado no Supabase Auth mas ainda não tiver perfil em `profiles`,
 * vincula automaticamente ao Tenant e Clínica matriz.
 */
export async function getCurrentUserSession(): Promise<SessionContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // 1. Busca perfil estendido vinculado ao auth.users(id)
  let { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Se o usuário está logado mas ainda não tem registro em profiles, cria automaticamente
  if (!profileData) {
    const { data: tenant } = await supabase.from("tenants").select("id").limit(1).maybeSingle();
    const { data: clinic } = await supabase.from("clinics").select("id").limit(1).maybeSingle();

    if (tenant && clinic) {
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          tenant_id: tenant.id,
          clinic_id: clinic.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Administrador",
          email: user.email || "",
          is_active: true,
        })
        .select()
        .maybeSingle();

      if (newProfile) {
        profileData = newProfile;
        // Atribui papel ADMIN por padrão para o novo perfil
        const { data: adminRole } = await supabase
          .from("roles")
          .select("id")
          .eq("name", "ADMIN")
          .maybeSingle();

        if (adminRole) {
          await supabase.from("user_roles").insert({
            user_id: newProfile.id,
            role_id: adminRole.id,
          });
        }
      }
    }
  }

  if (!profileData || !profileData.is_active) {
    return null;
  }

  // 2. Busca papéis (roles) associados ao usuário em user_roles
  const { data: rolesData } = await supabase
    .from("user_roles")
    .select("role_id, roles(name)")
    .eq("user_id", profileData.id);

  let roles: UserRole[] =
    rolesData?.map((r: any) => r.roles?.name as UserRole).filter(Boolean) || [];

  if (roles.length === 0) {
    roles = ["ADMIN"];
  }

  const activeRole: UserRole = roles[0] || "ADMIN";

  // 3. Busca permissões associadas aos papéis do usuário
  let permissions: string[] = [];
  if (rolesData && rolesData.length > 0) {
    const roleIds = rolesData.map((r: any) => r.role_id);
    const { data: permData } = await supabase
      .from("role_permissions")
      .select("permissions(code)")
      .in("role_id", roleIds);

    if (permData) {
      permissions = Array.from(
        new Set(
          permData
            .map((p: any) => p.permissions?.code as string)
            .filter(Boolean)
        )
      );
    }
  }

  // Perfis ADMIN possuem permissão implícita wildcard '*'
  if (roles.includes("ADMIN")) {
    permissions.push("*");
  }

  const profile: UserProfile = {
    id: profileData.id,
    userId: profileData.user_id,
    tenantId: profileData.tenant_id,
    clinicId: profileData.clinic_id,
    unitId: profileData.unit_id,
    fullName: profileData.full_name,
    email: profileData.email,
    phone: profileData.phone,
    cpf: profileData.cpf,
    avatarUrl: profileData.avatar_url,
    roles,
    isActive: profileData.is_active,
    createdAt: profileData.created_at,
    updatedAt: profileData.updated_at,
  };

  return {
    userId: user.id,
    profile,
    activeRole,
    permissions,
  };
}

/**
 * Verifica se a sessão do usuário possui a permissão especificada.
 */
export function hasPermission(
  session: SessionContext | null,
  requiredPermission: string
): boolean {
  if (!session || !session.profile.isActive) return false;
  if (session.permissions.includes("*")) return true;
  return session.permissions.includes(requiredPermission);
}

/**
 * Exige uma permissão para acesso à página/ação Server-Side. Redireciona caso não tenha acesso.
 */
export async function requirePermission(
  requiredPermission: string,
  redirectTo: string = "/dashboard"
): Promise<SessionContext> {
  const session = await getCurrentUserSession();

  if (!session) {
    redirect("/login");
  }

  if (!hasPermission(session, requiredPermission)) {
    redirect(`${redirectTo}?error=acesso_negado`);
  }

  return session;
}
