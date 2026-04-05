---
marp: true
theme: default
paginate: true
backgroundColor: #f9f7f4
color: #1a1a1a
style: |
  section {
    background: linear-gradient(135deg, #f9f7f4 0%, #efe9dc 100%);
    font-family: 'Segoe UI', sans-serif;
  }
  h1 { color: #8b6f47; font-size: 2.8em; }
  h2 { color: #8b6f47; font-size: 2em; }
  li { font-size: 1.1em; line-height: 1.4; }
---

# 🎯 SpecKit Research Core
## Spec-Driven Development Meets AI Automation

---

## Overview: Concept & Definition

- 🔍 **Unified Specs**: AI-readable design specifications bridge intent to execution
- 📋 **Single Source of Truth**: One spec drives requirements, design, implementation, tests
- 🤖 **AI Automates**: Agents generate code, tests, docs without "glue code"
- 🚀 **60-80% Faster**: Ideation to deployment with eliminated ambiguity

---

## Core Architecture

- 🧠 **Multi-Agent**: `specify`, `plan`, `task`, `implement` agents collaborate
- 📖 **Context**: `.specify/` maintains constitution, specs, plans, inventory
- 🔄 **Feedback**: Agents validate outputs, adjust strategies continuously
- 🎭 **Phases**: Each agent owns one lifecycle phase with clear gates

---

## SpecKit vs. Cucumber & OpenAPI

| Aspect | Cucumber | OpenAPI | SpecKit |
|:-------|:---------|:--------|:--------|
| **Glue Code** | 30-40% overhead | 60-70% manual | Eliminated |
| **Coupling** | Loose (drifts) | Medium | Tight (true) |
| **Scope** | BDD only | APIs only | Full-stack |
| **Automation** | Partial | Partial | End-to-end |

---

## Roles Transform in SpecKit SDLC

| Role | Traditional | SpecKit |
|:-----|:-----------|:--------|
| **BA/PO** | Write docs → hand-off | Define specs → validate |
| **Dev** | Implement from specs | Review code → architect |
| **QA** | Manual test scripts | Define scenarios → auto-execute |

---

## SpecKit Folder: `.specify/`

- 📁 **`templates/`**: spec, plan, tasks, constitution, checklist, agent templates
- 📁 **`scripts/bash/`**: check-prereqs, setup-plan, create-feature, update-context
- 📁 **`memory/`**: constitution.md (values, principles, constraints)
- 📁 **`integrations/`**: GitHub, CI/CD, IDE, LLM configs

---

## Step 1: SPECIFY (Input → spec.md)

- 📥 **Input**: Natural language feature description
- 🤖 **Agent**: `/speckit.specify` generates structured spec
- 📤 **Output**: User stories (P1, P2, P3), research.md
- ✅ **Gate**: Constitution compliance

---

## Step 2: PLAN (spec.md → plan.md)

- 📥 **Input**: Feature specification
- 🤖 **Agent**: `/speckit.plan` designs architecture
- 📤 **Output**: plan.md, data-model.md, contracts/, quickstart.md
- ✅ **Gate**: Feasibility & architecture review

---

## Step 3: TASKS (plan.md → tasks.md)

- 📥 **Input**: Implementation plan
- 🤖 **Agent**: `/speckit.tasks` generates ordered tasks
- 📤 **Output**: tasks.md (Setup → Foundation → User Stories)
- ✅ **Result**: [P] markers show parallel execution groups

---

## Step 4: IMPLEMENT (tasks.md → Code)

- 📥 **Input**: Task list + specs
- 🤖 **Agent**: `/speckit.implement` executes all tasks
- 📤 **Output**: Code + Tests + Docs + Infrastructure-as-code
- ✅ **Validation**: Each task verified vs spec

---

## Artifact Dependency Chain

```
User Input → SPECIFY → spec.md
→ PLAN → plan.md + data-model + contracts
→ TASKS → tasks.md
→ IMPLEMENT → Code + Tests + Docs
```

- 📍 Single Source of Truth
- 🔗 Traceability: Code → Spec
- 🎯 Tests from specs

---

## Real-World Example: Payment Processing

| Phase | Output | Time |
|:------|:-------|:-----|
| SPECIFY | 5 user stories | 1h |
| PLAN | Stripe architecture | 2h |
| TASKS | 23 ordered tasks | 1h |
| IMPLEMENT | Code + tests + config | 5h |
| **Total** | **Production-ready** | **2 days** |
| Traditional | Same | **2 weeks** |
| **Gain** | **70-75% faster** | ✅ |

---

## SpecKit Lifecycle & Creativity

```
SPECIFY → PLAN → TASKS → IMPLEMENT
  ↓        ↓       ↓        ↓
 Feedback loops + validation gates
```

- 🧠 **Contextual Solutions**: Interprets intent, generates creative implementations
- 🔮 **Pattern Recognition**: Detects spec conflicts, optimization opportunities
- 💡 **Learning**: Domain knowledge builds continuously

---

## Key Takeaways

- 🎯 **Spec-First Framework**: AI automates intent-to-code translation
- 📋 **Specification = King**: Output quality = spec clarity
- 🤖 **AI Orchestrator**: Agents handle mechanics, humans design strategy
- 🌟 **Multiplier Effect**: Expertise + structure + automation = velocity
- 📊 **Artifact-Driven**: Single truth, full traceability

---

# 🎓 Discussion

**SpecKit transforms development into specification and architecture discipline.**

*Building better, faster, with confidence.*
