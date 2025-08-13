import { NotionService } from './notion';

async function main() {
  const notion = new NotionService();
  
  notion.log('🌱 Starting content seeding...');
  notion.printConfig();

  // Load existing database IDs
  const ids = notion.loadNotionIds();
  if (!ids) {
    throw new Error('No database IDs found. Run bootstrap-notion-crm.ts first.');
  }

  try {
    // Step 1: Create Research Project
    notion.log('🔬 Creating sample Research Project...');
    const researchProject = await notion.createPage(
      ids.databases['Research Projects'].id,
      {
        'Project Name': {
          title: [{ type: 'text', text: { content: 'Agentic AI Interviews 2025-2026' } }]
        },
        'Research Questions': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'How are organizations implementing agentic AI workflows? What are the key challenges and opportunities in multi-agent systems? How do reasoning capabilities impact real-world AI applications?'
              }
            }
          ]
        },
        'Target Stakeholder Types': {
          multi_select: [
            { name: 'Founder' },
            { name: 'Engineer' },
            { name: 'Academic' }
          ]
        },
        'Interview Target': { number: 25 },
        'Timeline': {
          date: {
            start: '2025-01-01',
            end: '2026-12-31'
          }
        },
        'Status': {
          select: { name: 'Active' }
        }
      }
    );

    // Step 2: Create Companies
    notion.log('🏢 Creating sample Companies...');
    
    const anthropicCompany = await notion.createPage(
      ids.databases.Companies.id,
      {
        'Company Name': {
          title: [{ type: 'text', text: { content: 'Anthropic' } }]
        },
        'Company Type': {
          select: { name: 'Builder' }
        },
        'Size Category': {
          select: { name: 'Medium (200-1000)' }
        },
        'AI Capabilities': {
          multi_select: [
            { name: 'NLP' },
            { name: 'Reasoning' }
          ]
        },
        'Funding Stage': {
          select: { name: 'Series C' }
        },
        'Industries Served': {
          multi_select: [
            { name: 'Financial Services' },
            { name: 'Healthcare' }
          ]
        },
        'Ecosystem Role': {
          multi_select: [
            { name: 'Model Developer' }
          ]
        },
        'Geographic Presence': {
          multi_select: [
            { name: 'North America' }
          ]
        }
      }
    );

    const openaiCompany = await notion.createPage(
      ids.databases.Companies.id,
      {
        'Company Name': {
          title: [{ type: 'text', text: { content: 'OpenAI' } }]
        },
        'Company Type': {
          select: { name: 'Builder' }
        },
        'Size Category': {
          select: { name: 'Medium (200-1000)' }
        },
        'AI Capabilities': {
          multi_select: [
            { name: 'NLP' },
            { name: 'Reasoning' },
            { name: 'Computer Vision' }
          ]
        },
        'Funding Stage': {
          select: { name: 'Series C' }
        },
        'Industries Served': {
          multi_select: [
            { name: 'Financial Services' },
            { name: 'Healthcare' },
            { name: 'Manufacturing' }
          ]
        },
        'Ecosystem Role': {
          multi_select: [
            { name: 'Model Developer' },
            { name: 'Infrastructure Provider' }
          ]
        },
        'Geographic Presence': {
          multi_select: [
            { name: 'North America' },
            { name: 'Europe' }
          ]
        }
      }
    );

    // Step 3: Create Contacts
    notion.log('👥 Creating sample Contacts...');
    
    const contact1 = await notion.createPage(
      ids.databases.Contacts.id,
      {
        'Name': {
          title: [{ type: 'text', text: { content: 'Dr. Sarah Chen' } }]
        },
        'Company': {
          relation: [{ id: anthropicCompany.id }]
        },
        'Role/Title': {
          rich_text: [{ type: 'text', text: { content: 'Research Scientist' } }]
        },
        'Stakeholder Type': {
          multi_select: [{ name: 'Engineer' }]
        },
        'Experience Level': {
          select: { name: 'Senior' }
        },
        'AI Focus Area': {
          multi_select: [
            { name: 'Agentic AI' },
            { name: 'LLM Reasoning' }
          ]
        },
        'Company Size Category': {
          select: { name: 'Medium Company' }
        },
        'Interview Status': {
          select: { name: 'Scheduled' }
        },
        'Preferred Contact Method': {
          select: { name: 'Email' }
        },
        'Last Contact Date': {
          date: { start: '2025-08-10' }
        },
        'LinkedIn URL': {
          url: 'https://linkedin.com/in/sarah-chen-ai'
        }
      }
    );

    const contact2 = await notion.createPage(
      ids.databases.Contacts.id,
      {
        'Name': {
          title: [{ type: 'text', text: { content: 'Alex Rodriguez' } }]
        },
        'Company': {
          relation: [{ id: anthropicCompany.id }]
        },
        'Role/Title': {
          rich_text: [{ type: 'text', text: { content: 'Product Manager' } }]
        },
        'Stakeholder Type': {
          multi_select: [{ name: 'Founder' }]
        },
        'Experience Level': {
          select: { name: 'Executive' }
        },
        'AI Focus Area': {
          multi_select: [
            { name: 'Agentic AI' }
          ]
        },
        'Company Size Category': {
          select: { name: 'Medium Company' }
        },
        'Interview Status': {
          select: { name: 'Contacted' }
        },
        'Preferred Contact Method': {
          select: { name: 'LinkedIn' }
        },
        'Last Contact Date': {
          date: { start: '2025-08-08' }
        },
        'LinkedIn URL': {
          url: 'https://linkedin.com/in/alex-rodriguez-pm'
        }
      }
    );

    const contact3 = await notion.createPage(
      ids.databases.Contacts.id,
      {
        'Name': {
          title: [{ type: 'text', text: { content: 'Prof. Maria Gonzalez' } }]
        },
        'Company': {
          relation: [{ id: openaiCompany.id }]
        },
        'Role/Title': {
          rich_text: [{ type: 'text', text: { content: 'Senior Research Scientist' } }]
        },
        'Stakeholder Type': {
          multi_select: [{ name: 'Academic' }]
        },
        'Experience Level': {
          select: { name: 'Thought Leader' }
        },
        'AI Focus Area': {
          multi_select: [
            { name: 'LLM Reasoning' },
            { name: 'Planning Systems' }
          ]
        },
        'Company Size Category': {
          select: { name: 'Medium Company' }
        },
        'Interview Status': {
          select: { name: 'Target' }
        },
        'Preferred Contact Method': {
          select: { name: 'Warm Introduction' }
        },
        'LinkedIn URL': {
          url: 'https://linkedin.com/in/maria-gonzalez-ai'
        }
      }
    );

    // Step 4: Create Interviews with structured content
    notion.log('🎤 Creating sample Interviews...');
    
    const interview1 = await notion.createPage(
      ids.databases.Interviews.id,
      {
        'Interview Title': {
          title: [{ type: 'text', text: { content: 'Agentic AI Research Deep Dive - Sarah Chen' } }]
        },
        'Contact': {
          relation: [{ id: contact1.id }]
        },
        'Company': {
          relation: [{ id: anthropicCompany.id }]
        },
        'Date & Time': {
          date: {
            start: '2025-08-15T14:00:00.000Z'
          }
        },
        'Research Focus': {
          multi_select: [
            { name: 'Agentic Workflows' },
            { name: 'LLM Reasoning' }
          ]
        },
        'Interview Type': {
          select: { name: 'Deep Dive' }
        },
        'Status': {
          select: { name: 'Scheduled' }
        },
        'Workflow Patterns Discussed': {
          multi_select: [
            { name: 'Reflection' },
            { name: 'Tool Use' }
          ]
        },
        'Technical Depth': {
          select: { name: 'Deep Technical' }
        },
        'Project': {
          relation: [{ id: researchProject.id }]
        }
      },
      // Add structured content blocks
      [
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Pre-Interview Checklist' } }]
          }
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Background research on Sarah\'s recent publications' } }],
            checked: false
          }
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Personalize interview guide for agentic AI focus' } }],
            checked: false
          }
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Test Google Meet + Granola setup' } }],
            checked: false
          }
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Draft follow-up email template' } }],
            checked: false
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'During Interview Notes' } }]
          }
        },
        {
          type: 'toggle',
          toggle: {
            rich_text: [{ type: 'text', text: { content: 'Opening (5 minutes)' } }],
            children: [
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Introduction and context setting' } }]
                }
              },
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Recording permission and agenda overview' } }]
                }
              }
            ]
          }
        },
        {
          type: 'toggle',
          toggle: {
            rich_text: [{ type: 'text', text: { content: 'Core Discussion (35 minutes)' } }],
            children: [
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Current agentic AI projects and approaches' } }]
                }
              },
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Key challenges in reasoning capabilities' } }]
                }
              },
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Tool integration patterns and workflows' } }]
                }
              }
            ]
          }
        },
        {
          type: 'toggle',
          toggle: {
            rich_text: [{ type: 'text', text: { content: 'Deep Dive (15 minutes)' } }],
            children: [
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Technical architecture details' } }]
                }
              },
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Performance metrics and evaluation approaches' } }]
                }
              }
            ]
          }
        },
        {
          type: 'toggle',
          toggle: {
            rich_text: [{ type: 'text', text: { content: 'Closing (5 minutes)' } }],
            children: [
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Summary of key insights' } }]
                }
              },
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Follow-up questions and next steps' } }]
                }
              },
              {
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [{ type: 'text', text: { content: 'Additional contact recommendations' } }]
                }
              }
            ]
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Key Insights' } }]
          }
        },
        {
          type: 'callout',
          callout: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Record key insights, pain points, and opportunities discovered during the interview. Link to specific Insights database entries.' }
              }
            ],
            icon: { emoji: '💡' }
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Follow-up Actions' } }]
          }
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Send thank you email with summary' } }],
            checked: false
          }
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Create Insights entries for key findings' } }],
            checked: false
          }
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Schedule follow-up if needed' } }],
            checked: false
          }
        }
      ]
    );

    const interview2 = await notion.createPage(
      ids.databases.Interviews.id,
      {
        'Interview Title': {
          title: [{ type: 'text', text: { content: 'Product Strategy Discussion - Alex Rodriguez' } }]
        },
        'Contact': {
          relation: [{ id: contact2.id }]
        },
        'Company': {
          relation: [{ id: anthropicCompany.id }]
        },
        'Date & Time': {
          date: {
            start: '2025-08-12T16:00:00.000Z'
          }
        },
        'Research Focus': {
          multi_select: [
            { name: 'Agentic Workflows' }
          ]
        },
        'Interview Type': {
          select: { name: 'Discovery' }
        },
        'Status': {
          select: { name: 'Completed' }
        },
        'Workflow Patterns Discussed': {
          multi_select: [
            { name: 'Planning' },
            { name: 'Multi-Agent' }
          ]
        },
        'Technical Depth': {
          select: { name: 'High-Level' }
        },
        'Follow-up Actions': {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Share product roadmap insights with research team. Schedule technical deep-dive with engineering team.' }
            }
          ]
        },
        'Project': {
          relation: [{ id: researchProject.id }]
        }
      }
    );

    // Step 5: Create sample Insights
    notion.log('💡 Creating sample Insights...');
    
    await notion.createPage(
      ids.databases.Insights.id,
      {
        'Insight Title': {
          title: [{ type: 'text', text: { content: 'Tool Integration Complexity is Major Bottleneck' } }]
        },
        'Category': {
          select: { name: 'Pain Point' }
        },
        'AI Domain': {
          multi_select: [
            { name: 'Tool Integration' },
            { name: 'Agent Architecture' }
          ]
        },
        'Source Interview': {
          relation: [{ id: interview2.id }]
        },
        'Impact Level': {
          select: { name: 'High' }
        },
        'Confidence Level': {
          select: { name: 'High Confidence' }
        },
        'Supporting Evidence': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Multiple teams report 60-80% of development time spent on tool integration rather than core AI capabilities. Standardization across different tool APIs is lacking.'
              }
            }
          ]
        },
        'Ecosystem Implications': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Need for standardized tool integration frameworks. Opportunity for infrastructure providers to create abstraction layers.'
              }
            }
          ]
        },
        'Actionable Opportunities': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Develop universal tool integration SDK. Create best practices guide for tool API design. Interview more infrastructure providers.'
              }
            }
          ]
        }
      }
    );

    await notion.createPage(
      ids.databases.Insights.id,
      {
        'Insight Title': {
          title: [{ type: 'text', text: { content: 'Multi-Agent Coordination Patterns Emerging' } }]
        },
        'Category': {
          select: { name: 'Market Trend' }
        },
        'AI Domain': {
          multi_select: [
            { name: 'Multi-Agent Coordination' },
            { name: 'Agent Architecture' }
          ]
        },
        'Source Interview': {
          relation: [{ id: interview1.id }]
        },
        'Impact Level': {
          select: { name: 'Medium' }
        },
        'Confidence Level': {
          select: { name: 'Needs Validation' }
        },
        'Supporting Evidence': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Seeing consistent patterns across organizations: hierarchy-based coordination, message passing systems, and shared memory architectures.'
              }
            }
          ]
        },
        'Ecosystem Implications': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Potential for standardization around coordination protocols. Infrastructure needs for agent communication and state management.'
              }
            }
          ]
        },
        'Actionable Opportunities': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Interview more multi-agent system implementers. Map coordination pattern variations. Assess infrastructure requirements.'
              }
            }
          ]
        }
      }
    );

    // Step 6: Create sample Tasks (if Tasks DB is enabled)
    if (notion.config.includeTasksDb && ids.databases.Tasks) {
      notion.log('📋 Creating sample Tasks...');
      
      // Helper function to check if task already exists
      const checkTaskExists = async (taskTitle: string, interviewId?: string): Promise<boolean> => {
        try {
          const filters: any[] = [
            {
              property: 'Task',
              title: {
                equals: taskTitle
              }
            }
          ];

          if (interviewId) {
            filters.push({
              property: 'Interview',
              relation: {
                contains: interviewId
              }
            });
          }

          const response = await notion.notionClient.databases.query({
            database_id: ids.databases.Tasks.id,
            filter: {
              and: filters
            }
          });
          return response.results.length > 0;
        } catch (error) {
          notion.log(`Error checking task existence: ${error}`);
          return false;
        }
      };

      // Create task 1: Send thank-you email
      const task1Title = 'Send thank-you email';
      const task1Exists = await checkTaskExists(task1Title, interview1.id);
      if (!task1Exists) {
        const task1 = await notion.createPage(
          ids.databases.Tasks.id,
          {
            'Task': {
              title: [{ type: 'text', text: { content: task1Title } }]
            },
            'Interview': {
              relation: [{ id: interview1.id }]
            },
            'Contact': {
              relation: [{ id: contact1.id }]
            },
            'Due Date': {
              date: { start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] } // +1 day
            },
            'Priority': {
              select: { name: 'Medium' }
            },
            'Status': {
              select: { name: 'Next' }
            },
            'Channel': {
              select: { name: 'Email' }
            },
            'Next Action': {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Draft personalized thank-you email with key discussion points and next steps.' }
                }
              ]
            },
            'Notes': {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Include summary of agentic AI insights and offer to share relevant research papers.' }
                }
              ]
            }
          }
        );
      }

      // Create task 2: Schedule follow-up
      const task2Title = 'Schedule follow-up';
      const task2Exists = await checkTaskExists(task2Title, interview2.id);
      if (!task2Exists) {
        const task2 = await notion.createPage(
          ids.databases.Tasks.id,
          {
            'Task': {
              title: [{ type: 'text', text: { content: task2Title } }]
            },
            'Interview': {
              relation: [{ id: interview2.id }]
            },
            'Contact': {
              relation: [{ id: contact2.id }]
            },
            'Due Date': {
              date: { start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } // +7 days
            },
            'Priority': {
              select: { name: 'High' }
            },
            'Status': {
              select: { name: 'Backlog' }
            },
            'Channel': {
              select: { name: 'Meeting' }
            },
            'Next Action': {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Coordinate calendars for technical deep-dive session with engineering team.' }
                }
              ]
            },
            'Notes': {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Focus on multi-agent coordination patterns and tool integration challenges.' }
                }
              ]
            }
          }
        );
      }

      // Create task 3: Request referral
      const task3Title = 'Request referral to X';
      const task3Exists = await checkTaskExists(task3Title); // No interview relation for this task
      if (!task3Exists) {
        const task3 = await notion.createPage(
          ids.databases.Tasks.id,
          {
            'Task': {
              title: [{ type: 'text', text: { content: task3Title } }]
            },
            'Contact': {
              relation: [{ id: contact3.id }]
            },
            'Due Date': {
              date: { start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } // +14 days
            },
            'Priority': {
              select: { name: 'Low' }
            },
            'Status': {
              select: { name: 'Backlog' }
            },
            'Channel': {
              select: { name: 'LinkedIn' }
            },
            'Next Action': {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Draft LinkedIn message requesting introduction to Planning Systems team lead.' }
                }
              ]
            },
            'Notes': {
              rich_text: [
                {
                  type: 'text',
                  text: { content: 'Mention specific interest in recent planning research and potential collaboration opportunities.' }
                }
              ]
            }
          }
        );
      }
    }

    notion.log('✅ Content seeding complete!');
    
    console.log('\n🌱 SEEDED CONTENT:');
    console.log('• 1 Research Project: "Agentic AI Interviews 2025-2026"');
    console.log('• 2 Companies: Anthropic, OpenAI');
    console.log('• 3 Contacts: Dr. Sarah Chen, Alex Rodriguez, Prof. Maria Gonzalez');
    console.log('• 2 Interviews: with structured content blocks');
    console.log('• 2 Insights: covering pain points and market trends');
    if (notion.config.includeTasksDb) {
      console.log('• 3 Tasks: follow-up actions linked to interviews and contacts');
    }

  } catch (error) {
    notion.log(`❌ Content seeding failed: ${error}`);
    throw error;
  }
}

if (require.main === module) {
  main().catch(console.error);
}