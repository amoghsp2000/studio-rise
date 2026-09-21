/**
 * TECHNOLOGIES — shown as a layered system stack, top (closest to the user)
 * to bottom (infrastructure). Add, remove or rename freely.
 * Set `primary: true` on the tools you use most; they are emphasised.
 */
export const technologyLayers = [
  {
    id: 'ai',
    title: 'AI',
    role: 'Models, retrieval and agents inside real products',
    items: [
      { name: 'LLM APIs', primary: true },
      { name: 'Ollama', primary: true },
      { name: 'AI agents' },
      { name: 'RAG' },
      { name: 'Python' },
      { name: 'Automation' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    role: 'Interfaces people use every day',
    items: [
      { name: 'JavaScript', primary: true },
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'React' },
      { name: 'Bootstrap' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    role: 'Business logic, APIs and background work',
    items: [
      { name: 'PHP', primary: true },
      { name: 'Node.js', primary: true },
      { name: 'Python' },
      { name: 'Laravel' },
    ],
  },
  {
    id: 'data',
    title: 'Databases',
    role: 'Where correctness lives',
    items: [{ name: 'MySQL', primary: true }, { name: 'PostgreSQL' }, { name: 'Redis' }, { name: 'SQLite' }],
  },
  {
    id: 'infra',
    title: 'Infrastructure',
    role: 'Running it reliably',
    items: [
      { name: 'Linux', primary: true },
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Docker' },
      { name: 'cPanel / WHM' },
      { name: 'Cloud services' },
    ],
  },
];
