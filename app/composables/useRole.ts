import { UserRole } from "~/types/entities/user";

export function useRole(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN: return "developer";
    case UserRole.ANALYST: return "analyst";
    case UserRole.FACILITATOR: return "facilitator";
    case UserRole.COACH: return "coach";
    case UserRole.MANAGER: return "manager";
    case UserRole.CREATOR: return "creator";
    default: return "participant";
  }
}
