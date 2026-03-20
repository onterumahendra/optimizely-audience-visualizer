# Optimizely Audience Visualizer

An interactive treemap visualization tool for Optimizely audiences and experiments. Visualize which experiments are targeting which audiences at a glance.


Demo: https://onterumahendra.github.io/optimizely-audience-visualizer/

<img width="722" height="331" alt="Screenshot_2026-03-19_at_3 07 27_PM" src="https://github.com/user-attachments/assets/39257b16-6174-4b80-b881-e3bb2b683f91" />

<img width="722" height="333" alt="Screenshot_2026-03-19_at_3 06 40_PM" src="https://github.com/user-attachments/assets/67c416c7-a5e2-4abb-bb99-95057ef3d633" />

![1773418734945](https://github.com/user-attachments/assets/cbbc8e86-1e97-4760-aab8-cb756857f333)

![1773418735993](https://github.com/user-attachments/assets/c6dde077-3b3a-42e7-b3a9-711c3a61d538)


## 🎯 Features

- **Interactive Treemap Visualization**: See all your audiences sized by the number of experiments targeting them
- **Color-Coded Heat Map**: Quickly identify heavily-used audiences with stoplight colors (red-yellow-green)
- **Filter & Search**: Find specific audiences easily with multi-select filtering
- **Export Capabilities**: Download visualizations as PNG and experiment data as Excel
- **Optimizely API Integration**: Direct integration with Optimizely REST API v2
- **Secure**: Your API token is stored locally in your browser only
- **Fast**: Built with Vite, code splitting, and lazy loading for optimal performance
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smart Caching**: Session and local storage caching for faster load times

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- An Optimizely account with API access

### Installation

```bash
# Clone the repository
git clone https://github.com/onterumahendra/optimizely-audience-visualizer.git
cd optimizely-audience-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 📖 How to Use

### 1. Generate an Optimizely API Token

1. Log in to your Optimizely account at [app.optimizely.com](https://app.optimizely.com)
2. Click on **Profile** in the bottom left corner
3. Select the **API Access** tab
4. Click **Generate New Token**
5. Name your token and click **Create**
6. Copy the token (it won't be shown again!)

### 2. Enter Your Token

Paste your API token into the application. It will be securely stored in your browser's local storage.

### 3. Select a Project

Choose the Optimizely project you want to visualize from the list.

### 4. Explore Your Data

- **Treemap View**: Each block represents an audience, sized by experiment count
- **Color Coding**: Red = high usage, Yellow = medium, Green = low usage
- **Click a Block**: See detailed experiment information with export options
- **Filter Audiences**: Use the filter icon to show/hide specific audiences with multi-select
- **Search**: Quickly find audiences by name in the filter dialog
- **Download**: Export the visualization as PNG or experiment data as Excel

## 🎨 Color Legend

The treemap uses a classic "stoplight" color scheme with 6 shades to indicate experiment density:

- 🔴 **Dark Red**: Highest number of experiments (83-100%)
- 🔴 **Red**: High number of experiments (67-83%)
- 🟡 **Yellow**: Medium-high number of experiments (50-67%)
- 🟡 **Dark Yellow**: Medium number of experiments (33-50%)
- 🟢 **Green**: Low number of experiments (17-33%)
- 🟢 **Dark Green**: Lowest number of experiments (0-17%)

Note: Higher experiment counts are shown in red to indicate areas that may need attention or optimization.

## 🛠️ Development

### Tech Stack

- **React 18** - UI framework with hooks and functional components
- **TypeScript** - Type safety and better developer experience
- **Vite** - Ultra-fast build tool and dev server
- **Material-UI (MUI) v6** - Modern component library with custom Onter theme
- **Recharts** - Powerful charting library for treemap visualization
- **Optimizely REST API v2** - Data source
- **html2canvas** - PNG export functionality
- **react-export-table-to-excel** - Excel export capabilities

### Architecture

- **SOLID Principles**: Clean separation of concerns with single responsibility per module
- **Service Layer Pattern**: Dedicated API and storage services
- **Custom Hooks**: Reusable data fetching and state management
- **Code Splitting**: Lazy loading for optimal bundle size
- **Performance Optimized**: React.memo, useMemo, and Suspense for faster rendering
- **Type-Safe**: Full TypeScript coverage for reliability

### Development Benefits

- **Maintainable**: Modular architecture makes updates and debugging easier
- **Testable**: Separated concerns allow for focused unit testing
- **Extensible**: Easy to add new features without affecting existing code
- **Performant**: Optimized for Lighthouse performance scores
- **Developer-Friendly**: TypeScript provides excellent IDE support and autocomplete
- **Type-Safe**: All shared types centralized in `/src/types/` for consistency and reusability

### Project Structure

```
optimizely-audience-visualizer/
├── src/
│   ├── components/              # React components (lazy loaded)
│   │   ├── AudienceTreemap.tsx           # Main treemap visualization
│   │   ├── AudienceExperimentsDialog.tsx # Experiment details dialog
│   │   ├── AudienceFilterDialog.tsx      # Audience filtering UI
│   │   ├── ColorLegend.tsx               # Heat map legend
│   │   ├── HelpDialog.tsx                # API token help
│   │   ├── LoadingState.tsx              # Loading skeleton
│   │   ├── ProjectSelector.tsx           # Project selection dialog
│   │   └── TokenInput.tsx                # Token input form
│   ├── constants/               # Configuration constants
│   │   └── treemapColors.ts     # Color scheme for treemap (customizable)
│   ├── hooks/                   # Custom React hooks
│   │   └── useOptimizelyData.ts # Data fetching hook
│   ├── services/                # Service layer (SOLID)
│   │   ├── optimizelyApi.ts     # API calls to Optimizely
│   │   └── storageService.ts    # localStorage/sessionStorage
│   ├── utils/                   # Pure utility functions
│   │   └── dataTransformers.ts  # Data transformation logic
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # All shared types (Domain models, UI config)
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Application entry point
│   ├── theme.ts                 # MUI custom theme (Onter branding)
│   ├── index.css                # Global styles
│   └── globalStyles.css         # Utility CSS classes
├── public/                      # Static assets
├── .github/workflows/           # GitHub Actions CI/CD
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
npm run deploy   # Deploy to GitHub Pages
```

## 🌐 Deployment

### Deploy to GitHub Pages

1. **Update the base path** in `vite.config.ts`:
   ```ts
   export default defineConfig({
     base: '/optimizely-audience-visualizer/', // Replace with your repository name
     // ...
   })
   ```

2. **Update repository URL** in `package.json`:
   ```json
   {
     "repository": {
       "url": "https://github.com/onterumahendra/optimizely-audience-visualizer.git"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to **Pages**
   - Select **gh-pages** branch as the source
   - Your site will be live at `https://onterumahendra.github.io/optimizely-audience-visualizer/`

### Alternative: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

Done! Vercel auto-detects Vite configuration.

### Alternative: Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import from Git"
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy"

## 🔒 Security & Privacy

- **Your API token never leaves your browser** - it's stored in localStorage only
- API calls are made directly from your browser to Optimizely
- No data is sent to any third-party servers
- No analytics or tracking

## 🎨 Customization

### Custom Branding

The application uses a default theme defined in `src/theme.ts`. To customize:

```typescript
// src/theme.ts
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#YOUR_COLOR',
      // ...
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
```

### Customizing Treemap Colors

The treemap color scheme is defined in `src/constants/treemapColors.ts` for easy customization:

```typescript
// src/constants/treemapColors.ts
export const colorBins = [
  { color: '#c23e15', threshold: 0.83 },  // Dark Red - Highest
  { color: '#e24b1a', threshold: 0.67 },  // Red - High
  { color: '#f6bc33', threshold: 0.50 },  // Yellow - Medium-High
  { color: '#d9a52e', threshold: 0.33 },  // Dark Yellow - Medium
  { color: '#6da81e', threshold: 0.17 },  // Green - Low
  { color: '#5a8c19', threshold: 0.0 },   // Dark Green - Lowest
];
```

**Alternative color schemes** are documented in the file with examples for blue gradient, purple gradient, and more. Simply modify the hex color values to match your preference.

### Adding a Logo

To add your company logo, add an image to `/public/` and update the header in `src/App.tsx`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Optimizely community
- Inspired by the need to visualize complex audience/experiment relationships
- Uses the [Optimizely REST API v2](https://docs.developers.optimizely.com/web-experimentation/reference/introduction)

## 📞 Support

If you encounter any issues or have questions:

- **Issues**: [GitHub Issues](https://github.com/onterumahendra/optimizely-audience-visualizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/onterumahendra/optimizely-audience-visualizer/discussions)

## 🗺️ Roadmap

### Completed ✅
- [x] SOLID architecture refactoring
- [x] Code splitting and lazy loading
- [x] Service layer implementation
- [x] Custom hooks for data management
- [x] Performance optimizations (React.memo, useMemo)
- [x] Smart caching with session/local storage
- [x] Multi-select audience filtering
- [x] Responsive Grid layouts (MUI v6)
- [x] Custom theme support
- [x] Dark mode theme
- [x] Error boundaries for better error handling
- [x] Localization / Globalization

### Planned 🚀
- [ ] Support for Optimizely Feature Flags
- [ ] Advanced filtering options (date ranges, experiment status)
- [ ] Historical trend analysis
- [ ] Multiple project comparison view
- [ ] PDF export
- [ ] Unit and E2E tests
- [ ] Virtual scrolling for large datasets

---

Made with ❤️ by the open-source community
