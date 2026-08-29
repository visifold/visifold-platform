import type { ZodType } from "zod";

export function parseContract<TOutput>(schema: ZodType<TOutput>, input: unknown): TOutput {
  return schema.parse(input);
}
