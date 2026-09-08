import type { Locale } from "../../config/constants.ts";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: number;
        email: string;
        role: string;
      };
      locale: Locale;
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

export {};
