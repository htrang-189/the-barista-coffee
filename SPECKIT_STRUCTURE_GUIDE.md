# 📚 Complete SpecKit Framework Structure & Purpose Guide

**Last Updated**: April 5, 2026  
**Framework**: SpecKit - AI-Native Specification-Driven Development  
**Scope**: Comprehensive folder structure overview for GitHub integration

---

## 🎯 Executive Summary

SpecKit organizes a specification-driven development workflow through a hierarchical folder structure that serves as the **"project brain"**. Every folder has a specific purpose aligned with the development lifecycle:

```
PROJECT_ROOT/
├── .specify/               ← SPECKIT CORE (Project Brain)
├── specs/                  ← ARTIFACT REPOSITORY (Generated specs)
├── barista/                ← IMPLEMENTATION (Application code)
└── docs/                   ← EXTERNAL DOCUMENTATION
```

---

## 📁 Part 1: `.specify/` Directory (Project Brain)

### **Location**: `/.specify/`
### **Purpose**: Central governance, templates, scripts, and knowledge repository
### **Owner**: All team members (BA/PO, Dev, QA)
### **Access**: Version-controlled, team-shared

---

## 🧠 `.specify/` Folder Structure

### **1. `memory/` Folder**
**Path**: `/.specify/memory/`  
**Purpose**: Persistent project knowledge base

| File | Purpose | Owner | Update Frequency |
|:-----|:--------|:------|:-----------------|
| `constitution.md` | Project principles, values, tech constraints, quality standards, governance rules | Product Lead | Upon project changes |

**Contents of `constitution.md`**:
- 📋 **Project Values**: Core principles guiding decisions
- 🔧 **Technical Constraints**: Tech stack rules, performance requirements
- 🎯 **Architecture Patterns**: Approved design patterns, anti-patterns
- ⚖️ **Governance Rules**: Code review standards, testing requirements
- 🛡️ **Security Policies**: Data protection, compliance requirements

**Example**:
```markdown
# Project Constitution

## Values
- Clarity before speed
- User-centric design
- Security by default

## Technical Constraints
- Framework: Next.js 16+
- Database: PostgreSQL
- API: REST + GraphQL

## Governance
- All specs require 100% clarity gate
- Test coverage: minimum 80%
- Code review: 2+ approvals required
```

---

### **2. `templates/` Folder**
**Path**: `/.specify/templates/`  
**Purpose**: Standardized markdown templates for consistent artifact generation

| Template | Purpose | Used By | Format |
|:---------|:--------|:--------|:-------|
| `spec-template.md` | User story structure, acceptance criteria format | SPECIFY agent | Markdown |
| `plan-template.md` | Architecture, tech stack, project structure | PLAN agent | Markdown |
| `tasks-template.md` | Task orchestration, phase organization | TASKS agent | Markdown |
| `constitution-template.md` | Project governance framework | Project setup | Markdown |
| `checklist-template.md` | Quality gates, validation criteria | QA/Review | Markdown |
| `agent-file-template.md` | Agent behavior customization | Agent config | YAML/Markdown |

**Key Principle**: Templates ensure consistency across all projects

**Example - `spec-template.md`**:
```markdown
# Feature Specification: [FEATURE NAME]

## User Stories
### User Story 1 (Priority: P1)
- Given [initial state]
- When [action]
- Then [expected outcome]

## Acceptance Criteria
- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
```

---

### **3. `scripts/bash/` Folder**
**Path**: `/.specify/scripts/bash/`  
**Purpose**: Automation and orchestration scripts for agent coordination

| Script | Purpose | Invoked By | Function |
|:-------|:--------|:-----------|:---------|
| `check-prerequisites.sh` | Pre-flight validation before any phase | Agent startup | Validates dependencies, checks project readiness |
| `setup-plan.sh` | Initialize planning phase | `/speckit.plan` command | Creates directory structure, validates spec |
| `create-new-feature.sh` | Feature scaffold generator | Developer CLI | Generates new feature folder structure |
| `update-agent-context.sh` | Context synchronization | Agent framework | Syncs constitution, dependencies across agents |
| `common.sh` | Shared utilities and helper functions | All scripts | Logging, validation helpers, common functions |

