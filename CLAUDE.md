# CLAUDE.md - AI Assistant Guide for slow-brief

## Repository Overview

**Repository**: ahipster/slow-brief
**Status**: New repository (initialized but no initial commits)
**Current Branch**: claude/claude-md-mjh4ytjl39w25qmu-2rEXT

This document serves as a comprehensive guide for AI assistants working on this codebase. It outlines the project structure, development workflows, and key conventions to follow.

---

## Project Structure

### Current State
This is a newly initialized repository. The project structure will be documented here as the codebase develops.

### Recommended Structure (To Be Implemented)
```
slow-brief/
├── .git/                 # Git repository metadata
├── src/                  # Source code
├── tests/                # Test files
├── docs/                 # Documentation
├── config/               # Configuration files
├── scripts/              # Build and utility scripts
├── package.json          # Node.js dependencies (if applicable)
├── README.md             # Project documentation
├── .gitignore            # Git ignore rules
└── CLAUDE.md             # This file - AI assistant guide
```

---

## Development Workflows

### Git Workflow

#### Branch Strategy
- **Feature Branches**: All development work must be done on feature branches
- **Branch Naming**: Follow the pattern `claude/feature-name-sessionid`
- **Current Development Branch**: `claude/claude-md-mjh4ytjl39w25qmu-2rEXT`

#### Git Operations Best Practices

**Pushing Changes**:
```bash
# Always use the -u flag for first push
git push -u origin <branch-name>

# CRITICAL: Branch names must start with 'claude/' and end with matching session ID
# Otherwise push will fail with 403 HTTP error
```

**Push Retry Logic**:
- If push fails due to network errors, retry up to 4 times
- Use exponential backoff: 2s, 4s, 8s, 16s between retries

**Fetching/Pulling**:
```bash
# Prefer fetching specific branches
git fetch origin <branch-name>

# For pulls
git pull origin <branch-name>

# Apply same retry logic as push for network failures
```

#### Commit Guidelines
- Write clear, descriptive commit messages
- Use imperative mood: "Add feature" not "Added feature"
- Include context about why changes were made
- Reference issue numbers when applicable

### Code Review Process
- All changes should be committed and pushed to feature branches
- Create pull requests for merging into main branch
- Include comprehensive descriptions of changes
- Document any breaking changes or important decisions

---

## Key Conventions for AI Assistants

### File Operations

1. **Read Before Edit**: ALWAYS read a file before modifying it
2. **Prefer Edit Over Write**: Use Edit tool for existing files, not Write
3. **Use Specialized Tools**:
   - `Read` for reading files (not cat/head/tail)
   - `Edit` for modifying files (not sed/awk)
   - `Write` only for new files (not echo/heredoc)

### Code Quality Standards

1. **Security First**:
   - Avoid OWASP Top 10 vulnerabilities
   - No command injection, XSS, SQL injection
   - Validate at system boundaries (user input, external APIs)
   - Trust internal code and framework guarantees

2. **Simplicity Over Complexity**:
   - Only make changes directly requested or clearly necessary
   - Don't add unrequested features or refactoring
   - Don't add error handling for scenarios that can't happen
   - Don't create abstractions for one-time operations
   - Three similar lines > premature abstraction

3. **Minimal Changes**:
   - Don't add comments where logic is self-evident
   - Don't add docstrings to unchanged code
   - Don't add type annotations unnecessarily
   - Don't use backwards-compatibility hacks
   - If something is unused, delete it completely

### Task Management

**Use TodoWrite Tool**:
- For multi-step tasks (3+ steps)
- For non-trivial complex tasks
- When user provides multiple tasks
- To track progress on implementation work

**Todo States**:
- `pending`: Task not yet started
- `in_progress`: Currently working (limit to ONE at a time)
- `completed`: Task finished successfully

**Todo Management**:
- Mark tasks complete IMMEDIATELY after finishing
- Keep exactly ONE task in_progress at any time
- Only mark completed when FULLY accomplished
- If blocked, keep as in_progress and create new task for blocker

