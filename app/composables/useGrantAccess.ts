import type { UserRole } from "~/types/entities/user";

export function useGrantAccess(roles: UserRole[]): boolean {
  const { activeRoles } = storeToRefs(useUserStore());
  return !!activeRoles.value?.some(r => roles.includes(r));
}
