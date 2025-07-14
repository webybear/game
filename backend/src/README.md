# Star Wars Game - Backend Implementation

This backend application implements a GraphQL API for a Star Wars "top trumps" style game where players can compare People vs People or Starships vs Starships based on their attributes.

## 🎮 Game Logic Overview

The core game mechanics:
- **People compete by mass** - Higher mass wins
- **Starships compete by crew size** - Larger crew wins
- Game returns two random entities and determines the winner
- Supports full CRUD operations for both People and Starships

## 🏗️ Architecture

```
📁 backend/src/app/
├── 📁 config/
│   └── database.config.ts       # DynamoDB connection & operations
├── 📁 entities/
│   ├── person.entity.ts         # Person GraphQL entity
│   ├── starship.entity.ts       # Starship GraphQL entity
│   └── game.entity.ts           # Game logic entities & unions
├── 📁 dto/
│   ├── create-person.dto.ts     # Person input types
│   ├── create-starship.dto.ts   # Starship input types
│   └── connection.dto.ts        # Pagination response types
├── 📁 services/
│   ├── game.service.ts          # Core game logic & winner determination
│   ├── people.service.ts        # People CRUD operations
│   └── starships.service.ts     # Starships CRUD operations
├── 📁 resolvers/
│   └── game.resolver.ts         # GraphQL resolvers for all operations
└── app.module.ts                # Main application module
```

## 🔧 Services Implementation

### **GameService** - Core Game Logic
- `getRandomPair(resource: ResourceType)` - Main game function
- Winner determination based on competitive attributes
- Database seeding with sample Star Wars data
- Game statistics and analytics

### **PeopleService** - People Management
- Full CRUD operations (Create, Read, Update, Delete)
- Pagination support with `nextToken`
- Search functionality by name
- Proper error handling and validation

### **StarshipsService** - Starships Management
- Full CRUD operations for starships
- Pagination support
- Search by name and manufacturer
- Consistent API with PeopleService

### **DatabaseConfig** - Data Layer
- DynamoDB connection management
- Generic database operations (get, put, update, delete, scan)
- Random item selection for game logic
- Pagination support

## 🎯 GraphQL API

### **Game Queries**
```graphql
# Main game query - returns two entities and winner
getRandomPair(resource: ResourceType!): GameRound!

# Get statistics about game data
gameStats: String
```

### **Entity Queries**
```graphql
# People queries
getPerson(id: ID!): Person
listPeople(limit: Int, nextToken: String): PeopleConnection!

# Starship queries  
getStarship(id: ID!): Starship
listStarships(limit: Int, nextToken: String): StarshipConnection!
```

### **CRUD Mutations**
```graphql
# People mutations
createPerson(input: CreatePersonInput!): Person!
updatePerson(input: UpdatePersonInput!): Person!
deletePerson(id: ID!): ID!

# Starship mutations
createStarship(input: CreateStarshipInput!): Starship!
updateStarship(input: UpdateStarshipInput!): Starship!
deleteStarship(id: ID!): ID!

# Utility mutations
seedDatabase: String
```

## 🏆 Game Mechanics

### **Winner Determination Algorithm**
```typescript
// For People: Compare mass values
const winner = person1.mass > person2.mass ? person1 : person2;

// For Starships: Compare crew values  
const winner = starship1.crew > starship2.crew ? starship1 : starship2;
```

### **Sample Game Round Response**
```json
{
  "entities": [
    {
      "id": "1",
      "name": "Luke Skywalker", 
      "mass": 77
    },
    {
      "id": "2", 
      "name": "Darth Vader",
      "mass": 136
    }
  ],
  "winner": {
    "id": "2",
    "name": "Darth Vader", 
    "mass": 136
  },
  "winningAttribute": "mass",
  "resourceType": "PEOPLE"
}
```

## 🗄️ Database Schema

### **People Table**
```typescript
{
  id: string,           // Primary key (UUID)
  name: string,         // Character name
  mass: number,         // Competitive attribute
  height?: string,      // Additional attribute
  gender?: string,      // Additional attribute  
  homeworld?: string    // Additional attribute
}
```

### **Starships Table**
```typescript
{
  id: string,              // Primary key (UUID)
  name: string,            // Starship name
  crew: number,            // Competitive attribute
  model?: string,          // Additional attribute
  manufacturer?: string,   // Additional attribute
  passengers?: string      // Additional attribute
}
```

## 🎲 Sample Data

The application includes seeding functionality with authentic Star Wars data:

**Sample People:**
- Luke Skywalker (mass: 77)
- Darth Vader (mass: 136) 
- Leia Organa (mass: 49)
- Obi-Wan Kenobi (mass: 77)
- Yoda (mass: 17)

**Sample Starships:**
- X-wing (crew: 1)
- Millennium Falcon (crew: 4)
- Imperial Star Destroyer (crew: 47,060)
- Death Star (crew: 342,953)
- TIE Fighter (crew: 1)

## 🧪 Testing

### **Run Tests**
```bash
npm run test:backend
```

### **Test Coverage**
- Game logic winner determination
- Edge cases (ties, invalid inputs)
- Service CRUD operations
- Database mocking

### **Example Test**
```typescript
it('should determine winner based on mass for people', async () => {
  const result = await gameService.getRandomPair(ResourceType.PEOPLE);
  expect(result.winner).toBeDefined();
  expect(result.winningAttribute).toBe('mass');
});
```

## 🚀 Development

### **Local Development**
```bash
# Start the backend server
npm run serve:backend

# GraphQL Playground available at:
# http://localhost:3333/graphql
```

### **Environment Variables**
```bash
PEOPLE_TABLE_NAME=swapi-game-people
STARSHIPS_TABLE_NAME=swapi-game-starships  
AWS_REGION=us-east-1
NODE_ENV=development
```

## 📊 Performance Considerations

- **DynamoDB Optimization**: Uses scan operations for simplicity (can be optimized with GSIs)
- **Pagination**: Implements cursor-based pagination with `nextToken`
- **Caching**: Ready for Redis/ElastiCache integration
- **Batch Operations**: Supports batch reads/writes for better performance

## 🔒 Security Features

- **Input Validation**: All inputs validated with DTOs
- **Error Handling**: Comprehensive error handling and logging
- **Database Security**: Uses IAM roles and least privilege access
- **GraphQL Security**: Built-in query depth limiting

## 🎯 Next Steps

1. **Add Caching**: Implement Redis for frequently accessed data
2. **Add Authentication**: Integrate with AWS Cognito
3. **Add Monitoring**: CloudWatch metrics and alarms
4. **Add More Game Modes**: Tournament brackets, multiplayer games
5. **Add Real-time Features**: WebSocket subscriptions for live games

## 🏁 Ready for Deployment

The backend is fully configured for AWS deployment with:
- ✅ DynamoDB integration
- ✅ Lambda-ready architecture  
- ✅ AppSync GraphQL compatibility
- ✅ Comprehensive error handling
- ✅ Production logging
- ✅ Test coverage

**Deploy to AWS**: Follow the infrastructure setup in `backend/infrastructure/` 