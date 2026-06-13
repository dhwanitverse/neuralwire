/** Normalize email for API requests (trim + lowercase). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
