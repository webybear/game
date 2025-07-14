import { GameEntity, Person, Starship } from '../types/generated';

export const determineWinner = (entities: GameEntity[]): {
  winner: GameEntity | null;
  winnerPosition: 'left' | 'right' | null;
  winningAttribute: string | null;
} => {
  if (entities.length !== 2) {
    return { winner: null, winnerPosition: null, winningAttribute: null };
  }

  const [leftEntity, rightEntity] = entities;

  // Check if both entities are of the same type
  if (leftEntity.__typename !== rightEntity.__typename) {
    return { winner: null, winnerPosition: null, winningAttribute: null };
  }

  let leftValue: number;
  let rightValue: number;
  let attribute: string;

  if (leftEntity.__typename === 'Person') {
    leftValue = (leftEntity as Person).mass;
    rightValue = (rightEntity as Person).mass;
    attribute = 'mass';
  } else if (leftEntity.__typename === 'Starship') {
    leftValue = (leftEntity as Starship).crew;
    rightValue = (rightEntity as Starship).crew;
    attribute = 'crew';
  } else {
    return { winner: null, winnerPosition: null, winningAttribute: null };
  }

  // Handle tie (though this should be rare with real data)
  if (leftValue === rightValue) {
    return { winner: null, winnerPosition: null, winningAttribute: attribute };
  }

  // Determine winner
  if (leftValue > rightValue) {
    return { winner: leftEntity, winnerPosition: 'left', winningAttribute: attribute };
  } else {
    return { winner: rightEntity, winnerPosition: 'right', winningAttribute: attribute };
  }
};

export const getEntityDisplayValue = (entity: GameEntity): number => {
  if (entity.__typename === 'Person') {
    return (entity as Person).mass;
  } else if (entity.__typename === 'Starship') {
    return (entity as Starship).crew;
  }
  return 0;
};

export const getEntityAttributeName = (entity: GameEntity): string => {
  if (entity.__typename === 'Person') {
    return 'Mass';
  } else if (entity.__typename === 'Starship') {
    return 'Crew';
  }
  return 'Value';
};

export const isEntityWinner = (entity: GameEntity, winner: GameEntity | null): boolean => {
  if (!winner) return false;
  return entity.id === winner.id;
}; 