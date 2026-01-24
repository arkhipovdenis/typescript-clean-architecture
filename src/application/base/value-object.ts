/**
 * Base ValueObject Class
 *
 * Abstract base class for all domain value objects.
 * Value objects are:
 * - Immutable
 * - Defined by their value, not identity
 * - Compared by value equality
 *
 * @template T - Type of the value object's underlying value
 *
 * @example
 * ```typescript
 * class Email extends ValueObject<string> {
 *   private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 *
 *   private constructor(value: string) {
 *     super(value);
 *   }
 *
 *   static create(email: string): Email {
 *     const normalized = email.trim().toLowerCase();
 *
 *     if (!Email.EMAIL_REGEX.test(normalized)) {
 *       throw new Error('Invalid email format');
 *     }
 *
 *     return new Email(normalized);
 *   }
 * }
 *
 * const email1 = Email.create('test@example.com');
 * const email2 = Email.create('test@example.com');
 *
 * console.log(email1.value);           // 'test@example.com'
 * console.log(email1.equals(email2));  // true
 * ```
 *
 * @example
 * ```typescript
 * class Money extends ValueObject<{ amount: number; currency: string }> {
 *   private constructor(value: { amount: number; currency: string }) {
 *     super(value);
 *   }
 *
 *   static create(amount: number, currency: string): Money {
 *     if (amount < 0) {
 *       throw new Error('Amount cannot be negative');
 *     }
 *     return new Money({ amount, currency });
 *   }
 *
 *   add(other: Money): Money {
 *     if (this.value.currency !== other.value.currency) {
 *       throw new Error('Cannot add money with different currencies');
 *     }
 *     return Money.create(
 *       this.value.amount + other.value.amount,
 *       this.value.currency
 *     );
 *   }
 * }
 * ```
 */
export abstract class ValueObject<T> {
  constructor(private readonly _value: T) {}

  /**
   * Gets the underlying value of the value object
   *
   * @returns The value
   */
  get value(): T {
    return this._value;
  }

  /**
   * Compares two value objects for equality based on their values
   *
   * For primitive types (string, number, boolean), uses strict equality.
   * For complex types (objects, arrays), you may need to override this method.
   *
   * @param other - Another value object to compare with
   * @returns true if values are equal, false otherwise
   *
   * @example
   * ```typescript
   * const email1 = Email.create('test@example.com');
   * const email2 = Email.create('test@example.com');
   * const email3 = Email.create('other@example.com');
   *
   * email1.equals(email2); // true
   * email1.equals(email3); // false
   * ```
   */
  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other.value;
  }
}
