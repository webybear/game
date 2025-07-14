import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreatePersonInput = {
  gender?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['String']['input']>;
  homeworld?: InputMaybe<Scalars['String']['input']>;
  mass: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CreateStarshipInput = {
  crew: Scalars['Int']['input'];
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  passengers?: InputMaybe<Scalars['String']['input']>;
};

export type GameEntity = Person | Starship;

export type GameRound = {
  __typename?: 'GameRound';
  entities: Array<GameEntity>;
  resourceType: ResourceType;
  winner?: Maybe<GameEntity>;
  winningAttribute?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPerson: Person;
  createStarship: Starship;
  deletePerson: Scalars['ID']['output'];
  deleteStarship: Scalars['ID']['output'];
  updatePerson: Person;
  updateStarship: Starship;
};


export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
};


export type MutationCreateStarshipArgs = {
  input: CreateStarshipInput;
};


export type MutationDeletePersonArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStarshipArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdatePersonArgs = {
  input: UpdatePersonInput;
};


export type MutationUpdateStarshipArgs = {
  input: UpdateStarshipInput;
};

export type PeopleConnection = {
  __typename?: 'PeopleConnection';
  items: Array<Person>;
  nextToken?: Maybe<Scalars['String']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type Person = {
  __typename?: 'Person';
  gender?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['String']['output']>;
  homeworld?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mass: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getPerson?: Maybe<Person>;
  getRandomPair: GameRound;
  getStarship?: Maybe<Starship>;
  listPeople: PeopleConnection;
  listStarships: StarshipConnection;
};


export type QueryGetPersonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetRandomPairArgs = {
  resource: ResourceType;
};


export type QueryGetStarshipArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListPeopleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListStarshipsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export enum ResourceType {
  People = 'PEOPLE',
  Starships = 'STARSHIPS'
}

export type Starship = {
  __typename?: 'Starship';
  crew: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  manufacturer?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  passengers?: Maybe<Scalars['String']['output']>;
};

export type StarshipConnection = {
  __typename?: 'StarshipConnection';
  items: Array<Starship>;
  nextToken?: Maybe<Scalars['String']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type UpdatePersonInput = {
  gender?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['String']['input']>;
  homeworld?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  mass?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStarshipInput = {
  crew?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  passengers?: InputMaybe<Scalars['String']['input']>;
};

export type GetRandomPairQueryVariables = Exact<{
  resource: ResourceType;
}>;


export type GetRandomPairQuery = { __typename?: 'Query', getRandomPair: { __typename?: 'GameRound', winningAttribute?: string | null, resourceType: ResourceType, entities: Array<{ __typename?: 'Person', id: string, name: string, mass: number, height?: string | null, gender?: string | null, homeworld?: string | null } | { __typename?: 'Starship', id: string, name: string, crew: number, model?: string | null, manufacturer?: string | null, passengers?: string | null }>, winner?: { __typename?: 'Person', id: string, name: string, mass: number } | { __typename?: 'Starship', id: string, name: string, crew: number } | null } };


export const GetRandomPairDocument = gql`
    query GetRandomPair($resource: ResourceType!) {
  getRandomPair(resource: $resource) {
    entities {
      ... on Person {
        id
        name
        mass
        height
        gender
        homeworld
      }
      ... on Starship {
        id
        name
        crew
        model
        manufacturer
        passengers
      }
    }
    winner {
      ... on Person {
        id
        name
        mass
      }
      ... on Starship {
        id
        name
        crew
      }
    }
    winningAttribute
    resourceType
  }
}
    `;

/**
 * __useGetRandomPairQuery__
 *
 * To run a query within a React component, call `useGetRandomPairQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRandomPairQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRandomPairQuery({
 *   variables: {
 *      resource: // value for 'resource'
 *   },
 * });
 */
export function useGetRandomPairQuery(baseOptions: Apollo.QueryHookOptions<GetRandomPairQuery, GetRandomPairQueryVariables> & ({ variables: GetRandomPairQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRandomPairQuery, GetRandomPairQueryVariables>(GetRandomPairDocument, options);
      }
export function useGetRandomPairLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRandomPairQuery, GetRandomPairQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRandomPairQuery, GetRandomPairQueryVariables>(GetRandomPairDocument, options);
        }
export function useGetRandomPairSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRandomPairQuery, GetRandomPairQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRandomPairQuery, GetRandomPairQueryVariables>(GetRandomPairDocument, options);
        }
export type GetRandomPairQueryHookResult = ReturnType<typeof useGetRandomPairQuery>;
export type GetRandomPairLazyQueryHookResult = ReturnType<typeof useGetRandomPairLazyQuery>;
export type GetRandomPairSuspenseQueryHookResult = ReturnType<typeof useGetRandomPairSuspenseQuery>;
export type GetRandomPairQueryResult = Apollo.QueryResult<GetRandomPairQuery, GetRandomPairQueryVariables>;