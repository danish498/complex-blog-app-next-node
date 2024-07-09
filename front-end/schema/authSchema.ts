import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const LoginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
export type TSignUpSchema = z.infer<typeof SignupSchema>;
