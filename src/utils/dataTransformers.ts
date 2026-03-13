import { AudienceModel } from '../types';

export interface Experiment {
  name: string;
  last_modified: string;
  audience_conditions: any;
  id: number;
  variations: any[];
  status?: string;
}

/**
 * Extracts all audience IDs from experiment conditions
 */
export function extractAudienceIds(conditions: any): number[] {
  let ids: number[] = [];
  
  if (Array.isArray(conditions)) {
    conditions.forEach(cond => {
      ids = ids.concat(extractAudienceIds(cond));
    });
  } else if (typeof conditions === 'object' && conditions !== null) {
    if ('audience_id' in conditions && typeof conditions.audience_id === 'number') {
      ids.push(conditions.audience_id);
    }
    Object.values(conditions).forEach(val => {
      ids = ids.concat(extractAudienceIds(val));
    });
  }
  
  return ids;
}

/**
 * Maps experiments to audiences based on audience conditions
 */
export function mapExperimentsToAudiences(
  audiences: any[],
  experiments: Experiment[]
): AudienceModel[] {
  const audienceMap: { [id: number]: AudienceModel } = {};

  // Initialize audience map
  audiences.forEach((aud: any) => {
    audienceMap[aud.id] = {
      name: aud.name,
      audId: aud.id,
      projectId: aud.project_id,
      experiments: []
    };
  });

  // Map experiments to audiences
  experiments.forEach((exp: Experiment) => {
    const experimentData = {
      name: exp.name,
      last_modified: exp.last_modified,
      id: exp.id,
      variations: Array.isArray(exp.variations)
        ? exp.variations.map((v: any) => ({
            name: v.name,
            weight: v.weight
          }))
        : []
    };

    if (exp.audience_conditions === 'everyone') {
      // Add to all audiences
      Object.values(audienceMap).forEach(aud => {
        aud.experiments.push(experimentData);
      });
    } else {
      // Add to specific audiences
      const audienceIds = extractAudienceIds(exp.audience_conditions);
      audienceIds.forEach(audId => {
        if (audienceMap[audId]) {
          audienceMap[audId].experiments.push(experimentData);
        }
      });
    }
  });

  return Object.values(audienceMap);
}

/**
 * Calculates days from today for a given date string
 */
export function daysFromToday(dateStr: string): number {
  if (!dateStr) return 0;
  
  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) return 0;
  
  const today = new Date();
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffMs = today.getTime() - inputDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
