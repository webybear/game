import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';

export function makeClient() {
  const httpLink = new HttpLink({
    uri: '/graphql',
  });
  
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
} 