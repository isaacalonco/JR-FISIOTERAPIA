/**
 * JR SAÚDE 1.0 - Verificação de Sanidade das Variáveis de Ambiente
 */

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.warn(
    `[ALERTA DE AMBIENTE] Variáveis essenciais não detectadas: ${missing.join(", ")}`
  );
  console.warn(
    "Certifique-se de configurar o arquivo .env.local com base em .env.example para o funcionamento pleno da autenticação e banco de dados."
  );
} else {
  console.log("[AMBIENTE OK] Variáveis essenciais configuradas com sucesso.");
}
