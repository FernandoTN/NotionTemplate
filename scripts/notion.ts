import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

export interface DatabaseInfo {
  id: string;
  url: string;
  properties: Record<string, string>;
}

export interface NotionIds {
  databases: Record<string, DatabaseInfo>;
  pages: Record<string, { id: string; url: string }>;
}

export class NotionService {
  private client: Client;
  private rootPageId: string;
  private logger: (message: string) => void;

  constructor() {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN is required in .env file');
    }
    if (!process.env.ROOT_PAGE_ID) {
      throw new Error('ROOT_PAGE_ID is required in .env file');
    }

    this.client = new Client({ auth: process.env.NOTION_TOKEN });
    this.rootPageId = process.env.ROOT_PAGE_ID;
    this.logger = (message: string) => console.log(`[${new Date().toISOString()}] ${message}`);
  }

  log(message: string): void {
    this.logger(message);
  }

  async createOrGetDatabaseByName(name: string, properties: any): Promise<DatabaseInfo> {
    try {
      // Check if database already exists
      const response = await this.client.search({
        query: name,
        filter: { value: 'database', property: 'object' },
      });

      const existingDb = response.results.find((db: any) => 
        db.title && db.title[0] && db.title[0].plain_text === name
      );

      if (existingDb) {
        this.log(`Database "${name}" already exists, using existing database`);
        return {
          id: existingDb.id,
          url: existingDb.url,
          properties: this.extractPropertyIds(existingDb.properties)
        };
      }

      // Create new database
      this.log(`Creating database: ${name}`);
      const createResponse = await this.client.databases.create({
        parent: { page_id: this.rootPageId },
        title: [{ type: 'text', text: { content: name } }],
        properties,
      });

      return {
        id: createResponse.id,
        url: createResponse.url,
        properties: this.extractPropertyIds(createResponse.properties)
      };
    } catch (error) {
      this.log(`Error creating database ${name}: ${error}`);
      throw error;
    }
  }

  get notionClient() {
    return this.client;
  }

  async updateDatabase(databaseId: string, properties: any): Promise<void> {
    try {
      this.log(`Updating database properties: ${databaseId}`);
      await this.client.databases.update({
        database_id: databaseId,
        properties,
      });
    } catch (error) {
      this.log(`Error updating database ${databaseId}: ${error}`);
      throw error;
    }
  }

  async createPage(databaseId: string, properties: any, children?: any[]): Promise<{ id: string; url: string }> {
    try {
      const response = await this.client.pages.create({
        parent: { database_id: databaseId },
        properties,
        children: children || [],
      });

      return {
        id: response.id,
        url: response.url,
      };
    } catch (error) {
      this.log(`Error creating page in database ${databaseId}: ${error}`);
      throw error;
    }
  }

  async appendBlockChildren(pageId: string, children: any[]): Promise<void> {
    try {
      await this.client.blocks.children.append({
        block_id: pageId,
        children,
      });
    } catch (error) {
      this.log(`Error appending blocks to page ${pageId}: ${error}`);
      throw error;
    }
  }

  async createDashboardPage(title: string): Promise<{ id: string; url: string }> {
    try {
      this.log(`Creating dashboard page: ${title}`);
      const response = await this.client.pages.create({
        parent: { page_id: this.rootPageId },
        properties: {
          title: [{ type: 'text', text: { content: title } }],
        },
        children: [
          {
            type: 'heading_1',
            heading_1: {
              rich_text: [{ type: 'text', text: { content: 'Research Dashboard' } }],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'This dashboard will contain linked views to your CRM databases. Add the following linked databases manually after running the bootstrap script:' },
                },
              ],
            },
          },
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'This Week\'s Interviews: Calendar view of Interviews' } }],
            },
          },
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'Follow-up Pipeline: Board view of Contacts by Interview Status' } }],
            },
          },
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'High-Value Targets: Table view of Contacts filtered by criteria' } }],
            },
          },
          {
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: 'Company Ecosystem Map: Board view of Companies by Ecosystem Role' } }],
            },
          },
        ],
      });

      return {
        id: response.id,
        url: response.url,
      };
    } catch (error) {
      this.log(`Error creating dashboard page: ${error}`);
      throw error;
    }
  }

  private extractPropertyIds(properties: any): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [name, config] of Object.entries(properties)) {
      result[name] = (config as any).id;
    }
    return result;
  }

  saveNotionIds(ids: NotionIds): void {
    const outputPath = path.join(process.cwd(), 'output', 'notion-ids.json');
    fs.writeFileSync(outputPath, JSON.stringify(ids, null, 2));
    this.log(`Saved IDs to ${outputPath}`);
  }

  loadNotionIds(): NotionIds | null {
    try {
      const outputPath = path.join(process.cwd(), 'output', 'notion-ids.json');
      if (fs.existsSync(outputPath)) {
        return JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      }
    } catch (error) {
      this.log(`Could not load existing IDs: ${error}`);
    }
    return null;
  }
}