**Execution Flow**:
```bash
# Example: Creating a new feature
$ .specify/scripts/bash/create-new-feature.sh "payment-processing"
  ├─ Validates prerequisites
  ├─ Creates specs/001-payment-processing/
  ├─ Generates spec-template.md
  └─ Registers in feature registry

# Example: Pre-flight check
$ .specify/scripts/bash/check-prerequisites.sh --require-spec
  ├─ Checks git status
  ├─ Validates constitution exists
  ├─ Confirms Next.js environment
  └─ Returns status (READY/BLOCKED)
```

---

### **4. `integrations/` Folder**
**Path**: `/.specify/integrations/`  
**Purpose**: External tool connectors and configuration

| Integration | Purpose | Configuration |
|:------------|:--------|:--------------|
| **GitHub** | PR templates, branch rules, automation | `.github/pull_request_template.md`, branch rules |
| **CI/CD** | Build pipeline, deployment hooks | `github/workflows/`, build triggers |
| **IDE** | VSCode settings, editor configuration | `.vscode/settings.json`, extensions list |
| **LLM Provider** | AI model configuration, API keys | Provider-specific config files |

**Structure**:
```
.specify/integrations/
├── github/
│   ├── pr-template.md         → Pull request structure
│   ├── branch-rules.yaml      → Protected branch config
│   └── automation.yaml        → GitHub Actions integration
├── ci-cd/
│   ├── netlify.toml           → Netlify deployment config
│   ├── github-actions.yaml    → CI/CD pipelines
│   └── build-config.yaml      → Build parameters
├── ide/
│   ├── vscode-settings.json   → Editor preferences
│   ├── extensions.json        → Required VS Code extensions
│   └── .editorconfig          → Cross-editor formatting
└── llm/
    ├── provider-config.yaml   → LLM model selection
    ├── api-config.env         → API endpoint configuration
    └── model-parameters.yaml  → Temperature, max tokens, etc.
```

---

## 📊 Part 2: `specs/` Directory (Artifact Repository)

### **Location**: `/specs/`
### **Purpose**: Centralized repository for all generated specifications
### **Generated By**: SPECIFY, PLAN, TASKS agents
### **Structure**: Organized by feature ID and branch

---

## 📋 `specs/` Folder Structure

