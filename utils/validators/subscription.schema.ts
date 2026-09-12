import { z } from "zod";

export const clubPlanSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do plano deve ter no mínimo 3 caracteres")
    .max(150, "Nome do plano muito longo"),
  monthlyPrice: z
    .number()
    .min(0, "O valor mensal não pode ser negativo"),
  creditsPerMonth: z
    .number()
    .int("Quantidade de créditos deve ser um número inteiro")
    .min(1, "O plano deve ter pelo menos 1 crédito mensal"),
  extraCreditPrice: z
    .number()
    .min(0, "O valor do crédito extra não pode ser negativo"),
});

export const clubSubscriptionSchema = z.object({
  planId: z.string().uuid("Selecione um plano válido"),
  patientId: z.string().uuid("Selecione um paciente titular válido"),
  autoRenew: z.boolean().default(true),
});

export const createAuthorizationSchema = z.object({
  subscriptionId: z.string().uuid("Assinatura inválida"),
  beneficiaryName: z
    .string()
    .min(3, "Nome do beneficiário deve ter no mínimo 3 caracteres")
    .max(150, "Nome muito longo"),
  beneficiaryCpfOrPhone: z
    .string()
    .min(8, "Telefone ou CPF do beneficiário é obrigatório"),
  creditsReserved: z
    .number()
    .int("Quantidade de créditos deve ser inteira")
    .min(1, "Mínimo de 1 crédito por autorização"),
});

export const buyExtraCreditsSchema = z.object({
  subscriptionId: z.string().uuid("Assinatura inválida"),
  creditsQuantity: z
    .number()
    .int("Quantidade deve ser inteira")
    .min(1, "Compre pelo menos 1 crédito avulso"),
});

export type ClubPlanInput = z.infer<typeof clubPlanSchema>;
export type ClubSubscriptionInput = z.infer<typeof clubSubscriptionSchema>;
export type CreateAuthorizationInput = z.infer<typeof createAuthorizationSchema>;
export type BuyExtraCreditsInput = z.infer<typeof buyExtraCreditsSchema>;
