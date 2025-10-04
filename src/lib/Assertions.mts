export function CHECK(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function IS_NON_EMPTY(value: string): boolean {
  return value.trim().length > 0
}

export function IS_RECORD(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function IS_ARRAY(value: unknown): value is readonly unknown[] {
  return Array.isArray(value)
}