```
specs/
├── 001-main-menu-page/
│   ├── spec.md                    → Feature specification (user stories, AC)
│   ├── research.md                → Technical research, decisions
│   ├── plan.md                    → Architecture, tech stack, structure
│   ├── data-model.md              → Entities, relationships, schemas
│   ├── quickstart.md              → Integration guide, setup instructions
│   ├── contracts/
│   │   ├── api-contracts.md       → API endpoint specifications
│   │   ├── data-contracts.md      → Data schema contracts
│   │   └── test-requirements.md   → Testing specs from contracts
│   └── tasks.md                   → Implementation tasks (ordered, with deps)
│
├── 002-checkout-page/
│   ├── spec.md
│   ├── plan.md
│   ├── contracts/
│   └── tasks.md
│
└── 003-order-tracking/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

### **Feature Folder Naming Convention**
- **Format**: `NNN-feature-name/`
- **Example**: `001-main-menu-page`, `002-checkout-page`
- **Rationale**: Sequential numbering + kebab-case for consistency

### **Key Files in Each Feature Folder**

| File | Phase | Purpose | Owner |
|:-----|:------|:--------|:------|
| `spec.md` | SPECIFY | User stories, acceptance criteria, requirements | BA/PO |
| `research.md` | SPECIFY | Technical decisions, research findings | Tech Lead |
| `plan.md` | PLAN | Architecture, design decisions, structure | Solution Architect |
| `data-model.md` | PLAN | Entity relationships, database schema | Data Architect |
| `quickstart.md` | PLAN | Integration scenarios, setup guide | Developer |
| `contracts/api-contracts.md` | PLAN | API endpoint documentation | Backend Lead |
| `tasks.md` | TASKS | Implementation tasks, dependencies | Project Manager |

---

## 🚀 Part 3: `barista/` Directory (Implementation)

### **Location**: `/barista/`
### **Purpose**: Actual application source code and infrastructure
### **Generated By**: IMPLEMENT agent (based on tasks.md)
### **Owner**: Development team

---

## 💻 `barista/` Folder Structure

```
barista/
├── app/                           ← Next.js App Router
│   ├── api/                       → REST API routes
│   │   ├── categories/route.ts    → Product categories endpoint
│   │   ├── orders/route.ts        → Order management endpoints
│   │   └── products/route.ts      → Product listing endpoints
│   ├── checkout/page.tsx          → Checkout page component
│   ├── menu/page.tsx              → Menu listing page
│   ├── order-status/[id]/page.tsx → Order tracking page
│   ├── layout.tsx                 → Root layout wrapper
│   ├── page.tsx                   → Homepage
│   └── globals.css                → Global styles
│
├── components/                    ← React Components
│   ├── checkout/
│   │   ├── CheckoutForm.tsx       → Form component
│   │   └── OrderSummaryDisplay.tsx → Summary display
│   ├── menu/
│   │   ├── ProductCard.tsx        → Product card component
│   │   ├── ProductGrid.tsx        → Grid layout
│   │   └── CustomizationModal.tsx → User customization
│   └── common/
│       ├── Button.tsx             → Reusable button
│       ├── Modal.tsx              → Reusable modal
│       └── Input.tsx              → Form input
│
├── lib/                           ← Utilities & Libraries
│   ├── api/
│   │   └── client.ts              → API client instance
│   ├── checkout-validation.ts     → Form validation logic
│   ├── product-images.ts          → Image URL mapping
│   └── order-storage.ts           → Local order persistence
│
├── store/                         ← State Management (Zustand)
│   └── index.ts                   → Global cart state
│
├── public/                        ← Static assets
│   └── favicon.ico                → Site icon
│
├── cypress/                       ← E2E Tests
│   ├── e2e/
│   │   └── complete-flow.cy.ts    → End-to-end test scenarios
│   └── cypress.config.ts          → Cypress configuration
│
├── next.config.ts                 ← Next.js configuration
├── tsconfig.json                  ← TypeScript configuration
├── package.json                   ← Dependencies & scripts
├── netlify.toml                   ← Netlify deployment config
├── DOCUMENTATION.md               ← API documentation
└── README.md                      ← Project README

```

### **Key Subfolders**

**`app/` (Next.js App Router)**
- Houses all pages and API routes
- Organized by feature/page
- Dynamic routes use `[id]` syntax

**`components/` (React Components)**
- Organized by feature
- `common/` contains reusable components
- Each component is self-contained with props

**`lib/` (Utilities)**
- API client initialization
- Validation logic
- Helper functions
- Storage management

**`store/` (State Management)**
- Zustand store for cart state
- Centralized state management

---

## 📖 Part 4: `docs/` Directory (External Documentation)

### **Location**: `/docs/` (root level or `barista/`)
### **Purpose**: User-facing and team documentation
### **Owner**: Technical Writer / Developer

---

## 📝 `docs/` Contents

| Document | Purpose | Audience |
|:---------|:--------|:---------|
| `DOCUMENTATION.md` | Complete API reference, setup guide | Developers, Consumers |
| `LAUNCH_CHECKLIST.md` | Pre-launch validation checklist | QA, DevOps |
| `PHASE_*.md` | Phase completion reports | Project stakeholders |
| `DEPLOYMENT_GUIDE.md` | Deployment instructions | DevOps Engineers |
| `TROUBLESHOOTING.md` | Common issues and fixes | Developers |

---

## 🔗 Part 5: Root Level Files (Project Configuration)

```
PROJECT_ROOT/
├── .specify/                      ← Core governance (detailed above)
├── .github/                       ← GitHub configuration
│   ├── workflows/                 → CI/CD pipelines
│   ├── prompts/                   → Agent prompts
│   └── ISSUE_TEMPLATE/            → GitHub issue templates
├── .gitignore                     ← Git ignore rules
├── .env.local                     ← Local environment variables
├── .env.production                ← Production environment variables
├── plan.md                        ← Main project plan
├── tasks.md                       ← Master task list
├── SpecKit_Research_Core.md       ← This presentation
├── SPECKIT_STRUCTURE_GUIDE.md     ← This guide
├── README.md                      ← Project overview
├── package.json                   ← Dependencies (if monorepo root)
└── tsconfig.json                  ← TypeScript config (if monorepo root)
```

---

## 🎯 Part 6: Artifact Dependency Chain

### **How SpecKit Structures Flow Through Folders**

```
LIFECYCLE FLOW
═════════════════════════════════════════════════════════════════

