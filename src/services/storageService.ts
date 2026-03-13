// Storage Service
// Follows Single Responsibility Principle - only handles storage operations

const STORAGE_KEYS = {
  PROJECTS: 'optimizely_projects',
  TOKEN: 'optimizely_token',
  ACTIVE_TAB: 'optimizely_active_tab',
  ACTIVE_PROJECT: 'optimizely_active_project',
  AUDIENCE_PREFIX: 'optimizely_audiences_',
  EXPERIMENT_PREFIX: 'optimizely_experiments_',
} as const;

export { STORAGE_KEYS };

// Local Storage Operations
export const localStorage = {
  getToken: (): string | null => {
    return window.localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
  setToken: (token: string): void => {
    window.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },
  removeToken: (): void => {
    window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },
};

// Session Storage Operations
export const sessionStorage = {
  getProjects: <T>(): T | null => {
    const stored = window.sessionStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : null;
  },
  setProjects: <T>(projects: T): void => {
    window.sessionStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },
  getActiveTab: (): number => {
    const stored = window.sessionStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    return stored ? Number(stored) : 0;
  },
  setActiveTab: (index: number): void => {
    window.sessionStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, String(index));
  },
  getActiveProject: <T>(): T | null => {
    const stored = window.sessionStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT);
    return stored ? JSON.parse(stored) : null;
  },
  setActiveProject: <T>(project: T): void => {
    window.sessionStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, JSON.stringify(project));
  },
  getAudiences: <T>(projectId: number): T | null => {
    const key = `${STORAGE_KEYS.AUDIENCE_PREFIX}${projectId}`;
    const stored = window.sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  },
  setAudiences: <T>(projectId: number, audiences: T): void => {
    const key = `${STORAGE_KEYS.AUDIENCE_PREFIX}${projectId}`;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(audiences));
    } catch (e) {
      console.warn('SessionStorage quota exceeded:', e);
    }
  },
  getExperiments: <T>(projectId: number): T | null => {
    const key = `${STORAGE_KEYS.EXPERIMENT_PREFIX}${projectId}`;
    const stored = window.sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  },
  setExperiments: <T>(projectId: number, experiments: T): void => {
    const key = `${STORAGE_KEYS.EXPERIMENT_PREFIX}${projectId}`;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(experiments));
    } catch (e) {
      console.warn('SessionStorage quota exceeded:', e);
    }
  },
  clearAll: (removeToken = true): void => {
    window.sessionStorage.removeItem(STORAGE_KEYS.PROJECTS);
    window.sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
    window.sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
    
    // Clear all audience and experiment caches
    Object.keys(window.sessionStorage).forEach(key => {
      if (
        key.startsWith(STORAGE_KEYS.AUDIENCE_PREFIX) ||
        key.startsWith(STORAGE_KEYS.EXPERIMENT_PREFIX)
      ) {
        window.sessionStorage.removeItem(key);
      }
    });

    if (removeToken) {
      localStorage.removeToken();
    }
  },
};
