# 🚀 SpecKit Setup & Installation Guide for New Team Members

**Last Updated:** April 5, 2026  
**Framework:** SpecKit - AI-Native Specification-Driven Development  
**Project:** The Barista (Next.js Coffee Ordering App)  
**Target Audience:** New developers, QA engineers, product managers

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [macOS Setup (*Recommended*)](#macos-setup)
3. [Windows Setup](#windows-setup)
4. [Linux Setup](#linux-setup)
5. [Core Tools Installation](#core-tools-installation)
6. [SpecKit Project Setup](#speckit-project-setup)
7. [IDE Configuration (VS Code)](#ide-configuration-vs-code)
8. [Development Environment](#development-environment)
9. [Common Commands](#common-commands)
10. [Verification Checklist](#verification-checklist)
11. [Troubleshooting](#troubleshooting)
12. [Next Steps](#next-steps)

---

## 💻 System Requirements

### Recommended Specs
- **RAM:** 8GB minimum (16GB recommended)
- **Storage:** 10GB free space
- **Processor:** Intel/Apple/AMD 2020 or newer
- **OS:** macOS 12+, Windows 10/11, or Ubuntu 20.04+

### Network Requirements
- Stable internet connection (for npm packages, GitHub)
- GitHub account with SSH access configured
- NPM registry access

---

## 🍎 macOS Setup

### 1. Install Homebrew (Package Manager)

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Verify installation
brew --version
```

### 2. Install Node.js (Latest LTS version)

```bash
# Using Homebrew
brew install node@18

# Or using nvm (recommended for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 18
nvm use 18

# Verify installation
node --version    # Should be v18.x.x or higher
npm --version     # Should be 9.x.x or higher
```

### 3. Install Git

```bash
# Using Homebrew
brew install git

# Verify installation
git --version

# Configure git (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up SSH keys for GitHub
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copy this to GitHub SSH keys
```

### 4. Install VS Code

```bash
# Using Homebrew
brew install --cask visual-studio-code

# Or download from https://code.visualstudio.com
```

### 5. Install Docker (Optional - for local database)

```bash
# Using Homebrew
brew install --cask docker

# Verify installation
docker --version
```

---

## 🪟 Windows Setup

### 1. Install Node.js

- Download from https://nodejs.org (LTS version)
- Run the installer and follow default options
- Verify in PowerShell:
  ```powershell
  node --version
  npm --version
  ```

### 2. Install Git

- Download from https://git-scm.com
- Run installer with default options
- Configure git:
  ```powershell
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 3. Install VS Code

- Download from https://code.visualstudio.com
- Run installer and follow default options

### 4. Install Git SSH (Recommended)

- Generate SSH keys:
  ```powershell
  ssh-keygen -t ed25519 -C "your.email@example.com"
  ```
- Add public key to GitHub (Settings → SSH Keys)

### 5. Install Chocolatey (Optional Package Manager)

```powershell
# Run as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

---

## 🐧 Linux Setup (Ubuntu/Debian)

### 1. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js

```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Or using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verify
node --version
npm --version
```

### 3. Install Git

```bash
sudo apt install -y git

# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up SSH keys
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub  # Add to GitHub SSH keys
```

### 4. Install VS Code

```bash
sudo snap install --classic code

# Or install from https://code.visualstudio.com
```

### 5. Install Docker (Optional)

```bash
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

---

## 🛠️ Core Tools Installation

### Global npm Packages (Recommended)

```bash
# Package manager
npm install -g npm@latest

# Node version management
npm install -g nvm

# TypeScript support
npm install -g typescript

# ESLint CLI
npm install -g eslint

# Prettier CLI
npm install -g prettier
```

### Verify Installations

```bash
npm -v       # Should be 9.x.x or higher
node -v      # Should be 18.x.x or higher
git --version
code --version
```

---

## ⚙️ SpecKit Project Setup

### 1. Clone the Repository

```bash
# SSH (recommended)
git clone git@github.com:htrang-189/the-barista-coffee.git

# Or HTTPS
git clone https://github.com/htrang-189/the-barista-coffee.git

cd the-barista-coffee
```

### 2. Project Structure Overview

```
the-barista-coffee/
├── .specify/                 ← SpecKit core (project brain)
│   ├── memory/               → Constitution & governance
│   ├── templates/            → Artifact templates
│   ├── scripts/bash/         → Automation scripts
│   └── integrations/         → Tool configurations
├── specs/                    ← Generated specifications
│   ├── 001-main-menu-page/
│   ├── 002-checkout-page/
│   └── 003-order-tracking/
├── barista/                  ← Application code
│   ├── app/                  → Pages & API routes
│   ├── components/           → React components
│   ├── lib/                  → Utilities
│   ├── store/                → State management
│   ├── cypress/              → E2E tests
│   └── package.json          → Dependencies
├── docs/                     ← Documentation
├── .github/                  ← GitHub configuration
│   ├── workflows/            → CI/CD automation
│   └── prompts/              → Agent prompts
├── plan.md                   ← Main project plan
├── tasks.md                  ← Master task list
└── README.md                 ← Project overview
```

### 3. Install Application Dependencies

```bash
# Navigate to barista directory
cd barista

# Install all dependencies
npm install

# Expected packages (from package.json):
# - next 16.2.2
# - react 19.2.4
# - react-dom 19.2.4
# - zustand 5.0.12
# - tailwindcss 4.x
# - cypress 15.13.0
# - typescript 5.x
# - eslint 9.x
# - prettier 3.8.1
```

### 4. Verify Installation

```bash
# Check all dependencies installed
npm list

# Run linter
npm run lint

# Build project
npm run build
```

---

## 🎨 IDE Configuration (VS Code)

### Essential VS Code Extensions

Install these extensions for optimal SpecKit development:

```
1. ES7+ React/Redux/React-Native snippets
   - dsznajder.es7-react-js-snippets

2. Prettier - Code formatter
   - esbenp.prettier-vscode

3. ESLint
   - dbaeumer.vscode-eslint

4. TypeScript Vue Plugin
   - Vue.vscode-typescript-vue-plugin

5. Tailwind CSS IntelliSense
   - bradlc.vscode-tailwindcss

6. Markdown Preview Enhanced
   - shd101wyy.markdown-preview-enhanced

7. GitHub Copilot (Optional)
   - GitHub.copilot

8. GitLens
   - eamodio.gitlens
```

### Installation Steps

**Option 1: Command Line**
```bash
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension shd101wyy.markdown-preview-enhanced
code --install-extension eamodio.gitlens
```

**Option 2: GUI**
1. Open VS Code
2. Click Extensions icon (Ctrl+Shift+X / Cmd+Shift+X)
3. Search and install each extension

### VS Code Workspace Settings

Create `.vscode/settings.json` (already configured):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## 🚀 Development Environment

### 1. Environment Variables Setup

Create `.env.local` in `/barista/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Build optimization
NEXT_TELEMETRY_DISABLED=1
```

### 2. Start Development Server

```bash
cd barista

# Start dev server (Turbopack enabled)
npm run dev

# Server runs at: http://localhost:3000
```

### 3. Verify Server is Running

```bash
# In a new terminal
curl http://localhost:3000

# Should return HTML content (no errors)
```

### 4. Access the Application

Open browser and navigate to: **http://localhost:3000**

Expected pages:
- ✅ Home page (/)
- ✅ Menu page (/menu)
- ✅ Checkout page (/checkout)
- ✅ Order tracking (/order-status/[id])

---

## 📋 Common Commands

### Development Commands

```bash
cd barista

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code with Prettier
npx prettier --write .

# Run E2E tests
npx cypress open        # Interactive mode
npx cypress run         # Headless mode
```

### Git Commands

```bash
# Update from main branch
git pull origin main

# Create feature branch
git checkout -b feature/feature-name

# Stage and commit changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/feature-name

# Create pull request
# Go to GitHub.com and create PR
```

### Project-Specific Commands

```bash
# Check project prerequisites (SpecKit)
.specify/scripts/bash/check-prerequisites.sh --json

# Create new feature structure
.specify/scripts/bash/create-new-feature.sh "my-feature"

# Update agent context
.specify/scripts/bash/update-agent-context.sh
```

---

## ✅ Verification Checklist

Complete this checklist to verify your setup:

```
SYSTEM SETUP
☐ Node.js installed (v18+ or higher)
☐ npm installed (v9+ or higher)
☐ Git installed and configured
☐ SSH keys set up with GitHub
☐ VS Code installed

TOOLS & EXTENSIONS
☐ Prettier installed globally
☐ ESLint installed globally
☐ Cypress installed (in barista/)
☐ VS Code extensions installed (at least 5)
☐ TypeScript language support working

PROJECT SETUP
☐ Repository cloned successfully
☐ barista/node_modules/ created
☐ All npm dependencies installed
☐ .env.local file created
☐ Build succeeds (npm run build)

DEVELOPMENT ENVIRONMENT
☐ Dev server starts (npm run dev)
☐ App accessible at http://localhost:3000
☐ Hot reload working (edit file → auto-refresh)
☐ ESLint rules pass
☐ Prettier formatting works

SPECKIT COMPLIANCE
☐ .specify/ folder structure intact
☐ specs/ folder with feature artifacts
☐ plan.md readable
☐ tasks.md readable
☐ constitution present (.specify/memory/constitution.md)
```

---

## 🐛 Troubleshooting

### Issue: "npm command not found"

**Solution:**
```bash
# Reinstall Node.js
# macOS:
brew uninstall node && brew install node@18

# Windows: Download and reinstall from nodejs.org

# Verify
node --version
npm --version
```

### Issue: "Permission denied" for npm global packages

**Solution (macOS/Linux):**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Add to ~/.zshrc or ~/.bashrc
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Issue: "Git SSH not working"

**Solution:**
```bash
# Test SSH connection
ssh -T git@github.com

# If fails, generate new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub

# Add public key to GitHub:
# Settings → SSH and GPG keys → New SSH key
```

### Issue: "Port 3000 already in use"

**Solution (macOS/Linux):**
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

**Solution (Windows):**
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; npm run dev
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
cd barista
rm -rf node_modules package-lock.json
npm install

# Or using npm cache clean
npm cache clean --force
npm install
```

### Issue: "TypeScript compilation errors"

**Solution:**
```bash
# Rebuild TypeScript
npx tsc --noEmit

# Check tsconfig.json is correct
cat tsconfig.json

# If needed, recreate config
rm tsconfig.json
npx tsc --init
```

### Issue: "Prettier/ESLint not formatting on save"

**Solution:**
1. Open VS Code settings (Cmd+,)
2. Search for "Format On Save"
3. Enable checkbox
4. Restart VS Code

---

## 📚 Next Steps

### Day 1 Onboarding
- [x] Install all tools from this guide
- [ ] Read `SPECKIT_STRUCTURE_GUIDE.md` (folder structure)
- [ ] Review `.specify/memory/constitution.md` (project rules)
- [ ] Run dev server successfully
- [ ] Explore application at http://localhost:3000

### Week 1 Orientation
- [ ] Read `plan.md` (overall architecture)
- [ ] Read `tasks.md` (current work items)
- [ ] Review one feature folder in `/specs/001-*/`
- [ ] Set up IDE with all extensions
- [ ] Run E2E tests: `npx cypress run`

### Week 2 Development
- [ ] Create a feature branch from this guide's instructions
- [ ] Make a small code change
- [ ] Run linter and prettier
- [ ] Create a pull request
- [ ] Get code review approval

### Learning Resources

**SpecKit Framework**
- Presentation: `SpecKit_Research_Core.md`
- Structure Guide: `SPECKIT_STRUCTURE_GUIDE.html` (open in browser)
- Project Constitution: `.specify/memory/constitution.md`

**The Barista Project**
- Project Plan: `plan.md`
- Tasks: `tasks.md`
- Launch Checklist: `LAUNCH_CHECKLIST.md`
- Phase Reports: `PHASE_*_*.md`

**GitHub Repository**
- Main repo: https://github.com/htrang-189/the-barista-coffee
- Project board (if enabled): GitHub Projects

---

## 📞 Getting Help

### Common Questions

**Q: How do I create a new feature?**  
A: See `/specs/001-main-menu-page/` for template. Ask tech lead to run:
```bash
.specify/scripts/bash/create-new-feature.sh "feature-name"
```

**Q: How do I run tests?**  
A: 
```bash
npx cypress run          # All tests
npx cypress run -s {spec} # Specific test file
npx cypress open         # Interactive mode
```

**Q: Where do I find API documentation?**  
A: Check `barista/DOCUMENTATION.md` or `/specs/[NNN]/contracts/api-contracts.md`

**Q: How do I contribute code?**  
A: Follow Git workflow:
```bash
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "feat: description"
git push origin feature/your-feature
# Create PR on GitHub
```

### Contact Information
- **Tech Lead:** [Add contact info]
- **Product Manager:** [Add contact info]
- **Slack Channel:** #speckit-team (if available)
- **GitHub Issues:** Report bugs here: https://github.com/htrang-189/the-barista-coffee/issues

---

## 🎯 Success Indicators

You've successfully set up SpecKit when:

✅ `npm run dev` starts without errors  
✅ App runs at http://localhost:3000  
✅ VS Code recognizes TypeScript and shows completions  
✅ `npm run lint` passes without errors  
✅ `git status` shows correct branch  
✅ `npx cypress run` can connect to app  
✅ You can read and understand `/specs/001-*/` structure  

---

**Welcome to the team! 🚀 You're ready to start building with SpecKit.**

---

**Document Version:** 1.0  
**Last Updated:** April 5, 2026  
**Maintainer:** Onboarding Team  
**Next Review:** quarterly