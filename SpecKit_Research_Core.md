---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: #f5f3f0
color: #2c2c2c
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  
  section {
    background: linear-gradient(135deg, #f5f3f0 0%, #ede7e0 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 50px 60px;
  }
  
  h1 {
    color: #8b6f47;
    font-size: 3.2em;
    font-weight: 700;
    margin: 0 0 20px 0;
  }
  
  h2 {
    color: #8b6f47;
    font-size: 2.4em;
    font-weight: 700;
    border-bottom: 3px solid #d4a574;
    padding-bottom: 15px;
    margin-bottom: 30px;
  }
  
  h3 {
    color: #6b5637;
    font-size: 1.4em;
    font-weight: 600;
  }
  
  li {
    font-size: 1.15em;
    line-height: 1.8;
    margin: 12px 0;
  }
  
  table {
    font-size: 1em;
    margin: 20px 0;
  }
  
  code {
    background: #f0ebe4;
    padding: 2px 6px;
    border-radius: 3px;
    color: #c85a1e;
  }
  
  strong {
    color: #8b6f47;
    font-weight: 600;
  }
---

# 🎯 SpecKit Research Core
## Deep Dive into AI-Native Spec-Driven Development

**Presenter**: Trang  
**Date**: April 5, 2026

---

## 🌟 Overview: SpecKit Framework Definition

### **SpecKit = AI-Native Specification-Driven Development**

- 🧠 **Context-Aware Execution**: AI agents understand project constitution, domain constraints, and architectural patterns
  - Constitution acts as the "project conscience"
  - Every decision bounded by project principles
  - No ad-hoc workarounds or inconsistent implementations

- 🤖 **Autonomous Execution**: Agents orchestrate complete lifecycle (Spec → Plan → Tasks → Code)
  - Self-validating artifact generation
  - Automatic feedback loops on conflicts
  - Human reviews at critical gates only

- 📊 **Spec-as-Code**: Specifications are structured data, not documents
  - Machine-readable source of truth
  - Version-controlled alongside implementation
  - Executable acceptance criteria

---

## 🏗️ Core Architecture: Four Specialized Agents

| **Agent** | **Role** | **Input** | **Output** |
|:----------|:---------|:---------|:----------|
| 🎯 **SPECIFY** | Requirement Clarification | User intent (natural language) | `spec.md` + `research.md` |
| 📐 **PLAN** | Architectural Design | Validated spec | `plan.md` + `contracts/` + `data-model.md` |
| ✅ **TASKS** | Work Orchestration | Approved plan | `tasks.md` (ordered + dependency-aware) |
| 🚀 **IMPLEMENT** | Execution & Delivery | Task list + specs | Code + Tests + Docs + Infrastructure |

### **Agent Communication**
- Each agent validates predecessor outputs against **constitution**
- Agents communicate via **artifact dependency chain**
- **Zero manual glue code**: Specifications flow directly to implementation

---

## 🔄 The Critical Loop: SPECIFY ↔ CLARIFY (VERY IMPORTANT!)

### **The "No-Clarification" Gate**: 100% Clarity Requirement

```
BA/PO provides feature description
         ↓
    /speckit.specify
         ↓
   spec.md generated
         ↓
   ⚠️  CLARIFICATION REQUIRED?
     (Agent flags ambiguities)
         ↓
   YES → BA/PO clarifies → LOOP BACK ↻
         ↓
    NO → 100% CLARITY ACHIEVED ✅
         ↓
   ONLY THEN: Permission to PLAN
```

### **Why This Gate Exists**
- 📍 **Ambiguity costs**: 1 unclear spec = 3+ rework cycles
- 🎯 **BA/PO owns clarity**: Developers execute, don't interpret
- 🔐 **Constitution validation**: Every spec must align with project principles
- ✨ **Prevents cascading failures**: Bad spec → bad plan → bad code

---

## 📊 SpecKit Lifecycle: Constitution → Spec → Plan → Implementation

```
═════════════════════════════════════════════════════════════════

🏛️  CONSTITUTION (Project "Brain")
    ├─ Values & principles
    ├─ Technical constraints
    ├─ Quality standards
    └─ Governance rules
         ↓
    ⚖️  ALL DECISIONS MUST ALIGN

║

📋 SPECIFICATION (Single Source of Truth)
    ├─ User stories (P1, P2, P3)
    ├─ Acceptance criteria
    ├─ Research decisions
    └─ Traceability tags
         ↓
    🔗 EVERYTHING REFERENCES SPEC

║

🎨 PLAN (Architecture Document)
    ├─ Tech stack rationale
    ├─ Entity relationships
    ├─ API contracts
    └─ Deployment topology
         ↓
    🏗️  STRUCTURE FROM SPEC

║

⚙️  IMPLEMENTATION (Artifact Generation)
    ├─ Source code
    ├─ Tests (E2E, integration, unit)
    ├─ Documentation
    └─ Infrastructure-as-code
         ↓
    ✅ VALIDATED AGAINST SPEC

═════════════════════════════════════════════════════════════════
```

### **Key Principle**: Spec Traceability
- Every line of code → links to spec requirement
- Every test → validates acceptance criteria
- Every design decision → justified in plan (references spec)

---

## 📁 Folder Structure: `.specify/` as Project "Brain"

### **The Project Brain Architecture**

```
.specify/                          ← PROJECT BRAIN LOCATION
│
├─── memory/
│    └── constitution.md           ← Values, principles, constraints (IMMUTABLE)
│
├─── templates/                    ← Standardized formats
│    ├── spec-template.md          → User story structure
│    ├── plan-template.md          → Architecture format
│    ├── tasks-template.md         → Task orchestration schema
│    ├── constitution-template.md  → Governance template
│    └── checklist-template.md     → Quality gates
│
├─── scripts/bash/                 ← Automation engines
│    ├── check-prerequisites.sh    → Pre-flight validation
│    ├── setup-plan.sh             → Initialize planning phase
│    ├── create-new-feature.sh     → Feature scaffold generator
│    └── update-agent-context.sh   → Context synchronization
│
└─── integrations/                 ← External tool connectors
     ├── GitHub config             → PR templates, branch rules
     ├── CI/CD config              → Build pipeline hooks
     └── LLM provider config       → Agent model configuration
```

### **Why `.specify/` is the "Brain"**
- 🧠 **Central Knowledge**: Constitution enforces project consistency
- 🔄 **Feedback Loops**: Scripts validate artifacts against principles
- 📚 **Learning System**: Patterns stored for future decision-making
- 🛡️ **Governance**: Templates ensure quality standards applied automatically

---

## 👥 Roles Transformation: From Implementers to Architects

### **The Evolution of Development Roles**

| **Role** | **Traditional Model** | **SpecKit Model** | **Mindset Shift** |
|:---------|:-------------------|:-----------------|:-----------------|
| **BA/PO** | Write docs → Hand off to dev | Define specs → Clarify until 100% clear | *"What do we build?"* → *"Is our intent clear?"* |
| **Developer** | Implement from specs → Write tests | Review agent code → Architect patterns | *"How do I code this?"* → *"Is this design sound?"* |
| **QA/Test** | Manual test scripts → Regression | Define scenarios → Review test coverage | *"Does it work?"* → *"Is coverage complete?"* |

### **New Unified Role: "Specification Architect"**
- All roles become co-owners of specification quality
- Specifications are artifacts to be architected, not just written
- Code reviews shift from syntax → design alignment with spec
- Testing becomes specification validation, not post-hoc verification

---

## 🎯 Key Takeaways: Traceability, Velocity, Automation

### **1. 🔗 Traceability: End-to-End Accountability**
```
User Requirement
    ↓
Spec Acceptance Criteria
    ↓
Test Case
    ↓
Source Code
    ↓
Deployment Config
```
- Every artifact linked to source requirement
- Risk: easily identify impact of requirements changes
- Compliance: traceability built-in, not retrofitted

### **2. ⚡ Velocity: 70-75% Faster Development**
| **Metric** | **Traditional** | **SpecKit** | **Gain** |
|:-----------|:---------------|:-----------|:---------|
| Time to code | 2-3 weeks | 3-5 days | **5-6x faster** |
| Rework cycles | 3-5 cycles | 0-1 cycle | **75% less** |
| Team alignment | ~40% overhead | ~5% overhead | **8x better** |

### **3. 🤖 Automation of Mechanics, Humans on Strategy**
- **Machines handle**: Code generation, test execution, documentation, deployment
- **Humans handle**: Architecture decisions, specification clarity, design trade-offs
- **Result**: Development teams evolve from "coders" → "architects"

---

## 🚀 Closing: The Future is Specification-Driven

> *"In SpecKit, we don't write code.* ***We architect specifications.****"*

**The competency shift**: 
- ❌ *"Good at coding"* → ✅ *"Good at specifying"*
- ❌ *"Fast implementation"* → ✅ *"Clear architecture"*
- ❌ *"Testing rigor"* → ✅ *"Specification rigor"*

**Next wave of development**:
- 🌐 Teams that master specification discipline will dominate
- 🤖 AI handles mechanics; humans focus on creativity
- 🏆 Winner: Organization with best specification culture

---
