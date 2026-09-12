import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  sendWhatsAppMessageSchema,
  whatsappConfirmationSchema,
  aiTranscriptionInputSchema,
  humanVerificationSchema,
} from "../utils/validators/whatsapp-ai.schema";
import { generateConfirmationToken } from "../services/whatsapp.service";

describe("JR FISIOTERAPIA 1.0 - Testes da FASE 8 (WhatsApp Business API & IA Clínica)", () => {

  test("deve validar dados de envio de lembrete no WhatsApp com sucesso", () => {
    const validData = {
      appointmentId: "123e4567-e89b-12d3-a456-426614174000",
      phoneNumber: "(61) 99888-7777",
    };

    const parsed = sendWhatsAppMessageSchema.parse(validData);
    assert.equal(parsed.appointmentId, validData.appointmentId);
    assert.equal(parsed.phoneNumber, validData.phoneNumber);
  });

  test("deve rejeitar telefone inválido ou curto no schema do WhatsApp", () => {
    const invalidData = {
      appointmentId: "123e4567-e89b-12d3-a456-426614174000",
      phoneNumber: "123", // curto demais
    };

    assert.throws(() => {
      sendWhatsAppMessageSchema.parse(invalidData);
    });
  });

  test("deve validar acionamento de token público do WhatsApp (CONFIRM/CANCEL)", () => {
    const confirmInput = {
      token: "jrfizio_1234567890abcdefghijklmn",
      action: "CONFIRM",
    };

    const cancelInput = {
      token: "jrfizio_1234567890abcdefghijklmn",
      action: "CANCEL",
      reason: "Paciente viajará a trabalho",
    };

    assert.doesNotThrow(() => whatsappConfirmationSchema.parse(confirmInput));
    assert.doesNotThrow(() => whatsappConfirmationSchema.parse(cancelInput));
  });

  test("deve gerar token seguro de confirmação no formato jrfizio_*", () => {
    const token = generateConfirmationToken();
    assert.ok(token.startsWith("jrfizio_"));
    assert.ok(token.length > 20);
  });

  test("deve validar entrada de transcrição bruta da IA", () => {
    const input = {
      patientId: "123e4567-e89b-12d3-a456-426614174000",
      rawText: "Paciente refere dor forte na região lombar ao se abaixar",
    };

    const parsed = aiTranscriptionInputSchema.parse(input);
    assert.equal(parsed.patientId, input.patientId);
    assert.equal(parsed.rawText, input.rawText);
  });

  test("deve validar formulário de Validação Humana Clínica Obrigatória", () => {
    const validVerification = {
      transcriptionId: "123e4567-e89b-12d3-a456-426614174000",
      chiefComplaint: "Lombociatalgia aguda",
      painLevel: 8,
      conductOrNotes: "Aprovado em triagem física prévia",
    };

    const parsed = humanVerificationSchema.parse(validVerification);
    assert.equal(parsed.chiefComplaint, "Lombociatalgia aguda");
    assert.equal(parsed.painLevel, 8);
  });

  test("deve rejeitar validação humana com escala de dor inválida (maior que 10 ou menor que 0)", () => {
    const invalidVerification = {
      transcriptionId: "123e4567-e89b-12d3-a456-426614174000",
      chiefComplaint: "Lombociatalgia",
      painLevel: 15, // inválido!
    };

    assert.throws(() => {
      humanVerificationSchema.parse(invalidVerification);
    });
  });

});
