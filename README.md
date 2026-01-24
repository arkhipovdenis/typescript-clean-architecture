# TypeScript Clean Architecture Template

A **reference starter template** implementing Clean Architecture principles with modular, vertical slice architecture for building scalable, maintainable, and testable TypeScript applications.

> **This is a structural reference template, not a production-ready boilerplate.** It provides the architectural skeleton, base classes, conventions, and tooling configuration. You add the actual infrastructure, framework, and business logic for your project.

**Universal Template**: Designed for any **JavaScript/TypeScript** application - frontend, backend, or full-stack.

**What's truly universal:**
- ✅ Domain models (entities, value objects)
- ✅ Use cases (business workflows)
- ✅ Ports/Interfaces (repository contracts)
- ✅ Domain services (pure business logic)

**What differs between frontend/backend:**
- 🔄 View layer (UI components vs HTTP controllers)
- 🔄 Infrastructure (API clients vs database connections)
- 🔄 Error handling (Result types vs HTTP status codes)
- 🔄 Transaction management (backend only)

## Description

This template provides a solid foundation for TypeScript projects following Clean Architecture patterns with a modular approach. It enforces separation of concerns, dependency inversion, and testability from the ground up, making it suitable for both small and large-scale applications.

**Key Advantage**: Share domain models, use cases, and business logic between frontend and backend. Adapters and view layers are swappable based on your deployment target.

## Capabilities/Business Functionality

### What's Included

This template gives you the **structural skeleton and conventions** to build on:

- **Universal Architecture**: Same codebase structure for frontend and backend
- **Modular Clean Architecture**: Vertical slice architecture with domain modules
- **Type Safety**: Strict TypeScript configuration (`tsconfig.json`)
- **Domain-Driven Design**: Each module represents a bounded context
- **Base Classes**: `Entity` and `ValueObject` base classes (`src/application/base/`)
- **Tooling setup**: `typecheck`, `format` scripts ready to use

### What You Add

- Infrastructure (database, HTTP client, cache — your stack)
- View layer (HTTP framework, UI framework — your choice)
- Domain modules (your business domain)
- Tests (your test runner)

## Implementation

### Architecture

This project follows **Clean Architecture** principles with a **Vertical Slice Architecture** approach to ensure maintainability, testability, and separation of concerns:

- **Application Modules**: Self-contained domain modules (bounded contexts)
  - **Domain Layer**: Core business logic, entities, and domain rules
  - **Use Cases**: Application-specific business logic
  - **Services**: Orchestration layer (facades for Use Cases)
  - **Data Access**: Repository implementations for the module
- **Infrastructure Layer**: External dependencies (database, HTTP clients, cache)
- **View Layer**: User interface and delivery mechanisms (HTTP, CLI, etc.)

**Key Principles:**

- **Vertical Slices**: Features are organized by domain module, not by technical layer
- **Bounded Contexts**: Each module is independent with its own domain model
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Separation of Concerns**: Each layer has a specific, well-defined responsibility
- **Testability**: Business logic is isolated from external dependencies
- **Domain-Centric**: Business logic is independent of frameworks and external tools