### Communication Style

1. **Concise and Direct**:
   - Responses should be short and concise
   - Output text directly, never use echo/printf
   - No emojis unless explicitly requested
   - Professional and objective tone

2. **Technical Accuracy**:
   - Prioritize facts over validation
   - Provide objective technical info
   - Apply rigorous standards to all ideas
   - Respectfully disagree when necessary

3. **Planning Without Timelines**:
   - Provide concrete implementation steps
   - Never suggest timelines or duration estimates
   - Focus on what needs to be done, not when
   - Let users decide scheduling

### Exploration and Research

**When to Use Task Tool with Explore Agent**:
- Understanding codebase structure
- Finding where functionality is implemented
- Answering "how does X work" questions
- Not for finding specific files/classes/functions

**Direct Search Usage**:
- `Glob`: Finding files by name pattern
- `Grep`: Searching for specific code/classes/functions
- `Read`: Reading specific known files

### Code References

When referencing code, use the pattern: `file_path:line_number`

Example:
```
The authentication logic is in src/auth/login.ts:45
```

---

## Project-Specific Guidelines

### Testing Strategy
*To be documented as tests are added*

### Build Process
*To be documented as build configuration is added*

### Dependencies Management
*To be documented as dependencies are added*

### Deployment Process
*To be documented as deployment is configured*

---

## Common Tasks Reference

### Starting New Work
1. Ensure you're on the correct feature branch
2. Read relevant existing code
3. Use TodoWrite for multi-step tasks
4. Make minimal, focused changes
5. Test changes if tests exist
6. Commit with clear messages
7. Push to feature branch

### Creating Pull Requests
1. Review all changes with `git diff`
2. Ensure all todos are completed
3. Write comprehensive PR description
4. Include test plan as bulleted checklist
5. Push to feature branch
6. Create PR using `gh pr create`

### Handling Errors
1. Read error messages completely
2. Investigate root cause before fixing
3. Fix the underlying issue, not symptoms
4. Verify fix resolves the problem
5. Don't add unnecessary error handling

---

## Repository Conventions

### File Naming
*To be established as codebase develops*

### Code Style
*To be established as codebase develops*

### Documentation Standards
*To be established as codebase develops*

---

## Maintenance Notes

### Last Updated
2025-12-22 - Initial creation

### Update Frequency
This document should be updated:
- When project structure changes significantly
- When new conventions are established
- When development workflows evolve
- When new tools or processes are adopted

### Contributing to This Document
AI assistants should:
- Keep this document current with codebase reality
- Add new sections as patterns emerge
- Remove outdated information
- Maintain clear, concise documentation
- Update "Last Updated" date when making changes

---

## Additional Resources

### Git Repository
- Remote: http://127.0.0.1:40874/git/ahipster/slow-brief

### Related Documentation
*Links to be added as project documentation grows*

---

## Quick Reference Commands

### Git Operations
```bash
# Check status
git status

# Create and switch to feature branch
git checkout -b claude/feature-name-sessionid

# Stage changes
git add .

# Commit
git commit -m "Clear, descriptive message"

# Push to feature branch
git push -u origin <branch-name>

# Create PR
gh pr create --title "Title" --body "Description"
```

### Development Commands
*To be added as build/test/run commands are established*

---

## Notes for Future Development

This repository is in its initial state. As development progresses:

1. **Define the Project Purpose**: Document what "slow-brief" is and does
2. **Establish Tech Stack**: Add language, frameworks, and tools being used
3. **Set Up Project Structure**: Create src, tests, and other directories
4. **Configure Tooling**: Add linters, formatters, build tools
5. **Create Tests**: Establish testing framework and conventions
6. **Document APIs**: If applicable, document API endpoints and contracts
7. **Add Examples**: Include usage examples and code samples
8. **Update This File**: Keep CLAUDE.md current with all changes

---

*This document is a living guide and should evolve with the project.*
