import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import { Starship } from '../entities/starship.entity';
import { CreateStarshipInput, UpdateStarshipInput } from '../dto/create-starship.dto';
import { StarshipConnection } from '../dto/connection.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StarshipsService {
  constructor(private readonly databaseConfig: DatabaseConfig) {}

  /**
   * Create a new starship
   */
  async createStarship(input: CreateStarshipInput): Promise<Starship> {
    try {
      const newStarship = {
        id: uuidv4(),
        ...input,
      };

      await this.databaseConfig.putItem(
        this.databaseConfig.starshipsTableName,
        newStarship
      );

      return new Starship(newStarship);
    } catch (error) {
      console.error('Error creating starship:', error);
      throw error;
    }
  }

  /**
   * Get a starship by ID
   */
  async getStarship(id: string): Promise<Starship | null> {
    try {
      const result = await this.databaseConfig.getItem(
        this.databaseConfig.starshipsTableName,
        { id }
      );

      if (!result) {
        return null;
      }

      return new Starship(result);
    } catch (error) {
      console.error('Error getting starship:', error);
      throw error;
    }
  }

  /**
   * Update a starship
   */
  async updateStarship(input: UpdateStarshipInput): Promise<Starship> {
    try {
      // First check if the starship exists
      const existingStarship = await this.getStarship(input.id);
      if (!existingStarship) {
        throw new NotFoundException(`Starship with ID ${input.id} not found`);
      }

      // Build update expression
      const updateAttributes = Object.keys(input).filter(key => key !== 'id' && input[key as keyof UpdateStarshipInput] !== undefined);
      
      if (updateAttributes.length === 0) {
        return existingStarship; // No updates to make
      }

      const updateExpression = `SET ${updateAttributes.map(attr => `#${attr} = :${attr}`).join(', ')}`;
      const expressionAttributeNames = updateAttributes.reduce((acc, attr) => {
        acc[`#${attr}`] = attr;
        return acc;
      }, {} as Record<string, string>);
      const expressionAttributeValues = updateAttributes.reduce((acc, attr) => {
        acc[`:${attr}`] = input[attr as keyof UpdateStarshipInput];
        return acc;
      }, {} as Record<string, any>);

      const result = await this.databaseConfig.updateItem(
        this.databaseConfig.starshipsTableName,
        { id: input.id },
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues
      );

      return new Starship(result);
    } catch (error) {
      console.error('Error updating starship:', error);
      throw error;
    }
  }

  /**
   * Delete a starship
   */
  async deleteStarship(id: string): Promise<string> {
    try {
      // First check if the starship exists
      const existingStarship = await this.getStarship(id);
      if (!existingStarship) {
        throw new NotFoundException(`Starship with ID ${id} not found`);
      }

      await this.databaseConfig.deleteItem(
        this.databaseConfig.starshipsTableName,
        { id }
      );

      return id;
    } catch (error) {
      console.error('Error deleting starship:', error);
      throw error;
    }
  }

  /**
   * List starships with pagination
   */
  async listStarships(limit?: number, nextToken?: string): Promise<StarshipConnection> {
    try {
      let lastEvaluatedKey;
      
      if (nextToken) {
        try {
          lastEvaluatedKey = JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8'));
        } catch (error) {
          throw new Error('Invalid nextToken provided');
        }
      }

      const result = await this.databaseConfig.scanTable(
        this.databaseConfig.starshipsTableName,
        limit,
        lastEvaluatedKey
      );

      const starships = result.items.map(item => new Starship(item));
      
      let newNextToken;
      if (result.lastEvaluatedKey) {
        newNextToken = Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString('base64');
      }

      return {
        items: starships,
        nextToken: newNextToken,
        totalCount: result.count,
      };
    } catch (error) {
      console.error('Error listing starships:', error);
      throw error;
    }
  }

  /**
   * Get total count of starships
   */
  async getTotalCount(): Promise<number> {
    try {
      const result = await this.databaseConfig.scanTable(
        this.databaseConfig.starshipsTableName
      );
      return result.count;
    } catch (error) {
      console.error('Error getting starships count:', error);
      throw error;
    }
  }

  /**
   * Search starships by name
   */
  async searchStarshipsByName(name: string): Promise<Starship[]> {
    try {
      const result = await this.databaseConfig.scanTable(
        this.databaseConfig.starshipsTableName
      );

      const matchingStarships = result.items
        .filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
        .map(item => new Starship(item));

      return matchingStarships;
    } catch (error) {
      console.error('Error searching starships by name:', error);
      throw error;
    }
  }

  /**
   * Get starships by manufacturer
   */
  async getStarshipsByManufacturer(manufacturer: string): Promise<Starship[]> {
    try {
      const result = await this.databaseConfig.scanTable(
        this.databaseConfig.starshipsTableName
      );

      const matchingStarships = result.items
        .filter(item => item.manufacturer && item.manufacturer.toLowerCase().includes(manufacturer.toLowerCase()))
        .map(item => new Starship(item));

      return matchingStarships;
    } catch (error) {
      console.error('Error getting starships by manufacturer:', error);
      throw error;
    }
  }
} 