import { CHECK } from './Assertions.mts'

export function GET_RANDOM_INDEX(length: number): number {
  CHECK(Number.isInteger(length), 'Length must be an integer')
  CHECK(length > 0, 'Cannot select from empty list')
  return Math.floor(Math.random() * length)
}

export function GET_RANDOM_ITEM<T>(items: readonly T[]): T {
  CHECK(items.length > 0, 'Cannot pick from empty items list')
  const index = GET_RANDOM_INDEX(items.length)
  const candidate = items[index]
  if (candidate === undefined) {
    throw new Error('Random selection failed to resolve item')
  }
  return candidate
}
