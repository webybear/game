import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseConfig } from '../config/database.config';
import { Person } from '../entities/person.entity';
import { CreatePersonInput, UpdatePersonInput } from '../dto/create-person.dto';
import { PeopleConnection } from '../dto/connection.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PeopleService {
  constructor(private readonly databaseConfig: DatabaseConfig) {}

  /**
   * Create a new person
   */
  async createPerson(input: CreatePersonInput): Promise<Person> {
    try {
      const newPerson = {
        id: uuidv4(),
        ...input,
      };

      await this.databaseConfig.putItem(
        this.databaseConfig.peopleTableName,
        newPerson
      );

      return new Person(newPerson);
    } catch (error) {
      console.error('Error creating person:', error);
      throw error;
    }
  }

  /**
   * Get a person by ID
   */
  async getPerson(id: string): Promise<Person | null> {
    try {
      const result = await this.databaseConfig.getItem(
        this.databaseConfig.peopleTableName,
        { id }
      );

      if (!result) {
        return null;
      }

      return new Person(result);
    } catch (error) {
      console.error('Error getting person:', error);
      throw error;
    }
  }

  /**
   * Update a person
   */
  async updatePerson(input: UpdatePersonInput): Promise<Person> {
    try {
      // First check if the person exists
      const existingPerson = await this.getPerson(input.id);
      if (!existingPerson) {
        throw new NotFoundException(`Person with ID ${input.id} not found`);
      }

      // Build update expression
      const updateAttributes = Object.keys(input).filter(key => key !== 'id' && input[key as keyof UpdatePersonInput] !== undefined);
      
      if (updateAttributes.length === 0) {
        return existingPerson; // No updates to make
      }

      const updateExpression = `SET ${updateAttributes.map(attr => `#${attr} = :${attr}`).join(', ')}`;
      const expressionAttributeNames = updateAttributes.reduce((acc, attr) => {
        acc[`#${attr}`] = attr;
        return acc;
      }, {} as Record<string, string>);
      const expressionAttributeValues = updateAttributes.reduce((acc, attr) => {
        acc[`:${attr}`] = input[attr as keyof UpdatePersonInput];
        return acc;
      }, {} as Record<string, any>);

      const result = await this.databaseConfig.updateItem(
        this.databaseConfig.peopleTableName,
        { id: input.id },
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues
      );

      return new Person(result);
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  }

  /**
   * Delete a person
   */
  async deletePerson(id: string): Promise<string> {
    try {
      // First check if the person exists
      const existingPerson = await this.getPerson(id);
      if (!existingPerson) {
        throw new NotFoundException(`Person with ID ${id} not found`);
      }

      await this.databaseConfig.deleteItem(
        this.databaseConfig.peopleTableName,
        { id }
      );

      return id;
    } catch (error) {
      console.error('Error deleting person:', error);
      throw error;
    }
  }

  /**
   * List people with pagination
   */
  async listPeople(limit?: number, nextToken?: string): Promise<PeopleConnection> {
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
        this.databaseConfig.peopleTableName,
        limit,
        lastEvaluatedKey
      );

      const people = result.items.map(item => new Person(item));
      
      let newNextToken;
      if (result.lastEvaluatedKey) {
        newNextToken = Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString('base64');
      }

      return {
        items: people,
        nextToken: newNextToken,
        totalCount: result.count,
      };
    } catch (error) {
      console.error('Error listing people:', error);
      throw error;
    }
  }

  /**
   * Get total count of people
   */
  async getTotalCount(): Promise<number> {
    try {
      const result = await this.databaseConfig.scanTable(
        this.databaseConfig.peopleTableName
      );
      return result.count;
    } catch (error) {
      console.error('Error getting people count:', error);
      throw error;
    }
  }

  /**
   * Search people by name
   */
  async searchPeopleByName(name: string): Promise<Person[]> {
    try {
      const result = await this.databaseConfig.scanTable(
        this.databaseConfig.peopleTableName
      );

      const matchingPeople = result.items
        .filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
        .map(item => new Person(item));

      return matchingPeople;
    } catch (error) {
      console.error('Error searching people by name:', error);
      throw error;
    }
  }
} 