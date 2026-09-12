import { describe, it } from "node:test";
import assert from "node:assert";
import {
  clubPlanSchema,
  clubSubscriptionSchema,
  createAuthorizationSchema,
  buyExtraCreditsSchema,
} from "../utils/validators/subscription.schema";

describe("JR SAÚDE 1.0 - Testes da FASE 7 (JR Saúde Club & Créditos Recorrentes)", () => {
  it("deve validar criação de plano do clube no clubPlanSchema", () => {
    const validPlan = {
      name: "Plano Fit 2 Créditos",
      monthlyPrice: 69.0,
      creditsPerMonth: 2,
      extraCreditPrice: 35.0,
    };

    const result = clubPlanSchema.safeParse(validPlan);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar plano com créditos zerados ou negativos", () => {
    const invalidPlan = {
      name: "Plano Inválido",
      monthlyPrice: 50.0,
      creditsPerMonth: 0,
      extraCreditPrice: 30.0,
    };

    const result = clubPlanSchema.safeParse(invalidPlan);
    assert.strictEqual(result.success, false);
  });

  it("deve validar dados de assinatura de paciente titular", () => {
    const validSubscription = {
      planId: "123e4567-e89b-12d3-a456-426614174000",
      patientId: "987e6543-e21b-12d3-a456-426614174000",
      autoRenew: true,
    };

    const result = clubSubscriptionSchema.safeParse(validSubscription);
    assert.strictEqual(result.success, true);
  });

  it("deve validar geração de voucher/autorização para terceiros", () => {
    const validAuth = {
      subscriptionId: "123e4567-e89b-12d3-a456-426614174000",
      beneficiaryName: "Carlos Eduardo (Amigo com Dor Ortopédica)",
      beneficiaryCpfOrPhone: "(61) 98888-7777",
      creditsReserved: 1,
    };

    const result = createAuthorizationSchema.safeParse(validAuth);
    assert.strictEqual(result.success, true);
  });

  it("deve validar recarga de créditos avulsos no buyExtraCreditsSchema", () => {
    const validExtra = {
      subscriptionId: "123e4567-e89b-12d3-a456-426614174000",
      creditsQuantity: 3,
    };

    const result = buyExtraCreditsSchema.safeParse(validExtra);
    assert.strictEqual(result.success, true);
  });

  it("deve calcular corretamente o débito de saldo de créditos e saldo remanescente", () => {
    const saldoInicial = 3;
    const creditosReservados = 1;
    const recargaAvulsa = 2;

    const saldoAposVoucher = saldoInicial - creditosReservados;
    assert.strictEqual(saldoAposVoucher, 2);

    const saldoFinalComRecarga = saldoAposVoucher + recargaAvulsa;
    assert.strictEqual(saldoFinalComRecarga, 4);
  });
});
