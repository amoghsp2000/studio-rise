/**
 * SERVICES — edit, reorder, add or remove entries here.
 * `icon` must be a key from src/lib/icons.js.
 * `details` is shown when a visitor expands "Learn more".
 */
export const services = [
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    icon: 'layers',
    summary:
      'Tailored web applications and business software built around the way your operations actually run.',
    details:
      'From internal dashboards to customer-facing portals: requirements are mapped to workflows first, then built as maintainable software with clear data models, roles and audit trails.',
    tags: ['Web apps', 'Portals', 'Dashboards', 'Internal tools'],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: 'server',
    summary: 'Reliable backend systems: APIs, authentication, databases and business logic.',
    details:
      'Backend development in PHP, Node.js and Python with MySQL or PostgreSQL. Transactions, idempotency, locking and logging are designed in from the start, because that is where production systems usually fail.',
    tags: ['PHP', 'Node.js', 'Python', 'MySQL', 'PostgreSQL'],
  },
  {
    id: 'api',
    title: 'API Development & Integration',
    icon: 'plug',
    summary: 'Connect payment providers, business platforms, third-party services and internal systems.',
    details:
      'REST API design and API integration services for payment gateways, messaging platforms, government and partner portals, and SaaS tools, with retries, webhook verification and reconciliation for the cases where the other side misbehaves.',
    tags: ['REST', 'Webhooks', 'OAuth2', 'Payments'],
  },
  {
    id: 'automation',
    title: 'Business Automation',
    icon: 'workflow',
    summary: 'Automate repetitive workflows with APIs, queues, cron jobs, webhooks and background workers.',
    details:
      'Workflow automation that removes manual steps without hiding them: every automated job is logged, retryable and visible, so the team can see what happened and step in when something is stuck.',
    tags: ['Queues', 'Cron', 'Workers', 'Webhooks'],
  },
  {
    id: 'ai',
    title: 'AI Integration',
    icon: 'spark',
    summary: 'Add LLMs, AI APIs, local models and assistants to software you already run.',
    details:
      'AI integration and AI application development: document extraction, assistants that answer from your own data, AI agents that act through controlled tools, and local models where data must stay on your servers.',
    tags: ['LLM APIs', 'Ollama', 'RAG', 'AI agents'],
  },
  {
    id: 'saas',
    title: 'SaaS Development',
    icon: 'cloud',
    summary: 'Take a SaaS product from prototype to production.',
    details:
      'Multi-tenant architecture, subscription and usage plans, admin tooling and the operational groundwork (backups, monitoring, deployment) a SaaS product needs once real customers depend on it.',
    tags: ['Multi-tenant', 'Billing', 'Admin tools'],
  },
  {
    id: 'integration',
    title: 'System Integration',
    icon: 'nodes',
    summary: 'Reliable data flows between the applications your business already uses.',
    details:
      'Syncing orders, customers, invoices or inventory between systems that were never designed to talk to each other, with clear ownership of each record and a way to detect and repair drift.',
    tags: ['Data sync', 'ETL', 'Middleware'],
  },
  {
    id: 'modernization',
    title: 'Legacy Software Modernization',
    icon: 'refresh',
    summary: 'Improve existing software without rebuilding everything from scratch.',
    details:
      'Incremental modernisation of legacy PHP and database-driven applications: fixing race conditions and slow queries, adding tests and logging, redesigning interfaces and extracting APIs, while the system stays in production.',
    tags: ['Refactoring', 'Performance', 'Security'],
  },
];
