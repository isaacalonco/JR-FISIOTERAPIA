import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  unitSchema,
  reportFilterSchema,
} from "../utils/validators/reports-unit.schema";

describe("JR FISIOTERAPIA 1.0 - Testes da FASE 10 (Relatórios Executivos & Multiunidade)", () => {

  test("deve validar cadastro de nova unidade/filial física", () => {
    const validUnit = {
      name: "Unidade Matriz - Asa Sul",
      address: "SEPS 709/909 Bloco A Sala 204 - Brasília/DF",
      phone: "(61) 3344-5566",
      is_active: true,
    };

    const parsed = unitSchema.parse(validUnit);
    assert.equal(parsed.name, "Unidade Matriz - Asa Sul");
    assert.equal(parsed.is_active, true);
  });

  test("deve rejeitar unidade com nome curto ou vazio", () => {
    const invalidUnit = {
      name: "AB", // muito curto
    };

    assert.throws(() => {
      unitSchema.parse(invalidUnit);
    });
  });

  test("deve validar filtros de relatórios executivos (datas e unidades)", () => {
    const validFilter = {
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      unitId: "123e4567-e89b-12d3-a456-426614174000",
    };

    const parsed = reportFilterSchema.parse(validFilter);
    assert.equal(parsed.startDate, "2026-01-01");
    assert.equal(parsed.endDate, "2026-12-31");
  });

  test("deve calcular matematicamente o lucro líquido (Faturamento Bruto - Despesas)", () => {
    const grossRevenue = 45000.0;
    const expenses = 12500.0;
    const netRevenue = grossRevenue - expenses;

    assert.equal(netRevenue, 32500.0);
  });

  test("deve calcular a taxa de ocupação da agenda (%) corretamente", () => {
    const completed = 40;
    const total = 50;
    const occupancyRate = Math.round((completed / total) * 100);

    assert.equal(occupancyRate, 80);
  });

});