**📖 For detailed architecture information, see [Architecture Deep Dive](#architecture-deep-dive) below**

### Project Structure

```
src/
├── application/                 # Application Modules (Vertical Slices)
│   ├── base/                    # Base classes for entities and value objects
│   │   ├── entity.ts
│   │   └── value-object.ts
│   │
│   └── {module}/                # Your domain modules (candidates, vacancies, applications, etc.)
│       ├── domain/
│       │   ├── entities/     # Business entities with behavior
│       │   ├── value-objects/ # Immutable domain values
│       │   ├── interfaces/   # Repository and service contracts
│       │   ├── services/     # Domain services (pure business logic)
│       │   ├── events/       # Domain events
│       │   └── errors/       # Domain-specific errors
│       ├── use-cases/        # Application workflows
│       ├── services/         # Application services (facades, orchestration)
│       └── data-access/      # Persistence adapters
│           ├── repositories/ # Repository implementations
│           ├── dto/          # DTOs for persistence layer
│           └── mappers/      # Entity ↔ DTO mappers
│
├── infrastructure/              # Infrastructure Layer — ILLUSTRATIVE structure, add what you need
│   ├── database/                # (example) Database connection
│   ├── http/                    # (example) HTTP clients for external APIs
│   ├── cache/                   # (example) Caching providers
│   ├── messaging/               # (example) Message queues
│   └── config/                  # (example) Configuration management
│
├── view/                        # View Layer — ILLUSTRATIVE, structure differs per project
│   #
│   # Frontend example:
│   │   ├── pages/               # Application pages/screens
│   │   ├── components/          # UI components
│   │   ├── hooks/               # UI hooks/composables
│   │   ├── stores/              # State management
│   │   └── dto/ + mappers/      # API DTOs and mappers
│   #
│   # Backend example:
│   │   ├── http/                # HTTP controllers, routes, middlewares
│   │   │   ├── controllers/
│   │   │   ├── dto/             # Request/Response DTOs
│   │   │   └── mappers/         # Entity ↔ HTTP DTO mappers
│   │   ├── cli/                 # CLI commands
│   │   ├── graphql/             # GraphQL resolvers + types
│   │   └── websocket/           # WebSocket handlers
│
├── lib/                         # Shared utilities (usable in all layers)
│   ├── utils/                   # General utilities
│   ├── validators/              # Generic validators
│   ├── formatters/              # Data formatters
│   ├── parsers/                 # Data parsers
│   └── types/                   # Shared TypeScript types
│
├── app/                         # Composition Root (wiring only)
│   └── composition-root/
│       ├── container.ts         # DI container setup
│       └── setup.ts             # Application bootstrap
│
└── index.ts                     # Application entry point
```

### Architecture Layers

#### Application Modules (Vertical Slices)

Each module represents a **bounded context** in DDD terminology and contains all layers needed for that specific domain:

**Structure of Application Layer:**
```
application/
├── base/                # Base classes (Entity, ValueObject)
│   ├── entity.ts
│   └── value-object.ts
│
└── {module}/            # Domain module
    ├── domain/          # Domain layer - pure business logic
    │   ├── entities/    # Business entities with behavior
    │   ├── value-objects/ # Immutable domain values
    │   ├── interfaces/  # Repository and service contracts (ports)
    │   ├── services/    # Domain services (pure business logic)
    │   ├── events/      # Domain events
    │   └── errors/      # Domain-specific exceptions
    ├── use-cases/       # Application workflows
    ├── services/        # Application services (facades, orchestration)
    └── data-access/     # Persistence adapters
        ├── repositories/ # Repository implementations
        ├── dto/         # DTOs for persistence (database models)
        └── mappers/     # Entity ↔ DTO conversion
```

**Benefits:**
- High cohesion within a module
- Low coupling between modules
- Easy to understand and navigate
- Independent testing; deployment independence depends on your packaging/deployment model
- Teams can work on different modules simultaneously

**Entity Pattern:**

All domain entities extend the base `Entity` class with typed structure:

```typescript
// 1. Define the structure type
export type CandidateStruct = {
  name: string;
  email: Email;
  phone?: Phone;
};

// 2. Extend Entity with ID type and Struct
export class Candidate extends Entity<UUID, CandidateStruct> {
  // Access properties via this.props
  updateEmail(newEmail: Email): void {
    this.props.email = newEmail;
  }
}
```

See [Base Classes](#base-classes) section for more details.


#### Infrastructure Layer

Handles **only external dependencies** and technical implementations:

- Database connections and configuration
- External API clients (not domain repositories)
- Caching providers (Redis, Memcached)
- Message queue clients
- Configuration and environment management

**Important distinction - Infrastructure vs Data Access:**

The `infrastructure/` layer provides **shared technical resources** (database client, HTTP client, cache connection), while `application/{module}/data-access/` contains **module-specific persistence adapters** (repositories, DTOs, mappers).

**Why this separation?**
- `infrastructure/` = Reusable infrastructure providers (database connection pool, Redis client)
- `data-access/` = Domain-specific adapters that **use** infrastructure providers
- This follows **Vertical Slice Architecture** - keeping module cohesion while reusing technical infrastructure

**Example** (illustrative — add only what your project needs):
```typescript
// src/infrastructure/database/postgres.connection.ts
export class PostgresConnection {
  // Shared database connection pool — provided once, used by all data-access repositories
}

// src/application/candidates/data-access/repositories/candidate.repository.ts
export class PostgresCandidateRepository implements CandidateRepository {
  constructor(private db: PostgresConnection) {} // Receives infrastructure via DI

  async save(candidate: Candidate): Promise<void> {
    // Module-specific persistence logic
  }
}
```


#### View Layer

**The ONLY layer that differs between frontend and backend applications.**

Delivers data to and from users through various interfaces:

**Frontend Applications:**
- UI pages and components
- Hooks and composables
- State management

**Backend Applications:**
- HTTP REST API controllers and routes
- GraphQL resolvers
- CLI commands
- WebSocket handlers

**CRITICAL RULE:** View layer MUST call Application Services ONLY, NEVER Use Cases directly.

**Everything else (application, infrastructure, lib) remains identical!**


#### Lib Layer

Contains **pure, reusable utilities** that can be used across all layers:

- String/Date/Array utilities
- Generic validators and formatters
- Cryptography helpers
- Observable pattern implementation
- Shared TypeScript types

**Important:** Lib has no dependencies on any layer and contains only framework-agnostic code.


### Dependency Flow

```
View Layer
    ↓ calls
Application Services (Application Module)
    ↓ calls
Use Cases (Application Module)
    ↓ calls interfaces defined in ↘
Domain Layer ←── Data Access (implements domain interfaces)
                        ↓ uses
                  Infrastructure (External Dependencies)
```

> **Read direction:** Arrows show dependency direction (who depends on whom).
> Data Access depends on Domain (implements repository interfaces defined there) — Domain does NOT depend on Data Access.
> Infrastructure provides shared resources (DB connection, HTTP client) used by Data Access.

**Dependency Rules:**
1. Domain has zero dependencies (except Lib) — no knowledge of Data Access or Infrastructure
   - **Exception:** Aggregate Roots may import domain entities from other modules when they act as a transactional boundary (e.g., an `Application` aggregate composing `Candidate`, `Vacancy`, and `WorkflowStage`). This is allowed only when the aggregate owns the business logic for those entity interactions.
2. Use Cases depend only on Domain interfaces
3. Services depend on Use Cases (orchestration/facade layer)
4. Data Access implements Domain repository interfaces (ports) — dependency points inward
5. Infrastructure provides shared external resources used by Data Access
6. **View MUST call Application Services ONLY** — View MUST NOT call Use Cases directly
7. DTOs and Mappers live only at layer boundaries:
   - `data-access/dto` + `data-access/mappers` for persistence
   - `view/*/dto` + `view/*/mappers` for presentation
8. Lib can be used by ALL layers (pure utilities only)

---

## Architecture Deep Dive

### Vertical Slice Architecture

Instead of organizing code by technical layers (controllers, services, repositories), we organize by **features/domains (modules)**. Each module contains all the layers it needs.

**Traditional Layered Architecture:**
```
src/
├── domain/           # All entities together
├── application/      # All use cases together
└── infrastructure/   # All repositories together
```

**Problems:**
- ❌ Low cohesion - related code is scattered
- ❌ High coupling - changes affect multiple folders
- ❌ Hard to navigate - need to jump between folders
- ❌ Difficult to scale - merge conflicts

**Our Modular Architecture:**
```
src/application/
├── candidates/      # Everything for candidates
│   ├── domain/
│   ├── use-cases/
│   └── data-access/
└── vacancies/       # Everything for vacancies
    ├── domain/
    ├── use-cases/
    └── data-access/
```

**Benefits:**
- ✅ High cohesion - all candidate code is in `candidates/`
- ✅ Low coupling - `candidates/` and `vacancies/` are independent
- ✅ Easy to navigate - one folder per domain
- ✅ Easy to scale - no merge conflicts between modules
- ✅ Team-friendly - different teams can work on different modules

### Module Bounded Contexts

Each module represents a **bounded context** in Domain-Driven Design:

- **candidates** - Candidate profile management
- **vacancies** - Job vacancy management
- **applications** - Candidate applications to vacancies (aggregate root)
- **workflows** - Hiring pipeline stages and transitions
- **interviews** - Interview scheduling and feedback

Modules communicate through:
- Application Service calls (sync, default)
- Domain Events via EventBus (async, optional — see [Inter-Module Communication](#inter-module-communication))
- Application Services return Entities; cross-module method parameters use primitives (string IDs) or DTOs when needed
- Exception: Aggregate Roots may compose domain entities from other modules as a transactional boundary

### When to Create a New Module

Create a new module when:
- ✅ You have a distinct business domain
- ✅ The domain has its own entities and rules
- ✅ It can be developed independently
- ✅ It could become a microservice

Don't create a new module when:
- ❌ It's just a utility function
- ❌ It's tightly coupled to an existing module
- ❌ It doesn't have its own business logic

### Testing Strategy

**Domain Layer:**
- Pure unit tests
- No mocks
- Test business rules

**Use Cases:**
- Unit tests with mocked repositories
- Test application workflows

**Data Access:**
- Integration tests
- Real database (or test containers)
- Test mappings and queries

**View (Frontend):**
- Component tests
- Hook/Composable tests
- E2E tests

**View (Backend):**
- Controller unit tests
- API integration tests
- E2E tests for HTTP/GraphQL endpoints

---

## Getting Started

This is an architecture template - it works with any modern Node.js version and package manager (npm, yarn, pnpm).

### Installation

1. **Clone or use this template**:

   ```bash
   git clone https://github.com/arkhipovdenis/typescript-clean-architecture.git
   cd typescript-clean-architecture
   ```

2. **Install dependencies** (using your preferred package manager):

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. **Verify the setup**:
   ```bash
   pnpm run typecheck    # TypeScript type checking
   pnpm run format:check # Prettier formatting
   # or: npm run typecheck / yarn run typecheck
   ```

4. **Start building your application**:
   - Add your domain modules in `src/application/`
   - Implement your view layer in `src/view/`
   - Add infrastructure adapters in `src/infrastructure/`
   - Wire everything in `src/app/composition-root/`

## Code Quality

### TypeScript Configuration

This project uses strict TypeScript configuration for maximum type safety:

- Strict mode enabled (`strict: true` — includes `noImplicitAny`, `strictNullChecks`, and more)
- `noUncheckedIndexedAccess` — array/index access always includes `undefined`
- `exactOptionalPropertyTypes` — optional properties must match exactly
- `verbatimModuleSyntax` + `isolatedModules` — safe for bundlers and transpilers
- `noUnusedLocals` / `noUnusedParameters` — available as opt-in (commented out in `tsconfig.json`, enable when your project is ready)


## Architecture Guidelines

### Adding New Domain Module

When implementing a new feature domain, follow this structure:

1. **Create module directory**:
   ```bash
   mkdir -p src/application/{module-name}/{domain,use-cases,services,data-access}
   mkdir -p src/application/{module-name}/domain/{entities,value-objects,interfaces,services,events,errors}
   mkdir -p src/application/{module-name}/data-access/{repositories,dto,mappers}
   ```

2. **Domain Layer**: Define entities, value objects, and interfaces
   ```typescript
   // application/{module}/domain/entities/
   // application/{module}/domain/value-objects/
   // application/{module}/domain/interfaces/
   ```

3. **Use Cases**: Implement application logic
   ```typescript
   // application/{module}/use-cases/
   ```

4. **Data Access**: Implement repository interfaces
   ```typescript
   // application/{module}/data-access/
   ```

5. **View**: Create controllers/handlers
   ```typescript
   // view/http/controllers/{module}.controller.ts
   ```

### Inter-Module Communication

Modules must be independent and loosely coupled. Here's how they should interact:

#### TL;DR (Default Rules)

* **Cross-module calls (sync):** call the target module's **Application Service** directly; cross-module guards belong in the calling Application Service, not in use cases
* **Shared types used by 3+ modules:** use **Shared Kernel** — technical types only (`Money`, `Email`, `Result`), no domain-specific concepts
* **Domain-specific IDs** (`CandidateId`): keep in their module, reference by primitive across boundaries
* **DI container:** only in `src/app/composition-root/`, NEVER inside domain or use cases
* **Domain Events + EventBus:** optional — use when you need open/closed extensibility or eventual consistency (see section 2 below)

---

#### 1. Application Service Calls (Synchronous Communication — Default)

**When:** Module A cannot continue without a result from Module B.

**How:** Module B's Application Service **is** the public contract — its business methods define what the module exposes. Other modules import and call the service directly.

**Rules:**
- Other modules depend on the **Application Service class** of the target module, not its use cases or repositories
- Cross-module checks are the responsibility of the **calling module's Application Service** — not use cases
- Use cases know only their own domain; inter-module orchestration lives in Application Services
- Application Services return **Entities**, not DTOs — DTO mapping happens only at the view boundary

**Example:**

```typescript
// 1. Module B: Application Service is the public API
// application/vacancies/services/vacancy.service.ts
export class VacancyService {
  constructor(
    private getVacancyUseCase: GetVacancyUseCase,
    private checkVacancyStatusUseCase: CheckVacancyStatusUseCase
  ) {}

  async getVacancyById(id: string): Promise<Vacancy> {
    return this.getVacancyUseCase.execute({ id });  // ✅ Returns Entity
  }

  async checkVacancyOpen(vacancyId: string): Promise<boolean> {
    return this.checkVacancyStatusUseCase.execute({ vacancyId });
  }
}

// 2. Module A: Use case knows only its own domain
// application/applications/use-cases/create-application.use-case.ts
export class CreateApplicationUseCase {
  constructor(
    private applicationRepository: ApplicationRepository
    // ✅ No dependency on VacancyService — use case stays within its module
  ) {}

  async execute(dto: CreateApplicationDto): Promise<Application> {
    const application = Application.create(dto);
    await this.applicationRepository.save(application);
    return application;
  }
}

// 3. Module A: Application Service orchestrates cross-module check BEFORE calling use case
// application/applications/services/application.service.ts
export class ApplicationService {
  constructor(
    private createApplicationUseCase: CreateApplicationUseCase,
    private vacancyService: VacancyService,  // ✅ Cross-module call lives here
    private logger: Logger
  ) {}

  async createApplication(dto: CreateApplicationDto): Promise<Application> {
    // Cross-module guard: check before executing the use case
    const isOpen = await this.vacancyService.checkVacancyOpen(dto.vacancyId);
    if (!isOpen) {
      throw new ForbiddenError('Vacancy is closed for applications');
    }

    this.logger.info('Creating application', { vacancyId: dto.vacancyId });
    return this.createApplicationUseCase.execute(dto);  // ✅ Returns Entity
  }
}

// 4. Composition root: Wire services
// src/app/composition-root/setup.ts
container.register(VacancyService, () =>
  new VacancyService(
    container.get(GetVacancyUseCase),
    container.get(CheckVacancyStatusUseCase)
  )
);
container.register(ApplicationService, () =>
  new ApplicationService(
    container.get(CreateApplicationUseCase),
    container.get(VacancyService),
    container.get(Logger)
  )
);
```

**Project structure:**

```
application/
├── vacancies/
│   ├── services/
│   │   └── vacancy.service.ts              # Public API of the vacancies module
│   └── use-cases/                          # Internal — not imported by other modules
│       └── get-vacancy.use-case.ts
└── applications/
    ├── services/
    │   └── application.service.ts          # Orchestrates: calls VacancyService + own use case
    └── use-cases/
        └── create-application.use-case.ts  # Knows only applications domain
```

---

#### 2. Domain Events (Concept — Optional/Advanced)

**Domain Events** are records of business-significant facts: something that happened in the domain.

```typescript
// application/applications/domain/events/application-submitted.event.ts
export class ApplicationSubmittedEvent {
  readonly occurredAt: Date;

  constructor(
    public readonly applicationId: string,
    public readonly candidateId: string,
    public readonly vacancyId: string
  ) {
    this.occurredAt = new Date();
  }
}
```

**In this template, Domain Events are a concept, not a required infrastructure pattern.**

The default approach for cross-module reactions is a **direct Application Service call** (see section above). This is simpler, explicit, and sufficient for most projects.

> **When to add an EventBus (advanced/optional):**
> - You need to add new reactions without modifying the publishing code (open/closed principle)
> - You need eventual consistency — a handler can fail and retry independently
> - You are preparing for a transition to microservices
>
> If you introduce an EventBus, use it as an infrastructure port (`EventBus` interface in `domain/interfaces/`), implement it in `infrastructure/`, and wire handlers in `composition-root/`. Keep domain event classes in `domain/events/` — they are pure data, no framework dependencies.

---

#### 3. Shared Kernel

**Only for technical types**, not business entities.

**STRICT CONSTRAINTS:**

1. **Shared Kernel MUST contain ONLY technical types** - No business logic or domain-specific concepts
2. **Types MUST be generic and domain-agnostic** - If it's specific to one domain (Candidate, Vacancy), it doesn't belong here
3. **Shared Kernel MUST NOT contain:**
   - ❌ Domain entities with business logic
   - ❌ Domain services
   - ❌ Use cases
   - ❌ Business rules or validations
   - ❌ Domain-specific value objects (e.g., `CandidateStatus`, `SalaryRange` for recruiting domain)
4. **Use Shared Kernel when:** The type is used by 3+ modules AND is purely technical

**Examples of what belongs in shared-kernel:**

```
application/
└── shared-kernel/
    ├── value-objects/
    │   ├── money.vo.ts          # ✅ Technical VO used by multiple modules
    │   ├── email.vo.ts          # ✅ Technical VO
    │   └── date-range.vo.ts     # ✅ Technical VO
    ├── types/
    │   ├── result.ts            # ✅ Generic Result type
    │   ├── pagination.ts        # ✅ Generic pagination types
    │   └── errors.ts            # ✅ Base error classes
    └── interfaces/
        └── repository.interface.ts # ✅ Generic repository interface (optional)
```

**What does NOT belong in shared-kernel:**

```
❌ Candidate entity (business logic)
❌ Vacancy entity (business logic)
❌ Business rules/domain services
❌ Use cases
❌ CandidateId, VacancyId — domain-specific IDs owned by their module
❌ ApplicationStatus, SalaryRange — domain-specific value types
```

> **Common mistake:** Moving `CandidateId` to shared-kernel because it's used in 2 modules.
> **Correct approach:** Use primitive `string` / `UUID` as the identifier type when crossing module boundaries, or use direct cross-module import only when tightly coupled and justified.
> Domain-specific types belong in their owning module's domain layer, not in shared-kernel.

---

#### 4. Forbidden/Discouraged Approaches

**❌ Forbidden:**

```typescript
// ❌ BAD: Importing from internal parts of another module
import { Vacancy } from '../../vacancies/domain/entities/vacancy.entity';
import { VacancyRepository } from '../../vacancies/domain/interfaces/vacancy-repository';

// ❌ BAD: Using DI container as service locator inside business code
class CreateApplicationUseCase {
  async execute() {
    const vacancyRepo = container.get(VacancyRepository); // ❌ Service locator anti-pattern
  }
}

// ❌ BAD: Passing domain entities between modules
interface InterviewApi {
  scheduleInterview(application: Application): Promise<void>; // ❌ Application is from another module
}
```

**✅ Correct:**

```typescript
// ✅ GOOD: Application Service calls another module's Application Service
import { VacancyService } from '../../vacancies/services/vacancy.service';

// ✅ GOOD: Cross-module dependency lives in Application Service, not use case
class ApplicationService {
  constructor(
    private createApplicationUseCase: CreateApplicationUseCase,
    private vacancyService: VacancyService  // ✅ Injected via constructor
  ) {}
}

// ✅ GOOD: Pass DTOs between modules
interface InterviewApi {
  scheduleInterview(dto: ScheduleInterviewDto): Promise<void>; // ✅ DTO
}
```

**⚠️ Allowed with caution: Cross-module domain imports**

Sometimes one module genuinely depends on another from a business perspective. The default answer is a **direct Application Service call**. Direct domain imports are the exception, not the rule.

> **Shared Kernel is NOT the right place for `CandidateId`.**
> `CandidateId` is a domain-specific concept owned by the `candidates` module. Moving it to shared-kernel would pollute the technical layer with business domain details.

```typescript
// Option 1 (Default): Reference by primitive ID — no import needed
export type ApplicationStruct = {
  candidateId: string;  // ✅ Primitive ID, no cross-module dependency
  vacancyId: string;
  status: string;
};

export class Application extends Entity<UUID, ApplicationStruct> {}

// Option 2: Direct cross-module import — only when 2 modules are tightly coupled
// application/applications/domain/entities/application.entity.ts
import { CandidateId } from '../../candidates/domain/value-objects/candidate-id.vo';

export type ApplicationStruct = {
  candidateId: CandidateId;  // ⚠️ Explicit cross-module dependency — justify it
  vacancyId: VacancyId;
  status: string;
};

export class Application extends Entity<UUID, ApplicationStruct> {}
```

**When to use each:**
- **Primitive ID (string/UUID)**: Default — no coupling, passes by value
- **Direct import**: Only when 2 modules are tightly coupled AND it provides real type safety
- **Shared Kernel**: NEVER for domain-specific IDs. Only for `Money`, `Email`, `DateRange`, `Result`, `Pagination`
- **Application Service call**: Default for everything else

**Special case: Aggregate Roots (DDD pattern)**

Aggregates compose entities from multiple domains as transactional boundary:

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
 * Aggregate Root: Application represents hiring process
 * Composes entities from multiple bounded contexts
 */
export class Application extends Entity<UUID, ApplicationStruct> {
  moveToNextStage(): void {
    // Business logic for stage transitions
    if (!this.props.stage.canMoveNext(this.props.candidate)) {
      throw new Error('Cannot move to next stage');
    }
    // ...
  }

  reject(reason: string): void {
    // Business logic involving all composed entities
    this.props.stage = WorkflowStage.rejected();
    this.props.candidate.notifyRejection(this.props.vacancy, reason);
  }
}
```

**When this is correct:**
- ✅ Aggregate represents business process (Application = hiring workflow)
- ✅ Aggregate is transactional boundary (atomic changes)
- ✅ Contains business rules for entity interactions
- ✅ Single repository for entire aggregate

**When this is wrong:**
- ❌ Just "convenient" to keep together
- ❌ No business logic for interactions
- ❌ Can split into independent transactions
- ❌ Entities don't need consistency guarantees

**Discouraged:**
- Moving full business entities to shared-kernel (breaks bounded context)

---

#### 5. DI Container and Composition Root

**Canonical location:** `src/app/composition-root/`

**What it does:**
- Connects ports and adapters
- Wires all module dependencies together
- Registers Application Services with their cross-module dependencies
- Optionally: configures EventBus and registers event handlers (if using Domain Events)

**What it MUST NOT do:**
- ❌ MUST NOT be imported inside domain layer or use cases
- ❌ MUST NOT act as service locator (`container.get()` inside business code)

> **Note:** The `Container` class below is pseudocode illustrating the concept. Use any DI library (InversifyJS, tsyringe, Awilix) or plain constructor injection in real projects. Lifetimes (transient/singleton/scoped) depend on your chosen library.

```typescript
// src/app/composition-root/container.ts
// NOTE: Pseudocode illustrating the concept — replace with a real DI library.
// This simplified version is transient: factory is called on every get().
// Real libraries (InversifyJS, tsyringe, Awilix) support singleton/scoped/transient lifetimes.
export class Container {
  private factories = new Map<symbol, () => unknown>();

  // Registers a factory. For singleton behavior, cache the result yourself
  // or use a DI library with built-in lifetime management.
  register<T>(token: symbol, factory: () => T): void {
    this.factories.set(token, factory);
  }

  get<T>(token: symbol): T {
    const factory = this.factories.get(token);
    if (!factory) throw new Error(`No registration for token`);
    return factory() as T;  // transient: new instance per call
  }
}

// src/app/composition-root/setup.ts
export function setupContainer(): Container {
  const container = new Container();

  // Infrastructure
  const db = new PostgresConnection(config.database);

  // Repositories
  container.register(CandidateRepository, () => new PostgresCandidateRepository(db));
  container.register(ApplicationRepository, () => new PostgresApplicationRepository(db));

  // Use cases — know only their own domain
  container.register(SubmitApplicationUseCase, () =>
    new SubmitApplicationUseCase(
      container.get(ApplicationRepository)
    )
  );

  // Application Services — cross-module wiring lives here
  container.register(VacancyService, () =>
    new VacancyService(
      container.get(GetVacancyUseCase),
      container.get(CheckVacancyStatusUseCase)
    )
  );
  container.register(ApplicationService, () =>
    new ApplicationService(
      container.get(SubmitApplicationUseCase),
      container.get(VacancyService)  // ✅ Service-to-Service dependency
    )
  );

  return container;
}
```

---

#### Decision Matrix

| Scenario | Pattern | Why |
|----------|---------|-----|
| Create application → check vacancy open | Application Service call | `ApplicationService` calls `VacancyService` before use case |
| Application → Interview needs data | Application Service call + DTO | `ApplicationService` calls `InterviewService`, returns DTO |
| Share `Money` type | Shared Kernel | Technical VO, no business logic |
| Application submitted → schedule interview | Application Service call (default) / Domain Event + EventBus (optional) | Direct call is simpler; EventBus if you need open/closed extensibility |

---

**Summary:**
- **Application Service call** = default for cross-module communication, explicit and simple
- **Domain Events + EventBus** = optional, for extensibility or eventual consistency
- **Shared Kernel** = minimal, only technical types
- **DI** = composition root only, never service locator

### Testing Strategy

- **Domain Layer**: Pure unit tests with no mocks
- **Use Cases**: Unit tests with mocked repositories
- **Data Access**: Integration tests with real database
- **View Layer (Frontend)**: Component tests, hook tests, E2E tests
- **View Layer (Backend)**: Controller tests, API integration tests, E2E tests

## Base Classes

The template includes base classes for entities and value objects:

### Entity Base Class

```typescript
import { Entity } from '../base/entity';

// Define the structure type
export type CandidateStruct = {
  name: string;
  email: Email;
  phone?: Phone;
};

// Extend Entity with ID type and Struct type
export class Candidate extends Entity<UUID, CandidateStruct> {
  // Business methods can access this.props
  updateEmail(newEmail: Email): void {
    this.props.email = newEmail;
  }

  get email(): Email {
    return this.props.email;
  }
}
```

**Another example with business logic:**

```typescript
export type VacancyStruct = {
  title: string;
  description: string;
  salary: Money;
  status: VacancyStatus;
};

export class Vacancy extends Entity<UUID, VacancyStruct> {
  open(): void {
    if (this.props.status === 'closed') {
      this.props.status = 'open';
    }
  }

  close(): void {
    this.props.status = 'closed';
  }

  isOpen(): boolean {
    return this.props.status === 'open';
  }
}
```

See [application/base/entity.ts](./src/application/base/entity.ts)

### ValueObject Base Class

```typescript
import { ValueObject } from '../base/value-object';

class Email extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
```

See [application/base/value-object.ts](./src/application/base/value-object.ts)

## Best Practices

### 1. Keep Modules Focused

Each module should represent a single bounded context:

```
✓ Good:
application/user-authentication/
application/user-profile/
application/user-notifications/

✗ Bad:
application/users/  // Too broad, multiple concerns
```

### 2. Application Services - The Orchestration Layer

**Definition:** Application Services are **facades** that orchestrate use cases and handle cross-cutting concerns. They are the **public API of a module**.

**Definitions — three distinct layers:**

| Layer | Responsibility | Lives in | Example |
|-------|---------------|---------|---------|
| **Domain Service** | Pure business logic involving 2+ entities (no I/O) | `domain/services/` | `SalaryCalculator` — calculates offer salary from market data |
| **Use Case** | Single application workflow (one user action) | `use-cases/` | `SubmitApplicationUseCase` — validates + saves + returns entity |
| **Application Service** | Facade: orchestrates use cases + cross-cutting concerns | `services/` | `CandidateService` — entry point for the candidates module |

> The **"Services"** arrow in `View → Services → Use Cases` means **Application Services**, not Domain Services.

**Application Service rules:**
- ✅ Orchestrates multiple use cases for a single user-facing operation
- ✅ Handles cross-cutting concerns: logging, caching, authorization checks
- ✅ Acts as the public API of the module (what other modules or view layer calls)
- ✅ ALWAYS required — even if it's a thin wrapper around a single use case, at minimum add logging for traceability
- ❌ MUST NOT contain domain rules or business logic — that belongs in Domain or Use Case

**When Application Service truly orchestrates (not just proxies):**

```typescript
// application/candidates/services/candidate.service.ts
export class CandidateService {
  constructor(
    private createCandidateUseCase: CreateCandidateUseCase,
    private sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
    private logger: Logger,
    private cache: CandidateCache
  ) {}

  // Orchestrates 2 use cases + logging + cache invalidation in one operation
  async registerCandidate(dto: CreateCandidateDto): Promise<Candidate> {
    this.logger.info('Registering candidate', { email: dto.email });

    // Step 1: Create candidate (core use case)
    const candidate = await this.createCandidateUseCase.execute(dto);

    // Step 2: Trigger welcome email (second use case)
    await this.sendWelcomeEmailUseCase.execute({ candidateId: candidate.id.value });

    // Cross-cutting: invalidate cache
    await this.cache.invalidateList();

    this.logger.info('Candidate registered', { id: candidate.id.value });

    return candidate;  // ✅ Returns Entity — view layer maps to DTO
  }
}
```

**View MUST call Application Services, NOT use cases directly:**

```typescript
// ❌ FORBIDDEN — View bypasses the module facade
class CandidatesController {
  constructor(private createCandidateUseCase: CreateCandidateUseCase) {}
  async create(req) { return this.createCandidateUseCase.execute(req.body); }
}

// ✅ REQUIRED — View calls the module's public facade
class CandidatesController {
  constructor(private candidateService: CandidateService) {}
  async create(req) { return this.candidateService.registerCandidate(req.body); }
}
```

**Why this rule?**
- Single stable entry point per module — stable even when use cases are refactored
- Cross-cutting concerns (auth, logging, caching) applied once, not per use case
- Multiple delivery adapters (HTTP, CLI, WebSocket) all use the same service
- Testable in isolation: mock the service, not individual use cases in controller tests

### 3. Use Application Service Calls for Cross-Module Communication

```typescript
// ✅ ApplicationService orchestrates cross-module calls — use case stays clean
class ApplicationService {
  constructor(
    private createApplicationUseCase: CreateApplicationUseCase,
    private interviewService: InterviewService,   // cross-module dependency
    private notificationService: NotificationService
  ) {}

  async submitApplication(dto: SubmitApplicationDto): Promise<Application> {
    const application = await this.createApplicationUseCase.execute(dto);

    // Cross-module reactions — explicit, traceable, no magic
    await this.interviewService.scheduleInterview({
      applicationId: application.id.value,
      candidateId: application.candidateId,  // ✅ primitive string
    });
    await this.notificationService.notifyCandidate({ candidateId: application.candidateId });

    return application;  // ✅ Returns Entity — view layer maps to DTO
  }
}
```

### 4. DTOs Live at Layer Boundaries Only

**STRICT RULES:**

1. **Use Cases MUST return Domain Entities** — use cases work with rich domain models internally
2. **Application Services MUST return Domain Entities** — mapping to DTO happens at the view boundary, not inside the application layer
3. **DTOs are allowed ONLY at these boundaries:**
   - `data-access/dto/` — persistence layer (database rows ↔ entities)
   - `view/*/dto/` — presentation layer (HTTP/GraphQL/WebSocket request+response)
   - Event payloads — minimal primitive data in event classes (if using EventBus)
4. **NEVER create DTOs at module level** — `application/{module}/dto/` is FORBIDDEN

**Data flow:**

```
View layer (maps Entity → DTO, returns DTO to client)
    ↑
Application Service (returns Entity)
    ↑
Use Case (returns Entity)
    ↑
Repository (maps DB row DTO → Entity)
```

**Why these rules?**
- Use cases work with rich domain models, not anemic data structures
- DTOs are translation objects only for crossing architectural boundaries
- Domain layer stays pure and framework-agnostic

```typescript
// ✅ CORRECT: Use Cases return Entities
export class GetCandidateUseCase {
  async execute(id: string): Promise<Candidate> {
    return await this.repository.findById(id);
  }
}

// ✅ CORRECT: View Layer has DTOs for HTTP/API
// view/http/dto/candidate-response.dto.ts
export interface CandidateResponseDto {
  id: string;
  name: string;
  email: string;
}

// view/http/mappers/candidate.mapper.ts
export class CandidateViewMapper {
  static toResponseDto(candidate: Candidate): CandidateResponseDto {
    return {
      id: candidate.id.value,
      name: candidate.name,
      email: candidate.email.value
    };
  }
}

// view/http/controllers/candidate.controller.ts
export class CandidateController {
  constructor(private candidateService: CandidateService) {}  // ✅ Service, not use case

  async getCandidate(req, res) {
    const candidate = await this.candidateService.getCandidate(req.params.id);
    const dto = CandidateViewMapper.toResponseDto(candidate); // ✅ Map at boundary
    res.json(dto);
  }
}

// ✅ CORRECT: Data Access has DTOs for persistence
// application/candidates/data-access/dto/candidate-db.dto.ts
export interface CandidateDbDto {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

// application/candidates/data-access/mappers/candidate.mapper.ts
export class CandidatePersistenceMapper {
  static toDomain(dto: CandidateDbDto): Candidate {
    return Candidate.create(
      CandidateId.create(dto.id),
      { name: dto.name, email: Email.create(dto.email) }
    );
  }

  static toDto(candidate: Candidate): CandidateDbDto {
    return {
      id: candidate.id.value,
      name: candidate.name,
      email: candidate.email.value,
      created_at: candidate.createdAt
    };
  }
}
```

**Key Rules:**
- **Use Cases** work with Domain Entities only
- **View Layer** uses DTOs + Mappers for HTTP/GraphQL/WebSocket
- **Data Access** uses DTOs + Mappers for database/external APIs
- **Never** create DTOs at module level (`application/{module}/dto/`)

### 5. Repository per Aggregate Root

Each aggregate root gets its own repository:

```typescript
// ✓ Good
interface OrderRepository { }
interface CustomerRepository { }

// ✗ Bad
interface GenericRepository<T> { }
```

### 6. Keep Data Access Simple

Repository implementations should focus only on persistence:

```typescript
// ✓ Good
class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    // Just save
  }
}

// ✗ Bad
class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    // Save + send email + update cache + ...
  }
}
```

---

## Anti-patterns to Avoid

These patterns violate Clean Architecture principles and will break modularity:

### 1. Service Locator Pattern in Business Code

❌ **FORBIDDEN:**
```typescript
// application/candidates/use-cases/create-candidate.use-case.ts
class CreateCandidateUseCase {
  async execute(dto: CreateCandidateDto) {
    // ❌ Using container.get() inside use case
    const repo = container.get(CandidateRepository);
    const emailService = container.get(EmailService);
  }
}
```

✅ **CORRECT:**
```typescript
// application/candidates/use-cases/create-candidate.use-case.ts
class CreateCandidateUseCase {
  constructor(
    private candidateRepository: CandidateRepository,  // ✅ Constructor injection
    private emailService: EmailService
  ) {}

  async execute(dto: CreateCandidateDto) {
    // Use injected dependencies
  }
}
```

**Why:** DI container should only be used in composition root, not as service locator in business code.

---

### 2. Cross-Module Domain Imports Without Justification

❌ **FORBIDDEN:**
```typescript
// application/interviews/use-cases/schedule-interview.use-case.ts
import { Candidate } from '../../candidates/domain/entities/candidate.entity';
import { Vacancy } from '../../vacancies/domain/entities/vacancy.entity';

// ❌ Importing domain entities from other modules without proper justification
class ScheduleInterviewUseCase {
  async execute(candidate: Candidate, vacancy: Vacancy) {
    // ...
  }
}
```

✅ **CORRECT - Use Application Service call from the calling Service:**
```typescript
// application/interviews/services/interview.service.ts
import { CandidateService } from '../../candidates/services/candidate.service';

class InterviewService {
  constructor(
    private scheduleInterviewUseCase: ScheduleInterviewUseCase,
    private candidateService: CandidateService  // ✅ Service-to-Service, not use case
  ) {}

  async scheduleInterview(dto: ScheduleInterviewDto) {
    const candidate = await this.candidateService.getCandidate(dto.candidateId);
    // cross-module guard / enrichment here, then:
    return this.scheduleInterviewUseCase.execute(dto);
  }
}
```

**Exception:** Only allowed for Aggregate Roots that genuinely compose multiple domain entities as a transactional boundary.

---

### 3. Domain Events Used as Request/Response (RPC)

If you introduce an EventBus, do not use events as RPC.

❌ **FORBIDDEN:**
```typescript
// ❌ Using events to request data (like RPC)
const result = await eventBus.publish(new GetCandidateDataEvent(candidateId));
console.log(result.candidateEmail);  // ❌ Events don't return data
```

✅ **CORRECT — call the Application Service directly:**
```typescript
// ✅ Synchronous data retrieval via Application Service call
const candidateData = await this.candidateService.getCandidate(candidateId);
console.log(candidateData.email);
```

**Why:** Domain Events are fire-and-forget notifications. For request/response, call the Application Service directly.

---

### 4. Business Logic in Lib Layer

❌ **FORBIDDEN:**
```typescript
// lib/validate-candidate.ts
export function validateCandidate(candidate: Candidate): boolean {
  // ❌ Business logic with domain concepts in lib/
  return candidate.age >= 18 && candidate.hasRequiredSkills();
}
```

✅ **CORRECT - Business logic in Domain:**
```typescript
// application/candidates/domain/entities/candidate.entity.ts
export class Candidate extends Entity<UUID, CandidateStruct> {
  // ✅ Business logic inside domain entity
  isEligible(): boolean {
    return this.age >= 18 && this.hasRequiredSkills();
  }
}
```

**Why:** `lib/` contains ONLY pure utilities with no business logic or I/O operations.

---

### 5. View Layer Calling Use Cases Directly

❌ **FORBIDDEN:**
```typescript
// view/http/controllers/candidates.controller.ts
class CandidatesController {
  constructor(private createCandidateUseCase: CreateCandidateUseCase) {}  // ❌

  async create(req, res) {
    const candidate = await this.createCandidateUseCase.execute(req.body);  // ❌
    return res.json(candidate);
  }
}
```

✅ **CORRECT - Call Application Services, map to DTO in view:**
```typescript
// view/http/controllers/candidates.controller.ts
class CandidatesController {
  constructor(private candidateService: CandidateService) {}  // ✅

  async create(req, res) {
    const candidate = await this.candidateService.createCandidate(req.body);  // ✅ Entity
    return res.status(201).json(CandidateViewMapper.toResponseDto(candidate));  // ✅ Map at view boundary
  }
}
```

**Why:** Application Services provide a stable facade, handle cross-cutting concerns, and allow refactoring use cases without breaking view layer.

---

### 6. DTOs at Module Level

❌ **FORBIDDEN:**
```typescript
// application/candidates/dto/candidate.dto.ts  ← ❌ WRONG LOCATION
export interface CandidateDto {
  name: string;
  email: string;
}
```

✅ **CORRECT - DTOs only at boundaries:**
```typescript
// application/candidates/data-access/dto/candidate-persistence.dto.ts  ← ✅ For persistence
// view/http/dto/candidate-response.dto.ts  ← ✅ For HTTP layer
```

**Why:** DTOs are translation objects for crossing architectural boundaries, not for internal module use.

---

### 7. Shared Business Logic in Shared Kernel

❌ **FORBIDDEN:**
```typescript
// application/shared-kernel/domain-services/candidate-validator.ts
export class CandidateValidator {
  // ❌ Business logic specific to recruiting domain
  validateCandidateEligibility(candidate: Candidate): boolean {
    return candidate.yearsOfExperience >= 2;
  }
}
```

✅ **CORRECT - Domain-specific logic stays in module:**
```typescript
// application/candidates/domain/services/candidate-validator.service.ts
export class CandidateValidator {
  // ✅ Business logic in its own bounded context
  validateEligibility(candidate: Candidate): boolean {
    return candidate.yearsOfExperience >= 2;
  }
}
```

**Why:** Shared Kernel is for technical types only (Money, Email, Result), NOT domain-specific business logic.

---

## Frontend vs Backend Usage

### What's The Same

**The following remains 100% identical between frontend and backend:**

- ✅ **Application Modules** (`application/`) - Domain, use cases, services
- ✅ **Lib** (`lib/`) - Pure utilities, validators, formatters
- ✅ **Business Logic** - All domain entities, value objects, and use cases
- ✅ **Architecture Patterns** - Clean Architecture, DDD, Vertical Slices

### What's Different

**The `view/` and `infrastructure/` layers differ:**

**View Layer:**
- Frontend: UI components, pages, hooks, state management
- Backend: HTTP controllers, GraphQL resolvers, CLI commands

**Infrastructure Layer:**
- Frontend: HTTP clients for APIs, browser storage, auth providers
- Backend: Database connections, message queues, cache servers, email services

**Frontend (`view/`):**
```typescript
view/
├── pages/              # Application pages/screens
├── components/         # UI components
├── hooks/              # UI hooks/composables
└── stores/             # State management
```

**Backend (`view/`):**
```typescript
view/
├── http/
│   ├── controllers/    # HTTP request handlers
│   ├── routes/         # Route definitions
│   └── middlewares/    # HTTP middlewares
├── cli/                # CLI commands
├── graphql/            # GraphQL resolvers
└── websocket/          # WebSocket handlers
```

### Example: Same Use Case, Different Views

**Use Case (Identical for Both):**
```typescript
// application/candidates/use-cases/create-candidate.use-case.ts
export class CreateCandidateUseCase {
  constructor(private candidateRepository: CandidateRepository) {}

  async execute(dto: CreateCandidateDto): Promise<Candidate> {  // ✅ Returns Entity
    const email = Email.create(dto.email);
    const candidate = Candidate.create(email, dto.name);
    await this.candidateRepository.save(candidate);
    return candidate;  // ✅ Return entity, not DTO
  }
}
```

**Frontend View (example with React):**
```typescript
// view/hooks/useCreateCandidate.ts
import { container } from '../../app/composition-root/container';
import { CandidateService } from '../../application/candidates/services/candidate.service';

export function useCreateCandidate() {
  const candidateService = container.get(CandidateService);

  return useMutation({
    mutationFn: (dto) => candidateService.createCandidate(dto)
  });
}

// view/pages/CandidatePage.tsx
const createCandidate = useCreateCandidate();
createCandidate.mutate({ email, name });
```

**Backend View (example with Node.js):**
```typescript
// view/http/controllers/candidate.controller.ts
export class CandidateController {
  constructor(private candidateService: CandidateService) {}  // ✅ Through Service

  async create(req: Request, res: Response) {
    const candidate = await this.candidateService.createCandidate(req.body);  // ✅ Entity
    res.status(201).json({ success: true, data: CandidateViewMapper.toResponseDto(candidate) });  // ✅ Map at view boundary
  }
}
```

**Result**: Same business logic, different delivery mechanisms!


## Migration from Layered Architecture

If you have an existing layered architecture project:

1. Create module directories
2. Move domain entities to `application/{module}/domain/entities/`
3. Move use cases to `application/{module}/use-cases/`
4. Move repository implementations to `application/{module}/data-access/`
5. Keep external dependencies in `infrastructure/`

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

Built with Clean Architecture and Vertical Slice Architecture principles for maintainable and scalable TypeScript applications.
