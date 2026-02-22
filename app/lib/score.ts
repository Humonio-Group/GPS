import type { Score } from "~/types/entities/score";

export function buildScoreEntity(courseId: number, data: any): Score {
  const id = data.id;
  const name = data.attributes.name;
  const description = data.attributes.description;
  const color = data.attributes.color;

  const config = {
    min: data.attributes.minimum,
    max: data.attributes.maximum,
  };

  const courseProgress = data.attributes.recipient.programCurrentScores.find((s: any) => s.journey === courseId);
  const progress = {
    value: courseProgress.currentScore || 0,
    percent: (courseProgress.currentScore || 0) / config.max,
  };

  return {
    id,
    name,
    description,
    color,
    config,
    progress,
  };
}
