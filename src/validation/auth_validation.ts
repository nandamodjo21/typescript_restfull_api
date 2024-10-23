import { ZodType, z } from "zod";

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(255),
    username: z.string().min(1).max(255),
    email:z.string().min(1).max(255),
    whatsapp:z.string().min(1).max(255).nullable(),
    password: z.string().min(1).max(255),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
  });

  static readonly ACTIVATION: ZodType = z.object({
    email: z.string().email()
  });
}
