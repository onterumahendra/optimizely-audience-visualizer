// English translations
export const en = {
  app: {
    title: 'Optimizely Audience Visualizer',
  },
  common: {
    continue: 'Continue',
    confirm: 'Confirm',
    cancel: 'Cancel',
    apply: 'Apply',
    close: 'Close',
    clear: 'Clear',
    download: 'Download',
    filter: 'Filter',
    search: 'Search',
    select: 'Select',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noData: 'No data available',
    settings: 'Settings',
    settingsSaved: 'Settings are saved automatically',
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    toggleTheme: 'Toggle theme',
    system: 'System',
    modeLabel: 'Mode',
    systemDescription: 'System mode adjusts automatically based on time',
  },
  language: {
    title: 'Language',
    english: 'English',
    chinese: '中文',
  },
  tokenInput: {
    label: 'Optimizely API Bearer Token',
    helpTooltip: 'How to generate Token',
    placeholder: 'Enter your API token',
    ariaLabel: 'API Bearer Token Input',
  },
  projectSelector: {
    dialogTitle: 'Select a Project',
    projectLabel: 'Project-{index}',
    projectDescription: 'Project Description',
    confirmButton: 'Confirm',
    noProjectSelected: 'Please select a project',
  },
  audienceTreemap: {
    title: 'Audience Treemap',
    filterLabel: 'Filter audiences',
    downloadLabel: 'Download treemap',
    audienceLabel: 'Audience {index}',
    experimentsCount: '{count} experiments',
    noAudiences: 'No audiences available',
    downloadError: 'Failed to download treemap.',
    downloadFileName: '{projectName}-audience-treemap.png',
  },
  audienceFilter: {
    dialogTitle: 'Filter Audiences',
    searchPlaceholder: 'Search audiences...',
    selectAll: 'Select All',
    clearAll: 'Clear All',
    applyButton: 'Apply',
    cancelButton: 'Cancel',
    selectedCount: '{count} selected',
  },
  audienceExperiments: {
    dialogTitle: 'Experiments for {audienceName}',
    experimentId: 'ID',
    experimentName: 'Name',
    experimentStatus: 'Status',
    noExperiments: 'No experiments found',
    exportButton: 'Export to Excel',
  },
  colorLegend: {
    title: 'Experiments',
    min: 'Min: {value}',
    max: 'Max: {value}',
  },
  helpDialog: {
    title: 'How to Generate an API Token',
    step1: 'Step 1: Log in to your Optimizely account',
    step2: 'Step 2: Navigate to Settings > Personal Access Tokens',
    step3: 'Step 3: Click "Generate New Token"',
    step4: 'Step 4: Copy the token and paste it here',
    closeButton: 'Close',
  },
  errors: {
    fetchProjectsFailed: 'Failed to fetch projects. Please check your token and network connection.',
    noProjectsFound: 'No projects found for this token.',
    loadAudienceFailed: 'Failed to load audience data.',
    invalidToken: 'Invalid token. Please check your token and try again.',
    networkError: 'Network error. Please check your internet connection.',
    unknownError: 'An unknown error occurred. Please try again.',
    somethingWentWrong: 'Something went wrong',
    errorBoundaryMessage: 'An error occurred in this component. Please refresh the page.',
    refreshPage: 'Refresh Page',
  },
  loadingState: {
    fetchingProjects: 'Fetching projects...',
    loadingAudiences: 'Loading audiences...',
    processingData: 'Processing data...',
  },
} as const;

// Translation structure type
export type TranslationStructure = typeof en;

// Allow translations to have any string value with same structure
export type TranslationKeys = {
  [K in keyof TranslationStructure]: {
    [P in keyof TranslationStructure[K]]: string;
  };
};
