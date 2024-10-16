import { ZodType, z } from "zod";

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
    name: z.string().min(1).max(255),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
  });
}
