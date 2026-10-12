import { type Type, type } from 'arktype';

export class ValidationError extends Error {
  public readonly errors: type.errors;

  constructor(errors: type.errors) {
    super(`API response validation failed: ${errors.summary}`);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Validates arbitrary data against an ArkType schema.
 * Throws a ValidationError if the data fails schema validation.
 */
export function validateResponse<T>(schema: Type<T>, data: unknown): T {
  const result = schema(data);
  if (result instanceof type.errors) {
    throw new ValidationError(result);
  }
  return result as T;
}
