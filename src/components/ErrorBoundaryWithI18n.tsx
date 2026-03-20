// Error Boundary with I18n Support
// Wrapper that provides internationalized error messages

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ErrorBoundaryWithI18nProps {
  children: ReactNode;
}

// Simplified wrapper using default ErrorBoundary
export const ErrorBoundaryWithI18n: React.FC<ErrorBoundaryWithI18nProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWithI18n;
