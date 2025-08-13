# Notion CRM for AI Research Interviews

A comprehensive Notion-based CRM system designed specifically for conducting and tracking AI research interviews. This project creates five interconnected databases with proper relations, rollups, and formulas to manage contacts, companies, interviews, insights, and research projects.

## Features

- **Companies Database**: Track organizations by type, size, AI capabilities, and ecosystem role
- **Contacts Database**: Manage stakeholders with detailed categorization and interview tracking
- **Interviews Database**: Schedule and document interviews with structured content blocks
- **Insights Database**: Capture and categorize key findings from interviews
- **Research Projects Database**: Organize interview campaigns with progress tracking
- **Tasks Database**: Manage follow-up actions with priority, status, and deadline tracking (optional)

## Quick Start

### Prerequisites

- Node.js 20+
- Notion account with API access
- Notion integration token
- A Notion page where databases will be created

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/FernandoTN/NotionTemplate.git
   cd NotionTemplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your values:
   ```
   NOTION_TOKEN=your_notion_integration_token
   ROOT_PAGE_ID=your_parent_page_id
   
   # Feature Flags (default = true)
   INCLUDE_TASKS_DB=true
   INCLUDE_DASHBOARD_PAGE=true
   ```

### Usage

1. **Bootstrap the CRM databases** (idempotent):
   ```bash
   npm run bootstrap
   ```

2. **Seed with sample content**:
   ```bash
   npm run seed
   ```

3. **Check the output**:
   - Database URLs and IDs will be printed to console
   - All IDs saved to `output/notion-ids.json`
   - Research Dashboard page created with instructions

### Sample Content

After running the seed script, you'll have:
- **1 Research Project**: "Agentic AI Interviews 2025-2026"
- **2 Companies**: Anthropic, OpenAI
- **3 Contacts**: Dr. Sarah Chen, Alex Rodriguez, Prof. Maria Gonzalez
- **2 Interviews**: with structured content blocks
- **2 Insights**: covering pain points and market trends
- **3 Tasks**: project-linked follow-up actions with email scaffolding and deadline tracking (if enabled)

## Database Schema

### 1. Companies
- **Company Name** (Title)
- **Company Type**: Builder, Orchestrator, Participant, Enabler
- **Size Category**: Big Tech (1000+), Medium (200-1000), Startup (<200)
- **AI Capabilities**: Computer Vision, NLP, Robotics, Forecasting, Discovery, Planning, Creation, Reasoning
- **Funding Stage**: Pre-seed through Public, Bootstrapped
- **Industries Served**: Financial Services, Healthcare, Manufacturing, Retail, Transportation
- **Ecosystem Role**: Infrastructure Provider, Model Developer, Application Builder, Data Provider
- **Geographic Presence**: North America, Europe, APAC, LATAM, Middle East, Africa
- **Relations**: Contacts, Interviews (with rollup counts)

### 2. Contacts
- **Name** (Title)
- **Company** (Relation → Companies)
- **Role/Title** (Rich text)
- **Stakeholder Type**: Investor, Founder, Engineer, Academic, Consultant
- **Experience Level**: Junior, Mid-Level, Senior, Executive, Thought Leader
- **AI Focus Area**: Agentic AI, LLM Reasoning, Computer Vision, Robotics, Planning Systems
- **Company Size Category**: Big Tech, Medium Company, Startup, Research Institution
- **Interview Status**: Target, Contacted, Scheduled, Completed, Follow-up Needed
- **Preferred Contact Method**: Email, LinkedIn, Warm Introduction
- **Last Contact Date** (Date)
- **LinkedIn URL** (URL)
- **Referral Source** (Self-relation for network mapping)
- **Relations**: Interviews (with rollup count)

### 3. Interviews
- **Interview Title** (Title)
- **Contact** (Relation → Contacts)
- **Company** (Relation → Companies)
- **Date & Time** (Date)
- **Research Focus**: Agentic Workflows, LLM Reasoning, Tool Use, Multi-Agent Systems
- **Interview Type**: Discovery, Deep Dive, Follow-up, Validation
- **Status**: Scheduled, Completed, Cancelled, Rescheduled
- **Recording Link** (URL)
- **Granola Notes** (Files & media)
- **Workflow Patterns Discussed**: Reflection, Tool Use, ReAct, Planning, Multi-Agent
- **Technical Depth**: High-Level, Detailed, Deep Technical
- **Follow-up Actions** (Rich text)
- **Relations**: Key Insights, Project
- **CompletedNum** (Formula): `if(prop("Status") == "Completed", 1, 0)`

### 4. Insights
- **Insight Title** (Title)
- **Category**: Pain Point, Opportunity, Technical Challenge, Market Trend, Best Practice
- **AI Domain**: Reasoning Capabilities, Agent Architecture, Tool Integration, Multi-Agent Coordination
- **Source Interview** (Relation → Interviews)
- **Impact Level**: High, Medium, Low
- **Confidence Level**: High Confidence, Needs Validation, Hypothesis
- **Supporting Evidence** (Rich text)
- **Ecosystem Implications** (Rich text)
- **Actionable Opportunities** (Rich text)

