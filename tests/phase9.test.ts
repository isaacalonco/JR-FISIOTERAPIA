import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  legalCaseSchema,
  legalContractSchema,
  auditFilterSchema,
} from "../utils/validators/legal-audit.schema";

describe("JR FISIOTERAPIA 1.0 - Testes da FASE 9 (Módulo Jurídico & Auditoria Avançada)", () => {

  test("deve validar dados válidos de cadastro de Caso/Processo Jurídico", () => {
    const validCase = {
      case_number: "PROC-2026-0042",
      title: "Defesa de responsabilidade técnica em reembolso",
      case_type: "processo" as const,
      status: "em_andamento" as const,
      lawyer_name: "Dra. Mariana Costa",
      description: "Contestação de recurso junto à fonte pagadora.",
      due_date: "2026-10-15",
    };

    const parsed = legalCaseSchema.parse(validCase);
    assert.equal(parsed.case_number, "PROC-2026-0042");
    assert.equal(parsed.case_type, "processo");
    assert.equal(parsed.status, "em_andamento");
  });

  test("deve rejeitar caso jurídico sem número de processo ou com tipo inválido", () => {
    const invalidCase = {
      case_number: "A", // curto demais
      title: "Teste",
      case_type: "invalido",
    };

    assert.throws(() => {
      legalCaseSchema.parse(invalidCase);
    });
  });

  test("deve validar cadastro de Contrato Jurídico / Termo LGPD", () => {
    const validContract = {
      title: "Termo de Consentimento Livre e Esclarecido (TCLE) LGPD",
      contract_type: "termo_lgpd" as const,
      status: "vigente" as const,
      content: "Cláusula 1: Autorização de tratamento de dados de saúde...",
    };

    const parsed = legalContractSchema.parse(validContract);
    assert.equal(parsed.title, "Termo de Consentimento Livre e Esclarecido (TCLE) LGPD");
    assert.equal(parsed.contract_type, "termo_lgpd");
    assert.equal(parsed.status, "vigente");
  });

  test("deve rejeitar contrato com tipo inexistente", () => {
    const invalidContract = {
      title: "Contrato de Teste",
      contract_type: "outro_tipo_inexistente",
    };

    assert.throws(() => {
      legalContractSchema.parse(invalidContract);
    });
  });

  test("deve aplicar filtros padrão de Auditoria", () => {
    const filterInput = {
      action: "CREATE_LEGAL_CASE",
      entity_type: "legal_case",
    };

    const parsed = auditFilterSchema.parse(filterInput);
    assert.equal(parsed.action, "CREATE_LEGAL_CASE");
    assert.equal(parsed.limit, 50);
  });

});
