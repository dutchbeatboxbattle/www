export function sitePath(value: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    (base && (value === base || value.startsWith(base + "/")))
  )
    return value;
  return base + value;
}
export function isSafeLink(value: string): boolean {
  if (!value) return true;
  if (/[\s\\\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith("#")) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
