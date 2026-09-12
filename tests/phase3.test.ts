import { describe, it } from "node:test";
import assert from "node:assert";
import { patientSchema } from "../utils/validators/patient.schema";
import { professionalSchema } from "../utils/validators/professional.schema";
import { serviceSchema } from "../utils/validators/service.schema";

describe("JR SAÚDE 1.0 - Testes da FASE 3 (Pacientes, Profissionais e Serviços)", () => {
  it("deve validar dados de paciente válidos no patientSchema", () => {
    const validPatient = {
      fullName: "Carlos Eduardo da Silva",
      cpf: "52998224725", // CPF válido para teste
      rg: "12.345.678-9",
      birthDate: "1985-05-15",
      gender: "MASCULINO",
      phone: "(11) 98765-4321",
      email: "carlos.silva@email.com",
    };

    const result = patientSchema.safeParse(validPatient);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar paciente com CPF inválido no patientSchema", () => {
    const invalidCPF = {
      fullName: "Ana Maria",
      cpf: "111.111.111-11", // CPF falso
      birthDate: "1990-01-01",
      gender: "FEMININO",
      phone: "11987654321",
    };

    const result = patientSchema.safeParse(invalidCPF);
    assert.strictEqual(result.success, false);
  });

  it("deve validar cadastro de profissional com registro de conselho no professionalSchema", () => {
    const validProf = {
      profileId: "123e4567-e89b-12d3-a456-426614174000",
      specialtyId: "123e4567-e89b-12d3-a456-426614174001",
      councilNumber: "123456-F",
      councilState: "SP",
      commissionRateDefault: 40,
    };

    const result = professionalSchema.safeParse(validProf);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar comissão negativa no professionalSchema", () => {
    const invalidProf = {
      profileId: "123e4567-e89b-12d3-a456-426614174000",
      specialtyId: "123e4567-e89b-12d3-a456-426614174001",
      councilNumber: "123456-F",
      councilState: "SP",
      commissionRateDefault: -10,
    };

    const result = professionalSchema.safeParse(invalidProf);
    assert.strictEqual(result.success, false);
  });

  it("deve validar serviço com preço e duração válida no serviceSchema", () => {
    const validService = {
      name: "Sessão de Quiropraxia",
      description: "Ajuste articular articular e alívio vertebral",
      price: 130.00,
      durationMinutes: 45,
    };

    const result = serviceSchema.safeParse(validService);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar preço negativo ou duração menor que 5 min no serviceSchema", () => {
    const invalidService = {
      name: "Sessão Rápida",
      price: -50.00,
      durationMinutes: 2,
    };

    const result = serviceSchema.safeParse(invalidService);
    assert.strictEqual(result.success, false);
  });
});
