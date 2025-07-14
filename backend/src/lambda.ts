import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INestApplicationContext } from '@nestjs/common';
import { GameService } from './app/services/game.service';
import { PeopleService } from './app/services/people.service';
import { StarshipsService } from './app/services/starships.service';
import { CreatePersonInput, UpdatePersonInput } from './app/dto/create-person.dto';
import { CreateStarshipInput, UpdateStarshipInput } from './app/dto/create-starship.dto';

// Cache the NestJS app instance for performance
let app: INestApplicationContext;

async function bootstrap() {
  if (!app) {
    // We use the raw AppModule here. The GraphQLModule is not needed
    // because we are handling the resolver logic directly.
    app = await NestFactory.createApplicationContext(AppModule);
  }
  return app;
}

// Define the shape of the AppSync event
interface AppSyncEvent {
  info: {
    fieldName: string;
  };
  arguments: any;
}

// The main Lambda handler
export const handler = async (event: AppSyncEvent) => {
  const application = await bootstrap();

  const peopleService = application.get(PeopleService);
  const starshipsService = application.get(StarshipsService);
  const gameService = application.get(GameService);

  const { fieldName } = event.info;
  const { arguments: args } = event;

  // Manual routing from GraphQL field name to service method
  switch (fieldName) {
    // QUERIES
    case 'gameStats':
      return gameService.getGameStats();
    case 'getRandomPair':
      return gameService.getRandomPair(args.resource);
    case 'getPerson':
      return peopleService.getPerson(args.id);
    case 'listPeople':
      return peopleService.listPeople(args.limit, args.nextToken);
    case 'getStarship':
      return starshipsService.getStarship(args.id);
    case 'listStarships':
      return starshipsService.listStarships(args.limit, args.nextToken);

    // MUTATIONS
    case 'seedDatabase':
      await gameService.seedDatabase();
      return 'Database seeded successfully!';
    case 'createPerson':
      return peopleService.createPerson(args.person as CreatePersonInput);
    case 'updatePerson':
      return peopleService.updatePerson(args.person as UpdatePersonInput);
    case 'deletePerson':
      return peopleService.deletePerson(args.id);
    case 'createStarship':
      return starshipsService.createStarship(args.starship as CreateStarshipInput);
    case 'updateStarship':
      return starshipsService.updateStarship(args.starship as UpdateStarshipInput);
    case 'deleteStarship':
      return starshipsService.deleteStarship(args.id);

    default:
      throw new Error(`Unknown field, unable to resolve ${fieldName}`);
  }
}; 