### 5. Research Projects
- **Project Name** (Title)
- **Research Questions** (Rich text)
- **Target Stakeholder Types** (Multi-select)
- **Interview Target** (Number)
- **Relations**: Interviews, Key Findings
- **Completed Interviews** (Rollup): Sum of CompletedNum from related interviews
- **Completion %** (Formula): `if(prop("Interview Target") > 0, round(100 * prop("Completed Interviews") / prop("Interview Target")), 0)`
- **Timeline** (Date range)
- **Status**: Planning, Active, Analysis, Completed

### 6. Tasks (Optional)
- **Task** (Title)
- **Interview** (Relation → Interviews)
- **Contact** (Relation → Contacts)
- **Project** (Relation → Research Projects)
- **Due Date** (Date)
- **Priority**: Low, Medium, High, Urgent
- **Status**: Backlog, Next, Scheduled, In Progress, Waiting, Blocked, Completed
- **Owner** (People)
- **Channel**: Email, LinkedIn, Call, Meeting, Other
- **Recipient Email** (Email)
- **Next Action** (Rich text)
- **Notes** (Rich text)
- **Created** (Created time)
- **Completed At** (Date)
- **DoneNum** (Formula): `if(prop("Status") == "Completed", 1, 0)`
- **Is Overdue** (Formula): `and(prop("Status") != "Completed", prop("Due Date") != null, prop("Due Date") < now())`
- **DueSoonNum** (Formula): `if(and(prop("Status") != "Completed", prop("Due Date") != null, dateBetween(prop("Due Date"), now(), "days") <= 7, dateBetween(prop("Due Date"), now(), "days") >= 0), 1, 0)`

The Tasks database now includes project-level tracking with these additional rollups in Research Projects:
- **Total Tasks** (Rollup): Count of all related tasks
- **Completed Tasks** (Rollup): Sum of completed tasks
- **Open Tasks** (Formula): `prop("Total Tasks") - prop("Completed Tasks")`
- **Open %** (Formula): `if(prop("Total Tasks") > 0, round(100 * prop("Open Tasks") / prop("Total Tasks")), 0)`

## Feature Flags

The system supports feature flags to control which components are created:

- **INCLUDE_TASKS_DB**: Controls Tasks database creation (default: true)
- **INCLUDE_DASHBOARD_PAGE**: Controls enhanced dashboard creation (default: true)

Set these in your `.env` file or as environment variables.

## Post-Script Manual Setup

After running the bootstrap script, complete these manual steps in the Notion UI:

### 1. Database Page Templates

**For Interviews Database:**
1. Open Interviews database → Click "New" dropdown → "+ New template"
2. Add structured template with:
   - **Pre-Interview Checklist** (checkboxes)
     - [ ] Background research completed
     - [ ] Interview guide personalized
     - [ ] Meet + Granola tested
     - [ ] Follow-up email drafted
   - **During Interview Notes** (toggle sections)
     - Opening (5 minutes)
     - Core Discussion (35 minutes)
     - Deep Dive (15 minutes)
     - Closing (5 minutes)
   - **Post-Interview** (checkboxes)
     - [ ] Thank you email sent
     - [ ] Insights captured
     - [ ] Follow-up scheduled

**For Insights Database:**
1. Open Insights database → Click "New" dropdown → "+ New template"
2. Add template with structured fields and guidance for consistent insight capture

**For Tasks Database** (if enabled):
1. Open Tasks database → Click "New" dropdown → "+ New template"
2. Create email scaffolding templates (see Email Scaffolding section below)

### 2. Dashboard Views & Linked Databases

1. Navigate to the "Research Dashboard" page created by the script
2. Manually add these linked database views under each heading:

   **This Week's Interviews:**
   - Add linked database → Select "Interviews"
   - Change view to Calendar
   - Filter: Date & Time is this week

   **Follow-up Pipeline:**
   - Add linked database → Select "Tasks" (if enabled) or "Contacts"
   - Change view to Board
   - Group by: Status (for Tasks) or Interview Status (for Contacts)
   - Filter: Status ≠ Completed (for Tasks)

   **High-Value Targets:**
   - Add linked database → Select "Contacts"
   - Keep as Table view
   - Filter by: Stakeholder Type, Experience Level, Company Size Category

   **Insights Themes:**
   - Add linked database → Select "Insights"
   - Keep as Table view
   - Group by: Category or AI Domain

   **Progress:**
   - Add linked database → Select "Research Projects"
   - Keep as Table view
   - Show Completion % column

### 3. Optional Automations

**Complete Interview Button:**
- In Interviews database, add a button that:
  - Sets Status → "Completed"
  - Stamps completion date
  - Triggers follow-up reminder

**Complete Task Button** (if Tasks enabled):
- In Tasks database, add a button that:
  - Sets Status → "Completed"
  - Sets Completed At → now()
  - Updates priority and owner if needed

