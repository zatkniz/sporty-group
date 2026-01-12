# Copilot Configuration

This directory contains custom instructions and skills for GitHub Copilot to better understand and work with this Nuxt 4 project.

## 📁 Structure

```
.github/
├── copilot-instructions.md        # Repository-wide instructions (always loaded)
├── instructions/                  # Path-specific instructions (loaded for matching files)
│   ├── components.instructions.md
│   ├── composables.instructions.md
│   ├── layouts.instructions.md
│   ├── pages.instructions.md
│   ├── server-api.instructions.md
│   ├── utils.instructions.md
│   └── nuxt-config.instructions.md
└── skills/                        # Task-specific skills (loaded when relevant)
    ├── nuxt-documentation-lookup/
    ├── nuxt-module-finder/
    ├── nuxt-deployment-guide/
    └── nuxt-release-info/
```

## 🎯 Instructions vs Skills

### Instructions (`.github/copilot-instructions.md` & `.github/instructions/`)

**Always loaded** - Provide persistent context about the project.

- **Purpose**: Describe how the project works, conventions, structure, build commands
- **When**: Always active, providing constant context to Copilot
- **Content**: 
  - Project overview and tech stack
  - Directory structure and conventions
  - Auto-import rules
  - Build/test commands
  - Configuration patterns
  - Best practices for each file type

**Repository-wide instructions** (`copilot-instructions.md`):
- General project information
- Build and development commands
- Common troubleshooting
- Tech stack and conventions

**Path-specific instructions** (`instructions/*.instructions.md`):
- Apply only when working with matching files
- Specific to file types (components, pages, composables, etc.)
- Code patterns and examples
- File-specific best practices

### Skills (`.github/skills/`)

**Loaded when relevant** - Step-by-step processes for specific tasks.

- **Purpose**: Provide workflows for specific tasks that require external tools/data
- **When**: Loaded by Copilot when task matches skill description
- **Content**:
  - When to use the skill
  - Step-by-step process
  - Tool invocations
  - Examples

**Available Skills**:

1. **nuxt-documentation-lookup** - Look up Nuxt API docs for advanced features
2. **nuxt-module-finder** - Find and evaluate Nuxt modules
3. **nuxt-deployment-guide** - Get platform-specific deployment instructions
4. **nuxt-release-info** - Find release announcements and updates

## 🔄 How It Works

### Instructions Flow
```
User edits app/components/Button.vue
    ↓
Copilot loads: copilot-instructions.md (always)
    ↓
Copilot loads: instructions/components.instructions.md (matches path)
    ↓
Copilot provides context-aware suggestions
```

### Skills Flow
```
User: "I need authentication for my Nuxt app"
    ↓
Copilot recognizes task matches "nuxt-module-finder" skill
    ↓
Skill provides step-by-step process:
  1. Search modules with category: "auth"
  2. Compare options
  3. Get details for best match
  4. Provide installation steps
    ↓
Copilot executes workflow and provides recommendations
```

## 📝 Key Principles

### Instructions Should:
- ✅ Be concise (2 pages max per file)
- ✅ Focus on conventions and structure
- ✅ Provide code examples
- ✅ Explain auto-import behavior
- ✅ Document build/test commands
- ❌ NOT include task-specific workflows
- ❌ NOT duplicate content between files

### Skills Should:
- ✅ Have clear "When to Use" section
- ✅ Provide step-by-step process
- ✅ Specify tool invocations
- ✅ Include examples
- ✅ Be task-focused
- ❌ NOT duplicate instructions content
- ❌ NOT cover basic project conventions

## 🔍 Example Scenarios

### Scenario 1: Creating a Component

**Copilot Uses**: 
- `copilot-instructions.md` (auto-import rules)
- `instructions/components.instructions.md` (component patterns)

**Result**: Suggests properly structured component with auto-imports

### Scenario 2: "I need authentication"

**Copilot Uses**:
- `copilot-instructions.md` (project context)
- `skills/nuxt-module-finder/` (finds auth modules)

**Result**: Searches modules, recommends best option, provides installation

### Scenario 3: "How do I use Nuxt hooks?"

**Copilot Uses**:
- `copilot-instructions.md` (project context)
- `skills/nuxt-documentation-lookup/` (retrieves hook documentation)

**Result**: Fetches official docs, provides examples with project context

### Scenario 4: Editing `nuxt.config.ts`

**Copilot Uses**:
- `copilot-instructions.md` (general context)
- `instructions/nuxt-config.instructions.md` (config patterns)

**Result**: Suggests proper configuration structure and patterns

## 🛠️ Maintenance

### When to Update Instructions:
- Project structure changes
- New conventions adopted
- Build process changes
- New file types added

### When to Update Skills:
- New tools/APIs available
- Workflow processes change
- New task patterns emerge

### When to Add New Skills:
- Repetitive task that requires multiple steps
- Task that needs external data/tools
- Clear workflow that benefits from automation

## 📚 Additional Resources

- [GitHub Copilot Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Repository Custom Instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [Agent Skills Standard](https://github.com/agentskills/agentskills)
