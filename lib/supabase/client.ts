import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para execução no Navegador (Client-Side)
 * Utiliza estritamente a ANON KEY pública.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[Supabase] Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas."
    );
  }

  return createBrowserClient(supabaseUrl || "", supabaseAnonKey || "");
}
