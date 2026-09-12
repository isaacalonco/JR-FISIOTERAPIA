import { describe, it } from "node:test";
import assert from "node:assert";
import { loginSchema, passwordRecoverySchema, resetPasswordSchema } from "../utils/validators/auth.schema";
import { hasPermission } from "../lib/auth/rbac";
import { SessionContext } from "../types/auth.types";

describe("JR SAÚDE 1.0 - Testes do Módulo de Autenticação e RBAC", () => {
  it("deve validar dados de login válidos no loginSchema", () => {
    const validData = {
      email: "fisioterapeuta@jrsaude.com.br",
      password: "SenhaSegura123!",
      rememberMe: true,
    };
    const result = loginSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
  });

  it("deve rejeitar e-mail inválido ou senha curta no loginSchema", () => {
    const invalidEmail = {
      email: "email-invalido",
      password: "123",
    };
    const result = loginSchema.safeParse(invalidEmail);
    assert.strictEqual(result.success, false);
  });

  it("deve rejeitar confirmação de senha divergente no resetPasswordSchema", () => {
    const mismatchedPasswords = {
      password: "NovaSenhaForte123",
      confirmPassword: "OutraSenhaDivergente123",
    };
    const result = resetPasswordSchema.safeParse(mismatchedPasswords);
    assert.strictEqual(result.success, false);
  });

  it("deve validar redefinição com senhas idênticas e fortes", () => {
    const validReset = {
      password: "NovaSenhaForte123",
      confirmPassword: "NovaSenhaForte123",
    };
    const result = resetPasswordSchema.safeParse(validReset);
    assert.strictEqual(result.success, true);
  });

  it("deve verificar permissões RBAC corretamente", () => {
    const mockSession: SessionContext = {
      userId: "user-123",
      profile: {
        id: "profile-123",
        userId: "user-123",
        tenantId: "tenant-123",
        clinicId: "clinic-123",
        unitId: "unit-123",
        fullName: "Dr. João Silva",
        email: "joao@jrsaude.com.br",
        roles: ["FISIOTERAPEUTA"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      activeRole: "FISIOTERAPEUTA",
      permissions: ["patients.read", "physiotherapy.write"],
    };

    assert.strictEqual(hasPermission(mockSession, "patients.read"), true);
    assert.strictEqual(hasPermission(mockSession, "financial.admin"), false);
  });

  it("deve conceder todas as permissões para o perfil ADMIN via wildcard '*'", () => {
    const adminSession: SessionContext = {
      userId: "admin-123",
      profile: {
        id: "profile-admin",
        userId: "admin-123",
        tenantId: "tenant-123",
        clinicId: "clinic-123",
        fullName: "Administrador Geral",
        email: "admin@jrsaude.com.br",
        roles: ["ADMIN"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      activeRole: "ADMIN",
      permissions: ["*"],
    };

    assert.strictEqual(hasPermission(adminSession, "qualquer.permissao"), true);
  });
});
