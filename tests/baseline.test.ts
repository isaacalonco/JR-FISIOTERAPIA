import { describe, it } from "node:test";
import assert from "node:assert";
import { isValidCPF } from "../utils/validators";
import { formatCPF, formatCurrencyBRL } from "../utils/formatters";

describe("JR SAÚDE 1.0 - Testes Básicos de Infraestrutura", () => {
  it("deve validar CPF corretamente", () => {
    // CPFs com todos os dígitos iguais devem ser inválidos
    assert.strictEqual(isValidCPF("111.111.111-11"), false);
    assert.strictEqual(isValidCPF("00000000000"), false);
  });

  it("deve formatar valores em Real Brasileiro (BRL)", () => {
    const formatted = formatCurrencyBRL(150.5);
    assert.ok(formatted.includes("150,50"));
  });

  it("deve formatar CPF no padrão XXX.XXX.XXX-XX", () => {
    assert.strictEqual(formatCPF("12345678901"), "123.456.789-01");
  });
});
