import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GameCard from '../GameCard';
import { Person, Starship } from '../../types/generated';

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

const mockPerson: Person = {
  __typename: 'Person',
  id: '1',
  name: 'Luke Skywalker',
  mass: 77,
  height: '172',
  gender: 'male',
  homeworld: 'Tatooine',
};

const mockStarship: Starship = {
  __typename: 'Starship',
  id: '1',
  name: 'Millennium Falcon',
  crew: 4,
  model: 'YT-1300 light freighter',
  manufacturer: 'Corellian Engineering Corporation',
  passengers: '6',
};

describe('GameCard', () => {
  it('renders loading skeleton when loading', () => {
    render(
      <TestWrapper>
        <GameCard entity={null} isLoading={true} position="left" />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty state when no entity', () => {
    render(
      <TestWrapper>
        <GameCard entity={null} isLoading={false} position="left" />
      </TestWrapper>
    );

    expect(screen.getByText('Click Play to Start')).toBeInTheDocument();
  });

  it('renders person card correctly', () => {
    render(
      <TestWrapper>
        <GameCard entity={mockPerson} isLoading={false} position="left" />
      </TestWrapper>
    );

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Mass:')).toBeInTheDocument();
    expect(screen.getByText('77')).toBeInTheDocument();
    expect(screen.getByText('Height: 172')).toBeInTheDocument();
    expect(screen.getByText('Gender: male')).toBeInTheDocument();
    expect(screen.getByText('Homeworld: Tatooine')).toBeInTheDocument();
    expect(screen.getByText('Person')).toBeInTheDocument();
  });

  it('renders starship card correctly', () => {
    render(
      <TestWrapper>
        <GameCard entity={mockStarship} isLoading={false} position="left" />
      </TestWrapper>
    );

    expect(screen.getByText('Millennium Falcon')).toBeInTheDocument();
    expect(screen.getByText('Crew:')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Model: YT-1300 light freighter')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer: Corellian Engineering Corporation')).toBeInTheDocument();
    expect(screen.getByText('Passengers: 6')).toBeInTheDocument();
    expect(screen.getByText('Starship')).toBeInTheDocument();
  });

  it('shows winner badge when card is winner', () => {
    render(
      <TestWrapper>
        <GameCard entity={mockPerson} isLoading={false} position="left" isWinner={true} />
      </TestWrapper>
    );

    expect(screen.getByText('WINNER!')).toBeInTheDocument();
  });

  it('does not show winner badge when card is not winner', () => {
    render(
      <TestWrapper>
        <GameCard entity={mockPerson} isLoading={false} position="left" isWinner={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('WINNER!')).not.toBeInTheDocument();
  });

  it('renders person icon for person entity', () => {
    render(
      <TestWrapper>
        <GameCard entity={mockPerson} isLoading={false} position="left" />
      </TestWrapper>
    );

    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('renders starship icon for starship entity', () => {
    render(
      <TestWrapper>
        <GameCard entity={mockStarship} isLoading={false} position="left" />
      </TestWrapper>
    );

    expect(screen.getByText('🚀')).toBeInTheDocument();
  });
}); 