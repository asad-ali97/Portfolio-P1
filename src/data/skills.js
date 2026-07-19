/**
 * Skills content — categories map to the exact skill list in
 * 09_content.md. Proficiency values are self-assessed levels (0-100)
 * intended as an editable starting point, not a verified metric.
 *
 * Icons are generic/conceptual (lucide-react), not brand logos —
 * lucide dropped brand icons in recent versions, and monochrome
 * conceptual icons also read as more "premium/minimal" than a wall
 * of colorful brand marks (matches 03_design_system.md's restrained
 * palette better).
 */
export const SKILL_CATEGORIES = [
  {
    id: 'languages',
    label: 'Programming Languages',
    icon: 'Braces',
    accentIconClass: 'bg-primary/10 text-primary',
    accentBarClass: 'from-primary to-secondary',
    accentGlowClass: 'from-primary/60 to-secondary/60',
    skills: [
      { name: 'C++', level: 80, icon: 'Binary' },
      { name: 'Python', level: 85, icon: 'Terminal' },
      { name: 'JavaScript', level: 90, icon: 'FileCode2' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: 'Component',
    skills: [
      { name: 'React', level: 90, icon: 'Component' },
      { name: 'React Native', level: 75, icon: 'Smartphone' },
      { name: 'HTML & CSS', level: 90, icon: 'Code2' },
      { name: 'Tailwind CSS', level: 88, icon: 'Layers' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: 'Server',
    skills: [
      { name: 'Node.js', level: 78, icon: 'Server' },
      { name: 'Express', level: 76, icon: 'Network' },
      { name: 'MongoDB', level: 74, icon: 'Database' },
    ],
  },
  {
    id: 'testing',
    label: 'Software Testing & QA Automation',
    icon: 'TestTube2',
    skills: [
      { name: 'Selenium', level: 85, icon: 'FlaskConical' },
      { name: 'TestNG', level: 80, icon: 'ClipboardCheck' },
      { name: 'Page Object Model / PageFactory', level: 82, icon: 'Blocks' },
      { name: 'Katalon Studio', level: 75, icon: 'Bug' },
      { name: 'Manual & Regression Testing', level: 85, icon: 'ShieldCheck' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Tools',
    icon: 'Workflow',
    skills: [
      { name: 'Git & GitHub', level: 90, icon: 'GitBranch' },
      { name: 'GitHub Actions (CI/CD)', level: 72, icon: 'Workflow' },
      { name: 'Docker', level: 65, icon: 'Container' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Automation',
    icon: 'BrainCircuit',
    skills: [
      { name: 'AI Automation', level: 70, icon: 'Sparkles' },
      { name: 'Agentic AI', level: 65, icon: 'Bot' },
    ],
  },
]
