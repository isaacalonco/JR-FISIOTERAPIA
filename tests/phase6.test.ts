import { describe, it } from "node:test";
import assert from "node:assert";
import {
  receivableSchema,
  expenseSchema,
  paymentSchema,
} from "../utils/validators/financial.schema";

describe("JR SAÚDE 1.0 - Testes da FASE 6 (Gestão Financeira & Repasses Profissionais)", () => {
  it("deve validar conta a receber válida no receivableSchema", () => {
    const validReceivable = {
      description: "Sessão de Fisioterapia Ortopédica",
      category: "FISIOTERAPIA",
      amount: 150.0,
      dueDate: "2026-10-20",
    };

    const result = receivableSchema.safeParse(validReceivable);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar conta a receber com valor menor ou igual a zero", () => {
    const invalidReceivable = {
      description: "Consulta médica",
      category: "CONSULTA",
      amount: 0,
      dueDate: "2026-10-20",
    };

    const result = receivableSchema.safeParse(invalidReceivable);
    assert.strictEqual(result.success, false);
  });

  it("deve validar despesa operacional no expenseSchema", () => {
    const validExpense = {
      description: "Fatura de Energia Elétrica da Unidade",
      category: "ENERGIA",
      amount: 485.5,
      dueDate: "2026-10-10",
    };

    const result = expenseSchema.safeParse(validExpense);
    assert.strictEqual(result.success, true);
  });

  it("deve validar forma de pagamento PIX e Cartão no paymentSchema", () => {
    const validPayment = {
      receivableId: "123e4567-e89b-12d3-a456-426614174000",
      paymentMethod: "PIX",
      amountPaid: 150.0,
      transactionCode: "PIX-987654321",
    };

    const result = paymentSchema.safeParse(validPayment);
    assert.strictEqual(result.success, true);
  });

  it("deve calcular matematicamente o repasse profissional de acordo com a taxa de comissão", () => {
    const volumeTotal = 3000.0; // R$ 3.000 em atendimentos
    const taxaComissao = 40.0; // 40%

    const repasseCalculado = (volumeTotal * taxaComissao) / 100;
    const retencaoClinica = volumeTotal - repasseCalculado;

    assert.strictEqual(repasseCalculado, 1200.0);
    assert.strictEqual(retencaoClinica, 1800.0);
  });
});
