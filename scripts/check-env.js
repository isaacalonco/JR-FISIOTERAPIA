/**
 * JR SAÚDE 1.0 - Verificação de Sanidade das Variáveis de Ambiente
 */

const fs = require("fs");
const path = require("path");

// Carrega .env.local se existir para execução direta via node
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (!process.env[key]) {
        process.env[key] = value.trim();
      }
    }
  });
}

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
