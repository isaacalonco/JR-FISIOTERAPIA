import { z } from "zod";

/**
 * Validação algorítmica de CPF (Receita Federal)
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(10), 10)) return false;

  return true;
}

/**
 * Schemas Zod base para higienização e validação segura de dados
 */
export const cpfSchema = z
  .string()
  .min(11, "CPF deve conter no mínimo 11 dígitos")
  .refine((val) => isValidCPF(val), {
    message: "CPF inválido",
  });

export const phoneSchema = z
  .string()
  .min(10, "Telefone deve conter no mínimo 10 dígitos com DDD")
  .max(15, "Telefone inválido");

export const emailSchema = z
  .string()
  .email("Formato de e-mail inválido")
  .max(255, "E-mail muito longo");
