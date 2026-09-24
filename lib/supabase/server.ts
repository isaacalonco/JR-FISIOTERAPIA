import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const fetchWithTimeout: typeof fetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    signal: options.signal || AbortSignal.timeout(3500),
  });
};

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Utiliza gerenciamento seguro de cookies de sessão com HttpOnly e SameSite.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: fetchWithTimeout,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Chamado a partir de um Server Component: ignorar atualização de cookies
        }
      },
    },
  });
}

/**
 * Cliente Supabase Administrativo com SERVICE ROLE KEY (Server-only).
 * ATENÇÃO: Ignora RLS. Deve ser utilizado estritamente em operações de sistema e auditoria.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ausente nas variáveis de ambiente do servidor."
    );
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
