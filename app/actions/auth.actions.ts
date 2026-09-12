"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, passwordRecoverySchema, resetPasswordSchema } from "@/utils/validators/auth.schema";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Server Action para efetuar Login de usuário com e-mail e senha.
 */
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message || "Dados de login inválidos.",
    };
  }

  const { email, password } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let errorMessage = "E-mail ou senha incorretos.";
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Por favor, confirme seu e-mail antes de realizar o acesso.";
    }
    return {
      success: false,
      error: errorMessage,
    };
  }

  redirect("/dashboard");
}

/**
 * Server Action para Logout do Usuário.
 */
export async function logoutAction(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Server Action para solicitar recuperação de senha por e-mail.
 */
export async function requestPasswordResetAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email");
  const validation = passwordRecoverySchema.safeParse({ email });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "E-mail inválido.",
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email, {
    redirectTo: `${siteUrl}/login/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: "Não foi possível enviar o e-mail de recuperação. Tente novamente.",
    };
  }

  return {
    success: true,
    message: "E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.",
  };
}

/**
 * Server Action para redefinir a senha do usuário autenticado.
 */
export async function updatePasswordAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = resetPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Senha inválida.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return {
      success: false,
      error: "Falha ao atualizar a senha. A sessão pode ter expirado.",
    };
  }

  redirect("/login?message=senha_atualizada");
}