1️⃣ SPECIFY PHASE
   Input:  User description (BA/PO conversation)
   Output: /specs/001-feature/spec.md + research.md
   ├─ Validation Gate: Constitution compliance
   └─ Output: Stored in specs/ folder

2️⃣ PLAN PHASE
   Input:  /specs/001-feature/spec.md (validated)
   Output: /specs/001-feature/plan.md + data-model.md + contracts/
   ├─ Validation Gate: Architecture review
   └─ Output: Stored in same specs/ subfolder

3️⃣ TASKS PHASE
   Input:  /specs/001-feature/plan.md (approved)
   Output: /specs/001-feature/tasks.md (ordered + dependencies)
   ├─ Task Properties: [P] markers for parallel execution
   └─ Output: Stored in same specs/ subfolder

4️⃣ IMPLEMENT PHASE
   Input:  /specs/001-feature/tasks.md (complete)
   Output: Code generated in /barista/ folder
   ├─ Source Code: app/, components/, lib/ subdirectories
   ├─ Tests: cypress/ directory
   ├─ Docs: DOCUMENTATION.md at root
   ├─ Config: netlify.toml, next.config.ts
   └─ Validation: Each task verified against spec

═════════════════════════════════════════════════════════════════
```

### **Traceability Matrix**: Spec → Code Mapping

```
/specs/001-feature/spec.md (User Story)
    ↓
/specs/001-feature/plan.md (Architecture Decision → Why)
    ↓
/specs/001-feature/contracts/api-contracts.md (API Design)
    ↓
/specs/001-feature/tasks.md (Task: "Implement GET /api/users")
    ↓
/barista/app/api/users/route.ts (Actual Implementation)
    ↓
/barista/cypress/e2e/user-api.cy.ts (Test from Acceptance Criteria)
```

---

## 📊 Part 7: Folder Purpose Matrix

### **Complete Reference Table**

| Folder | Purpose | Lifecycle Phase | Owner | Frequency |
|:-------|:--------|:----------------|:------|:----------|
| `.specify/memory/` | Constitutional governance | All phases | Product Lead | Static |
| `.specify/templates/` | Template standards | Setup | Tech Lead | On project change |
| `.specify/scripts/bash/` | Automation orchestration | All phases | DevOps | On agent update |
| `.specify/integrations/` | Tool configuration | Setup + CI/CD | Platform Eng | Per tool update |
| `specs/[NNN]/` | Specification artifacts | Specify-Plan-Tasks | BA/PO, Arch, Dev | Per feature |
| `barista/app/` | Pages and API routes | Implement | Backend Dev | Per commit |
| `barista/components/` | UI components | Implement | Frontend Dev | Per commit |
| `barista/lib/` | Utilities and helpers | Implement | Any Dev | Per commit |
| `barista/store/` | State management | Implement | Frontend Dev | Per commit |
| `barista/cypress/` | End-to-end tests | Test & Validate | QA Engineer | Per feature |
| `docs/` | External documentation | Finalize | Tech Writer | Post-phase |

---

## 🔐 Part 8: Access Control & Governance

### **Folder Access by Role**

| Folder | BA/PO | Developer | QA/Tester | DevOps | Solution Architect |
|:-------|:------|:----------|:----------|:--------|:-------------------|
| `.specify/memory/` | ✅ Review | 🔒 Read | ✅ Review | ✅ Read | ✅ Admin |
| `.specify/` | ✅ Collaborate | ✅ Collaborate | ✅ Read | ✅ Admin | ✅ Admin |
| `specs/` | ✅ Create | ✅ Review | ✅ Review | 🔒 Read | ✅ Admin |
| `barista/app/` | 🔒 View | ✅ Write | 🔒 View | 🔒 View | ✅ Review |
| `barista/cypress/` | 🔒 View | ✅ Contribute | ✅ Write | 🔒 View | ✅ Review |
| `docs/` | ✅ Review | ✅ Write | ✅ Write | ✅ Write | ✅ Admin |

**Legend**: ✅ Full Access | 🔒 Restricted | ✅ Admin = Full admin rights

---

## 🚀 Part 9: GitHub Integration Guide

### **How SpecKit Folders Map to GitHub**

```
GitHub Repository: the-barista-coffee
├── .github/
│   ├── workflows/         ← CI/CD automation
│   ├── ISSUE_TEMPLATE/    ← Issue templates
│   └── prompts/           ← Agent prompts
│
├── .specify/              ← Protected: Review required on changes
│   └── memory/constitution.md (PROTECTED - Admin only)
│
├── specs/                 ← Main branch only, PR required
│   └── [NNN]-feature/     (Auto-generated by agents)
│
├── barista/               ← Feature branches, PR reviews
│   ├── app/
│   ├── components/
│   └── ...
│
└── docs/                  ← Automated updates, PR optional
    └── *.md files
