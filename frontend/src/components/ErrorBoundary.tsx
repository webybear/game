import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import { Refresh, ErrorOutline } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF9999 90%)',
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 64,
                color: 'white',
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              Something went wrong!
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'white', mb: 3, opacity: 0.9 }}
            >
              The Force is not strong with this one. An unexpected error occurred.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                onClick={this.handleReset}
                startIcon={<Refresh />}
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={this.handleReload}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Reload Page
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert
                severity="error"
                sx={{
                  textAlign: 'left',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& .MuiAlert-icon': {
                    color: 'white',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  <strong>Error:</strong> {this.state.error.message}
                </Typography>
                {this.state.errorInfo && (
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', mt: 1 }}
                  >
                    <strong>Stack:</strong>
                    <br />
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Alert>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 