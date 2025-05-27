# Project Context for GitHub Copilot

## Project Overview
This project is [brief description of your project].

## Architecture
- Frontend: [React]
- Backend: [.net]
- Database: [SQL]

## Code Guidelines
- [Naming conventions]
- [Style guidelines]
- [Project-specific patterns]

## Common Patterns
- [controller-service-repository]
- [global-error-handling]
- [jwt-auth]

## Dependencies
- [List key libraries and frameworks]
- [Explain how they're typically used]

## Testing Strategy
- [Unit testing approach]
- [Integration testing approach]
- [Test naming conventions]
```

## Where to Place It

1. Create a `.github` directory in the root of your project (if it doesn't exist)
2. Inside that, create a `copilot` directory
3. Save the template as `template.md` in the `.github/copilot` directory

## How to Use Copilot Context Files

1. **Customize the template**: Fill in the sections with information specific to your project
   
2. **Keep it updated**: As your project evolves, update the context file

3. **Be specific**: The more specific information you provide, the better Copilot will understand your project

4. **Multiple context files**: You can have multiple `.md` files in the `.github/copilot` directory for different aspects of your project

5. **Local contexts**: You can also create context files in subdirectories for more specific guidance in those areas

GitHub Copilot will automatically use this context when providing suggestions in your project, making its code completions more relevant to your specific codebase and practices.// filepath: .github/copilot/template.md
# Project Context for GitHub Copilot

## Project Overview
This project is [brief description of your project].

## Architecture
- Frontend: [technologies used]
- Backend: [technologies used]
- Database: [database systems]

## Code Guidelines
- [Naming conventions]
- [Style guidelines]
- [Project-specific patterns]

## Common Patterns
- [Describe repeated patterns used across the codebase]
- [Standard approaches for error handling]
- [Authentication flow]

## Dependencies
- [List key libraries and frameworks]
- [Explain how they're typically used]

## Testing Strategy
- [Unit testing approach]
- [Integration testing approach]
- [Test naming conventions]