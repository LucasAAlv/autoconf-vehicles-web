import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Informe o nome"),
    email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
    // Mirrors Laravel's default Password::defaults() rule (min 8 chars).
    password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
