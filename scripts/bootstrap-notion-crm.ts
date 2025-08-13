import { NotionService, NotionIds } from './notion';

async function main() {
  const notion = new NotionService();
  
  notion.log('🚀 Starting Notion CRM Bootstrap...');

  // Initialize the IDs structure
  const ids: NotionIds = {
    databases: {},
    pages: {}
  };

  try {
    // Step 1: Create Companies Database
    notion.log('📊 Creating Companies database...');
    const companiesDb = await notion.createOrGetDatabaseByName('Companies', {
      'Company Name': { title: {} },
      'Company Type': {
        select: {
          options: [
            { name: 'Builder', color: 'blue' },
            { name: 'Orchestrator', color: 'green' },
            { name: 'Participant', color: 'yellow' },
            { name: 'Enabler', color: 'purple' }
          ]
        }
      },
      'Size Category': {
        select: {
          options: [
            { name: 'Big Tech (1000+)', color: 'red' },
            { name: 'Medium (200-1000)', color: 'orange' },
            { name: 'Startup (<200)', color: 'green' }
          ]
        }
      },
      'AI Capabilities': {
        multi_select: {
          options: [
            { name: 'Computer Vision', color: 'blue' },
            { name: 'NLP', color: 'green' },
            { name: 'Robotics', color: 'yellow' },
            { name: 'Forecasting', color: 'orange' },
            { name: 'Discovery', color: 'red' },
            { name: 'Planning', color: 'purple' },
            { name: 'Creation', color: 'pink' },
            { name: 'Reasoning', color: 'brown' }
          ]
        }
      },
      'Funding Stage': {
        select: {
          options: [
            { name: 'Pre-seed', color: 'gray' },
            { name: 'Seed', color: 'brown' },
            { name: 'Series A', color: 'orange' },
            { name: 'Series B', color: 'yellow' },
            { name: 'Series C', color: 'green' },
            { name: 'Public', color: 'blue' },
            { name: 'Bootstrapped', color: 'purple' }
          ]
        }
      },
      'Industries Served': {
        multi_select: {
          options: [
            { name: 'Financial Services', color: 'blue' },
            { name: 'Healthcare', color: 'green' },
            { name: 'Manufacturing', color: 'yellow' },
            { name: 'Retail', color: 'orange' },
            { name: 'Transportation', color: 'red' }
          ]
        }
      },
      'Ecosystem Role': {
        multi_select: {
          options: [
            { name: 'Infrastructure Provider', color: 'blue' },
            { name: 'Model Developer', color: 'green' },
            { name: 'Application Builder', color: 'yellow' },
            { name: 'Data Provider', color: 'orange' }
          ]
        }
      },
      'Geographic Presence': {
        multi_select: {
          options: [
            { name: 'North America', color: 'blue' },
            { name: 'Europe', color: 'green' },
            { name: 'APAC', color: 'yellow' },
            { name: 'LATAM', color: 'orange' },
            { name: 'Middle East', color: 'red' },
            { name: 'Africa', color: 'purple' }
          ]
        }
      }
    });
    ids.databases.Companies = companiesDb;

    // Step 2: Create Contacts Database
    notion.log('👥 Creating Contacts database...');
    const contactsDb = await notion.createOrGetDatabaseByName('Contacts', {
      'Name': { title: {} },
      'Company': {
        relation: {
          database_id: companiesDb.id,
          single_property: {}
        }
      },
      'Role/Title': { rich_text: {} },
      'Stakeholder Type': {
        multi_select: {
          options: [
            { name: 'Investor', color: 'blue' },
            { name: 'Founder', color: 'green' },
            { name: 'Engineer', color: 'yellow' },
            { name: 'Academic', color: 'orange' },
            { name: 'Consultant', color: 'red' }
          ]
        }
      },
      'Experience Level': {
        select: {
          options: [
            { name: 'Junior', color: 'gray' },
            { name: 'Mid-Level', color: 'brown' },
            { name: 'Senior', color: 'orange' },
            { name: 'Executive', color: 'red' },
            { name: 'Thought Leader', color: 'purple' }
          ]
        }
      },
      'AI Focus Area': {
        multi_select: {
          options: [
            { name: 'Agentic AI', color: 'blue' },
            { name: 'LLM Reasoning', color: 'green' },
            { name: 'Computer Vision', color: 'yellow' },
            { name: 'Robotics', color: 'orange' },
            { name: 'Planning Systems', color: 'red' }
          ]
        }
      },
      'Company Size Category': {
        select: {
          options: [
            { name: 'Big Tech', color: 'red' },
            { name: 'Medium Company', color: 'orange' },
            { name: 'Startup', color: 'green' },
            { name: 'Research Institution', color: 'blue' }
          ]
        }
      },
      'Interview Status': {
        select: {
          options: [
            { name: 'Target', color: 'gray' },
            { name: 'Contacted', color: 'yellow' },
            { name: 'Scheduled', color: 'orange' },
            { name: 'Completed', color: 'green' },
            { name: 'Follow-up Needed', color: 'red' }
          ]
        }
      },
      'Preferred Contact Method': {
        select: {
          options: [
            { name: 'Email', color: 'blue' },
            { name: 'LinkedIn', color: 'purple' },
            { name: 'Warm Introduction', color: 'green' }
          ]
        }
      },
      'Last Contact Date': { date: {} },
      'LinkedIn URL': { url: {} },
      'Referral Source': {
        relation: {
          database_id: '', // Will be set to contacts db id after creation
          single_property: {}
        }
      }
    });
    ids.databases.Contacts = contactsDb;

    // Update Contacts to have self-relation
    await notion.updateDatabase(contactsDb.id, {
      'Referral Source': {
        relation: {
          database_id: contactsDb.id,
          single_property: {}
        }
      }
    });

    // Step 3: Create Interviews Database
    notion.log('🎤 Creating Interviews database...');
    const interviewsDb = await notion.createOrGetDatabaseByName('Interviews', {
      'Interview Title': { title: {} },
      'Contact': {
        relation: {
          database_id: contactsDb.id,
          single_property: {}
        }
      },
      'Company': {
        relation: {
          database_id: companiesDb.id,
          single_property: {}
        }
      },
      'Date & Time': { date: {} },
      'Research Focus': {
        multi_select: {
          options: [
            { name: 'Agentic Workflows', color: 'blue' },
            { name: 'LLM Reasoning', color: 'green' },
            { name: 'Tool Use', color: 'yellow' },
            { name: 'Multi-Agent Systems', color: 'orange' }
          ]
        }
      },
      'Interview Type': {
        select: {
          options: [
            { name: 'Discovery', color: 'blue' },
            { name: 'Deep Dive', color: 'green' },
            { name: 'Follow-up', color: 'yellow' },
            { name: 'Validation', color: 'orange' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: 'Scheduled', color: 'yellow' },
            { name: 'Completed', color: 'green' },
            { name: 'Cancelled', color: 'red' },
            { name: 'Rescheduled', color: 'orange' }
          ]
        }
      },
      'Recording Link': { url: {} },
      'Granola Notes': { files: {} },
      'Workflow Patterns Discussed': {
        multi_select: {
          options: [
            { name: 'Reflection', color: 'blue' },
            { name: 'Tool Use', color: 'green' },
            { name: 'ReAct', color: 'yellow' },
            { name: 'Planning', color: 'orange' },
            { name: 'Multi-Agent', color: 'red' }
          ]
        }
      },
      'Technical Depth': {
        select: {
          options: [
            { name: 'High-Level', color: 'gray' },
            { name: 'Detailed', color: 'yellow' },
            { name: 'Deep Technical', color: 'red' }
          ]
        }
      },
      'Follow-up Actions': { rich_text: {} },
      'CompletedNum': {
        formula: {
          expression: 'if(prop("Status") == "Completed", 1, 0)'
        }
      }
    });
    ids.databases.Interviews = interviewsDb;

    // Step 4: Create Insights Database
    notion.log('💡 Creating Insights database...');
    const insightsDb = await notion.createOrGetDatabaseByName('Insights', {
      'Insight Title': { title: {} },
      'Category': {
        select: {
          options: [
            { name: 'Pain Point', color: 'red' },
            { name: 'Opportunity', color: 'green' },
            { name: 'Technical Challenge', color: 'orange' },
            { name: 'Market Trend', color: 'blue' },
            { name: 'Best Practice', color: 'purple' }
          ]
        }
      },
      'AI Domain': {
        multi_select: {
          options: [
            { name: 'Reasoning Capabilities', color: 'blue' },
            { name: 'Agent Architecture', color: 'green' },
            { name: 'Tool Integration', color: 'yellow' },
            { name: 'Multi-Agent Coordination', color: 'orange' }
          ]
        }
      },
      'Source Interview': {
        relation: {
          database_id: interviewsDb.id,
          single_property: {}
        }
      },
      'Impact Level': {
        select: {
          options: [
            { name: 'High', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' }
          ]
        }
      },
      'Confidence Level': {
        select: {
          options: [
            { name: 'High Confidence', color: 'green' },
            { name: 'Needs Validation', color: 'yellow' },
            { name: 'Hypothesis', color: 'gray' }
          ]
        }
      },
      'Supporting Evidence': { rich_text: {} },
      'Ecosystem Implications': { rich_text: {} },
      'Actionable Opportunities': { rich_text: {} }
    });
    ids.databases.Insights = insightsDb;

    // Step 5: Create Research Projects Database
    notion.log('🔬 Creating Research Projects database...');
    const researchProjectsDb = await notion.createOrGetDatabaseByName('Research Projects', {
      'Project Name': { title: {} },
      'Research Questions': { rich_text: {} },
      'Target Stakeholder Types': {
        multi_select: {
          options: [
            { name: 'Investor', color: 'blue' },
            { name: 'Founder', color: 'green' },
            { name: 'Engineer', color: 'yellow' },
            { name: 'Academic', color: 'orange' },
            { name: 'Consultant', color: 'red' }
          ]
        }
      },
      'Interview Target': { number: {} },
      'Interviews': {
        relation: {
          database_id: interviewsDb.id,
          dual_property: {}
        }
      },
      'Key Findings': {
        relation: {
          database_id: insightsDb.id,
          dual_property: {}
        }
      },
      'Timeline': { date: {} },
      'Status': {
        select: {
          options: [
            { name: 'Planning', color: 'gray' },
            { name: 'Active', color: 'yellow' },
            { name: 'Analysis', color: 'orange' },
            { name: 'Completed', color: 'green' }
          ]
        }
      }
    });
    ids.databases['Research Projects'] = researchProjectsDb;

    // Step 6: Add rollup properties that require the relation property IDs
    notion.log('🔄 Adding rollup properties...');
    
    // Add rollups to Companies
    await notion.updateDatabase(companiesDb.id, {
      'Contacts': {
        relation: {
          database_id: contactsDb.id,
          dual_property: {}
        }
      },
      'Interviews': {
        relation: {
          database_id: interviewsDb.id,
          dual_property: {}
        }
      }
    });

    // Get updated property IDs for rollups
    const companiesResponse = await notion.notionClient.databases.retrieve({ database_id: companiesDb.id });
    const contactsRelationId = (companiesResponse.properties['Contacts'] as any).id;
    const interviewsRelationId = (companiesResponse.properties['Interviews'] as any).id;

    await notion.updateDatabase(companiesDb.id, {
      'Total Contacts': {
        rollup: {
          relation_property_id: contactsRelationId,
          rollup_property_id: 'title', // Count relation items
          function: 'count'
        }
      },
      'Interview Count': {
        rollup: {
          relation_property_id: interviewsRelationId,
          rollup_property_id: 'title', // Count relation items
          function: 'count'
        }
      }
    });

    // Add rollups to Contacts
    const contactsResponse = await notion.notionClient.databases.retrieve({ database_id: contactsDb.id });
    await notion.updateDatabase(contactsDb.id, {
      'Interviews': {
        relation: {
          database_id: interviewsDb.id,
          dual_property: {}
        }
      }
    });

    const contactsUpdatedResponse = await notion.notionClient.databases.retrieve({ database_id: contactsDb.id });
    const contactInterviewsRelationId = (contactsUpdatedResponse.properties['Interviews'] as any).id;

    await notion.updateDatabase(contactsDb.id, {
      'Interview Count': {
        rollup: {
          relation_property_id: contactInterviewsRelationId,
          rollup_property_id: 'title', // Count relation items
          function: 'count'
        }
      }
    });

    // Add rollups to Research Projects
    await notion.updateDatabase(interviewsDb.id, {
      'Key Insights': {
        relation: {
          database_id: insightsDb.id,
          dual_property: {}
        }
      },
      'Project': {
        relation: {
          database_id: researchProjectsDb.id,
          dual_property: {}
        }
      }
    });

    const researchProjectsResponse = await notion.notionClient.databases.retrieve({ database_id: researchProjectsDb.id });
    const projectInterviewsRelationId = (researchProjectsResponse.properties['Interviews'] as any).id;

    await notion.updateDatabase(researchProjectsDb.id, {
      'Completed Interviews': {
        rollup: {
          relation_property_id: projectInterviewsRelationId,
          rollup_property_id: (ids.databases.Interviews.properties['CompletedNum'] || 'CompletedNum'),
          function: 'sum'
        }
      },
      'Completion %': {
        formula: {
          expression: 'if(prop("Interview Target") > 0, round(100 * prop("Completed Interviews") / prop("Interview Target")), 0)'
        }
      }
    });

    // Step 7: Create Dashboard Page
    notion.log('📊 Creating Research Dashboard page...');
    const dashboardPage = await notion.createDashboardPage('Research Dashboard');
    ids.pages['Research Dashboard'] = dashboardPage;

    // Save all IDs
    notion.saveNotionIds(ids);

    // Print results
    notion.log('✅ Bootstrap complete! Database URLs:');
    console.log('\n📊 DATABASE URLs:');
    Object.entries(ids.databases).forEach(([name, info]) => {
      console.log(`${name}: ${info.url}`);
    });

    console.log('\n📄 PAGE URLs:');
    Object.entries(ids.pages).forEach(([name, info]) => {
      console.log(`${name}: ${info.url}`);
    });

    console.log('\n🗂️  Database IDs:');
    Object.entries(ids.databases).forEach(([name, info]) => {
      console.log(`${name}: ${info.id}`);
    });

  } catch (error) {
    notion.log(`❌ Bootstrap failed: ${error}`);
    throw error;
  }
}

if (require.main === module) {
  main().catch(console.error);
}