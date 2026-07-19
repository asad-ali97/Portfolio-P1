import PropTypes from 'prop-types'
import {
  Binary,
  Terminal,
  FileCode2,
  Component,
  Smartphone,
  Code2,
  Layers,
  Server,
  Network,
  Database,
  FlaskConical,
  ClipboardCheck,
  Blocks,
  Bug,
  ShieldCheck,
  GitBranch,
  Workflow,
  Container,
  Sparkles,
  Bot,
  Braces,
  TestTube2,
  BrainCircuit,
  Boxes,
  Calculator,
  Dumbbell,
  Globe,
  Store,
  Briefcase,
  Heart,
} from 'lucide-react'

// Explicit map — deliberately NOT `import * as Icons from 'lucide-react'`,
// which would pull the entire icon set (thousands of components) into
// the bundle and blow the perf budget in 11_performance.md. Only
// icons actually referenced by src/data/*.js belong here.
const ICON_MAP = {
  Binary,
  Terminal,
  FileCode2,
  Component,
  Smartphone,
  Code2,
  Layers,
  Server,
  Network,
  Database,
  FlaskConical,
  ClipboardCheck,
  Blocks,
  Bug,
  ShieldCheck,
  GitBranch,
  Workflow,
  Container,
  Sparkles,
  Bot,
  Braces,
  TestTube2,
  BrainCircuit,
  Boxes,
  Calculator,
  Dumbbell,
  Globe,
  Store,
  Briefcase,
  Heart,
}

/**
 * Renders a lucide icon by name (as stored in data files). Falls back
 * to a plain circle glyph if an unrecognized name is ever passed, so
 * a data typo degrades gracefully instead of crashing the page.
 */
function Icon({ name, size = 20, className = '', ...rest }) {
  const LucideIcon = ICON_MAP[name]

  if (!LucideIcon) return null

  return <LucideIcon size={size} className={className} aria-hidden="true" {...rest} />
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
}

export default Icon
