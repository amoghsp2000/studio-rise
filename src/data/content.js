/**
 * Smaller content blocks. Edit copy here rather than in components.
 */

export const hero = {
  title: 'Build software that moves your business forward',
  lead:
    'Custom software, backend systems, APIs, automation and AI-powered applications for businesses that need them to work every day, not just in the demo.',
  credibility: ['Software engineering', 'Backend systems', 'APIs', 'Automation', 'AI'],
};

/** Engineering approach — a real sequence, so it is numbered. */
export const processSteps = [
  { title: 'Understand', text: 'Map the business problem, the people involved and what “working” means before any code is written.' },
  { title: 'Design', text: 'Choose the architecture, data model and integration points, and agree on the trade-offs in writing.' },
  { title: 'Build', text: 'Develop in small, reviewable increments with working software you can try along the way.' },
  { title: 'Test', text: 'Check reliability, security and the edge cases: retries, duplicates, timeouts and bad input.' },
  { title: 'Deploy', text: 'Set up production infrastructure, backups, logging and a documented release process.' },
  { title: 'Improve', text: 'Monitor real usage, fix what surfaces and keep improving the system after launch.' },
];

/** Why work with us — principles, not statistics. */
export const principles = [
  { title: 'Business-first engineering', text: 'Technical choices are judged by what they do for your operations and your budget.' },
  { title: 'Maintainable architecture', text: 'Readable code, clear boundaries and documentation, so the system outlives the project.' },
  { title: 'API-first development', text: 'Clean interfaces make it easy to add a mobile app, a partner or an automation later.' },
  { title: 'Automation where it pays', text: 'Repetitive work is automated, with logs and retries so nothing fails silently.' },
  { title: 'Reliable integrations', text: 'Webhooks are verified, calls are idempotent and mismatches get reconciled.' },
  { title: 'Security-conscious by default', text: 'Least-privilege access, validated input, protected secrets and auditable changes.' },
  { title: 'Performance-focused', text: 'Efficient queries and lean pages, measured rather than guessed.' },
  { title: 'Clear communication', text: 'Plain-language updates, honest estimates and early warning when something changes.' },
];

export const about = {
  heading: 'An engineering studio led by the engineer who builds your software',
  paragraphs: [
    'The studio is led by its founder, a backend-focused software engineer who designs and builds production systems for payments, messaging, document processing and government-portal automation, mostly in PHP, Node.js, Python and MySQL.',
    'Working directly with the person writing the code means fewer handoffs, faster decisions and someone who understands both the business problem and the database schema. Current focus areas are backend engineering, API integration, business automation, software architecture and AI-powered applications.',
  ],
};

export const contactCopy = {
  heading: 'Have a software problem to solve?',
  lead: 'Tell us what you’re trying to build or fix. A short description is enough to start the conversation.',
  projectTypes: [
    'Custom software / web application',
    'Backend or API development',
    'API integration',
    'Business automation',
    'AI integration',
    'SaaS product',
    'Modernising existing software',
    'Something else',
  ],
};

/**
 * Hero "request trace" — illustrative examples of the kind of systems the
 * studio builds. Each line: [elapsed, component, message, state]
 * state: 'ok' | 'wait' | 'warn'
 */
export const traceScenarios = [
  {
    id: 'webhook',
    label: 'Payment webhook',
    lines: [
      ['0 ms', 'gateway', 'POST /webhooks/payment received', 'ok'],
      ['3 ms', 'verify', 'signature valid, event id not seen before', 'ok'],
      ['9 ms', 'queue', 'job enqueued: settle_order', 'ok'],
      ['41 ms', 'worker', 'order locked, wallet credited once', 'ok'],
      ['58 ms', 'notify', 'receipt sent to customer', 'ok'],
      ['60 ms', 'audit', 'ledger entry written, 200 OK', 'ok'],
    ],
  },
  {
    id: 'document',
    label: 'Document AI',
    lines: [
      ['0 s', 'upload', 'invoice.pdf stored, 2 pages', 'ok'],
      ['0.4 s', 'extract', 'text and tables extracted', 'ok'],
      ['2.1 s', 'model', 'fields returned as JSON', 'ok'],
      ['2.2 s', 'validate', 'tax ID checksum passed, totals match', 'ok'],
      ['2.2 s', 'review', 'low confidence on due date, flagged', 'warn'],
      ['2.3 s', 'export', 'draft entry queued for approval', 'wait'],
    ],
  },
  {
    id: 'sync',
    label: 'Nightly sync',
    lines: [
      ['02:00', 'cron', 'reconciliation run started', 'ok'],
      ['02:00', 'fetch', '1,204 records pulled from partner API', 'ok'],
      ['02:03', 'compare', '3 records differ from local database', 'warn'],
      ['02:03', 'retry', 'pending jobs re-checked with provider', 'ok'],
      ['02:04', 'repair', '3 records updated, reasons logged', 'ok'],
      ['02:04', 'report', 'summary sent to operations', 'ok'],
    ],
  },
];
