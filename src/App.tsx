import React, { useState, useEffect, useCallback, Suspense, lazy, memo } from 'react';
import {
  Grid, Box, Typography, Tooltip, FormControl, Select, MenuItem, InputLabel, 
  Skeleton, Container, Button
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Project } from './types';
import { useOptimizelyData } from './hooks/useOptimizelyData';
import * as api from './services/optimizelyApi';
import { localStorage as localStorageService, sessionStorage as sessionStorageService } from './services/storageService';
import onterTheme from './theme';

// Lazy load components for better performance
const AudienceTreemap = lazy(() => import('./components/AudienceTreemap'));
const TokenInput = lazy(() => import('./components/TokenInput'));
const HelpDialog = lazy(() => import('./components/HelpDialog'));
const ProjectSelector = lazy(() => import('./components/ProjectSelector'));
const LoadingState = lazy(() => import('./components/LoadingState'));

const App: React.FC = memo(() => {
  const [token, setToken] = useState<string>(() => localStorageService.getToken() || '');
  const [isTokenAvailable, setIsTokenAvailable] = useState<boolean>(() => !!localStorageService.getToken());
  const [projects, setProjects] = useState<Project[]>(() => sessionStorageService.getProjects() || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(() => sessionStorageService.getActiveTab());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [howToOpen, setHowToOpen] = useState(false);

  const { audienceModels, loading: dataLoading, loadAudienceData } = useOptimizelyData(token);

  // Load cached data on mount
  useEffect(() => {
    if (projects.length > 0 && projects[tabIndex]) {
      loadAudienceData(projects[tabIndex].id);
    }
  }, [projects, tabIndex, loadAudienceData]);

  const clearAllStateAndStorage = useCallback((removeToken = true) => {
    setProjects([]);
    setIsTokenAvailable(false);
    setTabIndex(0);
    setSelectedProjectId(null);
    sessionStorageService.clearAll(removeToken);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!token) return;
    setError(null);
    
    const storedToken = localStorageService.getToken();
    const storedProjects = sessionStorageService.getProjects();
    
    if (token === storedToken && token !== '' && storedProjects) {
      setIsTokenAvailable(true);
      return;
    }
    
    if (token !== storedToken) {
      clearAllStateAndStorage(false);
      localStorageService.setToken(token);
    }
    
    setLoading(true);
    try {
      const projectsData = await api.fetchProjects(token);
      
      if (projectsData.length > 0) {
        setProjects(projectsData);
        sessionStorageService.setProjects(projectsData);
        localStorageService.setToken(token);
        setIsTokenAvailable(true);
        setDialogOpen(true);
      } else {
        setError('No projects found for this token.');
        clearAllStateAndStorage();
      }
    } catch (err) {
      setError('Failed to fetch projects. Please check your token and network connection.');
      clearAllStateAndStorage();
    }
    setLoading(false);
  }, [token, clearAllStateAndStorage]);

  const handleProjectChange = useCallback(async (selectedId: number) => {
    const idx = projects.findIndex(p => p.id === selectedId);
    if (idx !== -1) {
      setTabIndex(idx);
      sessionStorageService.setActiveTab(idx);
      const selected = projects[idx];
      sessionStorageService.setActiveProject({
        account_id: selected.account_id,
        id: selected.id,
        name: selected.name,
        description: selected.description,
      });
      await loadAudienceData(selectedId);
    }
  }, [projects, loadAudienceData]);

  const handleDialogClose = useCallback(async () => {
    setDialogOpen(false);
    if (selectedProjectId !== null) {
      const selected = projects.find(p => p.id === selectedProjectId);
      if (selected) {
        sessionStorageService.setActiveProject({
          account_id: selected.account_id,
          id: selected.id,
          name: selected.name,
          description: selected.description,
        });
        const idx = projects.findIndex(p => p.id === selectedProjectId);
        if (idx !== -1) {
          setTabIndex(idx);
          sessionStorageService.setActiveTab(idx);
          await loadAudienceData(selected.id);
        }
      }
    }
  }, [projects, selectedProjectId, loadAudienceData]);

  const isLoading = loading || dataLoading;

  return (
    <ThemeProvider theme={onterTheme}>
      <Container maxWidth="xl" >
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Optimizely Audience Visualizer
        </Typography>
        {isTokenAvailable && projects.length > 0 && !isLoading && (
          <Box display="flex" gap={2} alignItems="center">
            <Tooltip title="Update Bearer Token">
              <Button size="small" onClick={() => setIsTokenAvailable(false)}>
                Update Token
              </Button>
            </Tooltip>
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel id="project-select-label">Select Project</InputLabel>
              <Select
                labelId="project-select-label"
                value={projects[tabIndex]?.id ?? ''}
                label="Select Project"
                onChange={(e) => handleProjectChange(Number(e.target.value))}
              >
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Grid>

      {(!isTokenAvailable || projects.length === 0) && (
        <Box sx={{ p: 3, mb: 2 }} className="styled-box">
          <Suspense fallback={<Skeleton variant="rectangular" height={100} />}>
            <TokenInput
              token={token}
              onTokenChange={setToken}
              onContinue={handleContinue}
              onHelpClick={() => setHowToOpen(true)}
              loading={loading}
              error={error}
            />
            <HelpDialog open={howToOpen} onClose={() => setHowToOpen(false)} />
          </Suspense>
        </Box>
      )}

      {projects.length > 0 && !isLoading && isTokenAvailable && audienceModels.length > 0 && (
        <Box sx={{ p: 3 }} className="styled-box">
          <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={600} />}>
            <AudienceTreemap audiences={audienceModels} />
          </Suspense>
        </Box>
      )}

      {isLoading && (
        <Suspense fallback={<Skeleton variant="rectangular" height={200} />}>
          <LoadingState />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <ProjectSelector
          open={dialogOpen}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
          onConfirm={handleDialogClose}
          onClose={() => setDialogOpen(false)}
        />
      </Suspense>
    </Container>
    </ThemeProvider>
  );
});

App.displayName = 'App';

export default App;
