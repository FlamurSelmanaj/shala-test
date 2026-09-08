/**
 * Express 5's default (unparametrized) Request types route params as
 * `string | string[]` to account for wildcard segments. Our routes never use
 * wildcards, so this just normalizes back to the single string every plain
 * `:param` segment actually produces at runtime.
 */
export function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
