// API Service for Optimizely
// Follows Single Responsibility Principle - only handles API calls

// ============================================
// API Response Types
// These represent raw responses from Optimizely API
// Domain models are defined in ../types/index.ts
// ============================================

export interface OptimizelyProject {
  id: number;
  name: string;
  description: string;
  account_id: number;
  is_flags_enabled: boolean;
}

export interface OptimizelyAudience {
  name: string;
  project_id: number;
  id: number;
  experiments: any[];
}

export interface OptimizelyExperiment {
  name: string;
  last_modified: string;
  audience_conditions: any;
  id: number;
  variations: any[];
  status?: string;
}

const BASE_URL = 'https://api.optimizely.com/v2';
const PROXY_URL = 'https://try.readme.io/https://api.optimizely.com/v2';

/**
 * Fetches paginated data from Optimizely API
 */
async function fetchPaginatedData<T>(
  endpoint: string,
  token: string,
  useProxy = false
): Promise<T[]> {
  let allData: T[] = [];
  let page = 1;
  const perPage = 100;
  const baseUrl = useProxy ? PROXY_URL : BASE_URL;

  while (true) {
    const response = await fetch(
      `${baseUrl}${endpoint}&per_page=${perPage}&page=${page}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;
    
    allData = allData.concat(data);
    if (data.length < perPage) break;
    page++;
  }

  return allData;
}

/**
 * Fetches all projects for a given token
 */
export async function fetchProjects(token: string): Promise<OptimizelyProject[]> {
  const response = await fetch(`${BASE_URL}/projects?per_page=25&page=1`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(proj => ({
    id: proj.id,
    name: proj.name,
    description: proj.description,
    account_id: proj.account_id,
    is_flags_enabled: proj.is_flags_enabled || false,
  })) : [];
}

/**
 * Fetches all audiences for a project
 */
export async function fetchAudiences(
  projectId: number,
  token: string
): Promise<OptimizelyAudience[]> {
  const audiences = await fetchPaginatedData<any>(
    `/audiences?project_id=${projectId}`,
    token
  );

  return audiences.map(aud => ({
    name: aud.name,
    project_id: aud.project_id,
    id: aud.id,
    experiments: [],
  }));
}

/**
 * Fetches all experiments for a project
 */
export async function fetchExperiments(
  projectId: number,
  token: string
): Promise<OptimizelyExperiment[]> {
  const experiments = await fetchPaginatedData<any>(
    `/experiments?project_id=${projectId}`,
    token,
    true // Use proxy for experiments
  );

  return experiments
    .filter(exp => exp.status === 'running')
    .map(exp => ({
      name: exp.name,
      last_modified: exp.last_modified,
      audience_conditions:
        exp.audience_conditions === 'everyone'
          ? 'everyone'
          : typeof exp.audience_conditions === 'string'
          ? JSON.parse(exp.audience_conditions)
          : exp.audience_conditions,
      id: exp.id,
      variations: exp.variations,
    }));
}
