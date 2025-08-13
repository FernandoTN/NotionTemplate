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

export interface BootstrapConfig {
  includeTasksDb: boolean;
  includeDashboardPage: boolean;
}

export class NotionService {
  private client: Client;
  private rootPageId: string;
  private logger: (message: string) => void;
  public config: BootstrapConfig;

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
    
    // Parse feature flags with defaults
    this.config = {
      includeTasksDb: process.env.INCLUDE_TASKS_DB !== 'false',
      includeDashboardPage: process.env.INCLUDE_DASHBOARD_PAGE !== 'false'
    };
  }

  log(message: string): void {
    this.logger(message);
  }

  logProgress(step: number, total: number, message: string): void {
    const percentage = Math.round((step / total) * 100);
    const progressBar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    this.log(`[${step}/${total}] ${progressBar} ${percentage}% ${message}`);
  }

  printConfig(): void {
    this.log('🔧 Configuration:');
    this.log(`  INCLUDE_TASKS_DB: ${this.config.includeTasksDb}`);
    this.log(`  INCLUDE_DASHBOARD_PAGE: ${this.config.includeDashboardPage}`);
  }

  async createOrGetDatabaseByName(name: string, properties: any): Promise<DatabaseInfo> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
          url: (existingDb as any).url,
          properties: this.extractPropertyIds((existingDb as any).properties)
        };
      }

      // Create new database
      this.log(`Creating database: ${name}`);
      const databaseConfig: any = {
        parent: { page_id: this.rootPageId },
        title: [{ type: 'text', text: { content: name } }],
        properties,
      };

      // Add database-specific icons and descriptions
      if (name === 'Companies') {
        databaseConfig.icon = { emoji: '🏢' };
        databaseConfig.description = [{ type: 'text', text: { content: 'Track organizations by type, size, AI capabilities, and ecosystem role' } }];
      } else if (name === 'Contacts') {
        databaseConfig.icon = { emoji: '👥' };
        databaseConfig.description = [{ type: 'text', text: { content: 'Manage stakeholders with detailed categorization and interview tracking' } }];
      } else if (name === 'Interviews') {
        databaseConfig.icon = { emoji: '🎤' };
        databaseConfig.description = [{ type: 'text', text: { content: 'Schedule and document interviews with structured content blocks' } }];
      } else if (name === 'Insights') {
        databaseConfig.icon = { emoji: '💡' };
        databaseConfig.description = [{ type: 'text', text: { content: 'Capture and categorize key findings from interviews' } }];
      } else if (name === 'Research Projects') {
        databaseConfig.icon = { emoji: '🔬' };
        databaseConfig.description = [{ type: 'text', text: { content: 'Organize interview campaigns with progress tracking' } }];
      } else if (name === 'Tasks') {
        databaseConfig.icon = { emoji: '📋' };
        databaseConfig.description = [{ type: 'text', text: { content: 'Manage follow-up actions with priority, status, and deadline tracking' } }];
      }

      const createResponse = await this.client.databases.create(databaseConfig);

      return {
        id: createResponse.id,
        url: (createResponse as any).url,
        properties: this.extractPropertyIds((createResponse as any).properties)
      };
      } catch (error) {
        lastError = error;
        this.log(`Attempt ${attempt}/${maxRetries} failed for database ${name}: ${error}`);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    this.log(`❌ Failed to create database ${name} after ${maxRetries} attempts`);
    throw lastError;
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
        url: (response as any).url,
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
          title: { 
            title: [{ type: 'text', text: { content: title } }]
          }
        } as any,
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
        url: (response as any).url,
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

  async ensureDatabase(name: string, parentId: string, properties: any): Promise<DatabaseInfo> {
    return this.createOrGetDatabaseByName(name, properties);
  }

  async ensureRelation(fromDbId: string, toDbId: string, relationName: string): Promise<{ fromPropertyId: string; toPropertyId: string }> {
    try {
      // Check if relation already exists
      const fromDb = await this.notionClient.databases.retrieve({ database_id: fromDbId });
      const existingProperty = fromDb.properties[relationName];
      
      if (existingProperty && existingProperty.type === 'relation') {
        this.log(`Relation "${relationName}" already exists, skipping creation`);
        const relationId = (existingProperty as any).id;
        
        // Get the dual property ID from the target database
        const toDb = await this.notionClient.databases.retrieve({ database_id: toDbId });
        let dualPropertyId = '';
        for (const [propName, prop] of Object.entries(toDb.properties)) {
          if ((prop as any).type === 'relation' && (prop as any).relation?.database_id === fromDbId) {
            dualPropertyId = (prop as any).id;
            break;
          }
        }
        
        return {
          fromPropertyId: relationId,
          toPropertyId: dualPropertyId
        };
      }

      // Create new relation
      this.log(`Creating relation: ${relationName} from ${fromDbId} to ${toDbId}`);
      await this.updateDatabase(fromDbId, {
        [relationName]: {
          relation: {
            database_id: toDbId,
            dual_property: {}
          }
        }
      });

      // Get the property IDs after creation
      const updatedFromDb = await this.notionClient.databases.retrieve({ database_id: fromDbId });
      const fromPropertyId = (updatedFromDb.properties[relationName] as any).id;

      // Find the dual property in the target database
      const updatedToDb = await this.notionClient.databases.retrieve({ database_id: toDbId });
      let toPropertyId = '';
      for (const [propName, prop] of Object.entries(updatedToDb.properties)) {
        if ((prop as any).type === 'relation' && (prop as any).relation?.database_id === fromDbId) {
          toPropertyId = (prop as any).id;
          break;
        }
      }

      return {
        fromPropertyId,
        toPropertyId
      };
    } catch (error) {
      this.log(`Error ensuring relation ${relationName}: ${error}`);
      throw error;
    }
  }

  async ensureRollup(dbId: string, rollupName: string, relationPropertyId: string, targetPropertyId: string, rollupFunction: string): Promise<void> {
    try {
      // Check if rollup already exists
      const db = await this.notionClient.databases.retrieve({ database_id: dbId });
      const existingProperty = db.properties[rollupName];
      
      if (existingProperty && existingProperty.type === 'rollup') {
        this.log(`Rollup "${rollupName}" already exists, skipping creation`);
        return;
      }

      // Create new rollup
      this.log(`Creating rollup: ${rollupName} in ${dbId}`);
      await this.updateDatabase(dbId, {
        [rollupName]: {
          rollup: {
            relation_property_id: relationPropertyId,
            rollup_property_id: targetPropertyId,
            function: rollupFunction
          }
        }
      });
    } catch (error) {
      this.log(`Error ensuring rollup ${rollupName}: ${error}`);
      throw error;
    }
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

  async createOrGetTasksDatabase(interviewsDbId: string, contactsDbId: string, researchProjectsDbId: string): Promise<DatabaseInfo> {
    const tasksProperties = {
      'Task': { title: {} },
      'Interview': {
        relation: {
          database_id: interviewsDbId,
          dual_property: {}
        }
      },
      'Contact': {
        relation: {
          database_id: contactsDbId,
          dual_property: {}
        }
      },
      'Project': {
        relation: {
          database_id: researchProjectsDbId,
          dual_property: {}
        }
      },
      'Due Date': { date: {} },
      'Priority': {
        select: {
          options: [
            { name: 'Low', color: 'gray' },
            { name: 'Medium', color: 'yellow' },
            { name: 'High', color: 'orange' },
            { name: 'Urgent', color: 'red' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: 'Backlog', color: 'gray' },
            { name: 'Next', color: 'blue' },
            { name: 'Scheduled', color: 'yellow' },
            { name: 'In Progress', color: 'orange' },
            { name: 'Waiting', color: 'purple' },
            { name: 'Blocked', color: 'red' },
            { name: 'Completed', color: 'green' }
          ]
        }
      },
      'Owner': { people: {} },
      'Channel': {
        select: {
          options: [
            { name: 'Email', color: 'blue' },
            { name: 'LinkedIn', color: 'purple' },
            { name: 'Call', color: 'green' },
            { name: 'Meeting', color: 'orange' },
            { name: 'Other', color: 'gray' }
          ]
        }
      },
      'Recipient Email': { email: {} },
      'Next Action': { rich_text: {} },
      'Notes': { rich_text: {} },
      'Created': { created_time: {} },
      'Completed At': { date: {} },
      'DoneNum': {
        formula: {
          expression: 'if(prop("Status") == "Completed", 1, 0)'
        }
      },
      'Is Overdue': {
        formula: {
          expression: 'and(prop("Status") != "Completed", prop("Due Date") != null, prop("Due Date") < now())'
        }
      },
      'DueSoonNum': {
        formula: {
          expression: 'if(and(prop("Status") != "Completed", prop("Due Date") != null, dateBetween(prop("Due Date"), now(), "days") <= 7, dateBetween(prop("Due Date"), now(), "days") >= 0), 1, 0)'
        }
      }
    };

    return this.createOrGetDatabaseByName('Tasks', tasksProperties);
  }

  async createEnhancedDashboardPage(title: string): Promise<{ id: string; url: string }> {
    try {
      // Check if dashboard page already exists
      const response = await this.client.search({
        query: title,
        filter: { value: 'page', property: 'object' },
      });

      const existingPage = response.results.find((page: any) => 
        page.properties?.title?.title?.[0]?.plain_text === title
      );

      if (existingPage) {
        this.log(`Dashboard page "${title}" already exists, using existing page`);
        return {
          id: existingPage.id,
          url: (existingPage as any).url,
        };
      }

      this.log(`Creating enhanced dashboard page: ${title}`);
      const pageResponse = await this.client.pages.create({
        parent: { page_id: this.rootPageId },
        icon: { emoji: '📊' },
        properties: {
          title: { 
            title: [{ type: 'text', text: { content: title } }]
          }
        } as any,
        children: [
          {
            type: 'heading_1',
            heading_1: {
              rich_text: [{ type: 'text', text: { content: 'Research Dashboard' } }],
            },
          },
          {
            type: 'callout',
            callout: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Add the linked-database views under each heading (UI).' },
                },
              ],
              icon: { emoji: '📋' },
            },
          },
          {
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: 'This Week\'s Interviews' } }],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Add a Linked View of Interviews → Calendar, filtered to this week.' },
                },
              ],
            },
          },
          {
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: 'Follow-up Pipeline' } }],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Add a Linked View of Tasks → Board grouped by Status, filtered: Status ≠ Completed.' },
                },
              ],
            },
          },
          {
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: 'High-Value Targets' } }],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Add a Linked View of Contacts → Table filtered by Stakeholder Type / Company Type.' },
                },
              ],
            },
          },
          {
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: 'Insights Themes' } }],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Add a Linked View of Insights → Table grouped by Category or AI Domain.' },
                },
              ],
            },
          },
          {
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: 'Progress' } }],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Add a Linked View of Research Projects → Table showing Completion %.' },
                },
              ],
            },
          },
        ],
      });

      return {
        id: pageResponse.id,
        url: (pageResponse as any).url,
      };
    } catch (error) {
      this.log(`Error creating enhanced dashboard page: ${error}`);
      throw error;
    }
  }
}