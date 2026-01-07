# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "nikki" - a diary application that helps users organize their thoughts through LLM conversations. Users interact with an AI to reflect on their day and generate diary entries from the conversation.

**Key Concept**: Lower the psychological barrier to diary writing by enabling natural conversation that transforms into structured journal entries.

## Project Status

This is currently in the **planning/requirements phase**. The codebase contains only documentation at this time:

- `/doc/requirement.md` - Comprehensive requirements document in Japanese

## Architecture (Planned)

Based on the requirements document, this will be:

### Technology Stack

- **Frontend**: Next.js App Router (Web application)
- **Storage**: IndexedDB for prototype (no server-side storage initially)
- **LLM Integration**: User's own API key (BYO API Key) with OpenAI-compatible APIs
- **Audio Input**: External tools like Superwhisper (no built-in STT)

### Core Components (To Be Built)

- **LLM Chat Interface**: Real-time conversation with AI
- **Settings Management**: API key, base URL, model configuration
- **Diary Generation**: Convert conversations into diary entries
- **Local Storage**: IndexedDB for persistence without server dependency
- **Daily Entry System**: One diary entry per day

### Data Models (Planned)

```
LLM Settings:
- baseUrl, model, apiKey

Diary Entry:
- date (YYYY-MM-DD), body, updatedAt

Conversation Log:
- role (user/assistant), content, createdAt
```

## Development Approach

### Prototype Scope (MVP0)

The initial prototype focuses on core functionality:

1. LLM configuration and local storage
2. Daily diary creation (one per day)
3. Chat interface with LLM
4. Conversation → diary text generation
5. Local persistence with IndexedDB
6. Support for external voice input tools

### Future Extensions

- Server-side storage and sync
- User authentication
- Multi-device support
- Weekly/monthly reflection features
- Push notifications for reminders

## Privacy & Security

- **No server storage** in prototype phase
- User's own LLM API keys (not stored on servers)
- All data remains local (IndexedDB)
- Privacy-first approach with future sync considerations

## Key Principles

- Minimize friction in diary writing
- Support conversational thought organization
- Local-first data approach
- Prepare architecture for future server sync
- Japanese language support (requirements in Japanese)

## 🚨 CRITICAL: Development Rules Compliance

**ALL code development MUST strictly follow the established rules:**

### Technical Rules (MANDATORY)

1. **Test Strategy**: `/doc/rule/test_strategy.md`
   - Unit Tests: 80%+ coverage, 1 function = 1 test file
   - Integration Tests: Module interactions, real IndexedDB
   - E2E Tests: User flows only, mocked LLM API
   - TDD approach: Write tests BEFORE implementation

2. **Coding Standards**: `/doc/rule/coding_standards.md`
   - TypeScript strict mode required
   - No `any` type usage (use `unknown`)
   - Explicit return types for public functions
   - PascalCase components, camelCase functions/variables

3. **Architecture Rules**: `/doc/rule/architecture.md`
   - Layer separation: Presentation → Application → Business → Data
   - Single responsibility principle for components/hooks
   - Repository pattern for data access
   - Container/Presentation component pattern

### Pre-Development Checklist

Before writing ANY code:

- [ ] Read the relevant rule files
- [ ] Understand the layer responsibilities
- [ ] Plan test cases (TDD)
- [ ] Ensure proper TypeScript typing
- [ ] Follow naming conventions

### Code Review Requirements

Every implementation MUST:

- [ ] Pass all ESLint/TypeScript checks
- [ ] Have corresponding tests (Unit + Integration)
- [ ] Follow architecture layer separation
- [ ] Use proper error handling patterns
- [ ] Include proper type definitions

**Rule Violations = Code Rejection**

## 📋 CRITICAL: Development Process Compliance

**ALL development MUST strictly follow the established process:**

### Development Process (MANDATORY)

4. **Development Process**: `/doc/rule/development_process.md`
   - 1 Task = 1 Branch = 1 Pull Request (strict)
   - Immediate documentation updates when requirements change
   - TDD implementation: Test → Code → Refactor
   - Multi-stage quality gates: Commit → PR → Merge

### Workflow Requirements

**Before ANY code changes:**

- [ ] Create feature branch: `feature/task-{number}-{description}`
- [ ] Read task file: `doc/task/{task}.md`
- [ ] Verify requirement alignment: `doc/requirement.md`

**During development:**

- [ ] Write tests BEFORE implementation (TDD)
- [ ] Follow technical rules strictly
- [ ] Update docs IMMEDIATELY when requirements change
- [ ] Commit regularly with meaningful messages

**When requirements change (CRITICAL):**

1. **STOP current work immediately**
2. **Update requirement.md FIRST**
3. **Update relevant task files**
4. **Update related documentation**
5. **Resume development with updated requirements**

### Pull Request Requirements

**Every PR MUST include:**

- [ ] All task completion criteria met
- [ ] All tests passing (unit + integration + e2e)
- [ ] Documentation updated if requirements changed
- [ ] Technical rule compliance verified
- [ ] Working feature demonstration

**Process Violations = Development Rejection**

## Git Commit Guidelines

### Commit Message Format

- Use clear, descriptive commit messages
- **DO NOT include** "🤖 Generated with [Claude Code]" or similar tool attribution
- Focus on what was changed and why
- Use conventional commit format when applicable: `feat:`, `fix:`, `docs:`, etc.

### Example Good Commit Messages

```
feat: implement LLM settings storage with IndexedDB
fix: resolve TypeScript errors in chat interface
docs: update requirements for diary generation
test: add unit tests for conversation repository
```
