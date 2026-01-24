/**
 * Entity Constructor Interface
 *
 * Defines the constructor signature for Entity classes.
 * Entities are objects with unique identity that are defined by their ID rather than their attributes.
 */
interface EntityConstructor {
  new <ID extends any, Struct extends Record<string, any>>(
    id: ID,
    struct: Struct,
  ): Omit<_Entity<ID, Struct>, `_${string}`> & Readonly<Struct>;
}

/**
 * Base Entity Class
 *
 * Abstract base class for all domain entities.
 * Entities have:
 * - Unique identity (ID)
 * - Mutable state (struct)
 * - Equality based on ID
 *
 * @template ID - Type of the entity's unique identifier
 * @template Struct - Type of the entity's properties/state
 *
 * @example
 * ```typescript
 * export type CandidateStruct = {
 *   name: string;
 *   email: Email;
 *   phone?: Phone;
 * };
 *
 * export class Candidate extends Entity<UUID, CandidateStruct> {
 *   updateEmail(newEmail: Email): void {
 *     this.props.email = newEmail;
 *   }
 *
 *   get email(): Email {
 *     return this.props.email;
 *   }
 * }
 *
 * const candidateId = UUID.generate();
 * const candidate = new Candidate(candidateId, {
 *   name: 'John Doe',
 *   email: Email.create('john@example.com'),
 *   phone: Phone.create('+1234567890')
 * });
 *
 * console.log(candidate.id);    // UUID
 * console.log(candidate.name);  // 'John Doe'
 * console.log(candidate.email); // Email instance
 * ```
 */
abstract class _Entity<ID extends any, Struct extends Record<string, any>> {
  readonly #id: ID;
  #struct: Struct;

  protected constructor(
    private _id: ID,
    private _struct: Struct,
  ) {
    this.#id = this._id;
    this.#struct = this._struct;

    const entriesStruct = Object.keys(this.#struct) as Array<keyof Struct>;

    // Define getters for all struct properties
    for (let i = 0; i < entriesStruct.length; i++) {
      const key = entriesStruct[i];
      if (!key) continue;

      Object.defineProperty(this, key, {
        get() {
          return this.#struct[key];
        },
        configurable: true,
        enumerable: true,
      });
    }
  }

  /**
   * Compares two entities for equality based on their IDs
   *
   * @param other - Another entity to compare with
   * @returns true if entities have the same ID, false otherwise
   */
  equals(other: _Entity<ID, Struct>): boolean {
    return this.#id === other.id;
  }

  /**
   * Gets the entity's unique identifier
   *
   * @returns The entity's ID
   */
  get id(): ID {
    return this.#id;
  }
}

/**
 * Entity class export with proper typing
 *
 * Use this as the base class for your domain entities.
 */
export const Entity = _Entity as unknown as EntityConstructor;

/**
 * Entity type export for type annotations
 */
export type Entity<ID extends never, Struct extends Record<string, never>> = _Entity<ID, Struct>;
