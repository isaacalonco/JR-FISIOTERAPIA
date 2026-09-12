import { z } from "zod";
import { emailSchema } from "../validators";

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, "A senha deve conter no mínimo 6 caracteres")
    .max(100, "Senha muito longa"),
  rememberMe: z.boolean().optional().default(false),
});

export const passwordRecoverySchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A nova senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordRecoveryInput = z.infer<typeof passwordRecoverySchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
