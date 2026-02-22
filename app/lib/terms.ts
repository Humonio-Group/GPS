import type { Term } from "~/types/entities/terms";

export function buildTermEntity(data: any): Term {
  return {
    id: data.id,
    name: data.attributes.displayTitle,
    description: data.attributes.displayDescription,
    canRevoke: data.attributes.permissions.isRevokable,
    lastUpdate: new Date(data.attributes.dates.update),
  };
}
