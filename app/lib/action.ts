import type { Action, ActionRecommendedActivity, Objective } from "~/types/entities/action";
import { EntityType } from "~/types/entities/entities";

export function buildObjectiveEntity(data: any): Objective {
  return {
    id: data.id,
    name: data.attributes.displayName,
    description: data.attributes.displayDesc,
    section: data.attributes.section.value,
  };
}

export function buildRecommendedActivityEntity(data: any, included: any): ActionRecommendedActivity {
  const content = included.find((entity: any) => entity.type === EntityType.CONTENT && entity.id === data.relationships.content.data[0]!.id);

  return {
    id: data.id,
    name: data.attributes.title,
    icon: data.attributes.design.picture?.thumbnail,
    locked: data.attributes.permissions.isLocked,
    duration: content.attributes.duration || null,
  };
}

export function buildActionEntity(data: any, included: any): Action {
  const strategies = included.filter((entity: any) => entity.type === EntityType.STRATEGY);
  const config = included.find((entity: any) => entity.type === EntityType.CHANGR);
  const recommendations = included.filter((entity: any) => entity.type === EntityType.ACTIVITY_USER);

  const appliedStrategies = [
    data.relationships.impactMapCategory1.data[0]?.id,
    data.relationships.impactMapCategory2.data[0]?.id,
    data.relationships.impactMapCategory3.data[0]?.id,
    data.relationships.impactMapCategory4.data[0]?.id,
  ].filter((entity: any) => entity !== undefined && entity > 0);

  const strategy = included.filter((i: any) => i.type === EntityType.STRATEGY)[0];

  return {
    id: data.id,
    objective: {
      id: strategy.id,
      name: strategy.attributes.displayName,
      description: strategy.attributes.displayDesc,
      section: 4,
    },
    hasImpactMap: config?.attributes.specific.impactMapActive,
    strategies: strategies.filter((strategy: any) => appliedStrategies.includes(strategy.id)).map(buildObjectiveEntity).sort((a: any, b: any) => a.section < b.section ? 1 : -1),
    description: {
      original: data.attributes.description,
      raw: data.attributes.rawDescription,
    },
    end: new Date(data.attributes.dates.endAction),
    progression: data.attributes.progression,
    tasks: data.attributes.tasklist.map((t: any) => ({
      name: t.name,
      done: t.done,
    })),
    stats: {
      likes: data.attributes.stats.nbLikes,
      followers: data.attributes.stats.nbFollowers,
      comments: data.attributes.stats.nbComments,
    },
    recommendations: recommendations.map((recommendation: any) => buildRecommendedActivityEntity(recommendation, included)),
  };
}
