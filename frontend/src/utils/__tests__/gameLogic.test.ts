import { determineWinner, getEntityDisplayValue, getEntityAttributeName, isEntityWinner } from '../gameLogic';
import { Person, Starship } from '../../types/generated';

const mockPerson1: Person = {
  __typename: 'Person',
  id: '1',
  name: 'Luke Skywalker',
  mass: 77,
  height: '172',
  gender: 'male',
  homeworld: 'Tatooine',
};

const mockPerson2: Person = {
  __typename: 'Person',
  id: '2',
  name: 'Darth Vader',
  mass: 136,
  height: '202',
  gender: 'male',
  homeworld: 'Tatooine',
};

const mockStarship1: Starship = {
  __typename: 'Starship',
  id: '1',
  name: 'Millennium Falcon',
  crew: 4,
  model: 'YT-1300 light freighter',
  manufacturer: 'Corellian Engineering Corporation',
  passengers: '6',
};

const mockStarship2: Starship = {
  __typename: 'Starship',
  id: '2',
  name: 'Imperial Star Destroyer',
  crew: 47060,
  model: 'Imperial I-class Star Destroyer',
  manufacturer: 'Kuat Drive Yards',
  passengers: '0',
};

describe('gameLogic', () => {
  describe('determineWinner', () => {
    it('returns null for empty array', () => {
      const result = determineWinner([]);
      expect(result).toEqual({
        winner: null,
        winnerPosition: null,
        winningAttribute: null,
      });
    });

    it('returns null for single entity', () => {
      const result = determineWinner([mockPerson1]);
      expect(result).toEqual({
        winner: null,
        winnerPosition: null,
        winningAttribute: null,
      });
    });

    it('returns null for mismatched entity types', () => {
      const result = determineWinner([mockPerson1, mockStarship1]);
      expect(result).toEqual({
        winner: null,
        winnerPosition: null,
        winningAttribute: null,
      });
    });

    it('determines winner for people by mass', () => {
      const result = determineWinner([mockPerson1, mockPerson2]);
      expect(result).toEqual({
        winner: mockPerson2,
        winnerPosition: 'right',
        winningAttribute: 'mass',
      });
    });

    it('determines winner for starships by crew', () => {
      const result = determineWinner([mockStarship1, mockStarship2]);
      expect(result).toEqual({
        winner: mockStarship2,
        winnerPosition: 'right',
        winningAttribute: 'crew',
      });
    });

    it('handles tie scenario', () => {
      const person1 = { ...mockPerson1, mass: 77 };
      const person2 = { ...mockPerson2, mass: 77 };
      const result = determineWinner([person1, person2]);
      expect(result).toEqual({
        winner: null,
        winnerPosition: null,
        winningAttribute: 'mass',
      });
    });

    it('returns left winner when first entity wins', () => {
      const result = determineWinner([mockPerson2, mockPerson1]);
      expect(result).toEqual({
        winner: mockPerson2,
        winnerPosition: 'left',
        winningAttribute: 'mass',
      });
    });
  });

  describe('getEntityDisplayValue', () => {
    it('returns mass for person', () => {
      expect(getEntityDisplayValue(mockPerson1)).toBe(77);
    });

    it('returns crew for starship', () => {
      expect(getEntityDisplayValue(mockStarship1)).toBe(4);
    });

    it('returns 0 for unknown entity type', () => {
      const unknownEntity = { __typename: 'Unknown' } as unknown as Person;
      expect(getEntityDisplayValue(unknownEntity)).toBe(0);
    });
  });

  describe('getEntityAttributeName', () => {
    it('returns Mass for person', () => {
      expect(getEntityAttributeName(mockPerson1)).toBe('Mass');
    });

    it('returns Crew for starship', () => {
      expect(getEntityAttributeName(mockStarship1)).toBe('Crew');
    });

    it('returns Value for unknown entity type', () => {
      const unknownEntity = { __typename: 'Unknown' } as unknown as Person;
      expect(getEntityAttributeName(unknownEntity)).toBe('Value');
    });
  });

  describe('isEntityWinner', () => {
    it('returns true when entity is winner', () => {
      expect(isEntityWinner(mockPerson1, mockPerson1)).toBe(true);
    });

    it('returns false when entity is not winner', () => {
      expect(isEntityWinner(mockPerson1, mockPerson2)).toBe(false);
    });

    it('returns false when winner is null', () => {
      expect(isEntityWinner(mockPerson1, null)).toBe(false);
    });
  });
}); 