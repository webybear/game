import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PlayButton from '../PlayButton';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FFE81F' },
    secondary: { main: '#FF6B6B' },
    background: { default: '#000000', paper: '#1a1a1a' },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('PlayButton', () => {
  const mockOnPlay = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders start battle button when not played', () => {
    render(
      <TestWrapper>
        <PlayButton onPlay={mockOnPlay} isLoading={false} hasPlayed={false} />
      </TestWrapper>
    );

    expect(screen.getByText('Start Battle')).toBeInTheDocument();
    expect(screen.getByText('Random matchups from a galaxy far, far away')).toBeInTheDocument();
  });

  it('renders play again button when has played', () => {
    render(
      <TestWrapper>
        <PlayButton onPlay={mockOnPlay} isLoading={false} hasPlayed={true} />
      </TestWrapper>
    );

    expect(screen.getByText('Play Again')).toBeInTheDocument();
    expect(screen.getByText('Ready for another round? The Force is strong with this one!')).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    render(
      <TestWrapper>
        <PlayButton onPlay={mockOnPlay} isLoading={true} hasPlayed={false} />
      </TestWrapper>
    );

    expect(screen.getByText('Drawing Cards...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calls onPlay when button is clicked', () => {
    render(
      <TestWrapper>
        <PlayButton onPlay={mockOnPlay} isLoading={false} hasPlayed={false} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Start Battle'));
    expect(mockOnPlay).toHaveBeenCalledTimes(1);
  });

  it('disables button when loading', () => {
    render(
      <TestWrapper>
        <PlayButton onPlay={mockOnPlay} isLoading={true} hasPlayed={false} />
      </TestWrapper>
    );

    const button = screen.getByText('Drawing Cards...');
    expect(button).toBeDisabled();
  });

  it('disables button when explicitly disabled', () => {
    render(
      <TestWrapper>
        <PlayButton onPlay={mockOnPlay} isLoading={false} hasPlayed={false} disabled={true} />
      </TestWrapper>
    );

    const button = screen.getByText('Start Battle');
    expect(button).toBeDisabled();
  });

  it('does not call onPlay when button is disabled', () => {
    render(
      <TestWrapper>
        <PlayButton onPlay={mockOnPlay} isLoading={false} hasPlayed={false} disabled={true} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Start Battle'));
    expect(mockOnPlay).not.toHaveBeenCalled();
  });
}); 