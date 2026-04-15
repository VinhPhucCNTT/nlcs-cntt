import type { UserRole } from "../types/sidebar";

export function getPrimaryRole(roles: string[] | undefined): UserRole {
  const r = roles ?? [];
  if (r.includes("Admin")) return "Admin";
  if (r.includes("Instructor")) return "Instructor";
  return "Student";
}
