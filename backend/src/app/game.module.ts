import { Module } from '@nestjs/common';
import { GameResolver, GameEntityResolver } from './resolvers/game.resolver';
import { GameService } from './services/game.service';
import { PeopleService } from './services/people.service';
import { StarshipsService } from './services/starships.service';
import { DatabaseConfig } from './config/database.config';

@Module({
  providers: [
    GameResolver,
    GameEntityResolver,
    GameService,
    PeopleService,
    StarshipsService,
    DatabaseConfig,
  ],
  exports: [GameService, PeopleService, StarshipsService],
})
export class GameModule {} 