import { z } from "zod";

export const receivableSchema = z.object({
  patientId: z.string().uuid().optional().nullable(),
  appointmentId: z.string().uuid().optional().nullable(),
  subscriptionId: z.string().uuid().optional().nullable(),
  description: z
    .string()
    .min(3, "A descrição do título deve ter no mínimo 3 caracteres")
    .max(255, "Descrição muito longa"),
  category: z
    .string()
    .min(2, "Categoria é obrigatória"),
  amount: z
    .number()
    .min(0.01, "O valor deve ser maior que zero"),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de vencimento deve estar no formato AAAA-MM-DD"),
});

export const expenseSchema = z.object({
  description: z
    .string()
    .min(3, "Descrição da despesa é obrigatória")
    .max(255, "Descrição muito longa"),
  category: z
    .string()
    .min(2, "Categoria é obrigatória (ex: ALUGUEL, ENERGIA, MATERIAIS, SALARIOS)"),
  amount: z
    .number()
    .min(0.01, "O valor da despesa deve ser maior que zero"),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de vencimento deve estar no formato AAAA-MM-DD"),
  paymentDate: z.string().optional().nullable(),
});

export const paymentSchema = z.object({
  receivableId: z.string().uuid("ID da conta a receber inválido"),
  paymentMethod: z.enum(
    ["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "DINHEIRO", "BOLETO"],
    { errorMap: () => ({ message: "Forma de pagamento inválida" }) }
  ),
  amountPaid: z
    .number()
    .min(0.01, "O valor pago deve ser maior que zero"),
  transactionCode: z.string().optional().nullable(),
});

export const payoutSchema = z.object({
  professionalId: z.string().uuid("Selecione um profissional válido"),
  periodStart: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de início deve estar no formato AAAA-MM-DD"),
  periodEnd: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de término deve estar no formato AAAA-MM-DD"),
});

export type ReceivableInput = z.infer<typeof receivableSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type PayoutInput = z.infer<typeof payoutSchema>;
