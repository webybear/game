// Allow TypeScript to import .graphql files as strings
declare module '*.graphql' {
  const content: string;
  export default content;
} 