**Schedule Follow-up Button:**
- In Interviews or Contacts, add a button that:
  - Creates new Task with Due Date = now + 7 days
  - Links to current Interview/Contact
  - Pre-fills common follow-up actions

## Email Scaffolding Workflow

The Tasks database supports email workflow automation through database templates. Create these templates in the Notion UI for efficient email management.

### Email Templates (Manual UI Setup)

**1. "Email: Thank-you" Template**

Open Tasks database → Click "New" dropdown → "+ New template" → Name: "Email: Thank-you"

Add these content blocks to the template:

```
📋 Callout: "Copy/personalize the email below. Adjust bullets with concrete takeaways."

## Subject
Thank you — {{Company}} interview on {{Date}}

## Body
Hi {{FirstName}},

Thank you for your time today discussing {{topic}} at {{Company}}. Top takeaways:
• {{Insight 1}}
• {{Insight 2}}
• {{Insight 3}}

Next steps:
• {{Commitment you made}}
• {{What I'll send by when}}

If helpful, here's a slot finder: {{Scheduling Link}}.

Best,
{{Your Name}}

## Post-send Checklist
- [ ] Set Task → Status = Completed
- [ ] Create follow-up task if needed
```

**2. "Email: Follow-up" Template**

Create second template: "Email: Follow-up"

```
## Subject
Following up on {{topic}} — next steps

## Body
Hi {{FirstName}},

Following up on our {{Date}} conversation re: {{topic}}. Quick summary of the ask:
• {{Request/decision}}
• {{Link to doc/demo}}

Would {{two time windows}} work? Otherwise, feel free to propose.

Thanks again,
{{Your Name}}

## Post-send Checklist
- [ ] Set Task → Status = Completed
- [ ] Schedule next follow-up if needed
```

### Optional Database Buttons

Add these buttons to the Tasks database for workflow automation:

**Complete Task Button:**
- Action: Edit pages in Tasks
- Set Status = "Completed"
- Set Completed At = now()

**Draft Thank-you Email Button:**
- Action: Insert content blocks with Thank-you template
- Or connect to Gmail for direct sending

### Email Workflow Process

1. **After Interview**: Auto-created "Send thank-you email" task appears
2. **Open Task**: Use "Email: Thank-you" template
3. **Customize**: Replace {{placeholders}} with specific details
4. **Send Email**: Copy to email client or use Notion's email integration
5. **Complete**: Mark task as completed, create follow-up tasks as needed

### Integration with Recipient Email Field

The `Recipient Email` property in Tasks enables:
- Quick copy-paste to email clients
- Integration with email automation tools
- Contact management and email history tracking

## Integration Setup

### Google Calendar + Meet Integration

1. **Install Notion Calendar** (separate app)
2. Connect your Google account
3. Events automatically get Google Meet links
4. Use Make.com for two-way sync:
   - **Notion → Calendar**: New/updated Interview (Status = Scheduled) → Create/Update Google Calendar event
   - **Calendar → Notion**: Event completed/updated → Update Interview status

### Granola Notes Integration

1. In Granola: Settings → Integrations → Notion
2. Connect to your workspace
3. Point export target to Interviews database
4. Map fields: Interview Title, Date & Time, Granola Notes file

## File Structure

```
NotionTemplate/
├── scripts/
│   ├── notion.ts              # Notion client wrapper and utilities
│   ├── bootstrap-notion-crm.ts # Database creation script
│   └── seed-starter-content.ts # Sample data seeding
├── output/
│   └── notion-ids.json        # Generated database and property IDs
├── .env                       # Environment configuration
├── .env.example              # Environment template
├── package.json              # Node.js dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Scripts

- `npm run bootstrap` - Create all databases and relations (idempotent)
- `npm run seed` - Add sample content to test the setup
- `npm run build` - Compile TypeScript to JavaScript

## Key Design Decisions

### Relations & Rollups
- **Company field in Interviews**: Enables simple company-level interview rollups without complex nested rollups
- **Dual relations**: Automatically sync between databases (e.g., Contacts ↔ Interviews)
- **Rollup formulas**: Track progress and counts across related databases

### API Limitations Handled
- **No Status property creation**: Use Select properties instead
- **No linked database creation**: Manual step required
- **No view configuration**: Manual setup in UI
- **Formula/Select immutability**: Set options correctly during creation

### Idempotency
- Scripts check for existing databases by name before creating
- Safe to run multiple times
- Preserves existing data and relationships

## Troubleshooting

### Common Issues

**"Database not found" errors:**
- Verify NOTION_TOKEN has correct permissions
- Ensure ROOT_PAGE_ID is accessible by the integration
- Check that the integration is shared with the parent page

**Relation property errors:**
- Make sure databases are created in the correct order
- Relations require target database IDs to exist first

**Missing property IDs:**
- Run bootstrap script completely before seeding
- Check `output/notion-ids.json` for all required IDs

### Getting Help

- Check the [Notion API documentation](https://developers.notion.com/reference)
- Review error messages in console output
- Verify environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with your own Notion workspace
5. Submit a pull request

## License

MIT License - see LICENSE file for details