```

### **GitHub Branch Strategy**

```
main (master branch)
├─ Protected: All changes via PR
├─ .specify/ changes: Admin review only
├─ specs/ changes: Automatic (agent-generated)
└─ barista/ changes: Code review required

feature/NNN-feature-name (feature branches)
├─ Created per feature
├─ One-to-one mapping with /specs/NNN-feature-name/
└─ Merged via PR to main after approval
```

---

## 📋 Part 10: Initialization Checklist

### **Setting Up SpecKit Folder Structure**

```bash
# 1. Initialize .specify/ directory
$ mkdir -p .specify/{memory,templates,scripts/bash,integrations}

# 2. Create constitution.md (foundational)
$ cp .specify/templates/constitution-template.md .specify/memory/constitution.md

# 3. Create specs/ directory
$ mkdir -p specs

# 4. Create barista/ application directory (if new project)
$ mkdir -p barista/{app,components,lib,store,cypress/e2e}

# 5. Create docs/ for documentation
$ mkdir -p docs

# 6. Version control all folders
$ git add .specify/ specs/ barista/ docs/
$ git commit -m "chore: initialize SpecKit folder structure"
```

---

## ✅ Summary: SpecKit Folder Purpose at a Glance

| Folder | What | Why | When |
|:-------|:-----|:----|:-----|
| `.specify/memory/` | Constitution & governance | Source of truth for project rules | Once at start |
| `.specify/templates/` | Standard formats | Consistency across all artifacts | Per project setup |
| `.specify/scripts/bash/` | Automation | Orchestrate agent execution | Per agent invocation |
| `.specify/integrations/` | Tool configs | Connect external systems | Per tool integration |
| `specs/[NNN]/` | Feature specifications | Complete feature documentation | Per feature lifecycle |
| `barista/` | Application code | Actual implementation | Per development sprint |
| `docs/` | User-facing docs | Maintain documentation | Post-implementation |

---

## 🎓 Quick Start: Navigating SpecKit

**Q: "Where do I find the project rules?"**  
A: → `/.specify/memory/constitution.md`

**Q: "Where should I document my feature spec?"**  
A: → `/specs/[###-feature-name]/spec.md`

**Q: "Where is the API implementation?"**  
A: → `/barista/app/api/[endpoint]/route.ts`

**Q: "Where are the E2E tests?"**  
A: → `/barista/cypress/e2e/`

**Q: "Where is the deployment config?"**  
A: → `/barista/netlify.toml` or `.specify/integrations/`

**Q: "Where are the architecture decisions documented?"**  
A: → `/specs/[###-feature-name]/plan.md`

---

**Document Version**: 1.0  
**Last Updated**: April 5, 2026  
**Framework**: SpecKit v1.0  
**Maintainer**: Solution Architecture Team
