# Contributing to TypeScript Clean Architecture Template

Thank you for considering contributing to this project! This guide will help you understand our architecture principles and contribution process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Architecture Principles](#architecture-principles)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions professional

## Architecture Principles

This template follows **Clean Architecture** and **Vertical Slice Architecture**. When contributing, please adhere to these principles:

### 1. Dependency Rule

**Dependencies must point inward:**

```
View → Services → Use Cases → Domain ← Data Access → Infrastructure
```

- **Domain** has NO dependencies (except `lib/`)
- **Use Cases** depend only on Domain
- **Services** depend on Use Cases (orchestration/facade layer)
- **Data Access** implements Domain interfaces
- **View MUST call Application Services ONLY** - View MUST NOT call Use Cases directly
- **Lib** = pure functions only, no I/O

### 2. Module Independence

**Modules must be loosely coupled:**

- ✅ **DO:** Communicate via direct Application Service calls (default) or Domain Events via EventBus (optional)
- ✅ **DO:** Pass DTOs between modules
- ❌ **DON'T:** Import domain entities from other modules (see exception below)
- ❌ **DON'T:** Share repositories between modules

**Exception: Cross-module domain dependencies**

If one domain genuinely depends on another from a business perspective. The **default** answer is to reference by primitive ID or use Public API. Direct domain imports are the exception.

> **Shared Kernel is NOT for `CandidateId`.** It is a domain-specific concept owned by the `candidates` module. Shared Kernel is for generic technical types only (`Money`, `Email`, `Result`).

**Option 1 (Default): Reference by primitive ID**
```typescript
// application/applications/domain/entities/application.entity.ts
export type ApplicationStruct = {
  candidateId: string;  // ✅ Primitive ID — no cross-module import
  vacancyId: string;
  status: string;
};

export class Application extends Entity<UUID, ApplicationStruct> {}
```

**Option 2: Direct cross-module import (use sparingly)**
```typescript
// application/applications/domain/entities/application.entity.ts
import { CandidateId } from '../../candidates/domain/value-objects/candidate-id.vo';

export type ApplicationStruct = {
  candidateId: CandidateId;  // ⚠️ Explicit dependency — justified by tight coupling
  vacancyId: VacancyId;
  status: string;
};

export class Application extends Entity<UUID, ApplicationStruct> {}
```

**When to use each:**
- **Primitive ID**: Default — zero coupling, works across any boundary
- **Direct import**: Only 2 modules, tightly coupled business domain, type safety is worth the coupling
- **Shared Kernel**: NEVER for domain-specific IDs. Only `Money`, `Email`, `DateRange`, `Result`, `Pagination`
- **Application Service call**: Default for everything else — call the target module's Application Service directly

**Special case: Aggregate Roots**

Aggregates often compose entities from multiple domains. This is **allowed** when the aggregate is the transactional boundary:

```typescript
// application/applications/domain/entities/application.entity.ts
import { Candidate } from '../../../candidates/domain/entities/candidate.entity';
import { Vacancy } from '../../../vacancies/domain/entities/vacancy.entity';
import { WorkflowStage } from '../../../workflows/domain/entities/workflow-stage.entity';

export type ApplicationStruct = {
  candidate: Candidate;
  vacancy: Vacancy;
  stage: WorkflowStage;
};

/**
 * Aggregate Root: Application (candidate + vacancy + workflow stage)
 * Composes entities from other domains for the business process
 */
export class Application extends Entity<UUID, ApplicationStruct> {
  // Business methods work with the composition
  moveToNextStage(): void {
    // ...
  }
}
```

**When this is correct:**
- ✅ Aggregate represents business process (Application = hiring workflow)
- ✅ Aggregate is transactional boundary (all changes are atomic)
- ✅ Aggregate contains business rules for entity interactions

**When this is wrong:**
- ❌ Just "convenient" to keep together
- ❌ No business logic for interactions
- ❌ Can split into independent transactions

### 3. Lib Layer Rules

**Lib must contain ONLY pure functions:**

- ✅ **ALLOWED:** Pure utilities, formatters, validators, type guards
- ❌ **FORBIDDEN:** I/O operations, environment variables, HTTP clients, database connections, business logic

Before adding to `lib/`, ask:
1. Does this perform I/O? → **NOT lib**
2. Does this depend on runtime config? → **NOT lib**
3. Contains business logic? → **NOT lib**
4. Can be tested without mocks? → **YES** = lib candidate

## Project Structure

```
src/
├── application/          # Bounded contexts (vertical slices)
│   ├── {module}/
│   │   ├── domain/       # Pure business logic
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── interfaces/
│   │   │   ├── services/
│   │   │   ├── events/
│   │   │   └── errors/
│   │   ├── use-cases/    # Application workflows
│   │   ├── services/     # Application services (facades)
│   │   └── data-access/  # Persistence adapters
│   │       ├── repositories/
│   │       ├── dto/      # DTOs for persistence layer ONLY
│   │       └── mappers/  # Entity ↔ DTO mappers
│   └── shared-kernel/    # Technical types only
├── infrastructure/       # External dependencies
│   ├── database/
│   ├── cache/
│   ├── http/
│   └── config/
├── view/                 # Delivery layer
│   ├── http/             # Backend: controllers, routes
│   │   ├── controllers/
│   │   ├── dto/          # Request/Response DTOs
│   │   └── mappers/      # Entity ↔ HTTP DTO mappers
│   └── pages/            # Frontend: React/Vue components
│       ├── dto/          # API DTOs
│       └── mappers/      # Entity ↔ API DTO mappers
└── lib/                  # Pure utilities ONLY
```

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arkhipovdenis/typescript-clean-architecture.git
   cd typescript-clean-architecture
   ```

2. **Install dependencies:**
   ```bash
   pnpm install  # or npm install / yarn install
   ```

3. **Run type checking:**
   ```bash
   pnpm run typecheck  # or npm run typecheck
   ```

4. **Format code:**
   ```bash
   pnpm run format  # or npm run format
   ```

## Making Changes

### Adding a New Module

1. **Create module structure:**
   ```bash
   mkdir -p src/application/{module-name}/{domain,use-cases,services,data-access}
   mkdir -p src/application/{module-name}/domain/{entities,value-objects,interfaces,services,events,errors}
   mkdir -p src/application/{module-name}/data-access/{repositories,dto,mappers}
   ```

2. **Define domain layer:**
   - Create entities with business logic
   - Create value objects for domain concepts
   - Define repository interfaces (ports)
   - Create domain events
   - Create domain-specific errors

3. **Implement use cases:**
   - One use case per user action
   - Keep them thin - delegate to domain
   - **Return entities ONLY** (not DTOs)

4. **Implement data access:**
   - Implement repository interfaces in `data-access/repositories/`
   - Create DTOs for persistence in `data-access/dto/`
   - Create mappers in `data-access/mappers/` for Entity ↔ DTO conversion
   - Focus only on persistence

5. **Implement view layer (if needed):**
   - Create DTOs in `view/{http,graphql}/dto/`
   - Create mappers in `view/{http,graphql}/mappers/`
   - Map entities to DTOs at the boundary

6. **Add tests:**
   - Domain: Pure unit tests, no mocks
   - Use Cases: Unit tests with mocked repositories
   - Data Access: Integration tests with real/test database

### Adding to Lib

**Before adding any utility to `lib/`, verify:**

```typescript
// ✅ GOOD - Pure function
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ❌ BAD - Has I/O
export function getConfig() {
  return process.env.API_URL;  // ❌ Runtime dependency
}

// ❌ BAD - Business logic
export function validateCandidate(candidate: Candidate) {  // ❌ Domain concept
  // ...
}
```

**If it has I/O or business logic, it does NOT belong in `lib/`.**

### Module Communication

**Default: Application Service calls for cross-module reactions:**

```typescript
// ✅ ApplicationService orchestrates — explicit, traceable
class ApplicationService {
  constructor(
    private submitApplicationUseCase: SubmitApplicationUseCase,
    private interviewService: InterviewService  // cross-module dependency
  ) {}

  async submitApplication(dto: SubmitApplicationDto): Promise<Application> {
    const application = await this.submitApplicationUseCase.execute(dto);
    await this.interviewService.scheduleInterview({ applicationId: application.id.value });
    return application;  // ✅ Returns Entity — view layer maps to DTO
  }
}
```

**Optional: Domain Events via EventBus** — when you need open/closed extensibility or eventual consistency. See README for details.

**Use Application Service call for sync communication:**

```typescript
// Module B: Application Service is the public contract
// application/auth/services/auth.service.ts
export class AuthService {
  async checkPermission(userId: string, action: string): Promise<boolean> { ... }
}

// Module A: Application Service calls Module B's Service
// application/orders/services/order.service.ts
constructor(private authService: AuthService) {}  // ✅ Service-to-Service

const hasPermission = await this.authService.checkPermission(userId, 'create:order');
// Cross-module guard resolved in Service — use case stays clean
```

## Pull Request Process

### Before Submitting

1. **Ensure your changes follow architecture principles**
2. **Run type checking:** `pnpm run typecheck`
3. **Format code:** `pnpm run format`
4. **Add tests** for new functionality
5. **Update documentation** if needed

### PR Guidelines

1. **Title:** Use clear, descriptive titles
   - ✅ "Add user authentication module with JWT"
   - ✅ "Fix: Repository mapping for nullable fields"
   - ❌ "Update stuff"

2. **Description:** Explain:
   - What changes were made
   - Why these changes were necessary
   - How to test the changes
   - Any breaking changes

3. **Size:** Keep PRs focused and reasonably sized
   - Prefer multiple small PRs over one large PR
   - Each PR should address one concern

4. **Tests:** Include tests for:
   - New domain logic (unit tests)
   - New use cases (unit tests with mocks)
   - New repository implementations (integration tests)

### Review Process

- Maintainers will review your PR
- Address feedback and requested changes
- Once approved, maintainers will merge

## Coding Standards

### TypeScript

- **Strict mode enabled** - no implicit any
- **Use interfaces** for contracts
- **Use types** for unions/intersections
- **Explicit return types** on functions

```typescript
// ✅ GOOD
export function calculateSalary(vacancies: VacancyItem[]): Money {
  return vacancies.reduce((sum, item) => sum.add(item.salary), Money.zero());
}

// ❌ BAD
export function calculateSalary(items) {  // ❌ No types
  return items.reduce((sum, item) => sum + item.salary, 0);
}
```

### Naming Conventions

- **Classes:** PascalCase
  - `CandidateEntity`, `EmailValueObject`, `CreateCandidateUseCase`
- **Functions/Variables:** camelCase
  - `createCandidate`, `candidateId`, `applicationTotal`
- **Interfaces:** PascalCase with descriptive names
  - `CandidateRepository`, `VacancyService`, `ApplicationService`
- **Files:** kebab-case
  - `candidate.entity.ts`, `create-candidate.use-case.ts`, `candidate-repository.interface.ts`

### File Organization

```typescript
// ✅ GOOD - One class per file
// create-candidate.use-case.ts
export class CreateCandidateUseCase {
  // ...
}

// ❌ BAD - Multiple classes in one file
// candidate-use-cases.ts
export class CreateCandidateUseCase { }
export class UpdateCandidateUseCase { }
export class DeleteCandidateUseCase { }
```

### Imports

```typescript
// ✅ GOOD - Explicit imports
import { Candidate } from '../domain/entities/candidate.entity';
import { Email } from '../domain/value-objects/email.vo';

// ❌ BAD - Barrel imports from other modules
import { Application } from '../../applications';  // ❌ Cross-module entity import
```

### Comments and Documentation

- **JSDoc** for public APIs
- **Inline comments** for complex logic
- **README** files for modules

```typescript
/**
 * Creates a new candidate profile
 *
 * @param dto - Candidate creation data
 * @returns Created candidate entity
 * @throws CandidateAlreadyExistsError if email is taken
 */
export class CreateCandidateUseCase {
  async execute(dto: CreateCandidateDto): Promise<Candidate> {
    // Implementation
  }
}
```

### Testing

- **Test file naming:** `*.test.ts` or `*.spec.ts`
- **Test location:** `__tests__/` folder or next to source file
- **Test structure:** Arrange-Act-Assert

```typescript
describe('CreateCandidateUseCase', () => {
  it('should create candidate with valid data', async () => {
    // Arrange
    const dto = { email: 'test@example.com', name: 'Test' };
    const mockRepo = createMockRepository();

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.email.value).toBe('test@example.com');
  });
});
```

## Questions?

If you have questions:

1. Check [README.md](./README.md) and layer-specific READMEs
2. Review existing code for examples
3. Open an issue for discussion

Thank you for contributing! 🎉