/**
 * PROJECTS — add a project by adding one object to this array.
 *
 * Everything on the site that shows projects reads from here:
 *   • the filterable "Work" grid                 (every project; featured first)
 *   • the "Currently building" list              (status: Planning | In Development | Beta)
 *   • individual case-study pages /projects/<slug>/  (when caseStudy is present)
 *   • JSON-LD structured data and sitemap.xml
 *
 * Field reference
 * ───────────────
 * title        (required) Display name.
 * slug         (required) URL-safe id, unique. Used for /projects/<slug>/.
 * summary      (required) One or two sentences for cards.
 * categories   (required) Any of the filter keys in `projectCategories` below.
 * technologies (required) Short tags.
 * status       (required) 'Planning' | 'In Development' | 'Beta' | 'Live' | 'Maintained'
 * featured     Show first and larger in the grid.
 * archived     Keep the project but show it under an "Archived" label.
 * year         Optional string, e.g. '2026'.
 * image        Optional. { src: 'assets/projects/x.webp', width, height, alt,
 *              avif?: 'assets/projects/x.avif' }. Without an image a generated
 *              cover is drawn from the slug, so nothing ever looks broken.
 * links        Optional. { github, live, caseStudy, progress } — empty values are hidden.
 *              `caseStudy` here is for an EXTERNAL write-up; an internal page is
 *              created automatically when `caseStudy` (below) is filled in.
 * progressNote Optional. One line shown in "Currently building".
 * caseStudy    Optional. { problem, solution, architecture, challenges[], technologies[], results }
 */

/**
 * Filter categories, one per kind of work (mirrors src/data/services.js).
 * Every category is always shown as a filter, even with no projects yet;
 * empty ones are dimmed and show the "No projects in this category" note.
 * Add a new kind of work by adding an entry here, then tag projects with its key.
 */
export const projectCategories = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web Applications' },
  { key: 'backend', label: 'Backend Systems' },
  { key: 'api', label: 'API Development & Integration' },
  { key: 'automation', label: 'Business Automation' },
  { key: 'ai', label: 'AI Integration' },
  { key: 'saas', label: 'SaaS Products' },
  { key: 'integration', label: 'System Integration' },
  { key: 'modernization', label: 'Legacy Modernization' },
  { key: 'tools', label: 'Developer Tools' },
];

/** Order used by the status track in "Currently building". */
export const projectStatuses = ['Planning', 'In Development', 'Beta', 'Live', 'Maintained'];

export const projects = [
  {
    title: 'AI Engineering Workbench',
    slug: 'ai-engineering-workbench',
    summary:
      'A self-hosted AI workspace: one gateway serving a chat web app, a coding agent, a VS Code extension and a CLI, across hosted and local models.',
    categories: ['ai', 'tools', 'backend'],
    technologies: ['TypeScript', 'Node.js', 'React', 'SQLite', 'Ollama', 'LLM APIs', 'SSE'],
    status: 'Beta',
    featured: true,
    year: '2026',
    links: { github: '', live: '' },
    progressNote: 'Preparing the open-source release: licence, security policy and live-provider verification.',
    caseStudy: {
      problem:
        'Hosted and local language models each have strengths, but switching between separate chat apps, editor plugins and terminals means repeated context, no shared history and no control over what an agent is allowed to change.',
      solution:
        'A single backend gateway that every client talks to. The web app, the VS Code extension and the CLI share the same conversations, projects and knowledge store. The coding agent proposes changes as diffs and waits for explicit approval before writing anything to disk.',
      architecture:
        'npm-workspaces monorepo. Shared packages for providers, database, retrieval, security and the agent loop; apps for the server, web UI, CLI and VS Code extension. Responses stream over server-sent events using one event protocol. Providers sit behind a common interface, so NVIDIA-hosted models, OpenRouter and local Ollama models are interchangeable, and the Ollama model list is discovered at runtime rather than hard-coded.',
      challenges: [
        'Agent safety: every file write goes through a permission gate with a unified diff, and runs fail closed if no one answers the approval request.',
        'Different model families expose reasoning controls in incompatible shapes; the provider layer normalises them behind capability flags.',
        'Long agent runs can exhaust a context window quickly, so prompts are capped and trimmed with retrieval instead of replaying full history.',
        'Chats keep running on the server when a client disconnects, and reconnecting replays the events that were missed.',
      ],
      technologies: ['TypeScript', 'Node.js', 'React', 'Vite', 'SQLite', 'VS Code Extension API', 'Vitest'],
      results:
        'All six planned phases are implemented, with a test suite of several hundred automated tests. The remaining work before public release is verification against live providers and inside a real editor session.',
    },
  },
  {
    title: 'forge',
    slug: 'forge',
    summary:
      'A local-first AI coding tool for machines with a small GPU: routes work across small local models, verifies every change with the real toolchain, and escalates to a stronger model only when needed.',
    categories: ['ai', 'tools'],
    technologies: ['TypeScript', 'Node.js', 'Ollama', 'Git'],
    status: 'In Development',
    year: '2026',
    links: { github: '' },
    progressNote: 'Running end-to-end on real hardware and tuning model tiers for a 4 GB GPU.',
    caseStudy: {
      problem:
        'Most AI coding tools assume a large GPU or a paid API for every step. On a 4 GB laptop GPU, larger local models spill to the CPU and slow to a crawl, and sending everything to a hosted model is expensive.',
      solution:
        'A command-line tool that measures the hardware, plans which model fits in memory, scales effort to task difficulty and checks every edit by actually running the project’s compiler and tests. A stronger hosted model is used as a reviewer only when local repair attempts stop making progress.',
      architecture:
        'Zero runtime npm dependencies (Node built-ins with JSON storage) to avoid native-module breakage on Windows. Components include a hardware probe with memory budgeting, a model swap manager that keeps one model resident on the GPU, hybrid retrieval, a search-and-replace edit protocol, a bounded repair loop, git checkpoints with rollback, and a path jail with secret redaction.',
      challenges: [
        'Memory planning had to learn from measured behaviour, because the runtime placed less on the GPU than the free memory suggested.',
        'Small models copied line-number gutters into edits; the file reader was changed to return exact bytes and error messages quote the real file text.',
        'The tool refuses to report success when nothing actually changed.',
      ],
      technologies: ['TypeScript', 'Node.js', 'Ollama', 'Git'],
      results:
        'Core commands (health check, indexing, search, verification, questions) work on the target machine; a full autonomous edit run end-to-end is the current milestone.',
    },
  },
  {
    title: 'AI Efficiency',
    slug: 'ai-efficiency',
    summary:
      'A SaaS layer that analyses how a team uses AI, recommends the right model for each task and routes requests through a gateway with usage tracking.',
    categories: ['saas', 'ai', 'web', 'api'],
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Beta',
    year: '2026',
    links: { live: '' },
    progressNote: 'MVP complete; validating demand with early users.',
  },
  {
    title: 'SSH Connection Manager',
    slug: 'ssh-connection-manager',
    summary:
      'A cross-platform command-line tool to save servers, connect with one command, generate key pairs for new hosts and open any server directly in VS Code.',
    categories: ['tools'],
    technologies: ['CLI', 'SSH', 'Windows', 'Linux'],
    status: 'In Development',
    year: '2026',
    links: { github: '' },
    progressNote: 'Command-line version done; a desktop picker that opens on startup is next.',
  },
];
