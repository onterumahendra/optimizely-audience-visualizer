// Custom hook for Optimizely data management
// Follows Single Responsibility Principle

import { useState, useCallback } from 'react';
import { AudienceModel } from '../types';
import * as api from '../services/optimizelyApi';
import { sessionStorage } from '../services/storageService';
import { mapExperimentsToAudiences } from '../utils/dataTransformers';

export function useOptimizelyData(token: string) {
  const [audienceModels, setAudienceModels] = useState<AudienceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAudienceData = useCallback(async (projectId: number) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = sessionStorage.getAudiences<AudienceModel[]>(projectId);
      if (cached) {
        setAudienceModels(cached);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const [audiences, experiments] = await Promise.all([
        api.fetchAudiences(projectId, token),
        api.fetchExperiments(projectId, token)
      ]);

      const model = mapExperimentsToAudiences(audiences, experiments);
      
      setAudienceModels(model);
      sessionStorage.setAudiences(projectId, model);
    } catch (err) {
      setError('Failed to fetch audiences or experiments.');
      console.error('Error loading audience data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    audienceModels,
    loading,
    error,
    loadAudienceData
  };
}
